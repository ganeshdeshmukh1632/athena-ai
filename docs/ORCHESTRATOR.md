# Athena OS - Orchestrator

## Purpose

The Orchestrator is the brain of Athena.

It receives a user's question, decides which AI agents and data sources are required, gathers their responses, and produces one final answer.

---

## Workflow

User Prompt

↓

Intent Detection

↓

Task Planning

↓

Select AI Agents

↓

Fetch External Data

↓

Execute Agents

↓

Merge Results

↓

Resolve Conflicts

↓

Generate Final Response

---

## Responsibilities

- Understand user intent
- Select required agents
- Fetch required data
- Execute agents
- Merge responses
- Resolve conflicts
- Generate final answer
- Save conversation

---

## Decision Rules

Technical Question
→ Technical Agent

Fundamental Question
→ Fundamental Agent

News Question
→ News Agent

Portfolio Question
→ Portfolio Agent

Risk Question
→ Risk Agent

Mixed Question
→ Multiple Agents

---

## Response Format

- Summary
- Evidence
- Risks
- Confidence
- Recommendation
