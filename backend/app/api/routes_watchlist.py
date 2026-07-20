from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.routes_auth import get_current_user
from app.core.database import get_db
from app.data.nse_symbols import ALL_SYMBOLS
from app.models.db_models import User, WatchlistItem
from app.services.market_data import get_stock_snapshot

router = APIRouter(prefix="/api/v1/watchlist", tags=["watchlist"])


class WatchlistAddRequest(BaseModel):
    symbol: str


@router.get("")
def list_watchlist(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    items = (
        db.query(WatchlistItem)
        .filter(WatchlistItem.user_id == current_user.id)
        .order_by(WatchlistItem.added_at.desc())
        .all()
    )
    results = []
    for item in items:
        try:
            snapshot = get_stock_snapshot(item.symbol)
        except Exception:
            snapshot = None
        results.append({
            "id": item.id,
            "symbol": item.symbol,
            "added_at": item.added_at.isoformat(),
            "snapshot": snapshot,
        })
    return results


@router.post("")
def add_to_watchlist(
    request: WatchlistAddRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    symbol = request.symbol.upper()
    if symbol not in ALL_SYMBOLS:
        raise HTTPException(status_code=400, detail=f"Unknown symbol: {symbol}")

    existing = (
        db.query(WatchlistItem)
        .filter(WatchlistItem.user_id == current_user.id, WatchlistItem.symbol == symbol)
        .first()
    )
    if existing:
        raise HTTPException(status_code=400, detail=f"{symbol} is already on your watchlist")

    item = WatchlistItem(user_id=current_user.id, symbol=symbol)
    db.add(item)
    db.commit()
    db.refresh(item)
    return {"id": item.id, "symbol": item.symbol, "added_at": item.added_at.isoformat()}


@router.delete("/{item_id}")
def remove_from_watchlist(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    item = (
        db.query(WatchlistItem)
        .filter(WatchlistItem.id == item_id, WatchlistItem.user_id == current_user.id)
        .first()
    )
    if not item:
        raise HTTPException(status_code=404, detail="Watchlist item not found")
    db.delete(item)
    db.commit()
    return {"deleted": True}
