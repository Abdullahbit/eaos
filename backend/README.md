# EAOS - Education Agent Operating System Backend

Minimal Python backend that synchronizes university program data from the StudyFans external portal into PostgreSQL.

## Environment Requirements
- Python 3.12+
- PostgreSQL (Supabase) or SQLite (for tests)

## Setup Instructions

1. **Create and Activate Virtual Environment:**
   ```bash
   cd backend
   python -m venv .venv
   .venv\Scripts\activate
   ```

2. **Install Dependencies:**
   ```bash
   pip install -e .[dev]
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to `.env` and fill in the values:
   ```bash
   copy .env.example .env
   ```

4. **Run Migrations:**
   ```bash
   alembic upgrade head
   ```

## CLI Usage

### Verify Database Connection
```bash
python -m app.cli health
```

### Run Program Synchronization
```bash
python -m app.cli sync-programs
```

### Run Dry-Run (In-Memory Comparison)
```bash
python -m app.cli sync-programs --dry-run --page-size 50
```

## Running Linting and Tests

### Code Style (Ruff)
```bash
ruff check
ruff format --check
```

### Unit & Integration Tests
```bash
pytest
```
