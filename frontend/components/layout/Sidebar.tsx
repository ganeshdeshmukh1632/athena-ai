import Link from "next/link";
import HistoryList from "@/components/workspace/HistoryList";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/" },
  { label: "AI Workspace", href: "/" },
  { label: "Research", href: "/" },
  { label: "Markets", href: "/" },
  { label: "Portfolio", href: "/" },
  { label: "Watchlists", href: "/watchlist" },
  { label: "Settings", href: "/" },
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
          <Link
            key={item.label}
            href={item.href}
            className="rounded-md px-3 py-2 text-sm text-slate-400 hover:bg-slate-900 hover:text-white"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <HistoryList refreshKey={refreshKey} onSelect={onSelectHistory} />
    </aside>
  );
}
