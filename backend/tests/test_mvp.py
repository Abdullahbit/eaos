from decimal import Decimal

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.db.repositories.search import ProgramSearchRepository
from app.main import app
from app.models.lead import Lead
from app.models.program import Program
from app.models.program_fee import ProgramFee
from app.models.university import University
from app.utils.whatsapp import generate_whatsapp_link


@pytest.fixture(name="client")
def client_fixture(db_session: Session):
    """
    Overrides the FastAPI dependency to use the in-memory testing DB session.
    """

    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture(name="seed_data")
def seed_data_fixture(db_session: Session):
    """
    Seeds universities, programs, and fees for search tests.
    """
    uni = University(
        portal_id=1,
        name="Dogus University",
        country_name="Turkey",
        city_name="Istanbul",
        website="https://dogus.edu.tr",
        source_hash="hash1",
        last_seen_at=pytest.importorskip("datetime").datetime.now(
            pytest.importorskip("datetime").UTC
        ),
        is_active=True,
    )
    db_session.add(uni)
    db_session.flush()

    prog1 = Program(
        portal_id=101,
        university_id=uni.id,
        name="Computer Engineering",
        years=Decimal("4"),
        language_name="English",
        faculty_name="Engineering",
        degree_name="Bachelor",
        deposit_fee=Decimal("500.00"),
        source_hash="hash2",
        last_seen_at=pytest.importorskip("datetime").datetime.now(
            pytest.importorskip("datetime").UTC
        ),
        is_active=True,
    )
    db_session.add(prog1)

    prog2 = Program(
        portal_id=102,
        university_id=uni.id,
        name="Software Engineering",
        years=Decimal("4"),
        language_name="English",
        faculty_name="Engineering",
        degree_name="Bachelor",
        deposit_fee=Decimal("400.00"),
        source_hash="hash3",
        last_seen_at=pytest.importorskip("datetime").datetime.now(
            pytest.importorskip("datetime").UTC
        ),
        is_active=True,
    )
    db_session.add(prog2)
    db_session.flush()

    fee1 = ProgramFee(
        portal_id=201,
        program_id=prog1.id,
        semester="fall",
        status="active",
        fees=Decimal("6000.00"),
        discounted_fees=Decimal("4000.00"),
        cash_fees=Decimal("3800.00"),
        source_hash="hash4",
        last_seen_at=pytest.importorskip("datetime").datetime.now(
            pytest.importorskip("datetime").UTC
        ),
        is_active=True,
    )
    db_session.add(fee1)

    fee2 = ProgramFee(
        portal_id=202,
        program_id=prog2.id,
        semester="fall",
        status="active",
        fees=Decimal("9000.00"),
        discounted_fees=Decimal("8000.00"),
        cash_fees=Decimal("7500.00"),
        source_hash="hash5",
        last_seen_at=pytest.importorskip("datetime").datetime.now(
            pytest.importorskip("datetime").UTC
        ),
        is_active=True,
    )
    db_session.add(fee2)
    db_session.commit()

    return {
        "uni": uni,
        "prog1": prog1,
        "prog2": prog2,
        "fee1": fee1,
        "fee2": fee2,
    }


def test_assessment_validation(client: TestClient):
    """
    Checks that invalid payload data returns bad request or unprocessable entity status.
    """
    # 1. Missing consent should fail
    payload_no_consent = {
        "full_name": "John Doe",
        "whatsapp_number": "+905001234567",
        "consent": False,
        "country": "Turkey",
        "study_level": "Bachelor",
        "intended_major": "Computer Engineering",
        "preferred_language": "English",
        "max_budget": 5000,
    }
    response = client.post("/api/leads", json=payload_no_consent)
    assert response.status_code == 400

    # 2. Negative budget should fail validation
    payload_neg_budget = {
        "full_name": "John Doe",
        "whatsapp_number": "+905001234567",
        "consent": True,
        "country": "Turkey",
        "study_level": "Bachelor",
        "intended_major": "Computer Engineering",
        "preferred_language": "English",
        "max_budget": -500.00,
    }
    response = client.post("/api/leads", json=payload_neg_budget)
    assert response.status_code == 422


