"use client";

import { useState } from "react";
import { analyzeQuestion, type AnalyzeResponse } from "@/services/api";

export default function AskAthena({
  onResult,
}: {
  onResult: (result: AnalyzeResponse | null) => void;
}) {
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
    onResult(null);

    try {
      const data = await analyzeQuestion(question);
      setResult(data);
      onResult(data);
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

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      {result && (
        <div className="mt-8 rounded-lg border border-slate-800 bg-slate-900 p-6">
          <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-400">
            Summary
          </h3>
          <p className="text-white">{result.summary}</p>
        </div>
      )}
    </div>
  );
}
