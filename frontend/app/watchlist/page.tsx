"use client";

import { useEffect, useState } from "react";
import { useAuth, navigateWithPrefix } from "@/lib/auth";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import {
  addToWatchlist,
  getWatchlist,
  removeFromWatchlist,
  type WatchlistEntry,
} from "@/services/api";

export default function WatchlistPage() {
  const [items, setItems] = useState<WatchlistEntry[]>([]);
  const [symbol, setSymbol] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigateWithPrefix("/login");
    }
  }, [isAuthenticated]);

  function loadWatchlist() {
    setLoading(true);
    getWatchlist()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadWatchlist();
    }
  }, [isAuthenticated]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!symbol.trim()) return;
    setError(null);
    try {
      await addToWatchlist(symbol.trim());
      setSymbol("");
      loadWatchlist();
      setRefreshKey((k) => k + 1);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  }

  async function handleRemove(id: number) {
    await removeFromWatchlist(id);
    loadWatchlist();
  }

  if (!isAuthenticated) return null;

  return (
    <main className="flex h-screen flex-col bg-slate-950">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar refreshKey={refreshKey} onSelectHistory={() => {}} />
        <div className="flex-1 overflow-y-auto p-8">
          <h1 className="mb-6 text-xl font-semibold text-white">Watchlist</h1>

          <form onSubmit={handleAdd} className="mb-6 flex gap-3">
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="Symbol, e.g. RELIANCE, TCS, ZOMATO"
              className="w-72 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white placeholder-slate-500 focus:border-blue-600 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700"
            >
              Add
            </button>
          </form>

          {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

          {loading ? (
            <p className="text-sm text-slate-500">Loading...</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-slate-500">
              No stocks on your watchlist yet. Add one above.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => {
                const s = item.snapshot;
                const change =
                  s && s.current_price !== null && s.previous_close !== null
                    ? s.current_price - s.previous_close
                    : null;
                const changePct =
                  change !== null && s?.previous_close
                    ? (change / s.previous_close) * 100
                    : null;
                const isUp = change !== null && change >= 0;

                return (
                  <div
                    key={item.id}
                    className="rounded-lg border border-slate-800 bg-slate-900 p-4"
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <h3 className="font-semibold text-white">{item.symbol}</h3>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="text-xs text-slate-500 hover:text-red-400"
                      >
                        Remove
                      </button>
                    </div>

                    {s ? (
                      <>
                        <p className="text-lg text-white">
                          ₹{s.current_price?.toFixed(2)}
                        </p>
                        {change !== null && (
                          <p
                            className={
                              "text-sm " + (isUp ? "text-green-400" : "text-red-400")
                            }
                          >
                            {isUp ? "+" : ""}
                            {change.toFixed(2)} ({changePct?.toFixed(2)}%)
                          </p>
                        )}
                        <div className="mt-2 text-xs text-slate-500">
                          PE: {s.pe_ratio?.toFixed(2) ?? "—"} · 52W High: ₹
                          {s.fifty_two_week_high ?? "—"}
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-slate-500">Data unavailable</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
