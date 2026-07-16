import sys
from unittest.mock import patch

from app.cli import main


@patch("app.cli.health_check")
def test_cli_health(mock_health_check):
    with patch.object(sys, "argv", ["cli.py", "health"]):
        main()
    mock_health_check.assert_called_once()


@patch("app.cli.sync_programs")
def test_cli_sync_programs_dry_run(mock_sync_programs):
    with patch.object(
        sys,
        "argv",
        [
            "cli.py",
            "sync-programs",
            "--dry-run",
            "--page-size",
            "50",
            "--limit",
            "10",
        ],
    ):
        main()
    mock_sync_programs.assert_called_once_with(dry_run=True, page_size=50, limit=10)


@patch("app.cli.sync_programs")
def test_cli_sync_programs_default(mock_sync_programs):
    with patch.object(sys, "argv", ["cli.py", "sync-programs"]):
        main()
    mock_sync_programs.assert_called_once_with(
        dry_run=False, page_size=None, limit=None
    )
