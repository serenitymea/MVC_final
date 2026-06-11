# schema pydantic validation
from pydantic import BaseModel, Field


class GameCreate(BaseModel):
    title: str
    genre: str
    rating: int = Field(default=5, ge=1, le=10)


class GameUpdate(BaseModel):
    rating: int = Field(ge=1, le=10)
    completed: bool


class GameOut(BaseModel):
    id: int
    title: str
    genre: str
    rating: int
    completed: bool
    owner: str

    model_config = {"from_attributes": True}
