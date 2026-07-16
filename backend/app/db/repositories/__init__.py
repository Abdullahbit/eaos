from app.db.repositories.program import ProgramRepository
from app.db.repositories.program_fee import ProgramFeeRepository
from app.db.repositories.sync_run import SyncRunRepository
from app.db.repositories.university import UniversityRepository

__all__ = [
    "UniversityRepository",
    "ProgramRepository",
    "ProgramFeeRepository",
    "SyncRunRepository",
]
