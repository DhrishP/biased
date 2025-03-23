from sqlalchemy import Column, String, Integer, JSON, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class BiasAnalysis(Base):
    __tablename__ = "bias_analyses"

    id = Column(String, primary_key=True)
    text = Column(String, nullable=False)
    results = Column(JSON, nullable=False)
    summary = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow) 