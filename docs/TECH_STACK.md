# Tech Stack

## Frontend
- Next.js 14 (App Router) + React + TypeScript
- Tailwind CSS v4
- Deployed as a standard Node dev server behind Nginx (production: `npm run build && npm start` recommended over `next dev`)

## Backend
- FastAPI (Python)
- Uvicorn as ASGI server
- SQLAlchemy ORM

## Database
- PostgreSQL (local instance on the EC2 host)
- Tables: `users`, `analysis_history`, `watchlist_items`

## Authentication
- JWT (via `python-jose`), 7-day expiry
- Passwords hashed with bcrypt (via `passlib`)

## AI / LLM
- Groq API (OpenAI-compatible), model: `llama-3.3-70b-versatile`
- Chosen over Anthropic/OpenAI for free-tier access with no billing requirement
- Four specialized agents: Technical, Fundamental, Risk, News — each a separate prompt/call, merged by the Orchestrator

## Market Data
- `yfinance` (Yahoo Finance, unofficial free API) — NSE tickers via `.NS` suffix
- Covers Nifty 50 + Nifty Next 50, with fuzzy name matching (`rapidfuzz`) for typo tolerance

## News
- Free RSS feeds (Moneycontrol) via `feedparser`, filtered by company name aliases

## Infrastructure
- AWS EC2 (Ubuntu 24.04), accessed via code-server for development
- Fixed Elastic IP + free DuckDNS subdomain (`athena-ganesh.duckdns.org`)
- Nginx reverse proxy routing `/api/*` → backend (port 8000), everything else → frontend (port 3000)
- HTTPS via free Let's Encrypt certificate (Certbot), auto-renewing
- GitHub for version control
