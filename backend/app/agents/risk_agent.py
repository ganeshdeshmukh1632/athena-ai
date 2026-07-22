import json

from openai import OpenAI

SYSTEM_PROMPT = """You are the Risk Manager agent inside Athena AI. Your \
only job is protecting capital — flag what could go wrong. Given raw \
market data, respond with ONLY this JSON shape:

{
  "risks": ["risk 1", "risk 2"],
  "confidence": 0.0 to 1.0
}"""


class RiskAgent:
    def __init__(self, client: OpenAI):
        self.client = client

    def run(self, market_data: dict) -> dict:
        completion = self.client.chat.completions.create(
            model="openai/gpt-oss-120b",
            max_tokens=300,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": json.dumps(market_data)},
            ],
            response_format={"type": "json_object"},
        )
        return json.loads(completion.choices[0].message.content.strip())
