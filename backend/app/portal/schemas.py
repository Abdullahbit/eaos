import re
from decimal import Decimal
from typing import Annotated, Any
from pydantic import BaseModel, Field, BeforeValidator


def parse_portal_decimal(v: Any) -> Any:
    """
    Normalizes string numeric formats (including Turkish/European formats)
    to a format standard Python Decimal parser understands.
    e.g. "6.597,5" -> "6597.5"
         "6597,5"   -> "6597.5"
         "6.597"    -> "6597"
         "6.5"      -> "6.5"
    """
    if isinstance(v, str):
        v = v.strip()
        if not v:
            return None
        # If both dot and comma are present, e.g. "6.597,5"
        if "." in v and "," in v:
            v = v.replace(".", "").replace(",", ".")
        # If only comma is present, e.g. "6597,5"
        elif "," in v:
            v = v.replace(",", ".")
        # If only dot is present and followed by 3-digit groups (thousands format), e.g. "6.597"
        elif re.match(r"^\d{1,3}(\.\d{3})+$", v):
            v = v.replace(".", "")
    return v


# Annotated type using BeforeValidator to clean portal decimal representations
PortalDecimal = Annotated[Decimal, BeforeValidator(parse_portal_decimal)]


class PortalProgramFee(BaseModel):
    id: int
    semester: str | None = None
    status: str | None = None
    fees: PortalDecimal | None = None
    discounted_fees: PortalDecimal | None = None
    cash_fees: PortalDecimal | None = None


class PortalProgram(BaseModel):
    id: int
    years: PortalDecimal | None = None
    deposit_fee: PortalDecimal | None = None
    deposit_note: str | None = None
    prep_school_fee: PortalDecimal | None = None
    prep_school_note: str | None = None
    note: str | None = None
    program_name: str
    language_name: str | None = None
    university_id: int
    university_name: str
    country_name: str | None = None
    city_name: str | None = None
    university_website: str | None = None
    faculty_name: str | None = None
    degree_name: str | None = None
    currency_name: str | None = None
    campus_name: str | None = None
    campus_address: str | None = None
    programs_fees: list[PortalProgramFee] = Field(default_factory=list)


class PortalProgramPage(BaseModel):
    draw: str | int
    recordsTotal: int  # noqa: N815
    recordsFiltered: int  # noqa: N815
    data: list[PortalProgram]
