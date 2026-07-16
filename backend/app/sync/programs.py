import hashlib
import json
import time
from datetime import UTC, datetime
from decimal import Decimal
from typing import Any

from sqlalchemy.orm import Session

from app.core.logging import logger
from app.core.normalizers import normalize_string
from app.db.repositories.program import ProgramRepository
from app.db.repositories.program_fee import ProgramFeeRepository
from app.db.repositories.sync_run import SyncRunRepository
from app.db.repositories.university import UniversityRepository
from app.db.session import pg_advisory_lock
from app.models.program import Program
from app.models.program_fee import ProgramFee
from app.models.university import University
from app.portal.client import PortalClient
from app.portal.schemas import PortalProgram

PROGRAM_SYNC_LOCK_ID = 482937492837492  # Unique 64-bit advisory lock ID


def compute_source_hash(data: dict[str, Any]) -> str:
    """
    Computes a deterministic SHA-256 hash of a dictionary.
    Converts Decimal values to string representation.
    """

    def serializer(obj: Any) -> str:
        if isinstance(obj, Decimal):
            return str(obj)
        raise TypeError(f"Type {type(obj)} not serializable")

    serialized = json.dumps(data, sort_keys=True, default=serializer)
    return hashlib.sha256(serialized.encode("utf-8")).hexdigest()


