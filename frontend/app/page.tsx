"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import AskAthena from "@/components/workspace/AskAthena";
import EvidencePanel from "@/components/workspace/EvidencePanel";
import type { AnalyzeResponse } from "@/services/api";

export default function Home() {
  const [result, setResult] = useState<AnalyzeResponse | null>(null);

  return (
    <main className="flex h-screen flex-col bg-slate-950">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-y-auto">
          <AskAthena onResult={setResult} />
        </div>
        <EvidencePanel result={result} />
      </div>
    </main>
  );
}
