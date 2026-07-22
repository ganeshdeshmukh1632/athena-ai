import json
import re

from openai import OpenAI

SYSTEM_PROMPT = """You are the Options Chart Reader agent inside Athena AI. \
You analyze a screenshot of a stock/index price chart (candlesticks, \
trendlines, indicators if visible) and reason about whether current \
conditions favor buying a CALL option, a PUT option, or neither \
(staying out). You do NOT give guaranteed trading signals, you do NOT \
know the exact current price or expiry, and you always explain your \
reasoning based only on what is visible in the chart image.

Identify which index/stock the chart appears to show if possible (e.g. \
Nifty 50, Bank Nifty), but if unclear, say so rather than guessing.

Respond with ONLY a valid JSON object and NOTHING else — no markdown, \
no code fences, no explanation before or after, no <think> tags. \
Output must start with { and end with }. Match exactly this shape:

{
  "identified_chart": "what you think this chart shows, or 'unclear' if not obvious",
  "recommendation": "CALL" or "PUT" or "NEUTRAL",
  "reasoning": "clear paragraph explaining the trend/pattern basis for this call",
  "evidence": ["specific chart observation 1", "specific chart observation 2"],
  "risks": ["risk 1", "risk 2"],
  "confidence": 0.0 to 1.0
}

Be conservative with confidence — chart reading from a screenshot alone \
is inherently uncertain. If the image is unclear, blurry, or doesn't \
look like a price chart at all, say so and set recommendation to \
"NEUTRAL" with low confidence."""


def _extract_json(raw_text: str) -> dict:
    """
    Some vision models wrap JSON in reasoning text or markdown fences
    despite instructions. Strip that and grab the first {...} block.
    """
    text = raw_text.strip()
    text = re.sub(r"```json\s*|\s*```", "", text)
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if match:
        text = match.group(0)
    return json.loads(text)


class ChartAgent:
    def __init__(self, api_key: str):
        self.client = OpenAI(
            api_key=api_key,
            base_url="https://api.groq.com/openai/v1",
        )

    def run(self, image_data_url: str, user_note: str = "") -> dict:
        user_content = [
            {
                "type": "text",
                "text": user_note or "Analyze this chart and give a Call/Put recommendation.",
            },
            {"type": "image_url", "image_url": {"url": image_data_url}},
        ]

        completion = self.client.chat.completions.create(
            model="qwen/qwen3.6-27b",
            max_completion_tokens=1024,
            temperature=0.7,
            reasoning_effort="none",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_content},
            ],
            response_format={"type": "json_object"},
        )
        raw_text = completion.choices[0].message.content
        return _extract_json(raw_text)
