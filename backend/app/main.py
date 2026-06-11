from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine, SessionLocal
from app.models import user, game  # DONT TOUCJH IT!!!!s
from app.routers import auth, games
from app.seed import seed_games

Base.metadata.create_all(bind=engine)

# Seed demo data
with SessionLocal() as db:
    seed_games(db)

app = FastAPI(title="Board Game Tracker")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(games.router)
