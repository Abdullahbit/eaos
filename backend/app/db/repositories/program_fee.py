import uuid
from datetime import datetime

from sqlalchemy import update
from sqlalchemy.orm import Session

from app.db.repositories.base import BaseRepository
from app.models.program_fee import ProgramFee


class ProgramFeeRepository(BaseRepository[ProgramFee]):
    def __init__(self, session: Session):
        super().__init__(ProgramFee, session)

    def get_by_portal_id(self, portal_id: int) -> ProgramFee | None:
        return (
            self.session.query(ProgramFee)
            .filter(ProgramFee.portal_id == portal_id)
            .first()
        )

    def deactivate_unseen(
        self, seen_portal_ids: list[int], before_timestamp: datetime
    ) -> int:
        """
        Deactivates active fees that were not seen in the current sync run.
        """
        stmt = (
            update(ProgramFee)
            .where(ProgramFee.is_active.is_(True))
            .where(ProgramFee.portal_id.not_in(seen_portal_ids))
            .values(is_active=False, updated_at=before_timestamp)
        )
        result = self.session.execute(stmt)
        return result.rowcount

    def deactivate_removed_fees_for_program(
        self,
        program_id: uuid.UUID,
        current_fee_portal_ids: list[int],
        before_timestamp: datetime,
    ) -> int:
        """
        For a given program, deactivates active fees that are no longer present in
        the current page's programs_fees array for this program.
        """
        stmt = (
            update(ProgramFee)
            .where(ProgramFee.program_id == program_id)
            .where(ProgramFee.is_active.is_(True))
        )
        if current_fee_portal_ids:
            stmt = stmt.where(ProgramFee.portal_id.not_in(current_fee_portal_ids))

        stmt = stmt.values(is_active=False, updated_at=before_timestamp)
        result = self.session.execute(stmt)
        return result.rowcount
