"use client";

import { useState } from "react";
import { useAuth, navigateWithPrefix } from "@/lib/auth";
import { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { analyzeChart, type ChartAnalysisResult } from "@/services/api";

export default function OptionsPage() {
  const { isAuthenticated } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<ChartAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) navigateWithPrefix("/login");
  }, [isAuthenticated]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setResult(null);
    setError(null);
    setPreviewUrl(URL.createObjectURL(selected));
  }

  async function handleAnalyze() {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await analyzeChart(file);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong analyzing the chart");
    } finally {
      setLoading(false);
    }
  }

  if (!isAuthenticated) return null;

  const recColor =
    result?.recommendation === "CALL"
      ? "text-green-400"
      : result?.recommendation === "PUT"
      ? "text-red-400"
      : "text-slate-400";

  return (
    <main className="flex h-screen flex-col bg-slate-950">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar refreshKey={0} onSelectHistory={() => {}} />
        <div className="flex-1 overflow-y-auto p-8">
          <h1 className="mb-2 text-xl font-semibold text-white">Options Chart Reader</h1>
          <p className="mb-6 text-sm text-slate-500">
            Upload a screenshot of a Nifty 50, Bank Nifty, or any index/stock chart.
            Athena will read the trend and suggest whether conditions favor a Call or Put —
            this is not guaranteed trading advice, always do your own research.
          </p>

          <div className="mb-6 flex flex-wrap items-start gap-6">
            <div>
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleFileChange}
                className="block text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-blue-700"
              />
              <button
                onClick={handleAnalyze}
                disabled={!file || loading}
                className="mt-4 rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Analyzing chart..." : "Analyze Chart"}
              </button>
            </div>

            {previewUrl && (
              <img
                src={previewUrl}
                alt="Chart preview"
                className="max-h-64 rounded-lg border border-slate-800"
              />
            )}
          </div>

          {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

          {result && (
            <div className="max-w-2xl rounded-lg border border-slate-800 bg-slate-900 p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Identified Chart
                  </h3>
                  <p className="text-white">{result.identified_chart}</p>
                </div>
                <div className="text-right">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Recommendation
                  </h3>
                  <p className={"text-2xl font-bold " + recColor}>{result.recommendation}</p>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Reasoning
                </h3>
                <p className="text-sm text-slate-300">{result.reasoning}</p>
              </div>

              <div className="mb-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Evidence
                  </h3>
                  <ul className="space-y-1 text-xs text-slate-400">
                    {result.evidence.map((e, i) => (
                      <li key={i}>• {e}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Risks
                  </h3>
                  <ul className="space-y-1 text-xs text-slate-400">
                    {result.risks.map((r, i) => (
                      <li key={i}>• {r}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4">
                <span className="text-sm text-slate-400">
                  Confidence: {(result.confidence * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
