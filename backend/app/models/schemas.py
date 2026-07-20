from pydantic import BaseModel


class AnalyzeRequest(BaseModel):
    question: str


class AgentBreakdown(BaseModel):
    analysis: str | None = None
    evidence: list[str] = []
    risks: list[str] = []
    confidence: float


class AnalyzeResponse(BaseModel):
    summary: str
    evidence: list[str]
    risks: list[str]
    confidence: float
    sources: list[str]
    technical: AgentBreakdown | None = None
    fundamental: AgentBreakdown | None = None
    risk: AgentBreakdown | None = None
    news: AgentBreakdown | None = None
