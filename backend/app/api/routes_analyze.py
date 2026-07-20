from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.routes_auth import get_current_user
from app.core.database import get_db
from app.models.db_models import AnalysisHistory, User
from app.models.schemas import AnalyzeRequest, AnalyzeResponse
from app.orchestrator.orchestrator import guess_symbol, orchestrator

router = APIRouter(prefix="/api/v1", tags=["analyze"])


@router.post("/analyze", response_model=AnalyzeResponse)
def analyze(
    request: AnalyzeRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> AnalyzeResponse:
    result = orchestrator.run(request)

    history_entry = AnalysisHistory(
        user_id=current_user.id,
        question=request.question,
        symbol=guess_symbol(request.question),
        summary=result.summary,
        confidence=result.confidence,
        full_response=result.model_dump(),
    )
    db.add(history_entry)
    db.commit()

    return result


@router.get("/history")
def get_history(
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    entries = (
        db.query(AnalysisHistory)
        .filter(AnalysisHistory.user_id == current_user.id)
        .order_by(AnalysisHistory.created_at.desc())
        .limit(limit)
        .all()
    )
    return [
        {
            "id": e.id,
            "question": e.question,
            "symbol": e.symbol,
            "summary": e.summary,
            "confidence": e.confidence,
            "created_at": e.created_at.isoformat(),
        }
        for e in entries
    ]
