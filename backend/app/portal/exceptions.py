class PortalError(Exception):
    """Base exception for portal-related errors."""

    pass


class SessionExpiredError(PortalError):
    """Raised when the session cookie (connect.sid) is expired or invalid."""

    pass


class PortalResponseError(PortalError):
    """Raised when the portal response has invalid formats or unexpected schemas."""

    pass
