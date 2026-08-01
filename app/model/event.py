from sqlalchemy import Column, Integer, String, Date, Time

from app.core.database import Base


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String)

    date = Column(Date)

    time = Column(Time)

    category = Column(String)