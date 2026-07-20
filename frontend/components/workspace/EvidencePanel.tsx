import type { AnalyzeResponse } from "@/services/api";

export default function EvidencePanel({ result }: { result: AnalyzeResponse | null }) {
  if (!result) {
    return (
      <aside className="hidden w-80 shrink-0 border-l border-slate-800 bg-slate-950 p-6 lg:block">
        <p className="text-sm text-slate-500">
          Ask Athena a question to see supporting evidence here.
        </p>
      </aside>
    );
  }

  return (
    <aside className="hidden w-80 shrink-0 overflow-y-auto border-l border-slate-800 bg-slate-950 p-6 lg:block">
      <div className="mb-6">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Confidence Score
        </h3>
        <div className="h-2 w-full rounded-full bg-slate-800">
          <div
            className="h-2 rounded-full bg-blue-600"
            style={{ width: `${result.confidence * 100}%` }}
          />
        </div>
        <p className="mt-1 text-sm text-slate-400">
          {(result.confidence * 100).toFixed(0)}%
        </p>
      </div>

      {result.technical && (
        <div className="mb-6 border-t border-slate-800 pt-4">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Technical Analysis
          </h3>
          <p className="mb-2 text-sm text-slate-300">{result.technical.analysis}</p>
          <ul className="space-y-1 text-xs text-slate-400">
            {result.technical.evidence.map((e, i) => (
              <li key={i}>• {e}</li>
            ))}
          </ul>
        </div>
      )}

      {result.fundamental && (
        <div className="mb-6 border-t border-slate-800 pt-4">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Fundamental Analysis
          </h3>
          <p className="mb-2 text-sm text-slate-300">{result.fundamental.analysis}</p>
          <ul className="space-y-1 text-xs text-slate-400">
            {result.fundamental.evidence.map((e, i) => (
              <li key={i}>• {e}</li>
            ))}
          </ul>
        </div>
      )}

      {result.news && (
        <div className="mb-6 border-t border-slate-800 pt-4">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            News
          </h3>
          <p className="mb-2 text-sm text-slate-300">{result.news.analysis}</p>
          <ul className="space-y-1 text-xs text-slate-400">
            {result.news.evidence.map((e, i) => (
              <li key={i}>• {e}</li>
            ))}
          </ul>
        </div>
      )}

      {result.risk && (
        <div className="mb-6 border-t border-slate-800 pt-4">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Risk
          </h3>
          <ul className="space-y-1 text-xs text-slate-400">
            {result.risk.risks.map((r, i) => (
              <li key={i}>• {r}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="border-t border-slate-800 pt-4">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Sources
        </h3>
        <ul className="space-y-1 text-xs text-slate-400">
          {result.sources.map((s, i) => (
            <li key={i}>• {s}</li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
