# My Website — Backend + Frontend

This repository contains a FastAPI backend and a React frontend (Vite).

Quick start (local)

1. Backend (Python venv):

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
uvicorn main:app --reload --port 8000
```

2. Frontend (from `frontend/`):

```bash
cd frontend
npm install
npm run dev
```

Contact persistence

- Contact form submissions are persisted to `backend/contacts.db` (SQLite).
- Optionally configure SMTP via environment variables: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_TO`.

Docker

```bash
docker compose up --build
```

*** End Patch
