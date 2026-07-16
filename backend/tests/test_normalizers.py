from app.core.normalizers import normalize_string


def test_normalize_string_none():
    assert normalize_string(None) is None


def test_normalize_string_basic():
    assert normalize_string("Hello World") == "Hello World"
    assert normalize_string("  Hello World  ") == "Hello World"


def test_normalize_string_multiple_spaces():
    assert normalize_string("Hello   World") == "Hello World"
    assert normalize_string("Hello \t\n World") == "Hello World"


def test_normalize_string_non_breaking_spaces():
    # \xa0 is the non-breaking space
    assert normalize_string("Hello\xa0World") == "Hello World"
    assert normalize_string(" \xa0 Hello \xa0 World \xa0 ") == "Hello World"
