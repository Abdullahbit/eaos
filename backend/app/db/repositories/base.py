from typing import Any

from sqlalchemy.orm import Session

from app.db.base import Base


class BaseRepository[ModelType: Base]:
    def __init__(self, model: type[ModelType], session: Session):
        self.model = model
        self.session = session

    def get(self, id: Any) -> ModelType | None:
        return self.session.query(self.model).filter(self.model.id == id).first()
