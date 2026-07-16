import logging
import sys

from app.core.config import settings


def setup_logging() -> None:
    log_level_str = settings.LOG_LEVEL.upper()
    log_level = getattr(logging, log_level_str, logging.INFO)

    # Standard clean formatting for logs
    log_format = (
        '{"timestamp": "%(asctime)s", "level": "%(levelname)s", '
        '"name": "%(name)s", "message": "%(message)s"}'
    )

    logging.basicConfig(
        level=log_level, format=log_format, handlers=[logging.StreamHandler(sys.stdout)]
    )


# Run setup logging
setup_logging()
logger = logging.getLogger("eaos")
