from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from app.api.routes_analyze import router as analyze_router
from app.api.routes_auth import router as auth_router
from app.api.routes_portfolio import router as portfolio_router
from app.api.routes_watchlist import router as watchlist_router
from app.core.config import settings
from app.core.database import Base, engine

Base.metadata.create_all(bind=engine)

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(title=settings.app_name)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze_router)
app.include_router(watchlist_router)
app.include_router(portfolio_router)
app.include_router(auth_router)


@app.get("/health")
def health():
    return {"status": "ok"}
