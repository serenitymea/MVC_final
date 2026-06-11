# Controller auth logic
import os
import bcrypt
from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt
from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User

SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")
ALGORITHM = "HS256"
EXPIRE_MIN = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin123")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)


def _hash(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def _verify(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())


def _ensure_admin(db: Session) -> None:
    """Create or sync admin account from .env on every login attempt."""
    admin = db.query(User).filter(User.username == ADMIN_USERNAME).first()
    if not admin:
        db.add(User(username=ADMIN_USERNAME, hashed_password=_hash(ADMIN_PASSWORD), role="admin"))
        db.commit()
    elif not _verify(ADMIN_PASSWORD, admin.hashed_password):
        admin.hashed_password = _hash(ADMIN_PASSWORD)
        db.commit()


def register_user(username: str, password: str, db: Session) -> User:
    if db.query(User).filter(User.username == username).first():
        raise HTTPException(status_code=400, detail="Username already taken")
    user = User(username=username, hashed_password=_hash(password), role="user")
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def verify_credentials(username: str, password: str, db: Session) -> dict:
    _ensure_admin(db)
    user = db.query(User).filter(User.username == username).first()
    if not user or not _verify(password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Bad credentials")
    return {"username": user.username, "role": user.role}


def create_token(data: dict) -> str:
    payload = data.copy()
    payload["exp"] = datetime.now(timezone.utc) + timedelta(minutes=EXPIRE_MIN)
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(token: str = Depends(oauth2_scheme)) -> dict | None:
    if not token:
        return None
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return {"username": payload["username"], "role": payload["role"]}
    except JWTError:
        return None


def require_auth(user=Depends(get_current_user)):
    if user is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user
