from datetime import datetime, timezone

from sqlalchemy import JSON, Column, DateTime, Float, Integer, String

from app.core.database import Base


class AnalysisHistory(Base):
    __tablename__ = "analysis_history"

    id = Column(Integer, primary_key=True, index=True)
    question = Column(String, nullable=False)
    symbol = Column(String, nullable=True, index=True)
    summary = Column(String, nullable=False)
    confidence = Column(Float, nullable=False)
    full_response = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
