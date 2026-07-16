from decimal import Decimal
from unittest.mock import MagicMock

import pytest

from app.models.program import Program
from app.models.program_fee import ProgramFee
from app.models.sync_run import SyncRun
from app.models.university import University
from app.portal.exceptions import PortalResponseError, SessionExpiredError
from app.portal.schemas import PortalProgram, PortalProgramFee, PortalProgramPage
from app.sync.programs import ProgramSyncEngine


def make_portal_program(
    prog_id: int,
    name: str = "Computer Engineering",
    uni_id: int = 42,
    uni_name: str = "Test University",
    fees: list[PortalProgramFee] = None,
) -> PortalProgram:
    return PortalProgram(
        id=prog_id,
        years=Decimal("4"),
        deposit_fee=Decimal("500.00"),
        deposit_note="Deposit note text",
        prep_school_fee=Decimal("1000.00"),
        prep_school_note="Prep school note text",
        note="General note",
        program_name=name,
        language_name="English",
        university_id=uni_id,
        university_name=uni_name,
        country_name="Turkey",
        city_name="Istanbul",
        university_website="https://test.edu.tr",
        faculty_name="Engineering",
        degree_name="Bachelor",
        currency_name="USD",
        campus_name="Main Campus",
        campus_address="Campus road 1",
        programs_fees=fees or [],
    )


def test_sync_idempotency_and_creation(db_session):
    # Mock portal client returning one program with one fee
    mock_client = MagicMock()

    fee1 = PortalProgramFee(
        id=101,
        semester="Fall 2025",
        status="Open",
        fees=Decimal("2000.00"),
        discounted_fees=Decimal("1800.00"),
        cash_fees=Decimal("1700.00"),
    )
    program = make_portal_program(prog_id=1, fees=[fee1])
    page = PortalProgramPage(draw=1, recordsTotal=1, recordsFiltered=1, data=[program])
    mock_client.fetch_program_page.return_value = page

    # First Run
    engine = ProgramSyncEngine(db_session, mock_client, page_size=10, dry_run=False)
    status = engine.run()

    assert status == "success"

    # Verify DB entries
    db_uni = db_session.query(University).filter_by(portal_id=42).first()
    assert db_uni is not None
    assert db_uni.name == "Test University"
    assert db_uni.is_active is True

    db_prog = db_session.query(Program).filter_by(portal_id=1).first()
    assert db_prog is not None
    assert db_prog.name == "Computer Engineering"
    assert db_prog.is_active is True
    assert db_prog.university_id == db_uni.id

    db_fee = db_session.query(ProgramFee).filter_by(portal_id=101).first()
    assert db_fee is not None
    assert db_fee.semester == "Fall 2025"
    assert db_fee.fees == Decimal("2000.00")
    assert db_fee.is_active is True

    # Record first run timestamps
    uni_seen_first = db_uni.last_seen_at
    prog_seen_first = db_prog.last_seen_at
    fee_seen_first = db_fee.last_seen_at

    # Second Run (Idempotency check: hash and last_seen_at)
    # Simulate time gap
    import time

    time.sleep(0.1)

    db_session.expire_all()

    mock_client.fetch_program_page.return_value = page
    engine.run()

    db_uni_2 = db_session.query(University).filter_by(portal_id=42).first()
    db_prog_2 = db_session.query(Program).filter_by(portal_id=1).first()
    db_fee_2 = db_session.query(ProgramFee).filter_by(portal_id=101).first()

    # last_seen_at must be updated to a newer timestamp
    assert db_uni_2.last_seen_at > uni_seen_first
    assert db_prog_2.last_seen_at > prog_seen_first
    assert db_fee_2.last_seen_at > fee_seen_first

    # Hash should be identical, so updated_at should not change if we
    # haven't changed the fields
    # But last_seen_at shows the record was checked in this sync.


def test_sync_dry_run_no_database_writes(db_session):
    mock_client = MagicMock()
    program = make_portal_program(prog_id=2)
    page = PortalProgramPage(draw=1, recordsTotal=1, recordsFiltered=1, data=[program])
    mock_client.fetch_program_page.return_value = page

    # Run in Dry-Run Mode
    engine = ProgramSyncEngine(db_session, mock_client, page_size=10, dry_run=True)
    status = engine.run()

    assert status == "dry_run"

    # Verify no persistent writes for programs, universities, or fees
    assert db_session.query(University).filter_by(portal_id=42).first() is None
    assert db_session.query(Program).filter_by(portal_id=2).first() is None

    # SyncRun log should still be recorded with status dry_run
    run_log = db_session.query(SyncRun).filter_by(status="dry_run").first()
    assert run_log is not None
    assert run_log.records_received == 1


def test_sync_session_expiration_error(db_session):
    mock_client = MagicMock()
    mock_client.fetch_program_page.side_effect = SessionExpiredError(
        "Session cookie expired"
    )

    engine = ProgramSyncEngine(db_session, mock_client, page_size=10, dry_run=False)

    with pytest.raises(SessionExpiredError):
        engine.run()

    # Verify SyncRun logged as failed
    run_log = db_session.query(SyncRun).filter_by(status="failed").first()
    assert run_log is not None
    assert "Session cookie expired" in run_log.error_message


