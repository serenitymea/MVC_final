# view router auth endpoints
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.auth import LoginRequest, RegisterRequest, TokenOut
from app.controllers.auth import verify_credentials, register_user, create_token

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=TokenOut, status_code=201)
def register(body: RegisterRequest, db: Session = Depends(get_db)):
    user = register_user(body.username, body.password, db)
    token = create_token({"username": user.username, "role": user.role})
    return TokenOut(access_token=token, username=user.username, role=user.role)


@router.post("/login", response_model=TokenOut)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    user = verify_credentials(body.username, body.password, db)
    token = create_token(user)
    return TokenOut(access_token=token, username=user["username"], role=user["role"])
