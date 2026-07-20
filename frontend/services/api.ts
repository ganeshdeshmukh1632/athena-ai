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