def test_budget_filtering(db_session: Session, seed_data):
    """
    Verifies that budget filtering matches programs correctly based on max budget.
    """
    search_repo = ProgramSearchRepository(db_session)

    # Budget of $5,000 should only match Computer Engineering (discounted fee = $4,000)
    matches_under_5000 = search_repo.search_programs(
        country="Turkey",
        study_level="Bachelor",
        intended_major="Engineering",
        preferred_language="English",
        max_budget=Decimal("5000.00"),
    )
    assert len(matches_under_5000) == 1
    assert matches_under_5000[0][0].name == "Computer Engineering"

    # Budget of $10,000 should match both programs (Computer & Software Engineering)
    matches_under_10000 = search_repo.search_programs(
        country="Turkey",
        study_level="Bachelor",
        intended_major="Engineering",
        preferred_language="English",
        max_budget=Decimal("10000.00"),
    )
    assert len(matches_under_10000) == 2


def test_no_match_results(db_session: Session, seed_data):
    """
    Ensures that searches with no matching parameters return a clean empty list.
    """
    search_repo = ProgramSearchRepository(db_session)
    matches = search_repo.search_programs(
        country="Germany",
        study_level="Master",
        intended_major="Art History",
        preferred_language="German",
        max_budget=Decimal("1000.00"),
    )
    assert matches == []


def test_lead_creation(client: TestClient, db_session: Session, seed_data):
    """
    Verifies that submission creates a Lead record in the database.
    """
    payload = {
        "full_name": "Jane Smith",
        "whatsapp_number": "+905559876543",
        "email": "jane@example.com",
        "consent": True,
        "country": "Turkey",
        "study_level": "Bachelor",
        "intended_major": "Computer Engineering",
        "preferred_language": "English",
        "max_budget": 6000.00,
    }
    response = client.post("/api/leads", json=payload)
    if response.status_code == 500:
        print("ERROR DETAIL:", response.json())
    assert response.status_code == 201
    data = response.json()
    assert "lead_id" in data
    assert len(data["results"]) == 1

    # Verify database entry
    lead = db_session.query(Lead).filter(Lead.id == data["lead_id"]).first()
    assert lead is not None
    assert lead.full_name == "Jane Smith"
    assert lead.email == "jane@example.com"
    assert lead.consent is True


def test_utm_storage(client: TestClient, db_session: Session, seed_data):
    """
    Verifies that marketing attribution tags (UTM) are stored correctly.
    """
    payload = {
        "full_name": "Alex Mercer",
        "whatsapp_number": "+905339998877",
        "consent": True,
        "country": "Turkey",
        "study_level": "Bachelor",
        "intended_major": "Computer Engineering",
        "preferred_language": "English",
        "max_budget": 5000.00,
        "utm_source": "google",
        "utm_medium": "cpc",
        "utm_campaign": "study_in_turkey",
        "referring_url": "https://google.com/search",
    }
    response = client.post("/api/leads", json=payload)
    if response.status_code == 500:
        print("ERROR DETAIL:", response.json())
    assert response.status_code == 201
    data = response.json()

    lead = db_session.query(Lead).filter(Lead.id == data["lead_id"]).first()
    assert lead is not None
    assert lead.utm_source == "google"
    assert lead.utm_medium == "cpc"
    assert lead.utm_campaign == "study_in_turkey"
    assert lead.referring_url == "https://google.com/search"


def test_whatsapp_link_generation():
    """
    Tests that generated WhatsApp wa.me links are formatted correctly
    and do not expose personal data.
    """
    lead_id = "test-uuid-value-1234"
    wa_link = generate_whatsapp_link(lead_id)
    assert "wa.me/905000000000" in wa_link
    assert lead_id in wa_link
    # Confirm no personal details like names or emails are hardcoded in URL
    assert "Jane" not in wa_link
    assert "Alex" not in wa_link
    assert "example.com" not in wa_link


