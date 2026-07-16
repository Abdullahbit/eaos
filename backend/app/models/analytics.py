from datetime import UTC, datetime
from sqlalchemy import DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class AnalyticsEvent(Base):
    __tablename__ = "analytics_events"

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True, doc="Primary key"
    )
    session_id: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True,
        doc="Anonymous session tracking identifier",
    )
    event_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True,
        doc="Name of the tracked funnel event",
    )
    utm_source: Mapped[str | None] = mapped_column(
        String(100), nullable=True, doc="UTM source parameter"
    )
    utm_medium: Mapped[str | None] = mapped_column(
        String(100), nullable=True, doc="UTM medium parameter"
    )
    utm_campaign: Mapped[str | None] = mapped_column(
        String(100), nullable=True, doc="UTM campaign parameter"
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        nullable=False,
        doc="Event timestamp in UTC",
    )
