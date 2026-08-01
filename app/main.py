from datetime import datetime
from typing import Optional

from fastapi import FastAPI, Request, Form, Depends, Query
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from app.core.database import Base, engine
from app.core.dependencies import get_db
from app.model.event import Event


# -------------------------------------------------
# Create Database
# -------------------------------------------------

print("Engine:", engine.url)
print("Creating database...")
Base.metadata.create_all(bind=engine)
print("Created database!")


# -------------------------------------------------
# FastAPI App
# -------------------------------------------------

app = FastAPI()

templates = Jinja2Templates(directory="app/templates")
app.mount("/static", StaticFiles(directory="app/static"), name="static")


# -------------------------------------------------
# Category Colours
# -------------------------------------------------

CATEGORY_COLORS = {
    "work": "#6EE7C4",
    "personal": "#8B7FD1",
    "health": "#FF8B6B",
    "study": "#5EC8E8",
    "other": "#8B90A0",
}


# -------------------------------------------------
# Helper
# -------------------------------------------------

def event_to_fc(event: Event):
    color = CATEGORY_COLORS.get(event.category, CATEGORY_COLORS["other"])

    if event.time:
        start = f"{event.date.isoformat()}T{event.time.strftime('%H:%M:%S')}"
        all_day = False
    else:
        start = event.date.isoformat()
        all_day = True

    return {
        "id": str(event.id),
        "title": event.title,
        "start": start,
        "allDay": all_day,
        "backgroundColor": color,
        "borderColor": color,
        "extendedProps": {
            "category": event.category,
        },
    }


# -------------------------------------------------
# Dashboard
# -------------------------------------------------

@app.get("/")
def root(request: Request):

    hour = datetime.now().hour

    if hour < 12:
        greeting = "Good Morning"
        emoji = "☀️"
    elif hour < 17:
        greeting = "Good Afternoon"
        emoji = "🌤️"
    elif hour < 21:
        greeting = "Good Evening"
        emoji = "🌆"
    else:
        greeting = "Good Night"
        emoji = "🌙"

    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={
            "request": request,
            "greeting": greeting,
            "emoji": emoji,
        },
    )


# -------------------------------------------------
# Planner Page
# -------------------------------------------------

@app.get("/planner")
def planner(request: Request, db: Session = Depends(get_db)):

    events = db.query(Event).order_by(Event.date, Event.time).all()

    return templates.TemplateResponse(
        request=request,
        name="planner.html",
        context={
            "request": request,
            "events": events,
        },
    )


# -------------------------------------------------
# FullCalendar Event Feed
# -------------------------------------------------

@app.get("/api/events/feed")
def event_feed(
    start: str = Query(...),
    end: str = Query(...),
    categories: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):

    start_date = datetime.fromisoformat(
        start.replace("Z", "+00:00")
    ).date()

    end_date = datetime.fromisoformat(
        end.replace("Z", "+00:00")
    ).date()

    query = db.query(Event).filter(
        Event.date >= start_date,
        Event.date < end_date,
    )

    if categories:
        query = query.filter(
            Event.category.in_(categories.split(","))
        )

    events = query.all()

    return [event_to_fc(event) for event in events]


# -------------------------------------------------
# Add Event
# -------------------------------------------------

@app.post("/planner/add")
def add_event(
    title: str = Form(...),
    category: str = Form(...),
    date: str = Form(...),
    time: str = Form(...),
    db: Session = Depends(get_db),
):

    event = Event(
        title=title,
        category=category,
        date=datetime.strptime(date, "%Y-%m-%d").date(),
        time=datetime.strptime(time, "%H:%M").time(),
    )

    db.add(event)
    db.commit()

    return RedirectResponse(
        url="/planner",
        status_code=303,
    )

from pydantic import BaseModel

class EventCreate(BaseModel):
    title: str
    category: str
    date: str
    time: str


@app.post("/api/events")
def create_event(
    data: EventCreate,
    db: Session = Depends(get_db),
):
    event = Event(
        title=data.title,
        category=data.category,
        date=datetime.strptime(data.date, "%Y-%m-%d").date(),
        time=datetime.strptime(data.time, "%H:%M").time(),
    )

    db.add(event)
    db.commit()
    db.refresh(event)

    return {"success": True, "id": event.id}