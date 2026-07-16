from fastapi import APIRouter, Depends, HTTPException, status, Request, Header
from sqlalchemy.orm import Session
from datetime import UTC, datetime
import logging

from app.db.repositories.lead import LeadRepository
from app.db.repositories.search import ProgramSearchRepository
from app.db.session import get_db
from app.models.lead import Lead
from app.models.analytics import AnalyticsEvent
from app.core.security import rate_limiter, normalize_phone_number, verify_turnstile_token
from app.services.notification import get_notification_service
from app.core.config import settings
from app.schemas.search_schemas import (
    AssessmentSubmit,
    ProgramResultSchema,
    SubmitAssessmentResponse,
    AnalyticsEventSchema,
    AdminLeadSchema,
)

router = APIRouter(prefix="/api", tags=["search"])
logger = logging.getLogger("eaos.router")


@router.post(
    "/leads",
    response_model=SubmitAssessmentResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_lead_assessment(
    request: Request, payload: AssessmentSubmit, db: Session = Depends(get_db)
):
    """
    Submits student assessment details, records contact info as a new lead,
    and returns up to 5 matching programs. Supports idempotency via assessment_session_id.
    """
    # 1. Server-side Rate Limiting
    rate_limiter(request, limit=5, window_seconds=60)

    # 2. Validate consent requirement explicitly
    if not payload.consent:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Consent to be contacted is required to submit assessment.",
        )

    # 3. Cloudflare Turnstile token validation
    is_turnstile_valid = await verify_turnstile_token(
        payload.turnstile_token,
        client_ip=request.client.host if request.client else None,
    )
    if not is_turnstile_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cloudflare Turnstile token verification failed.",
        )

    # 4. Validate and Normalize International Phone Number
    try:
        normalized_phone = normalize_phone_number(payload.whatsapp_number)
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve),
        )

    # 5. Lead Idempotency Check
    if payload.assessment_session_id:
        existing_lead = (
            db.query(Lead)
            .filter(Lead.assessment_session_id == payload.assessment_session_id)
            .first()
        )
        if existing_lead:
            # Re-run search for existing lead's criteria and return
            search_repo = ProgramSearchRepository(db)
            matches = search_repo.search_programs(
                country=existing_lead.country,
                study_level=existing_lead.study_level,
                intended_major=existing_lead.intended_major,
                preferred_language=existing_lead.preferred_language,
                max_budget=existing_lead.max_budget,
                limit=5,
            )
            serialized_results = [
                ProgramResultSchema(
                    program_name=prog.name,
                    university_name=uni.name,
                    degree=prog.degree_name or "",
                    language=prog.language_name or "",
                    city=uni.city_name or "",
                    semester=fee.semester,
                    status=fee.status,
                    cash_fee=fee.cash_fees,
                    discounted_fee=fee.discounted_fees,
                    deposit_fee=prog.deposit_fee,
                )
                for prog, uni, fee in matches
            ]
            return SubmitAssessmentResponse(
                lead_id=existing_lead.id,
                results=serialized_results,
            )

    try:
        # 6. Instantiate and persist Lead record
        lead_repo = LeadRepository(db)
        lead = Lead(
            full_name=payload.full_name,
            whatsapp_number=normalized_phone,
            email=str(payload.email) if payload.email else None,
            consent=payload.consent,
            country=payload.country,
            study_level=payload.study_level,
            intended_major=payload.intended_major,
            preferred_language=payload.preferred_language,
            max_budget=payload.max_budget,
            utm_source=payload.utm_source,
            utm_medium=payload.utm_medium,
            utm_campaign=payload.utm_campaign,
            referring_url=payload.referring_url,
            assessment_session_id=payload.assessment_session_id,
            consent_timestamp=datetime.now(UTC),
            privacy_policy_version="v1.0",
            status="new",
        )
        lead_repo.create(lead)
        db.flush()  # Generate lead.id

        # 7. Query matching program options
        search_repo = ProgramSearchRepository(db)
        matches = search_repo.search_programs(
            country=payload.country,
            study_level=payload.study_level,
            intended_major=payload.intended_major,
            preferred_language=payload.preferred_language,
            max_budget=payload.max_budget,
            limit=5,
        )

        # 8. Map results to Response Schemas
        serialized_results = []
        for prog, uni, fee in matches:
            serialized_results.append(
                ProgramResultSchema(
                    program_name=prog.name,
                    university_name=uni.name,
                    degree=prog.degree_name or "",
                    language=prog.language_name or "",
                    city=uni.city_name or "",
                    semester=fee.semester,
                    status=fee.status,
                    cash_fee=fee.cash_fees,
                    discounted_fee=fee.discounted_fees,
                    deposit_fee=prog.deposit_fee,
                )
            )

        db.commit()

        # 9. Pluggable notification trigger (failures isolated from lead creation)
        try:
            notifier = get_notification_service()
            await notifier.send_lead_alert(lead)
        except Exception as ne:
            logger.error(f"Lead registration notification failure: {ne}")

        return SubmitAssessmentResponse(
            lead_id=lead.id,
            results=serialized_results,
        )

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process assessment and lead details: {e}",
        ) from e


@router.post("/analytics/events", status_code=status.HTTP_204_NO_CONTENT)
def record_analytics_event(
    request: Request, payload: AnalyticsEventSchema, db: Session = Depends(get_db)
):
    """
    Records an anonymous user funnel tracking event in the database.
    """
    # Rate Limiting
    rate_limiter(request, limit=20, window_seconds=60)

    try:
        event = AnalyticsEvent(
            session_id=payload.session_id,
            event_name=payload.event_name,
            utm_source=payload.utm_source,
            utm_medium=payload.utm_medium,
            utm_campaign=payload.utm_campaign,
        )
        db.add(event)
        db.commit()
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to record analytics event: {e}")
        # Return 204 regardless to ensure analytics failures don't break frontend flow
        pass


@router.get("/admin/leads", response_model=list[AdminLeadSchema])
def list_recent_leads(
    x_admin_token: str = Header(..., alias="X-Admin-Token"),
    db: Session = Depends(get_db),
):
    """
    Protected admin endpoint listing recent lead entries.
    """
    if x_admin_token != settings.ADMIN_TOKEN:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid administration token.",
        )

    leads = db.query(Lead).order_by(Lead.created_at.desc()).limit(100).all()
    return leads