def test_duplicate_submissions_idempotency(client: TestClient, db_session: Session, seed_data):
    """
    Verifies that duplicate submissions with the same session ID return the existing lead.
    """
    payload = {
        "full_name": "Idempotent User",
        "whatsapp_number": "+905559876543",
        "consent": True,
        "country": "Turkey",
        "study_level": "Bachelor",
        "intended_major": "Computer Engineering",
        "preferred_language": "English",
        "max_budget": 5000.00,
        "assessment_session_id": "session-123-abc",
    }
    
    # First submit
    res1 = client.post("/api/leads", json=payload)
    assert res1.status_code == 201
    id1 = res1.json()["lead_id"]

    # Second submit
    res2 = client.post("/api/leads", json=payload)
    assert res2.status_code == 201
    id2 = res2.json()["lead_id"]

    assert id1 == id2  # Should return same lead ID

    # Verify only one database entry
    leads = db_session.query(Lead).filter(Lead.assessment_session_id == "session-123-abc").all()
    assert len(leads) == 1


def test_invalid_phone_number_format(client: TestClient):
    """
    Verifies that invalid international phone numbers are rejected with 400 Bad Request.
    """
    payload = {
        "full_name": "Bad Phone",
        "whatsapp_number": "12345",  # Too short, no plus prefix auto-normalization check if E.164
        "consent": True,
        "country": "Turkey",
        "study_level": "Bachelor",
        "intended_major": "Computer Engineering",
        "preferred_language": "English",
        "max_budget": 5000.00,
    }
    
    # Should fail E.164 validation (digits count < 7)
    res = client.post("/api/leads", json=payload)
    assert res.status_code == 400
    assert "Invalid international phone number" in res.json()["detail"]


def test_turnstile_failure_handling(client: TestClient, mocker):
    """
    Verifies that Turnstile validation failure returns 400 Bad Request.
    """
    # Mock verify_turnstile_token to return False
    mocker.patch("app.api.search_router.verify_turnstile_token", return_value=False)
    
    payload = {
        "full_name": "Turnstile Fail User",
        "whatsapp_number": "+905559876543",
        "consent": True,
        "country": "Turkey",
        "study_level": "Bachelor",
        "intended_major": "Computer Engineering",
        "preferred_language": "English",
        "max_budget": 5000.00,
        "turnstile_token": "invalid-token",
    }
    res = client.post("/api/leads", json=payload)
    assert res.status_code == 400
    assert "Turnstile" in res.json()["detail"]


def test_notification_failure_isolation(client: TestClient, db_session: Session, mocker, seed_data):
    """
    Verifies that a notification service failure does not crash lead creation.
    """
    # Mock get_notification_service to throw an exception
    class ExplodingService:
        async def send_lead_alert(self, lead):
            raise Exception("Telegram Connection Refused")
            
    mocker.patch("app.api.search_router.get_notification_service", return_value=ExplodingService())

    payload = {
        "full_name": "Resilient User",
        "whatsapp_number": "+905559876543",
        "consent": True,
        "country": "Turkey",
        "study_level": "Bachelor",
        "intended_major": "Computer Engineering",
        "preferred_language": "English",
        "max_budget": 5000.00,
        "assessment_session_id": "session-exploding-notification",
    }

    res = client.post("/api/leads", json=payload)
    assert res.status_code == 201  # Flow completes successfully despite notification error


def test_analytics_events_recording(client: TestClient, db_session: Session):
    """
    Verifies that funnel events are recorded in the database.
    """
    from app.models.analytics import AnalyticsEvent
    
    payload = {
        "session_id": "anon-session-999",
        "event_name": "landing_view",
        "utm_source": "newsletter",
    }

    res = client.post("/api/analytics/events", json=payload)
    assert res.status_code == 204

    # Check database entry
    event = db_session.query(AnalyticsEvent).filter(AnalyticsEvent.session_id == "anon-session-999").first()
    assert event is not None
    assert event.event_name == "landing_view"
    assert event.utm_source == "newsletter"


