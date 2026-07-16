import httpx
import pytest

from app.portal.auth import PortalSessionManager
from app.portal.exceptions import SessionExpiredError


def test_session_manager_cookie_attachment():
    manager = PortalSessionManager(connect_sid="test_sid_123")
    client = httpx.Client()
    manager.attach_auth_cookie(client)
    assert client.cookies.get("connect.sid") == "test_sid_123"


def test_check_response_validity_http_errors():
    manager = PortalSessionManager()

    # 401 Unauthorized
    resp_401 = httpx.Response(status_code=401)
    with pytest.raises(SessionExpiredError):
        manager.check_response_validity(resp_401)

    # 403 Forbidden
    resp_403 = httpx.Response(status_code=403)
    with pytest.raises(SessionExpiredError):
        manager.check_response_validity(resp_403)


def test_check_response_validity_redirect_to_login():
    manager = PortalSessionManager()

    # Setup history of redirect responses
    r1 = httpx.Response(status_code=302, headers={"location": "/login"})
    resp = httpx.Response(
        status_code=200,
        request=httpx.Request("GET", "https://mock.com/login"),
        history=[r1],
    )

    with pytest.raises(SessionExpiredError):
        manager.check_response_validity(resp)


def test_check_response_validity_html_login():
    manager = PortalSessionManager()

    # HTML response containing a form / login indicators
    html_content = "<html><body><form id='login-form'></form></body></html>"
    resp_html = httpx.Response(
        status_code=200,
        headers={"content-type": "text/html; charset=utf-8"},
        content=html_content.encode("utf-8"),
    )

    with pytest.raises(SessionExpiredError):
        manager.check_response_validity(resp_html)


def test_check_response_validity_success():
    manager = PortalSessionManager()

    resp_ok = httpx.Response(
        status_code=200,
        headers={"content-type": "application/json"},
        content=b'{"status": "ok"}',
    )
    # Should not raise exception
    manager.check_response_validity(resp_ok)
