from fastapi import FastAPI, Form, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import sqlite3
import os
import smtplib
from email.message import EmailMessage
import json
from datetime import datetime
try:
    import gspread
except Exception:
    gspread = None

app = FastAPI(title="Prathamesh Portfolio API")

# Path to local SQLite file
DB_PATH = Path(__file__).resolve().parent / "contacts.db"

# Allow frontend (React) to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # in production, restrict to your domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Sample projects – you can edit these
PROJECTS = [
    {
        "title": "AI Voice Agent for Credit Card Sales",
        "tech": ["Vapi", "n8n", "FastAPI", "LLMs"],
        "description": "A voice bot that handles conditional credit card sales pitches with dynamic scripts and CRM integration.",
        "link": "https://github.com/your-username/voice-agent",  # change this
    },
    {
        "title": "AI Agent for Research & Blog Generation",
        "tech": ["LangGraph", "LangChain", "FastAPI", "Groq"],
        "description": "An AI agent that searches arXiv, Google, GitHub and generates long-form technical blogs for LinkedIn & Medium.",
        "link": "https://github.com/your-username/ai-blog-agent",
    },
    {
        "title": "Automation Workflows with n8n",
        "tech": ["n8n", "Webhooks", "PostgreSQL"],
        "description": "Automated workflows for scraping company data, enriching contacts, and sending reports.",
        "link": "https://github.com/your-username/n8n-workflows",
    },
]


@app.get("/api/profile")
def get_profile():
    return {
        "name": "Prathamesh Sunil Patil",
        "tagline": "Experienced AI Engineer | AI Agents & Voice AI",
        "location": "India",
        "headline": "I design, build, and deploy production-ready AI agents, voice bots, and automation workflows for real-world businesses.",
        "years_experience": "2+ years working with AI/ML, LLMs, and automation.",
        "specialties": [
            "AI Agents (LangGraph, LangChain)",
            "Voice AI & calling agents",
            "RAG & LLM Apps",
            "FastAPI backend development",
            "n8n automations & workflow orchestration",
        ],
    }


@app.get("/api/projects")
def get_projects():
    return {"projects": PROJECTS}


def _init_db():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    conn.commit()
    conn.close()


def save_contact(name: str, email: str, message: str) -> int:
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)",
        (name, email, message),
    )
    conn.commit()
    rowid = cur.lastrowid
    conn.close()
    return rowid


def send_email_notification(name: str, email: str, message_text: str) -> None:
    smtp_host = os.getenv("SMTP_HOST")
    if not smtp_host:
        return
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASS")
    notify_to = os.getenv("EMAIL_TO") or smtp_user

    msg = EmailMessage()
    msg["Subject"] = f"New contact from {name}"
    msg["From"] = smtp_user or "noreply@example.com"
    msg["To"] = notify_to
    body = f"Name: {name}\nEmail: {email}\n\nMessage:\n{message_text}"
    msg.set_content(body)

    try:
        with smtplib.SMTP(smtp_host, smtp_port, timeout=10) as s:
            s.starttls()
            if smtp_user and smtp_pass:
                s.login(smtp_user, smtp_pass)
            s.send_message(msg)
    except Exception:
        # Do not crash the API if email fails; it's best-effort
        pass


def append_to_google_sheet(name: str, email: str, message_text: str) -> None:
    """Append contact data to a Google Sheet using a service account.

    Requires these environment variables:
      - GOOGLE_SHEET_ID (the spreadsheet ID)
      - GOOGLE_SHEET_RANGE (optional, default: "Sheet1!A:D")
      - GOOGLE_SERVICE_ACCOUNT (JSON service-account credentials as a string)
    """
    if gspread is None:
        return

    sheet_id = os.getenv("GOOGLE_SHEET_ID")
    creds_json = os.getenv("GOOGLE_SERVICE_ACCOUNT")
    if not sheet_id or not creds_json:
        return

    try:
        creds = json.loads(creds_json)
    except Exception:
        return

    try:
        client = gspread.service_account_from_dict(creds)
        spreadsheet = client.open_by_key(sheet_id)
        # default range/table
        sheet_name = os.getenv("GOOGLE_SHEET_RANGE", "Sheet1")
        try:
            worksheet = spreadsheet.worksheet(sheet_name)
        except Exception:
            # fallback to first worksheet
            worksheet = spreadsheet.get_worksheet(0)

        timestamp = datetime.utcnow().isoformat()
        worksheet.append_row([timestamp, name, email, message_text])
    except Exception:
        # best-effort: ignore errors
        return


@app.on_event("startup")
def startup_event():
    _init_db()


@app.post("/api/contact")
def contact(
    background_tasks: BackgroundTasks,
    name: str = Form(...),
    email: str = Form(...),
    message: str = Form(...),
):
    # Persist contact and optionally send a notification email in the background
    print("New contact message:")
    print(f"Name: {name}")
    print(f"Email: {email}")
    print(f"Message: {message}")

    contact_id = save_contact(name, email, message)
    background_tasks.add_task(send_email_notification, name, email, message)
    background_tasks.add_task(append_to_google_sheet, name, email, message)

    return {"success": True, "id": contact_id, "message": "Thanks for reaching out! I'll get back to you soon."}
