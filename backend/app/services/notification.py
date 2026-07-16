import logging
import re
from typing import Protocol
import httpx

from app.core.config import settings
from app.models.lead import Lead

logger = logging.getLogger("eaos.notifications")


def mask_phone_number(phone: str) -> str:
    """
    Masks the middle digits of a phone number to protect privacy.
    E.g. +905551234567 -> +90*****4567
    """
    if not phone:
        return ""
    # Find match: leading + and country/operator prefix, middle digits, and last 4 digits
    # Assumes E.164 phone starts with + and has 7-15 digits.
    match = re.match(r"^(\+[1-9]\d{2,4})(\d+)(\d{4})$", phone)
    if match:
        prefix, middle, suffix = match.groups()
        return f"{prefix}{'*' * len(middle)}{suffix}"
    # Fallback masking if match fails
    return phone[:3] + "*****" + phone[-3:] if len(phone) > 6 else "*****"


class NotificationService(Protocol):
    async def send_lead_alert(self, lead: Lead) -> None:
        ...


class ConsoleNotificationService:
    """
    Fallback service that logs masked lead registration details to console.
    """
    async def send_lead_alert(self, lead: Lead) -> None:
        masked_phone = mask_phone_number(lead.whatsapp_number)
        logger.info(
            f"[Lead Notification] New Lead Registered! "
            f"Reference ID: {lead.id} | "
            f"Country: {lead.country} | "
            f"Major: {lead.intended_major} | "
            f"Budget: {lead.max_budget} | "
            f"Phone: {masked_phone} (Masked)"
        )


class TelegramNotificationService:
    """
    Production service sending a message notification via Telegram Bot API.
    """
    def __init__(self, bot_token: str, chat_id: str):
        self.bot_token = bot_token
        self.chat_id = chat_id

    async def send_lead_alert(self, lead: Lead) -> None:
        masked_phone = mask_phone_number(lead.whatsapp_number)
        message = (
            f"🚀 *New Lead Registered on Campus Insider*\n\n"
            f"• *Reference ID:* `{lead.id}`\n"
            f"• *Country:* {lead.country}\n"
            f"• *Major:* {lead.intended_major}\n"
            f"• *Budget:* ${lead.max_budget}/yr\n"
            f"• *Phone:* {masked_phone} (Masked)\n"
            f"• *UTM Source:* {lead.utm_source or 'None'}\n"
            f"• *Status:* {lead.status}"
        )
        url = f"https://api.telegram.org/bot{self.bot_token}/sendMessage"
        payload = {
            "chat_id": self.chat_id,
            "text": message,
            "parse_mode": "Markdown",
        }
        
        # We run inside try/except block to ensure failure does not halt main execution flow
        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                response = await client.post(url, json=payload)
                response.raise_for_status()
        except Exception as e:
            # Log failure but do not raise, ensuring reliability
            logger.error(f"Failed to deliver Telegram notification alert: {e}")


def get_notification_service() -> NotificationService:
    """
    Dependency resolver returning the configured notification service.
    """
    bot_token = getattr(settings, "TELEGRAM_BOT_TOKEN", None)
    chat_id = getattr(settings, "TELEGRAM_CHAT_ID", None)
    
    if bot_token and chat_id and bot_token != "mock_token":
        return TelegramNotificationService(bot_token, chat_id)
        
    return ConsoleNotificationService()
