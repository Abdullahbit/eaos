import uuid
from datetime import UTC, datetime
from decimal import Decimal

from sqlalchemy import Boolean, DateTime, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Lead(Base):
    __tablename__ = "leads"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        doc="Unique reference ID for the lead",
    )
    full_name: Mapped[str] = mapped_column(
        String(255), nullable=False, doc="Full name of the lead"
    )
    whatsapp_number: Mapped[str] = mapped_column(
        String(50), nullable=False, doc="WhatsApp phone number with country code"
    )
    email: Mapped[str | None] = mapped_column(
        String(255), nullable=True, doc="Optional email address"
    )
    consent: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
        doc="Consent checkbox verification to be contacted",
    )
    assessment_session_id: Mapped[str | None] = mapped_column(
        String(255),
        unique=True,
        nullable=True,
        doc="Unique identifier for the assessment session to prevent duplicates",
    )
    consent_timestamp: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
        doc="Timestamp of when the consent was granted",
    )
    privacy_policy_version: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
        default="v1.0",
        doc="Version of the privacy policy accepted by the lead",
    )

    # Assessment details
    country: Mapped[str] = mapped_column(
        String(100), nullable=False, doc="Target country preference"
    )
    study_level: Mapped[str] = mapped_column(
        String(100), nullable=False, doc="Desired level of study (e.g. Bachelor)"
    )
    intended_major: Mapped[str] = mapped_column(
        String(255), nullable=False, doc="Intended major / subject of interest"
    )
    preferred_language: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        doc="Preferred language of instruction (e.g. English)",
    )
    max_budget: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False,
        doc="Maximum yearly tuition budget in USD equivalent",
    )

    # Marketing Attribution & status
    utm_source: Mapped[str | None] = mapped_column(
        String(100), nullable=True, doc="UTM source parameter"
    )
    utm_medium: Mapped[str | None] = mapped_column(
        String(100), nullable=True, doc="UTM medium parameter"
    )
    utm_campaign: Mapped[str | None] = mapped_column(
        String(100), nullable=True, doc="UTM campaign parameter"
    )
    referring_url: Mapped[str | None] = mapped_column(
        Text, nullable=True, doc="HTTP referrer URL"
    )

    status: Mapped[str] = mapped_column(
        String(50),
        default="new",
        nullable=False,
        doc="Lead status (e.g., new, contacted)",
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        nullable=False,
        doc="Creation timestamp in UTC",
    )
