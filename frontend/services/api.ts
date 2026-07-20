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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export async function analyzeQuestion(question: string): Promise<AnalyzeResponse> {
  const res = await fetch(`${API_BASE_URL}/api/v1/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });

  if (!res.ok) {
    throw new Error(`Analyze request failed: ${res.status}`);
  }

  return res.json();
}

export async function getHistory(limit: number = 20): Promise<HistoryItem[]> {
  const res = await fetch(`${API_BASE_URL}/api/v1/history?limit=${limit}`);
  if (!res.ok) {
    throw new Error(`History request failed: ${res.status}`);
  }
  return res.json();
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

export async function getWatchlist(): Promise<WatchlistEntry[]> {
  const res = await fetch(`${API_BASE_URL}/api/v1/watchlist`);
  if (!res.ok) throw new Error("Failed to load watchlist");
  return res.json();
}

export async function addToWatchlist(symbol: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/v1/watchlist`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
  });
  if (!res.ok) throw new Error("Failed to remove from watchlist");
}
