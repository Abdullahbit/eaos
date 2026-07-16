from datetime import datetime

from sqlalchemy import update
from sqlalchemy.orm import Session

from app.db.repositories.base import BaseRepository
from app.models.program import Program


class ProgramRepository(BaseRepository[Program]):
    def __init__(self, session: Session):
        super().__init__(Program, session)

    def get_by_portal_id(self, portal_id: int) -> Program | None:
        return (
            self.session.query(Program).filter(Program.portal_id == portal_id).first()
        )

    def deactivate_unseen(
        self, seen_portal_ids: list[int], before_timestamp: datetime
    ) -> int:
        """
        Deactivates active programs that were not seen in the current sync run.
        """
        stmt = (
            update(Program)
            .where(Program.is_active.is_(True))
            .where(Program.portal_id.not_in(seen_portal_ids))
            .values(is_active=False, updated_at=before_timestamp)
        )
        result = self.session.execute(stmt)
        return result.rowcount
