import json

from openai import OpenAI
from rapidfuzz import fuzz, process

from app.agents.fundamental_agent import FundamentalAgent
from app.agents.news_agent import NewsAgent
from app.agents.risk_agent import RiskAgent
from app.agents.technical_agent import TechnicalAgent
from app.core.config import settings
from app.data.nse_symbols import ALL_SYMBOLS
from app.models.schemas import AgentBreakdown, AnalyzeRequest, AnalyzeResponse
from app.services.market_data import get_stock_snapshot
from app.services.news_data import get_recent_news

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

# Build a flat lookup: alias -> symbol, for fuzzy matching
ALIAS_TO_SYMBOL = {}
for symbol, aliases in ALL_SYMBOLS.items():
    for alias in aliases:
        ALIAS_TO_SYMBOL[alias] = symbol

FUZZY_MATCH_THRESHOLD = 72  # 0-100, higher = stricter


def guess_symbol(question: str) -> str | None:
    q = question.lower()

    # 1. Exact substring match first (fast, precise)
    candidates = []
    for symbol, aliases in ALL_SYMBOLS.items():
        for alias in aliases:
            if alias in q:
                candidates.append((len(alias), symbol))
    if candidates:
        candidates.sort(reverse=True)
        return candidates[0][1]

    # 2. Fuzzy fallback for typos (e.g. "reliense" -> "reliance")
    words = q.split()
    best_match = None
    best_score = 0
    for word in words:
        if len(word) < 4:
            continue
        match = process.extractOne(word, ALIAS_TO_SYMBOL.keys(), scorer=fuzz.ratio)
        if match and match[1] > best_score and match[1] >= FUZZY_MATCH_THRESHOLD:
            best_score = match[1]
            best_match = ALIAS_TO_SYMBOL[match[0]]

    return best_match


class AthenaOrchestrator:
    def __init__(self):
        self.client = OpenAI(
            api_key=settings.groq_api_key,
            base_url="https://api.groq.com/openai/v1",
        )
        self.technical_agent = TechnicalAgent(self.client)
        self.fundamental_agent = FundamentalAgent(self.client)
        self.risk_agent = RiskAgent(self.client)
        self.news_agent = NewsAgent(self.client)

    def _run_general(self, question: str) -> AnalyzeResponse:
        completion = self.client.chat.completions.create(
            model="openai/gpt-oss-120b",
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
        headlines = get_recent_news(ALL_SYMBOLS[symbol])

        technical = self.technical_agent.run(snapshot)
        fundamental = self.fundamental_agent.run(snapshot)
        risk = self.risk_agent.run(snapshot)
        news = self.news_agent.run(headlines)

        summary = f"{technical['analysis']} {fundamental['analysis']} {news['analysis']}"
        evidence = technical["evidence"] + fundamental["evidence"] + news["evidence"]
        risks = risk["risks"]
        confidence = round(
            (technical["confidence"] + fundamental["confidence"] + risk["confidence"] + news["confidence"]) / 4,
            2,
        )

        sources = [f"Live market data for {symbol}", "Technical Agent", "Fundamental Agent", "Risk Agent", "News Agent"]
        if headlines:
            sources.append(f"{len(headlines)} recent headline(s)")

        return AnalyzeResponse(
            summary=summary,
            evidence=evidence,
            risks=risks,
            confidence=confidence,
            sources=sources,
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
            news=AgentBreakdown(
                analysis=news["analysis"],
                evidence=news["evidence"],
                confidence=news["confidence"],
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
