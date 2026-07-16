import urllib.parse


def generate_whatsapp_link(lead_id: str, phone: str = "905000000000") -> str:
    """
    Generates a wa.me click-to-chat link with a pre-filled message
    containing the lead reference ID. Does not expose personal data.
    """
    message = (
        f"Hi Abdullah, I just completed my assessment on Campus Insider. "
        f"My assessment reference ID is: {lead_id}. Let's review my options!"
    )
    encoded_message = urllib.parse.quote(message)
    return f"https://wa.me/{phone}?text={encoded_message}"
