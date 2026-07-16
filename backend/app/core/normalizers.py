import re


def normalize_string(val: str | None) -> str | None:
    """
    Normalizes a string by replacing non-breaking spaces (\xa0) and multiple
    whitespace characters with a single space, and stripping leading/trailing
    whitespace.
    """
    if val is None:
        return None
    # Replace any whitespace sequence (including \xa0 and newlines) with a single space
    cleaned = re.sub(r"[\s\xa0]+", " ", val)
    return cleaned.strip()
