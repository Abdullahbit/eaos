import uuid
from datetime import UTC, datetime

from sqlalchemy.orm import Session

from app.db.repositories.base import BaseRepository
from app.models.sync_run import SyncRun


class SyncRunRepository(BaseRepository[SyncRun]):
    def __init__(self, session: Session):
        super().__init__(SyncRun, session)

    def create_run(self, entity_type: str, status: str = "running") -> SyncRun:
        run = SyncRun(
            entity_type=entity_type, started_at=datetime.now(UTC), status=status
        )
        self.session.add(run)
        self.session.commit()
        return run

    def update_run(
        self,
        run_id: uuid.UUID,
        status: str,
        records_received: int,
        records_inserted: int,
        records_updated: int,
        records_unchanged: int,
        records_deactivated: int,
        error_message: str | None = None,
    ) -> SyncRun | None:
        run = self.get(run_id)
        if run:
            run.status = status
            run.records_received = records_received
            run.records_inserted = records_inserted
            run.records_updated = records_updated
            run.records_unchanged = records_unchanged
            run.records_deactivated = records_deactivated
            run.finished_at = datetime.now(UTC)
            run.error_message = error_message
            self.session.commit()
        return run
