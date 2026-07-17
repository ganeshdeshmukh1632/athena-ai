import json
import re

from openai import OpenAI

from app.core.config import settings
from app.models.schemas import AnalyzeRequest, AnalyzeResponse
from app.services.market_data import get_stock_snapshot

SYSTEM_PROMPT = """You are a financial analysis assistant inside Athena AI, \
an investment research tool. You do NOT give guaranteed buy/sell calls, \
you do NOT execute trades, and you always explain your reasoning.

Respond with ONLY a valid JSON object (no markdown, no code fences, \
no extra text) matching exactly this shape:

{
  "summary": "one clear paragraph answering the question",
  "evidence": ["point 1", "point 2", "point 3"],
  "risks": ["risk 1", "risk 2"],
  "confidence": 0.0 to 1.0,
  "sources": ["general knowledge" or named sources if applicable]
}

If real market data is provided in the user message, use it directly and \
cite it in your evidence. If no market data is provided, say plainly that \
you don't have current price data rather than guessing numbers."""

# crude symbol guesser — matches known NSE tickers mentioned in FEATURES.md examples;
# will be replaced by a proper NLP/lookup step later
KNOWN_SYMBOLS = {
    "RELIANCE": ["reliance"],
    "TCS": ["tcs"],
    "INFY": ["infosys", "infy"],
    "HDFCBANK": ["hdfc bank", "hdfcbank"],
    "ICICIBANK": ["icici bank", "icicibank"],
}


def guess_symbol(question: str) -> str | None:
    q = question.lower()
    for symbol, aliases in KNOWN_SYMBOLS.items():
        if any(alias in q for alias in aliases):
            return symbol
    return None


class AthenaOrchestrator:
    def __init__(self):
        self.client = OpenAI(
            api_key=settings.groq_api_key,
            base_url="https://api.groq.com/openai/v1",
        )

    def run(self, request: AnalyzeRequest) -> AnalyzeResponse:
        symbol = guess_symbol(request.question)
        market_context = ""

        if symbol:
            try:
                snapshot = get_stock_snapshot(symbol)
                market_context = f"\n\nReal market data for {symbol}:\n{json.dumps(snapshot, indent=2)}"
            except Exception:
                market_context = f"\n\n(Attempted to fetch live data for {symbol} but it failed.)"

        try:
            completion = self.client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                max_tokens=1024,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": request.question + market_context},
                ],
                response_format={"type": "json_object"},
            )
            raw_text = completion.choices[0].message.content.strip()
            data = json.loads(raw_text)
            return AnalyzeResponse(**data)
        except Exception as e:
            return AnalyzeResponse(
                summary=f"Athena couldn't complete this analysis: {e}",
                evidence=[],
                risks=["Analysis failed — see summary for details."],
                confidence=0.0,
                sources=[],
            )


orchestrator = AthenaOrchestrator()
