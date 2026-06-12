# View router HTTP endpoints for games formats responses
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.game import GameCreate, GameUpdate, GameOut
from app.controllers import game as ctrl
from app.controllers.auth import require_auth

router = APIRouter(prefix="/api/games", tags=["games"])


@router.get("/", response_model=list[GameOut])
def get_games(db: Session = Depends(get_db), user=Depends(require_auth)):
    return ctrl.list_games(db, owner=user["username"])


@router.post("/", response_model=GameOut, status_code=201)
def add_game(
    body: GameCreate,
    db: Session = Depends(get_db),
    user=Depends(require_auth),
):
    return ctrl.create_game(db, body, owner=user["username"])


@router.put("/{game_id}", response_model=GameOut)
def edit_game(
    game_id: int,
    body: GameUpdate,
    db: Session = Depends(get_db),
    user=Depends(require_auth),
):
    return ctrl.update_game(db, game_id, body, user["username"])


@router.delete("/{game_id}", status_code=204)
def remove_game(
    game_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_auth),
):
    ctrl.delete_game(db, game_id, user["username"])
