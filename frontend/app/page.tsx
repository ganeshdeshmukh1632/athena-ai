"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import AskAthena from "@/components/workspace/AskAthena";
import EvidencePanel from "@/components/workspace/EvidencePanel";
import type { AnalyzeResponse } from "@/services/api";

export default function Home() {
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [prefillQuestion, setPrefillQuestion] = useState("");

  return (
    <main className="flex h-screen flex-col bg-slate-950">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          refreshKey={refreshKey}
          onSelectHistory={(q) => setPrefillQuestion(q)}
        />
        <div className="flex-1 overflow-y-auto">
          <AskAthena
            onResult={setResult}
            onComplete={() => setRefreshKey((k) => k + 1)}
            prefillQuestion={prefillQuestion}
          />
        </div>
        <EvidencePanel result={result} />
      </div>
    </main>
  );
}