def test_sync_malformed_response_schema_validation(db_session):
    mock_client = MagicMock()
    mock_client.fetch_program_page.side_effect = PortalResponseError(
        "Schema validation failed"
    )

    engine = ProgramSyncEngine(db_session, mock_client, page_size=10, dry_run=False)

    with pytest.raises(PortalResponseError):
        engine.run()

    run_log = db_session.query(SyncRun).filter_by(status="failed").first()
    assert run_log is not None
    assert "Schema validation failed" in run_log.error_message


def test_sync_partial_failure_and_rollback_safety(db_session):
    mock_client = MagicMock()

    # Page 1: Successful page
    prog1 = make_portal_program(prog_id=10, name="Prog Page 1")
    page1 = PortalProgramPage(draw=1, recordsTotal=2, recordsFiltered=2, data=[prog1])

    # Mock fetch_program_page to succeed on first page, but fail on second page
    def mock_fetch(start, length, draw):
        if start == 0:
            return page1
        else:
            raise ValueError("Network interruption on page 2")

    mock_client.fetch_program_page.side_effect = mock_fetch

    engine = ProgramSyncEngine(db_session, mock_client, page_size=1, dry_run=False)

    with pytest.raises(ValueError, match="Network interruption on page 2"):
        engine.run()

    # Page 1 transaction was committed because we bounded transaction per page
    db_prog1 = db_session.query(Program).filter_by(portal_id=10).first()
    assert db_prog1 is not None
    assert db_prog1.name == "Prog Page 1"

    # But the SyncRun should be marked failed and NO deactivations run
    run_log = db_session.query(SyncRun).filter_by(status="failed").first()
    assert run_log is not None
    assert "Network interruption on page 2" in run_log.error_message


def test_fee_lifecycle_deactivation(db_session):
    mock_client = MagicMock()

    # Sync 1: Program with two fees
    fee1 = PortalProgramFee(id=301, semester="Sem 1", fees=Decimal("100"))
    fee2 = PortalProgramFee(id=302, semester="Sem 2", fees=Decimal("200"))
    prog = make_portal_program(prog_id=20, fees=[fee1, fee2])
    page1 = PortalProgramPage(draw=1, recordsTotal=1, recordsFiltered=1, data=[prog])

    mock_client.fetch_program_page.return_value = page1
    engine = ProgramSyncEngine(db_session, mock_client, page_size=10, dry_run=False)
    engine.run()

    assert (
        db_session.query(ProgramFee).filter_by(portal_id=301, is_active=True).first()
        is not None
    )
    assert (
        db_session.query(ProgramFee).filter_by(portal_id=302, is_active=True).first()
        is not None
    )

    # Sync 2: Fee 302 is removed from the program's fee list
    prog_updated = make_portal_program(prog_id=20, fees=[fee1])
    page2 = PortalProgramPage(
        draw=1, recordsTotal=1, recordsFiltered=1, data=[prog_updated]
    )

    mock_client.fetch_program_page.return_value = page2
    engine2 = ProgramSyncEngine(db_session, mock_client, page_size=10, dry_run=False)
    engine2.run()

    # Fee 301 remains active, but Fee 302 must be deactivated
    assert (
        db_session.query(ProgramFee).filter_by(portal_id=301, is_active=True).first()
        is not None
    )

    fee302 = db_session.query(ProgramFee).filter_by(portal_id=302).first()
    assert fee302 is not None
    assert fee302.is_active is False


def test_sync_with_limit(db_session):
    mock_client = MagicMock()
    prog1 = make_portal_program(prog_id=50)
    prog2 = make_portal_program(prog_id=51)
    prog3 = make_portal_program(prog_id=52)

    # Page returns 3 programs, but limit is 2
    page = PortalProgramPage(
        draw=1, recordsTotal=3, recordsFiltered=3, data=[prog1, prog2, prog3]
    )
    mock_client.fetch_program_page.return_value = page

    engine = ProgramSyncEngine(
        db_session, mock_client, page_size=10, dry_run=False, limit=2
    )
    status = engine.run()

    assert status == "success"
    assert (
        db_session.query(Program).filter(Program.portal_id.in_([50, 51, 52])).count()
        == 2
    )


def test_portal_decimal_parsing():
    """
    Verifies that European and Turkish style formatted strings are correctly
    normalized and parsed into Decimal objects.
    """
    from app.portal.schemas import parse_portal_decimal
    
    # 1. European format with both dot and comma
    assert parse_portal_decimal("6.597,5") == "6597.5"
    assert Decimal(parse_portal_decimal("6.597,5")) == Decimal("6597.5")

    # 2. European format with comma only
    assert parse_portal_decimal("6597,5") == "6597.5"
    assert Decimal(parse_portal_decimal("6597,5")) == Decimal("6597.5")

    # 3. Thousands dot separator only (European)
    assert parse_portal_decimal("6.597") == "6597"
    assert Decimal(parse_portal_decimal("6.597")) == Decimal("6597")

    # 4. Standard float dot separator (years/standard float representation)
    assert parse_portal_decimal("6.5") == "6.5"
    assert Decimal(parse_portal_decimal("6.5")) == Decimal("6.5")
    
    # 5. Empty values
    assert parse_portal_decimal("   ") is None

