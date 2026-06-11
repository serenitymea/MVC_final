# Model orm table definition
from sqlalchemy import Boolean, Column, Integer, String
from app.database import Base


class Game(Base):
    __tablename__ = "games"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    genre = Column(String, nullable=False)
    rating = Column(Integer, default=5)          # 1-10
    completed = Column(Boolean, default=False)
    owner = Column(String, nullable=False)        # username who added the game
