import base64

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.agents.chart_agent import ChartAgent
from app.api.routes_auth import get_current_user
from app.core.config import settings
from app.core.database import get_db
from app.models.db_models import User

router = APIRouter(prefix="/api/v1/options", tags=["options"])

chart_agent = ChartAgent(api_key=settings.groq_api_key)

ALLOWED_TYPES = {"image/png", "image/jpeg", "image/jpg", "image/webp"}
MAX_SIZE_BYTES = 8 * 1024 * 1024  # 8 MB


@router.post("/analyze")
async def analyze_chart(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Please upload a PNG, JPEG, or WEBP image")

    contents = await file.read()
    if len(contents) > MAX_SIZE_BYTES:
        raise HTTPException(status_code=400, detail="Image too large (max 8MB)")

    b64_data = base64.b64encode(contents).decode("utf-8")
    data_url = f"data:{file.content_type};base64,{b64_data}"

    try:
        result = chart_agent.run(data_url)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chart analysis failed: {e}")

    return result
