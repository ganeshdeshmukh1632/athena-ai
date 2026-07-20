import json

from openai import OpenAI

from app.agents.fundamental_agent import FundamentalAgent
from app.agents.risk_agent import RiskAgent
from app.agents.technical_agent import TechnicalAgent
from app.core.config import settings
from app.data.nse_symbols import NIFTY_50
from app.models.schemas import AgentBreakdown, AnalyzeRequest, AnalyzeResponse
from app.services.market_data import get_stock_snapshot

GENERAL_SYSTEM_PROMPT = """You are a financial analysis assistant inside \
Athena AI, an investment research tool. You do NOT give guaranteed \
buy/sell calls, you do NOT execute trades, and you always explain your \
reasoning.

Respond with ONLY a valid JSON object (no markdown, no code fences, \
no extra text) matching exactly this shape:

{
  "summary": "one clear paragraph answering the question",
  "evidence": ["point 1", "point 2", "point 3"],
  "risks": ["risk 1", "risk 2"],
  "confidence": 0.0 to 1.0,
  "sources": ["general knowledge"]
}

You have no market data for this question. Say so plainly rather than \
guessing numbers."""


def guess_symbol(question: str) -> str | None:
    q = question.lower()
    candidates = []
    for symbol, aliases in NIFTY_50.items():
        for alias in aliases:
            if alias in q:
                candidates.append((len(alias), symbol))
    if not candidates:
        return None
    candidates.sort(reverse=True)
    return candidates[0][1]


class AthenaOrchestrator:
    def __init__(self):
        self.client = OpenAI(
            api_key=settings.groq_api_key,
            base_url="https://api.groq.com/openai/v1",
        )
        self.technical_agent = TechnicalAgent(self.client)
        self.fundamental_agent = FundamentalAgent(self.client)
        self.risk_agent = RiskAgent(self.client)

    def _run_general(self, question: str) -> AnalyzeResponse:
        completion = self.client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            max_tokens=1024,
            messages=[
                {"role": "system", "content": GENERAL_SYSTEM_PROMPT},
                {"role": "user", "content": question},
            ],
            response_format={"type": "json_object"},
        )
        data = json.loads(completion.choices[0].message.content.strip())
        return AnalyzeResponse(**data)

    def _run_with_market_data(self, symbol: str, question: str) -> AnalyzeResponse:
        snapshot = get_stock_snapshot(symbol)

        technical = self.technical_agent.run(snapshot)
        fundamental = self.fundamental_agent.run(snapshot)
        risk = self.risk_agent.run(snapshot)

        summary = f"{technical['analysis']} {fundamental['analysis']}"
        evidence = technical["evidence"] + fundamental["evidence"]
        risks = risk["risks"]
        confidence = round(
            (technical["confidence"] + fundamental["confidence"] + risk["confidence"]) / 3,
            2,
        )

        return AnalyzeResponse(
            summary=summary,
            evidence=evidence,
            risks=risks,
            confidence=confidence,
            sources=[f"Live market data for {symbol}", "Technical Agent", "Fundamental Agent", "Risk Agent"],
            technical=AgentBreakdown(
                analysis=technical["analysis"],
                evidence=technical["evidence"],
                confidence=technical["confidence"],
            ),
            fundamental=AgentBreakdown(
                analysis=fundamental["analysis"],
                evidence=fundamental["evidence"],
                confidence=fundamental["confidence"],
            ),
            risk=AgentBreakdown(
                risks=risk["risks"],
                confidence=risk["confidence"],
            ),
        )

    def run(self, request: AnalyzeRequest) -> AnalyzeResponse:
        try:
            symbol = guess_symbol(request.question)
            if symbol:
                return self._run_with_market_data(symbol, request.question)
            return self._run_general(request.question)
        except Exception as e:
            return AnalyzeResponse(
                summary=f"Athena couldn't complete this analysis: {e}",
                evidence=[],
                risks=["Analysis failed — see summary for details."],
                confidence=0.0,
                sources=[],
            )


orchestrator = AthenaOrchestrator()
