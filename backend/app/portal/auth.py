import httpx

from app.core.config import settings
from app.portal.exceptions import SessionExpiredError


class PortalSessionManager:
    def __init__(self, connect_sid: str | None = None):
        self.connect_sid = connect_sid or settings.PORTAL_COOKIE_CONNECT_SID

    def attach_auth_cookie(self, client: httpx.Client) -> None:
        """
        Attaches the configured connect.sid cookie to the HTTP client.
        """
        if self.connect_sid:
            client.cookies.set("connect.sid", self.connect_sid)

    def check_response_validity(self, response: httpx.Response) -> None:
        """
        Checks if the response indicates an expired session or access restriction.
        Triggers on:
        - 401/403 status codes.
        - 3xx redirects to paths containing 'login'.
        - HTML responses containing forms or 'login' indicators.
        """
        # HTTP Status Check
        if response.status_code in (401, 403):
            raise SessionExpiredError(
                f"Session expired or unauthorized: status {response.status_code}"
            )

        # Redirect History Check
        if response.history:
            for r in response.history:
                location = r.headers.get("location", "").lower()
                if "login" in location or "signin" in location:
                    raise SessionExpiredError(
                        "Session expired: Redirected to login page."
                    )

        # Content Type & Page body Check
        content_type = response.headers.get("content-type", "").lower()
        if "text/html" in content_type:
            body = response.text.lower()
            if "login" in body or "<form" in body or "signin" in body:
                raise SessionExpiredError(
                    "Session expired: Received login HTML page instead of JSON."
                )
            raise SessionExpiredError(
                f"Unexpected HTML response: {response.text[:200]}"
            )
