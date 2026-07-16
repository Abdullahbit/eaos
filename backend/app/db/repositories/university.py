from sqlalchemy.orm import Session

from app.db.repositories.base import BaseRepository
from app.models.university import University


class UniversityRepository(BaseRepository[University]):
    def __init__(self, session: Session):
        super().__init__(University, session)

    def get_by_portal_id(self, portal_id: int) -> University | None:
        return (
            self.session.query(University)
            .filter(University.portal_id == portal_id)
            .first()
        )
