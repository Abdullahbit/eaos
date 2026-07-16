from app.db.base import Base
from app.models.program import Program
from app.models.program_fee import ProgramFee
from app.models.sync_run import SyncRun
from app.models.university import University

__all__ = [
    "Base",
    "University",
    "Program",
    "ProgramFee",
    "SyncRun",
]
