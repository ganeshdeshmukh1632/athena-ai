from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.routes_auth import get_current_user
from app.core.database import get_db
from app.data.nse_symbols import ALL_SYMBOLS
from app.models.db_models import Holding, User
from app.services.market_data import get_stock_snapshot

router = APIRouter(prefix="/api/v1/portfolio", tags=["portfolio"])


class HoldingAddRequest(BaseModel):
    symbol: str
    quantity: float
    buy_price: float


@router.get("")
def list_portfolio(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    holdings = (
        db.query(Holding)
        .filter(Holding.user_id == current_user.id)
        .order_by(Holding.added_at.desc())
        .all()
    )

    results = []
    total_invested = 0.0
    total_current = 0.0

    for h in holdings:
        try:
            snapshot = get_stock_snapshot(h.symbol)
            current_price = snapshot.get("current_price")
        except Exception:
            current_price = None

        invested = h.quantity * h.buy_price
        current_value = (h.quantity * current_price) if current_price is not None else None
        pnl = (current_value - invested) if current_value is not None else None
        pnl_pct = (pnl / invested * 100) if pnl is not None and invested > 0 else None

        total_invested += invested
        if current_value is not None:
            total_current += current_value

        results.append({
            "id": h.id,
            "symbol": h.symbol,
            "quantity": h.quantity,
            "buy_price": h.buy_price,
            "current_price": current_price,
            "invested": invested,
            "current_value": current_value,
            "pnl": pnl,
            "pnl_pct": pnl_pct,
            "added_at": h.added_at.isoformat(),
        })

    return {
        "holdings": results,
        "total_invested": total_invested,
        "total_current_value": total_current,
        "total_pnl": total_current - total_invested,
    }


@router.post("")
def add_holding(
    request: HoldingAddRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    symbol = request.symbol.upper()
    if symbol not in ALL_SYMBOLS:
        raise HTTPException(status_code=400, detail=f"Unknown symbol: {symbol}")
    if request.quantity <= 0 or request.buy_price <= 0:
        raise HTTPException(status_code=400, detail="Quantity and buy price must be positive")

    holding = Holding(
        user_id=current_user.id,
        symbol=symbol,
        quantity=request.quantity,
        buy_price=request.buy_price,
    )
    db.add(holding)
    db.commit()
    db.refresh(holding)
    return {"id": holding.id}


@router.delete("/{holding_id}")
def remove_holding(
    holding_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    holding = (
        db.query(Holding)
        .filter(Holding.id == holding_id, Holding.user_id == current_user.id)
        .first()
    )
    if not holding:
        raise HTTPException(status_code=404, detail="Holding not found")
    db.delete(holding)
    db.commit()
    return {"deleted": True}
