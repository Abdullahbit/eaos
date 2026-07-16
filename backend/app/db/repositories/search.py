from decimal import Decimal

from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.models.program import Program
from app.models.program_fee import ProgramFee
from app.models.university import University


class ProgramSearchRepository:
    def __init__(self, session: Session):
        self.session = session

    def search_programs(
        self,
        country: str,
        study_level: str,
        intended_major: str,
        preferred_language: str,
        max_budget: Decimal,
        limit: int = 5,
    ) -> list[tuple[Program, University, ProgramFee]]:
        """
        Queries the database for programs matching the assessment criteria.
        Returns a list of matching tuples (Program, University, ProgramFee).
        """
        # Build deterministic query
        query = (
            self.session.query(Program, University, ProgramFee)
            .join(University, Program.university_id == University.id)
            .join(ProgramFee, Program.id == ProgramFee.program_id)
            .filter(University.is_active == True)  # noqa: E712
            .filter(Program.is_active == True)  # noqa: E712
            .filter(ProgramFee.is_active == True)  # noqa: E712
        )

        # Country filter (case-insensitive substring match)
        if country.strip():
            query = query.filter(University.country_name.ilike(f"%{country.strip()}%"))

        # Study Level / Degree filter (case-insensitive substring match)
        if study_level.strip():
            query = query.filter(Program.degree_name.ilike(f"%{study_level.strip()}%"))

        # Intended Major (keyword match on name or faculty)
        if intended_major.strip():
            major_clean = intended_major.strip()
            query = query.filter(
                or_(
                    Program.name.ilike(f"%{major_clean}%"),
                    Program.faculty_name.ilike(f"%{major_clean}%"),
                )
            )

        # Language filter (case-insensitive match)
        if preferred_language.strip():
            query = query.filter(
                Program.language_name.ilike(f"%{preferred_language.strip()}%")
            )

        # Budget filter: cash_fees or discounted_fees or fees <= max_budget
        query = query.filter(
            or_(
                ProgramFee.cash_fees <= max_budget,
                ProgramFee.discounted_fees <= max_budget,
                ProgramFee.fees <= max_budget,
            )
        )

        # Order by discounted fees first (best price), then cash fees
        query = query.order_by(
            ProgramFee.discounted_fees.asc(),
            ProgramFee.cash_fees.asc(),
        )

        # Group/distinct: to avoid duplicate program entries if there are multiple
        # fees, we can select the distinct Program.id. Since PostgreSQL supports
        # distinct on, or since we limit to 5, we can fetch them and deduplicate
        # in Python code to keep it simple.
        raw_results = query.all()

        # Deduplicate by Program portal_id in Python to guarantee unique programs
        seen_program_ids = set()
        deduplicated = []

        for prog, uni, fee in raw_results:
            if prog.portal_id not in seen_program_ids:
                seen_program_ids.add(prog.portal_id)
                deduplicated.append((prog, uni, fee))
            if len(deduplicated) >= limit:
                break

        return deduplicated
