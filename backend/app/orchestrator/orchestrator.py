import json

from openai import OpenAI

from app.core.config import settings
from app.models.schemas import AnalyzeRequest, AnalyzeResponse

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

If you lack real-time data (live prices, latest news), say so plainly \
inside the summary and evidence rather than guessing numbers."""


class AthenaOrchestrator:
    def __init__(self):
        self.client = OpenAI(
            api_key=settings.groq_api_key,
            base_url="https://api.groq.com/openai/v1",
        )

    def run(self, request: AnalyzeRequest) -> AnalyzeResponse:
        try:
            completion = self.client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                max_tokens=1024,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": request.question},
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
