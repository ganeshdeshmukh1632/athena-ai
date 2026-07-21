export interface AgentBreakdown {
  analysis?: string;
  evidence: string[];
  risks: string[];
  confidence: number;
}

export interface AnalyzeResponse {
  summary: string;
  evidence: string[];
  risks: string[];
  confidence: number;
  sources: string[];
  technical?: AgentBreakdown;
  fundamental?: AgentBreakdown;
  risk?: AgentBreakdown;
  news?: AgentBreakdown;
}

export interface HistoryItem {
  id: number;
  question: string;
  symbol: string | null;
  summary: string;
  confidence: number;
  created_at: string;
}

export interface WatchlistSnapshot {
  symbol: string;
  current_price: number | null;
  previous_close: number | null;
  day_high: number | null;
  day_low: number | null;
  market_cap: number | null;
  pe_ratio: number | null;
  fifty_two_week_high: number | null;
  fifty_two_week_low: number | null;
}

export interface WatchlistEntry {
  id: number;
  symbol: string;
  added_at: string;
  snapshot: WatchlistSnapshot | null;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("athena_token");
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function registerUser(email: string, password: string): Promise<string> {
  const res = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Registration failed");
  }
  const data = await res.json();
  return data.access_token;
}

export async function loginUser(email: string, password: string): Promise<string> {
  const res = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Login failed");
  }
  const data = await res.json();
  return data.access_token;
}

export async function analyzeQuestion(question: string): Promise<AnalyzeResponse> {
  const res = await fetch(`${API_BASE_URL}/api/v1/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ question }),
  });
  if (!res.ok) throw new Error(`Analyze request failed: ${res.status}`);
  return res.json();
}

export async function getHistory(limit: number = 20): Promise<HistoryItem[]> {
  const res = await fetch(`${API_BASE_URL}/api/v1/history?limit=${limit}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`History request failed: ${res.status}`);
  return res.json();
}

export async function getWatchlist(): Promise<WatchlistEntry[]> {
  const res = await fetch(`${API_BASE_URL}/api/v1/watchlist`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to load watchlist");
  return res.json();
}

export async function addToWatchlist(symbol: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/v1/watchlist`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ symbol }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to add to watchlist");
  }
}

export async function removeFromWatchlist(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/v1/watchlist/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to remove from watchlist");
}

export interface HoldingEntry {
  id: number;
  symbol: string;
  quantity: number;
  buy_price: number;
  current_price: number | null;
  invested: number;
  current_value: number | null;
  pnl: number | null;
  pnl_pct: number | null;
  added_at: string;
}

export interface PortfolioResponse {
  holdings: HoldingEntry[];
  total_invested: number;
  total_current_value: number;
  total_pnl: number;
}

export async function getPortfolio(): Promise<PortfolioResponse> {
  const res = await fetch(`${API_BASE_URL}/api/v1/portfolio`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to load portfolio");
  return res.json();
}

export async function addHolding(
  symbol: string,
  quantity: number,
  buyPrice: number
): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/v1/portfolio`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ symbol, quantity, buy_price: buyPrice }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to add holding");
  }
}

export async function removeHolding(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/v1/portfolio/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to remove holding");
}
