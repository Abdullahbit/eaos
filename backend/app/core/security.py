import re
import time
from collections import defaultdict
from fastapi import HTTPException, Request, status
import httpx

from app.core.config import settings

# Memory storage for IP-based rate limiting
# Key: client_ip, Value: list of request timestamps
_rate_limits = defaultdict(list)


def rate_limiter(request: Request, limit: int = 5, window_seconds: int = 60):
    """
    In-memory IP-based rate limiter.
    Raises HTTP 429 if the request threshold is exceeded within the timeframe.
    """
    client_ip = request.client.host if request.client else "unknown"
    now = time.time()
    
    # Filter out timestamps outside the window
    timestamps = [t for t in _rate_limits[client_ip] if now - t < window_seconds]
    
    if len(timestamps) >= limit:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many requests. Please try again later.",
        )
        
    timestamps.append(now)
    _rate_limits[client_ip] = timestamps


def normalize_phone_number(phone: str) -> str:
    """
    Validates and normalizes phone number to standard E.164 format (+[country][number]).
    Must contain between 7 and 15 digits.
    """
    # Remove whitespace, dashes, and parentheses
    cleaned = re.sub(r"[\s\-\(\)]", "", phone)
    
    if not cleaned.startswith("+"):
        # Auto-append + if starting with non-zero digit
        if cleaned.isdigit():
            cleaned = "+" + cleaned
        else:
            raise ValueError(
                "Phone number must start with '+' and contain only digits."
            )
            
    if not re.match(r"^\+[1-9]\d{6,14}$", cleaned):
        raise ValueError(
            "Invalid international phone number. Must follow E.164 format (e.g., +905001234567)."
        )
        
    return cleaned


async def verify_turnstile_token(token: str, client_ip: str | None = None) -> bool:
    """
    Verifies Cloudflare Turnstile token against Cloudflare API.
    Supports a mock development bypass if secret key is not set or token is 'dev-bypass-token'.
    """
    # Development Bypass
    secret_key = getattr(settings, "TURNSTILE_SECRET_KEY", None)
    if not secret_key or secret_key == "mock_secret" or token == "dev-bypass-token":
        return True

    url = "https://challenges.cloudflare.com/turnstile/v0/siteverify"
    data = {
        "secret": secret_key,
        "response": token,
    }
    if client_ip:
        data["remoteip"] = client_ip

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(url, data=data)
            response.raise_for_status()
            res_json = response.json()
            return bool(res_json.get("success"))
    except Exception:
        # Fallback to False to prevent bypass on actual network issues
        return False
