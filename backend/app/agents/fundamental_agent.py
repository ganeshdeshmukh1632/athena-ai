import json

from openai import OpenAI

SYSTEM_PROMPT = """You are the Fundamental Analyst agent inside Athena AI. \
You ONLY analyze valuation and company health (PE ratio, market cap) — \
never price momentum or news. Given raw market data, respond with ONLY \
this JSON shape:

{
  "analysis": "1-2 sentence fundamental read",
  "evidence": ["point 1", "point 2"],
  "confidence": 0.0 to 1.0
}"""


class FundamentalAgent:
    def __init__(self, client: OpenAI):
        self.client = client

    def run(self, market_data: dict) -> dict:
        completion = self.client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            max_tokens=400,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": json.dumps(market_data)},
            ],
            response_format={"type": "json_object"},
        )
        return json.loads(completion.choices[0].message.content.strip())