def test_consent_audit_fields(client: TestClient, db_session: Session, seed_data):
    """
    Verifies that consent_timestamp and privacy_policy_version are recorded.
    """
    payload = {
        "full_name": "Consent Audit User",
        "whatsapp_number": "+905559876543",
        "consent": True,
        "country": "Turkey",
        "study_level": "Bachelor",
        "intended_major": "Computer Engineering",
        "preferred_language": "English",
        "max_budget": 5000.00,
        "assessment_session_id": "session-consent-audit",
    }

    res = client.post("/api/leads", json=payload)
    assert res.status_code == 201
    lead_id = res.json()["lead_id"]

    lead = db_session.query(Lead).filter(Lead.id == lead_id).first()
    assert lead.consent_timestamp is not None
    assert lead.privacy_policy_version == "v1.0"


def test_admin_leads_authorization(client: TestClient, seed_data):
    """
    Verifies authentication requirements for listing leads.
    """
    # 1. Missing header
    res = client.get("/api/admin/leads")
    assert res.status_code == 422  # Missing header validation

    # 2. Invalid Token
    res = client.get("/api/admin/leads", headers={"X-Admin-Token": "bad-token"})
    assert res.status_code == 401

    # 3. Valid Token
    res = client.get("/api/admin/leads", headers={"X-Admin-Token": "dev_admin_token"})
    assert res.status_code == 200
    assert isinstance(res.json(), list)


def test_rate_limiting_trigger(client: TestClient):
    """
    Verifies that clients hitting the leads endpoint excessively are rate limited.
    """
    payload = {
        "full_name": "Spammer",
        "whatsapp_number": "+905559876543",
        "consent": True,
        "country": "Turkey",
        "study_level": "Bachelor",
        "intended_major": "Computer Engineering",
        "preferred_language": "English",
        "max_budget": 5000.00,
    }

    # Reset/Clear previous rate limits for testing IP address
    from app.core.security import _rate_limits
    _rate_limits.clear()

    # Trigger multiple requests rapidly (limit is 5)
    for _ in range(5):
        res = client.post("/api/leads", json=payload)
        # Should succeed because Turnstile is mocked/auto-bypassed in pytest env
        assert res.status_code == 201 or res.status_code == 400

    # 6th request should trigger 429
    res = client.post("/api/leads", json=payload)
    assert res.status_code == 429
    assert "Too many requests" in res.json()["detail"]


def test_sync_status_endpoint(client: TestClient, db_session: Session):
    """
    Verifies that the /api/sync/status endpoint correctly returns the latest successful
    sync run time and active syncing status.
    """
    from app.models.sync_run import SyncRun
    from datetime import datetime, UTC

    # Clear sync runs
    db_session.query(SyncRun).delete()
    db_session.commit()

    # 1. Initially no sync run exists
    res = client.get("/api/sync/status")
    assert res.status_code == 200
    data = res.json()
    assert data["is_syncing"] is False
    assert data["latest_sync_time"] is None

    # 2. Add a running sync run
    run1 = SyncRun(entity_type="program", started_at=datetime.now(UTC), status="running")
    db_session.add(run1)
    db_session.commit()

    res = client.get("/api/sync/status")
    assert res.json()["is_syncing"] is True
    assert res.json()["latest_sync_time"] is None

    # 3. Add a completed successful sync run
    run2 = SyncRun(
        entity_type="program",
        started_at=datetime.now(UTC),
        finished_at=datetime.now(UTC),
        status="success"
    )
    db_session.add(run2)
    # Set run1 status to completed as well
    run1.status = "success"
    run1.finished_at = datetime.now(UTC)
    db_session.commit()

    res = client.get("/api/sync/status")
    assert res.json()["is_syncing"] is False
    assert res.json()["latest_sync_time"] is not None


