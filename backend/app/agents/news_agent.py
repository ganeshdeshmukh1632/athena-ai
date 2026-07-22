import json

from openai import OpenAI

SYSTEM_PROMPT = """You are the News Analyst agent inside Athena AI. You \
ONLY summarize sentiment from provided news headlines — never technical \
or fundamental data. If no headlines are provided, say plainly that no \
recent news was found rather than guessing. Respond with ONLY this JSON \
shape:

{
  "analysis": "1-2 sentence news sentiment summary",
  "evidence": ["headline-based point 1", "headline-based point 2"],
  "confidence": 0.0 to 1.0
}"""


class NewsAgent:
    def __init__(self, client: OpenAI):
        self.client = client

    def run(self, headlines: list[dict]) -> dict:
        completion = self.client.chat.completions.create(
            model="openai/gpt-oss-120b",
            max_tokens=400,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": json.dumps(headlines)},
            ],
            response_format={"type": "json_object"},
        )
        return json.loads(completion.choices[0].message.content.strip())
