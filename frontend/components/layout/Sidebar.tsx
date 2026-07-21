"use client";

import HistoryList from "@/components/workspace/HistoryList";
import { navigateWithPrefix } from "@/lib/auth";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "AI Workspace", href: "/" },
  { label: "Research", href: "/research" },
  { label: "Markets", href: "/markets" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Watchlists", href: "/watchlist" },
  { label: "Settings", href: "/settings" },
];

export default function Sidebar({
  refreshKey,
  onSelectHistory,
}: {
  refreshKey: number;
  onSelectHistory: (question: string) => void;
}) {
  return (
    <aside className="hidden w-56 shrink-0 overflow-y-auto border-r border-slate-800 bg-slate-950 md:block">
      <nav className="flex flex-col gap-1 p-4">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.label}
            onClick={() => navigateWithPrefix(item.href)}
            className="rounded-md px-3 py-2 text-left text-sm text-slate-400 hover:bg-slate-900 hover:text-white"
          >
            {item.label}
          </button>
        ))}
      </nav>
      <HistoryList refreshKey={refreshKey} onSelect={onSelectHistory} />
    </aside>
  );
}
