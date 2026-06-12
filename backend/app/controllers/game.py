# Controller all business logic for games
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.game import Game
from app.schemas.game import GameCreate, GameUpdate


def list_games(db: Session, owner: str) -> list[Game]:
    return db.query(Game).filter(Game.owner == owner).all()


def create_game(db: Session, data: GameCreate, owner: str) -> Game:
    game = Game(**data.model_dump(), owner=owner)
    db.add(game)
    db.commit()
    db.refresh(game)
    return game


def update_game(db: Session, game_id: int, data: GameUpdate, username: str) -> Game:
    game = db.get(Game, game_id)
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    if game.owner != username:
        raise HTTPException(status_code=403, detail="Not your game")
    game.rating = data.rating
    game.completed = data.completed
    db.commit()
    db.refresh(game)
    return game


def delete_game(db: Session, game_id: int, username: str) -> None:
    game = db.get(Game, game_id)
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    if game.owner != username:
        raise HTTPException(status_code=403, detail="Not your game")
    db.delete(game)
    db.commit()
