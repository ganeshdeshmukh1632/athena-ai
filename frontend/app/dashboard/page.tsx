"use client";

import { useEffect, useState } from "react";
import { useAuth, navigateWithPrefix } from "@/lib/auth";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import {
  getHistory,
  getPortfolio,
  getWatchlist,
  type HistoryItem,
  type PortfolioResponse,
  type WatchlistEntry,
} from "@/services/api";

export default function DashboardPage() {
  const { isAuthenticated } = useAuth();
  const [portfolio, setPortfolio] = useState<PortfolioResponse | null>(null);
  const [watchlist, setWatchlist] = useState<WatchlistEntry[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    if (!isAuthenticated) navigateWithPrefix("/login");
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    getPortfolio().then(setPortfolio).catch(() => setPortfolio(null));
    getWatchlist().then(setWatchlist).catch(() => setWatchlist([]));
    getHistory(5).then(setHistory).catch(() => setHistory([]));
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  const totalPnlPositive = (portfolio?.total_pnl ?? 0) >= 0;

  return (
    <main className="flex h-screen flex-col bg-slate-950">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar refreshKey={0} onSelectHistory={() => {}} />
        <div className="flex-1 overflow-y-auto p-8">
          <h1 className="mb-6 text-xl font-semibold text-white">Dashboard</h1>

          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Portfolio Value</p>
              <p className="mt-1 text-lg text-white">
                ₹{portfolio ? portfolio.total_current_value.toFixed(2) : "—"}
              </p>
              {portfolio && (
                <p className={"text-sm " + (totalPnlPositive ? "text-green-400" : "text-red-400")}>
                  {totalPnlPositive ? "+" : ""}₹{portfolio.total_pnl.toFixed(2)}
                </p>
              )}
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Watchlist</p>
              <p className="mt-1 text-lg text-white">{watchlist.length} stocks</p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Analyses Run</p>
              <p className="mt-1 text-lg text-white">{history.length >= 5 ? "5+" : history.length}</p>
            </div>
          </div>

          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Recent Activity
          </h2>
          {history.length === 0 ? (
            <p className="text-sm text-slate-500">No activity yet — ask Athena a question to get started.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {history.map((h) => (
                <div key={h.id} className="rounded-lg border border-slate-800 bg-slate-900 p-3 text-sm text-slate-300">
                  {h.question}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
