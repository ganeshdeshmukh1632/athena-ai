"use client";

import { useEffect, useState } from "react";
import { useAuth, navigateWithPrefix } from "@/lib/auth";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import {
  addHolding,
  getPortfolio,
  removeHolding,
  type PortfolioResponse,
} from "@/services/api";

export default function PortfolioPage() {
  const [data, setData] = useState<PortfolioResponse | null>(null);
  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) navigateWithPrefix("/login");
  }, [isAuthenticated]);

  function load() {
    setLoading(true);
    getPortfolio()
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (isAuthenticated) load();
  }, [isAuthenticated]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const q = parseFloat(quantity);
    const p = parseFloat(buyPrice);
    if (!symbol.trim() || !q || !p) {
      setError("Enter a valid symbol, quantity, and buy price");
      return;
    }
    try {
      await addHolding(symbol.trim(), q, p);
      setSymbol("");
      setQuantity("");
      setBuyPrice("");
      load();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  }

  async function handleRemove(id: number) {
    await removeHolding(id);
    load();
  }

  if (!isAuthenticated) return null;

  const totalPnlPositive = (data?.total_pnl ?? 0) >= 0;

  return (
    <main className="flex h-screen flex-col bg-slate-950">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar refreshKey={0} onSelectHistory={() => {}} />
        <div className="flex-1 overflow-y-auto p-8">
          <h1 className="mb-6 text-xl font-semibold text-white">Portfolio</h1>

          {data && (
            <div className="mb-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Invested</p>
                <p className="mt-1 text-lg text-white">
                  ₹{data.total_invested.toFixed(2)}
                </p>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Current Value</p>
                <p className="mt-1 text-lg text-white">
                  ₹{data.total_current_value.toFixed(2)}
                </p>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Total P&L</p>
                <p
                  className={
                    "mt-1 text-lg " + (totalPnlPositive ? "text-green-400" : "text-red-400")
                  }
                >
                  {totalPnlPositive ? "+" : ""}₹{data.total_pnl.toFixed(2)}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleAdd} className="mb-6 flex flex-wrap gap-3">
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="Symbol, e.g. RELIANCE"
              className="w-48 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white placeholder-slate-500 focus:border-blue-600 focus:outline-none"
            />
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Quantity"
              className="w-32 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white placeholder-slate-500 focus:border-blue-600 focus:outline-none"
            />
            <input
              type="number"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              placeholder="Buy price (₹)"
              className="w-36 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white placeholder-slate-500 focus:border-blue-600 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700"
            >
              Add Holding
            </button>
          </form>

          {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

          {loading ? (
            <p className="text-sm text-slate-500">Loading...</p>
          ) : !data || data.holdings.length === 0 ? (
            <p className="text-sm text-slate-500">
              No holdings yet. Add one above to start tracking your portfolio.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-slate-800">
              <table className="w-full text-sm">
                <thead className="bg-slate-900 text-left text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Symbol</th>
                    <th className="px-4 py-3">Qty</th>
                    <th className="px-4 py-3">Buy Price</th>
                    <th className="px-4 py-3">Current Price</th>
                    <th className="px-4 py-3">Invested</th>
                    <th className="px-4 py-3">Current Value</th>
                    <th className="px-4 py-3">P&L</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {data.holdings.map((h) => {
                    const isUp = (h.pnl ?? 0) >= 0;
                    return (
                      <tr key={h.id} className="text-slate-300">
                        <td className="px-4 py-3 font-medium text-white">{h.symbol}</td>
                        <td className="px-4 py-3">{h.quantity}</td>
                        <td className="px-4 py-3">₹{h.buy_price.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          {h.current_price !== null ? `₹${h.current_price.toFixed(2)}` : "—"}
                        </td>
                        <td className="px-4 py-3">₹{h.invested.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          {h.current_value !== null ? `₹${h.current_value.toFixed(2)}` : "—"}
                        </td>
                        <td className={"px-4 py-3 " + (isUp ? "text-green-400" : "text-red-400")}>
                          {h.pnl !== null ? (
                            <>
                              {isUp ? "+" : ""}₹{h.pnl.toFixed(2)} ({h.pnl_pct?.toFixed(2)}%)
                            </>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleRemove(h.id)}
                            className="text-xs text-slate-500 hover:text-red-400"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
