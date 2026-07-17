from pydantic import BaseModel


class AnalyzeRequest(BaseModel):
    question: str


class AnalyzeResponse(BaseModel):
    summary: str
    evidence: list[str]
    risks: list[str]
    confidence: float
    sources: list[str]
