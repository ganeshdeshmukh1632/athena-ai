"use client";

import { useEffect, useState } from "react";
import { getHistory, type HistoryItem } from "@/services/api";

export default function HistoryList({
  refreshKey,
  onSelect,
}: {
  refreshKey: number;
  onSelect: (question: string) => void;
}) {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getHistory(10)
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [refreshKey]);

  if (loading) {
    return <p className="px-3 py-2 text-xs text-slate-500">Loading history...</p>;
  }

  if (items.length === 0) {
    return <p className="px-3 py-2 text-xs text-slate-500">No history yet.</p>;
  }

  return (
    <div className="mt-4 border-t border-slate-800 pt-4">
      <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
        Recent
      </h3>
      <div className="flex flex-col gap-1">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.question)}
            className="rounded-md px-3 py-2 text-left text-xs text-slate-400 hover:bg-slate-900 hover:text-white"
          >
            {item.question}
          </button>
        ))}
      </div>
    </div>
  );
}
