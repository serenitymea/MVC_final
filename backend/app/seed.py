# Seed demo games
from sqlalchemy.orm import Session
from app.models.game import Game

DEMO_GAMES = [
    {"title": "Catan", "genre": "Strategy", "rating": 9, "completed": False, "owner": "admin"},
    {"title": "Ticket to Ride", "genre": "Family", "rating": 8, "completed": True, "owner": "admin"},
    {"title": "Pandemic", "genre": "Cooperative", "rating": 9, "completed": False, "owner": "admin"},
    {"title": "Wingspan", "genre": "Engine Building", "rating": 10, "completed": True, "owner": "admin"},
    {"title": "Azul", "genre": "Abstract", "rating": 8, "completed": False, "owner": "admin"},
]


def seed_games(db: Session) -> None:
    if db.query(Game).count() == 0:
        db.add_all([Game(**g) for g in DEMO_GAMES])
        db.commit()
