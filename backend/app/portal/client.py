import logging

import httpx

from app.core.config import settings
from app.portal.auth import PortalSessionManager
from app.portal.exceptions import PortalError, PortalResponseError
from app.portal.schemas import PortalProgramPage

logger = logging.getLogger("eaos.portal")


class PortalClient:
    def __init__(
        self,
        session_manager: PortalSessionManager | None = None,
        base_url: str | None = None,
    ):
        self.session_manager = session_manager or PortalSessionManager()
        self.base_url = base_url or settings.PORTAL_BASE_URL

    def fetch_program_page(
        self, start: int, length: int, draw: int = 1
    ) -> PortalProgramPage:
        """
        Fetches a single page of programs from the portal.
        """
        url = f"{self.base_url.rstrip('/')}/all-programs"

        # DataTables payload
        data = {
            "draw": str(draw),
            "start": str(start),
            "length": str(length),
            "search[value]": "",
            "search[regex]": "false",
            "order[0][column]": "0",
            "order[0][dir]": "asc",
        }

        headers = {"Content-Type": "application/x-www-form-urlencoded"}

        import time

        t_start_req = time.perf_counter()
        try:
            with httpx.Client(timeout=30.0) as client:
                self.session_manager.attach_auth_cookie(client)
                response = client.post(url, data=data, headers=headers)
                t_duration_req = time.perf_counter() - t_start_req
                logger.info(
                    f"Portal request completed. Duration: {t_duration_req:.3f}s"
                )

                # Validate response auth/cookie state
                self.session_manager.check_response_validity(response)

                response.raise_for_status()

                t_start_parse = time.perf_counter()
                try:
                    json_data = response.json()
                except ValueError as e:
                    raise PortalResponseError("Response is not valid JSON") from e

                # Validate against schema
                try:
                    parsed_page = PortalProgramPage.model_validate(json_data)
                    t_duration_parse = time.perf_counter() - t_start_parse
                    logger.info(
                        f"Response parsing completed. Duration: {t_duration_parse:.3f}s"
                    )
                    return parsed_page
                except Exception as e:
                    raise PortalResponseError(f"Schema validation failed: {e}") from e

        except httpx.HTTPError as e:
            logger.error(f"HTTP error during portal fetch: {e}")
            raise PortalError(f"Portal network error: {e}") from e
