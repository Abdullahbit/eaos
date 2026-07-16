from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


# Import all models here so that Alembic's autogenerate can discover them
from app.models.lead import Lead  # noqa: E402, F401
from app.models.program import Program  # noqa: E402, F401
from app.models.program_fee import ProgramFee  # noqa: E402, F401
from app.models.sync_run import SyncRun  # noqa: E402, F401
from app.models.university import University  # noqa: E402, F401
from app.models.analytics import AnalyticsEvent  # noqa: E402, F401
