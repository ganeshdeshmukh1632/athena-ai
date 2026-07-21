# Database Schema

PostgreSQL, managed via SQLAlchemy models in `backend/app/models/db_models.py`.

## `users`
| column | type | notes |
|---|---|---|
| id | int, PK | |
| email | string, unique | |
| hashed_password | string | bcrypt hash |
| created_at | datetime | |

## `analysis_history`
| column | type | notes |
|---|---|---|
| id | int, PK | |
| user_id | int, FK → users.id | |
| question | string | raw user question |
| symbol | string, nullable | resolved NSE symbol, if any |
| summary | string | |
| confidence | float | |
| full_response | JSON | complete AnalyzeResponse, including per-agent breakdowns |
| created_at | datetime | |

## `watchlist_items`
| column | type | notes |
|---|---|---|
| id | int, PK | |
| user_id | int, FK → users.id | |
| symbol | string | unique per user (not globally) |
| added_at | datetime | |

## Notes
- No migration tool in use yet (tables are created via `Base.metadata.create_all` on backend startup). A tool like Alembic is worth adding before this handles real production data changes.
- Live market snapshots are NOT stored — always fetched fresh from yfinance on read (e.g. watchlist view).
