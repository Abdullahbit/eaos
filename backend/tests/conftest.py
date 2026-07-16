import os

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.db.base import Base


@pytest.fixture(scope="session", autouse=True)
def setup_test_env():
    # Set mock environment variables for tests
    os.environ["DATABASE_URL"] = "sqlite:///:memory:"
    os.environ["PORTAL_BASE_URL"] = "https://mockportal.studyfans.com"
    os.environ["PORTAL_COOKIE_CONNECT_SID"] = "mock_sid"


@pytest.fixture(name="db_session")
def db_session_fixture():
    """
    Creates an in-memory SQLite database session for unit tests.
    """
    from sqlalchemy.pool import StaticPool
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=engine)
    session_factory = sessionmaker(bind=engine)
    session = session_factory()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture(autouse=True)
def clear_rate_limits():
    """
    Clears the rate limits in-memory storage before each test case to prevent cross-contamination.
    """
    from app.core.security import _rate_limits
    _rate_limits.clear()
