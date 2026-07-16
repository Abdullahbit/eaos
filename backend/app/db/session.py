import logging
from contextlib import contextmanager

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

logger = logging.getLogger("eaos.db")

# Create engine
engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)

# Session local factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@contextmanager
def pg_advisory_lock(session, lock_id: int):
    """
    Acquires a session-level advisory lock on PostgreSQL.
    If database is SQLite (e.g., during tests), it will bypass and succeed.
    """
    is_postgres = session.bind is not None and "postgresql" in str(session.bind.url)

    if not is_postgres:
        logger.debug("Non-Postgres database detected, bypassing advisory lock.")
        yield True
        return

    acquired = False
    try:
        result = session.execute(
            text("SELECT pg_try_advisory_lock(:lock_id)"), {"lock_id": lock_id}
        )
        acquired = bool(result.scalar())
        yield acquired
    finally:
        if acquired:
            try:
                session.execute(
                    text("SELECT pg_advisory_unlock(:lock_id)"), {"lock_id": lock_id}
                )
                session.commit()
            except Exception as e:
                logger.error(f"Failed to release advisory lock {lock_id}: {e}")


def get_db():
    """
    FastAPI dependency that yields a database session and closes it on completion.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
