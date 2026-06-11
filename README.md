# Board Game Tracker

Learning project made with FastAPI, React and TypeScript.

Built mainly to understand how MVC architecture works in a real application instead of only reading about it.

## What is it

Simple web app for tracking board games.

Anyone can view the list of games without registration.

Registered users can add games and edit only their own games.

Admin can manage all games.

When the project starts for the first time it automatically creates 5 demo games (Catan, Pandemic, etc).

## Stack

### Backend

* FastAPI
* SQLAlchemy 2.0
* PostgreSQL
* python-jose (JWT)

### Frontend

* React
* TypeScript
* Vite
* Fetch API

### Infrastructure

* Docker Compose
* Nginx

## Run

Only Docker and Docker Compose are required.

```bash
git clone ...
cd board-game-tracker

docker compose up --build
```

After startup:

* Frontend: http://localhost:5173
* Backend docs: http://localhost:8000/docs

If database models were changed:

```bash
docker compose down -v
docker compose up --build
```

## Environment Variables

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

USER_USERNAME=user
USER_PASSWORD=user123

SECRET_KEY=...
ACCESS_TOKEN_EXPIRE_MINUTES=60

POSTGRES_USER=bgt
POSTGRES_PASSWORD=bgt_secret
POSTGRES_DB=bgt_db

DATABASE_URL=postgresql+psycopg2://bgt:bgt_secret@db:5432/bgt_db
```

Admin account is created automatically from environment variables on first login.

Regular users register through the UI.

## MVC Architecture

Backend structure:

```text
backend/app/
├── models/
├── controllers/
└── routers/
```

* models = database tables
* controllers = business logic and database operations
* routers = HTTP endpoints

Frontend structure:

```text
src/
├── api/
├── components/
└── App.tsx
```

* api = backend requests
* components = views
* App.tsx = main state management

## API

### Authentication

| Method | Route                | Description             |
| ------ | -------------------- | ----------------------- |
| POST   | `/api/auth/register` | Register a new user     |
| POST   | `/api/auth/login`    | Login and get JWT token |

Example:

```json
POST /api/auth/login

{
  "username": "admin",
  "password": "admin123"
}
```

Response:

```json
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "username": "admin",
  "role": "admin"
}
```

### Games

| Method | Route             | Description   |
| ------ | ----------------- | ------------- |
| GET    | `/api/games/`     | Get all games |
| POST   | `/api/games/`     | Create a game |
| PUT    | `/api/games/{id}` | Update a game |
| DELETE | `/api/games/{id}` | Delete a game |

JWT token must be sent in the header:

```text
Authorization: Bearer eyJ...
```

Create example:

```json
POST /api/games/

{
  "title": "Catan",
  "genre": "Strategy",
  "rating": 8
}
```

Update example:

```json
PUT /api/games/1

{
  "rating": 9,
  "completed": true
}
```

## Permissions

```text
guest  -> view games only

user   -> view, create, edit and delete own games

admin  -> full access
```

Permission check:

```python
if role != "admin" and game.owner != username:
    raise HTTPException(status_code=403, detail="Not your game")
```

## Project Structure

```text
.
├── .env
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│       ├── main.py
│       ├── database.py
│       ├── seed.py
│       ├── models/
│       │   ├── game.py
│       │   └── user.py
│       ├── schemas/
│       │   ├── game.py
│       │   └── auth.py
│       ├── controllers/
│       │   ├── game.py
│       │   └── auth.py
│       └── routers/
│           ├── games.py
│           └── auth.py
└── frontend/
    ├── Dockerfile
    ├── nginx.conf
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── api/index.ts
        ├── types/index.ts
        └── components/
            ├── AuthModal.tsx
            ├── GameForm.tsx
            ├── GameTable.tsx
            └── GameRow.tsx
```

## Known Issues

* JWT token is stored only in React state, so page refresh requires login again
* No pagination
* No Alembic migrations
* Database must be recreated manually after schema changes

```bash
docker compose down -v
```

## Notes

This project was created for learning purposes and is not intended for production use.
