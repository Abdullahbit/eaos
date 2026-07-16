from decimal import Decimal
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


class AssessmentSubmit(BaseModel):
    # Contact Information
    full_name: str = Field(..., min_length=2, max_length=100)
    whatsapp_number: str = Field(..., min_length=5, max_length=30)
    email: EmailStr | None = None
    consent: bool = Field(..., description="Consent to be contacted is required")

    # Assessment Criteria
    country: str = Field(..., min_length=1, max_length=50)
    study_level: str = Field(..., min_length=1, max_length=50)
    intended_major: str = Field(..., min_length=1, max_length=100)
    preferred_language: str = Field(..., min_length=1, max_length=50)
    max_budget: Decimal = Field(..., gt=0, decimal_places=2)

    # Attribution & Session Parameters
    assessment_session_id: str | None = Field(None, max_length=255)
    turnstile_token: str | None = Field(None, description="Cloudflare Turnstile verification token")
    utm_source: str | None = Field(None, max_length=100)
    utm_medium: str | None = Field(None, max_length=100)
    utm_campaign: str | None = Field(None, max_length=100)
    referring_url: str | None = None


class ProgramResultSchema(BaseModel):
    program_name: str
    university_name: str
    degree: str
    language: str
    city: str
    semester: str | None = None
    status: str | None = None
    cash_fee: Decimal | None = None
    discounted_fee: Decimal | None = None
    deposit_fee: Decimal | None = None


class SubmitAssessmentResponse(BaseModel):
    lead_id: str
    results: list[ProgramResultSchema]


class AnalyticsEventSchema(BaseModel):
    session_id: str = Field(..., max_length=255)
    event_name: str = Field(..., max_length=100)
    utm_source: str | None = Field(None, max_length=100)
    utm_medium: str | None = Field(None, max_length=100)
    utm_campaign: str | None = Field(None, max_length=100)


class AdminLeadSchema(BaseModel):
    id: str
    full_name: str
    whatsapp_number: str
    email: str | None = None
    country: str
    study_level: str
    intended_major: str
    preferred_language: str
    max_budget: Decimal
    utm_source: str | None = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

