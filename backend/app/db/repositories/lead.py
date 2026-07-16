from app.db.repositories.base import BaseRepository
from app.models.lead import Lead


class LeadRepository(BaseRepository[Lead]):
    def __init__(self, session):
        super().__init__(Lead, session)

    def create(self, lead: Lead) -> Lead:
        """
        Persists a new Lead record in the database.
        """
        self.session.add(lead)
        return lead
