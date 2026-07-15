# Athena OS - Decision Engine

## Purpose

The Decision Engine determines which AI agents and data sources should be used to answer a user's request.

---

## Step 1: Classify Intent

Possible intents:

- Technical Analysis
- Fundamental Analysis
- News Analysis
- Portfolio Review
- Risk Analysis
- Learning
- Comparison
- General Question

---

## Step 2: Select Agents

| Intent | Agents |
|---------|--------|
| Technical | Technical Agent |
| Fundamental | Fundamental Agent |
| News | News Agent |
| Risk | Risk Agent |
| Portfolio | Portfolio Agent |
| Comparison | Technical + Fundamental + News |
| Learning | Learning Agent |
| Mixed | Multiple Agents |

---

## Step 3: Select Data Sources

Technical
- TradingView
- Market Data

Fundamental
- Financial Statements
- Ratios

News
- News Providers

Portfolio
- User Portfolio

Risk
- User Profile

---

## Step 4: Execute

Run all required agents in parallel.

---

## Step 5: Merge

Merge all responses into a single structured output.

---

## Step 6: Confidence

Every response must include:

- Confidence Score
- Supporting Evidence
- Risks
- Missing Information

---

## Step 7: Final Response

Return one clear answer.

Never expose raw agent outputs.
