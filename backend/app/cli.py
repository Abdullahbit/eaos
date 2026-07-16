import argparse
import sys

from sqlalchemy import text

from app.core.config import settings
from app.core.logging import setup_logging
from app.db.session import SessionLocal
from app.portal.client import PortalClient
from app.sync.programs import ProgramSyncEngine


def health_check() -> None:
    session = SessionLocal()
    try:
        session.execute(text("SELECT 1"))
        print("Database connection verified successfully.")
        sys.exit(0)
    except Exception as e:
        print(f"Database connection failed: {e}")
        sys.exit(1)
    finally:
        session.close()


def sync_programs(dry_run: bool, page_size: int | None, limit: int | None) -> None:
    session = SessionLocal()
    client = PortalClient()
    effective_page_size = (
        page_size if page_size is not None else settings.SYNC_PAGE_SIZE
    )

    engine = ProgramSyncEngine(
        db_session=session,
        portal_client=client,
        page_size=effective_page_size,
        dry_run=dry_run,
        limit=limit,
    )

    try:
        status = engine.run()
        print(f"Sync execution finished with status: {status}")
        sys.exit(0)
    except Exception as e:
        print(f"Sync execution failed: {e}")
        sys.exit(1)
    finally:
        session.close()


def main() -> None:
    setup_logging()

    parser = argparse.ArgumentParser(description="EAOS CLI Tools")
    subparsers = parser.add_subparsers(dest="command")

    # health check subcommand
    subparsers.add_parser("health", help="Verify database connection")

    # sync-programs subcommand
    sync_parser = subparsers.add_parser(
        "sync-programs", help="Synchronize programs from external portal"
    )
    sync_parser.add_argument(
        "--dry-run", action="store_true", help="Run sync without modifying database"
    )
    sync_parser.add_argument(
        "--page-size", type=int, default=None, help="Items per page for portal requests"
    )
    sync_parser.add_argument(
        "--limit", type=int, default=None, help="Maximum number of programs to sync"
    )

    args = parser.parse_args()

    if args.command == "health":
        health_check()
    elif args.command == "sync-programs":
        sync_programs(dry_run=args.dry_run, page_size=args.page_size, limit=args.limit)
    else:
        parser.print_help()
        sys.exit(1)


if __name__ == "__main__":
    main()
