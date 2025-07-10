
from sqlalchemy import Column, Integer, String, Text, Float, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSONB
from .base import Base

class ChatMessage(Base):
    __tablename__ = "chat_message"

    id = Column(Integer, primary_key=True)
    message = Column(Text, nullable=False)
    sender = Column(String, nullable=False)  # "USER" or "AI"
    report_id = Column(Integer, ForeignKey("report.id"))

    report = relationship("Report", back_populates="chat")

class Report(Base):
    __tablename__ = "report"

    id = Column(Integer, primary_key=True)
    calendar_week = Column(Integer, nullable=False)
    year = Column(Integer, nullable=False)
    user_email = Column(String, nullable=False)
    notes = Column(Text)

    scores = relationship("Score", back_populates="report")
    chat = relationship("ChatMessage", back_populates="report")


class Score(Base):
    __tablename__ = 'report_scores'

    report_id = Column(Integer, ForeignKey("report.id"), primary_key=True)
    category_name = Column(String, primary_key=True)
    score = Column(Float)

    report = relationship("Report", back_populates="scores")