class ProgramSyncEngine:
    def __init__(
        self,
        db_session: Session,
        portal_client: PortalClient,
        page_size: int = 100,
        dry_run: bool = False,
        limit: int | None = None,
    ):
        self.db = db_session
        self.portal = portal_client
        self.page_size = page_size
        self.dry_run = dry_run
        self.limit = limit

        self.uni_repo = UniversityRepository(db_session)
        self.prog_repo = ProgramRepository(db_session)
        self.fee_repo = ProgramFeeRepository(db_session)
        self.sync_repo = SyncRunRepository(db_session)

    def run(self) -> str:
        """
        Executes the synchronization process.
        """
        sync_start_time = datetime.now(UTC)

        # Concurrency protection using Postgres advisory lock
        with pg_advisory_lock(self.db, PROGRAM_SYNC_LOCK_ID) as locked:
            if not locked:
                msg = "Sync already running: could not acquire database advisory lock."
                logger.error(msg)
                raise RuntimeError(msg)

            # Create SyncRun log
            initial_status = "dry_run" if self.dry_run else "running"
            sync_run = self.sync_repo.create_run(
                entity_type="program", status=initial_status
            )

            # Global tracking variables
            seen_program_ids: set[int] = set()
            seen_fee_ids: set[int] = set()
            page_content_hashes: set[str] = set()

            # Separate internal metrics
            metrics = {
                "uni_inserted": 0,
                "uni_updated": 0,
                "uni_unchanged": 0,
                "prog_inserted": 0,
                "prog_updated": 0,
                "prog_unchanged": 0,
                "fee_inserted": 0,
                "fee_updated": 0,
                "fee_unchanged": 0,
                "deactivated": 0,
            }

            start = 0
            draw = 1
            expected_total = None

            try:
                while True:
                    t_page_start = time.perf_counter()

                    fetch_len = self.page_size
                    if self.limit is not None:
                        remaining = self.limit - len(seen_program_ids)
                        if remaining <= 0:
                            break
                        fetch_len = min(self.page_size, remaining)

                    logger.info(
                        f"Fetching page: start={start}, "
                        f"page_size={fetch_len}, draw={draw}"
                    )
                    page_data = self.portal.fetch_program_page(
                        start=start, length=fetch_len, draw=draw
                    )

                    if expected_total is None:
                        expected_total = page_data.recordsFiltered
                        logger.info(f"Target record count: {expected_total}")

                    # Inconsistent totals detection (ignore if limit was used
                    # to fetch a custom size)
                    if (
                        self.limit is None
                        and page_data.recordsFiltered != expected_total
                    ):
                        raise ValueError(
                            f"Inconsistent recordsFiltered: expected {expected_total}, "
                            f"got {page_data.recordsFiltered}"
                        )

                    # Empty pages validation
                    if not page_data.data and len(seen_program_ids) < min(
                        expected_total, self.limit or expected_total
                    ):
                        if expected_total > 0:
                            raise ValueError(
                                f"Portal returned empty page at index {start} "
                                f"before reaching target {expected_total}"
                            )
                        break

                    # Slice page data if we are close to limit
                    data_to_process = page_data.data
                    if self.limit is not None:
                        remaining = self.limit - len(seen_program_ids)
                        if remaining <= 0:
                            break
                        data_to_process = page_data.data[:remaining]

                    if not data_to_process:
                        break

                    # Detect repeated page loop
                    page_program_ids = [p.id for p in data_to_process]
                    page_hash = hashlib.sha256(
                        json.dumps(page_program_ids).encode("utf-8")
                    ).hexdigest()
                    if page_hash in page_content_hashes:
                        raise ValueError(
                            f"Pagination loop detected: page content has "
                            f"been fetched already (start={start})"
                        )
                    page_content_hashes.add(page_hash)

                    t_comp_start = time.perf_counter()
                    # Page processing
                    if not self.dry_run:
                        # Transaction bounded to this single page
                        self._process_page(
                            data_to_process,
                            sync_start_time,
                            seen_program_ids,
                            seen_fee_ids,
                            metrics,
                        )
                        t_duration_comp = time.perf_counter() - t_comp_start
                        logger.info(
                            f"Database comparison complete. "
                            f"Duration: {t_duration_comp:.3f}s"
                        )

                        t_commit_start = time.perf_counter()
                        self.db.commit()
                        t_duration_commit = time.perf_counter() - t_commit_start
                        logger.info(
                            f"Database commit complete. "
                            f"Duration: {t_duration_commit:.3f}s"
                        )
                    else:
                        # Dry run: execute in-memory comparison
                        self._process_page_dry_run(
                            data_to_process, seen_program_ids, seen_fee_ids, metrics
                        )
                        t_duration_comp = time.perf_counter() - t_comp_start
                        logger.info(
                            f"Database comparison (dry-run) complete. "
                            f"Duration: {t_duration_comp:.3f}s"
                        )

                    t_duration_page = time.perf_counter() - t_page_start
                    logger.info(
                        f"Total page-processing completed. "
                        f"Duration: {t_duration_page:.3f}s"
                    )

                    # Move to next page
                    start += len(data_to_process)
                    draw += 1

                    # Stop conditions
                    if (
                        len(data_to_process) < fetch_len
                        or (
                            self.limit is not None
                            and len(seen_program_ids) >= self.limit
                        )
                        or (self.limit is None and start >= expected_total)
                    ):
                        break

                # Final Deactivation Transaction (Only if we synced the whole
                # dataset without limits)
                if not self.dry_run and expected_total > 0 and self.limit is None:
                    prog_deactivated = self.prog_repo.deactivate_unseen(
                        list(seen_program_ids), sync_start_time
                    )
                    fee_deactivated = self.fee_repo.deactivate_unseen(
                        list(seen_fee_ids), sync_start_time
                    )
                    metrics["deactivated"] += prog_deactivated + fee_deactivated
                    self.db.commit()

                # Log final stats
                logger.info(
                    f"Sync complete. Metrics: Universities("
                    f"inserted={metrics['uni_inserted']}, "
                    f"updated={metrics['uni_updated']}, "
                    f"unchanged={metrics['uni_unchanged']}), "
                    f"Programs("
                    f"inserted={metrics['prog_inserted']}, "
                    f"updated={metrics['prog_updated']}, "
                    f"unchanged={metrics['prog_unchanged']}), "
                    f"Fees("
                    f"inserted={metrics['fee_inserted']}, "
                    f"updated={metrics['fee_updated']}, "
                    f"unchanged={metrics['fee_unchanged']}), "
                    f"Deactivated={metrics['deactivated']}"
                )

                # Update SyncRun record
                status = "dry_run" if self.dry_run else "success"
                self.sync_repo.update_run(
                    run_id=sync_run.id,
                    status=status,
                    records_received=len(seen_program_ids),
                    records_inserted=metrics["prog_inserted"],
                    records_updated=metrics["prog_updated"],
                    records_unchanged=metrics["prog_unchanged"],
                    records_deactivated=metrics["deactivated"],
                )

                return status

            except Exception as e:
                logger.error(f"Sync failed: {e}", exc_info=True)
                if not self.dry_run:
                    self.db.rollback()

                # Record failure in SyncRun
                self.sync_repo.update_run(
                    run_id=sync_run.id,
                    status="failed",
                    records_received=len(seen_program_ids),
                    records_inserted=metrics["prog_inserted"],
                    records_updated=metrics["prog_updated"],
                    records_unchanged=metrics["prog_unchanged"],
                    records_deactivated=metrics["deactivated"],
                    error_message=str(e),
                )
                raise e

    def _process_page(
        self,
        programs: list[PortalProgram],
        sync_start_time: datetime,
        seen_program_ids: set[int],
        seen_fee_ids: set[int],
        metrics: dict[str, int],
    ) -> None:
        for p in programs:
            # Pagination safety: check duplicate IDs across pages
            if p.id in seen_program_ids:
                raise ValueError(
                    f"Duplicate program portal ID {p.id} detected across pages."
                )
            seen_program_ids.add(p.id)

            # 1. Normalize and process University
            uni_name = normalize_string(p.university_name)
            uni_country = normalize_string(p.country_name)
            uni_city = normalize_string(p.city_name)
            uni_website = normalize_string(p.university_website)

            uni_hash_dict = {
                "name": uni_name,
                "country_name": uni_country,
                "city_name": uni_city,
                "website": uni_website,
            }
            uni_hash = compute_source_hash(uni_hash_dict)

            db_uni = self.uni_repo.get_by_portal_id(p.university_id)
            if not db_uni:
                db_uni = University(
                    portal_id=p.university_id,
                    name=uni_name,
                    country_name=uni_country,
                    city_name=uni_city,
                    website=uni_website,
                    source_hash=uni_hash,
                    last_seen_at=sync_start_time,
                    is_active=True,
                )
                self.db.add(db_uni)
                self.db.flush()
                metrics["uni_inserted"] += 1
            else:
                if db_uni.source_hash != uni_hash or not db_uni.is_active:
                    db_uni.name = uni_name
                    db_uni.country_name = uni_country
                    db_uni.city_name = uni_city
                    db_uni.website = uni_website
                    db_uni.source_hash = uni_hash
                    db_uni.is_active = True
                    metrics["uni_updated"] += 1
                else:
                    metrics["uni_unchanged"] += 1
                db_uni.last_seen_at = sync_start_time

            # 2. Normalize and process Program
            prog_name = normalize_string(p.program_name)
            prog_lang = normalize_string(p.language_name)
            prog_fac = normalize_string(p.faculty_name)
            prog_deg = normalize_string(p.degree_name)
            prog_curr = normalize_string(p.currency_name)
            prog_camp = normalize_string(p.campus_name)
            prog_addr = normalize_string(p.campus_address)
            dep_note = normalize_string(p.deposit_note)
            prep_note = normalize_string(p.prep_school_note)
            p_note = normalize_string(p.note)

            prog_hash_dict = {
                "name": prog_name,
                "years": p.years,
                "language_name": prog_lang,
                "faculty_name": prog_fac,
                "degree_name": prog_deg,
                "currency_name": prog_curr,
                "campus_name": prog_camp,
                "campus_address": prog_addr,
                "deposit_fee": p.deposit_fee,
                "deposit_note": dep_note,
                "prep_school_fee": p.prep_school_fee,
                "prep_school_note": prep_note,
                "note": p_note,
            }
            prog_hash = compute_source_hash(prog_hash_dict)

            db_prog = self.prog_repo.get_by_portal_id(p.id)
            if not db_prog:
                db_prog = Program(
                    portal_id=p.id,
                    university_id=db_uni.id,
                    name=prog_name,
                    years=p.years,
                    language_name=prog_lang,
                    faculty_name=prog_fac,
                    degree_name=prog_deg,
                    currency_name=prog_curr,
                    campus_name=prog_camp,
                    campus_address=prog_addr,
                    deposit_fee=p.deposit_fee,
                    deposit_note=dep_note,
                    prep_school_fee=p.prep_school_fee,
                    prep_school_note=prep_note,
                    note=p_note,
                    source_hash=prog_hash,
                    last_seen_at=sync_start_time,
                    is_active=True,
                )
                self.db.add(db_prog)
                self.db.flush()
                metrics["prog_inserted"] += 1
            else:
                if db_prog.source_hash != prog_hash or not db_prog.is_active:
                    db_prog.university_id = db_uni.id
                    db_prog.name = prog_name
                    db_prog.years = p.years
                    db_prog.language_name = prog_lang
                    db_prog.faculty_name = prog_fac
                    db_prog.degree_name = prog_deg
                    db_prog.currency_name = prog_curr
                    db_prog.campus_name = prog_camp
                    db_prog.campus_address = prog_addr
                    db_prog.deposit_fee = p.deposit_fee
                    db_prog.deposit_note = dep_note
                    db_prog.prep_school_fee = p.prep_school_fee
                    db_prog.prep_school_note = prep_note
                    db_prog.note = p_note
                    db_prog.source_hash = prog_hash
                    db_prog.is_active = True
                    metrics["prog_updated"] += 1
                else:
                    metrics["prog_unchanged"] += 1
                db_prog.last_seen_at = sync_start_time

            # 3. Process Program Fees
            current_program_fee_ids = []
            for fee in p.programs_fees:
                seen_fee_ids.add(fee.id)
                current_program_fee_ids.append(fee.id)

                fee_sem = normalize_string(fee.semester)
                fee_stat = normalize_string(fee.status)

                fee_hash_dict = {
                    "semester": fee_sem,
                    "status": fee_stat,
                    "fees": fee.fees,
                    "discounted_fees": fee.discounted_fees,
                    "cash_fees": fee.cash_fees,
                }
                fee_hash = compute_source_hash(fee_hash_dict)

                db_fee = self.fee_repo.get_by_portal_id(fee.id)
                if not db_fee:
                    db_fee = ProgramFee(
                        portal_id=fee.id,
                        program_id=db_prog.id,
                        semester=fee_sem,
                        status=fee_stat,
                        fees=fee.fees,
                        discounted_fees=fee.discounted_fees,
                        cash_fees=fee.cash_fees,
                        source_hash=fee_hash,
                        last_seen_at=sync_start_time,
                        is_active=True,
                    )
                    self.db.add(db_fee)
                    metrics["fee_inserted"] += 1
                else:
                    if db_fee.source_hash != fee_hash or not db_fee.is_active:
                        db_fee.program_id = db_prog.id
                        db_fee.semester = fee_sem
                        db_fee.status = fee_stat
                        db_fee.fees = fee.fees
                        db_fee.discounted_fees = fee.discounted_fees
                        db_fee.cash_fees = fee.cash_fees
                        db_fee.source_hash = fee_hash
                        db_fee.is_active = True
                        metrics["fee_updated"] += 1
                    else:
                        metrics["fee_unchanged"] += 1
                    db_fee.last_seen_at = sync_start_time

            # Fee lifecycle deactivation for this program
            deact_count = self.fee_repo.deactivate_removed_fees_for_program(
                program_id=db_prog.id,
                current_fee_portal_ids=current_program_fee_ids,
                before_timestamp=sync_start_time,
            )
            metrics["deactivated"] += deact_count

    def _process_page_dry_run(
        self,
        programs: list[PortalProgram],
        seen_program_ids: set[int],
        seen_fee_ids: set[int],
        metrics: dict[str, int],
    ) -> None:
        for p in programs:
            if p.id in seen_program_ids:
                raise ValueError(
                    f"Duplicate program portal ID {p.id} detected across pages."
                )
            seen_program_ids.add(p.id)

            # 1. University Hash Check
            uni_name = normalize_string(p.university_name)
            uni_country = normalize_string(p.country_name)
            uni_city = normalize_string(p.city_name)
            uni_website = normalize_string(p.university_website)

            uni_hash = compute_source_hash(
                {
                    "name": uni_name,
                    "country_name": uni_country,
                    "city_name": uni_city,
                    "website": uni_website,
                }
            )
            db_uni = self.uni_repo.get_by_portal_id(p.university_id)
            if not db_uni:
                metrics["uni_inserted"] += 1
            elif db_uni.source_hash != uni_hash or not db_uni.is_active:
                metrics["uni_updated"] += 1
            else:
                metrics["uni_unchanged"] += 1

            # 2. Program Hash Check
            prog_name = normalize_string(p.program_name)
            prog_lang = normalize_string(p.language_name)
            prog_fac = normalize_string(p.faculty_name)
            prog_deg = normalize_string(p.degree_name)
            prog_curr = normalize_string(p.currency_name)
            prog_camp = normalize_string(p.campus_name)
            prog_addr = normalize_string(p.campus_address)
            dep_note = normalize_string(p.deposit_note)
            prep_note = normalize_string(p.prep_school_note)
            p_note = normalize_string(p.note)

            prog_hash = compute_source_hash(
                {
                    "name": prog_name,
                    "years": p.years,
                    "language_name": prog_lang,
                    "faculty_name": prog_fac,
                    "degree_name": prog_deg,
                    "currency_name": prog_curr,
                    "campus_name": prog_camp,
                    "campus_address": prog_addr,
                    "deposit_fee": p.deposit_fee,
                    "deposit_note": dep_note,
                    "prep_school_fee": p.prep_school_fee,
                    "prep_school_note": prep_note,
                    "note": p_note,
                }
            )
            db_prog = self.prog_repo.get_by_portal_id(p.id)
            if not db_prog:
                metrics["prog_inserted"] += 1
            elif db_prog.source_hash != prog_hash or not db_prog.is_active:
                metrics["prog_updated"] += 1
            else:
                metrics["prog_unchanged"] += 1

            # 3. Fees Hash Check
            for fee in p.programs_fees:
                seen_fee_ids.add(fee.id)
                fee_sem = normalize_string(fee.semester)
                fee_stat = normalize_string(fee.status)

                fee_hash = compute_source_hash(
                    {
                        "semester": fee_sem,
                        "status": fee_stat,
                        "fees": fee.fees,
                        "discounted_fees": fee.discounted_fees,
                        "cash_fees": fee.cash_fees,
                    }
                )
                db_fee = self.fee_repo.get_by_portal_id(fee.id)
                if not db_fee:
                    metrics["fee_inserted"] += 1
                elif db_fee.source_hash != fee_hash or not db_fee.is_active:
                    metrics["fee_updated"] += 1
                else:
                    metrics["fee_unchanged"] += 1
