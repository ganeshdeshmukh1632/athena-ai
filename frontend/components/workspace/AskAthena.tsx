"use client";

import { useState } from "react";
import { analyzeQuestion, type AnalyzeResponse } from "@/services/api";

export default function AskAthena() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeQuestion(question);
      setResult(data);
    } catch (err) {
      setError("Something went wrong reaching Athena. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask anything... e.g. Should I buy Reliance?"
          className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 focus:border-blue-600 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </form>

      {error && (
        <p className="mt-4 text-sm text-red-400">{error}</p>
      )}

      {result && (
        <div className="mt-8 space-y-6 rounded-lg border border-slate-800 bg-slate-900 p-6">
          <div>
            <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-400">
              Summary
            </h3>
            <p className="text-white">{result.summary}</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
                Evidence
              </h3>
              <ul className="space-y-1 text-slate-300">
                {result.evidence.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
                Risks
              </h3>
              <ul className="space-y-1 text-slate-300">
                {result.risks.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-800 pt-4">
            <span className="text-sm text-slate-400">
              Confidence: {(result.confidence * 100).toFixed(0)}%
            </span>
            <span className="text-sm text-slate-500">
              Sources: {result.sources.join(", ")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
