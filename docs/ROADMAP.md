# Roadmap

## Done
- Multi-agent orchestration (Technical, Fundamental, Risk, News) via Groq/Llama
- Live NSE market data (Nifty 50 + Nifty Next 50) with fuzzy symbol matching
- Free RSS-based news sentiment
- 3-panel UI (nav, workspace, evidence panel)
- Persisted analysis history
- Watchlist with live price cards
- User authentication (JWT), per-user data
- HTTPS on a real domain via Nginx + Let's Encrypt

## Next
- Portfolio tracking (holdings, cost basis, P&L) — described in FEATURES.md, not yet built
- Broader market coverage beyond Nifty 50/Next 50
- Chart-based technical analysis (moving averages, RSI) instead of raw-number reasoning
- Alembic migrations for schema changes
- Production build (`next build`) instead of dev server; process manager (e.g. systemd or PM2) instead of manual terminal runs

## Later / Exploratory
- Multiple AI provider support (originally envisioned: ChatGPT, Gemini, Perplexity, DeepSeek, Grok — currently Groq/Llama only)
- US markets, crypto, ETFs, commodities, forex
- Futures & Options analysis
- Mobile-friendly layout (sidebar/evidence panel currently hide below certain breakpoints rather than adapting)
