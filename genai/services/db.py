import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from .models import Report
from sqlalchemy.orm import joinedload

load_dotenv()  # Load variables from .env in local dev

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL not set in environment")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

def get_db_session():
    return SessionLocal()

def fetch_latest_report(user_email):
    session = get_db_session()

    try:
        report = (
            session.query(Report)
            .options(
                joinedload(Report.chat),
                joinedload(Report.scores)
            )
            .filter(Report.user_email == user_email)
            .order_by(Report.calendar_week.desc())
            .first()
        )
        return report
    finally:
        session.close()

def prepare_tool_input(report):
    return {
        "notes": report.notes,
        "scores": {s.category_name: s.score for s in report.scores},
        "chat": [m.message for m in report.chat]
    }
