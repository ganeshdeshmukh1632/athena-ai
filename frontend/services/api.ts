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
