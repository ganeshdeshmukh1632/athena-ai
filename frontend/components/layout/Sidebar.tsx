const NAV_ITEMS = [
  "Dashboard",
  "AI Workspace",
  "Research",
  "Markets",
  "Portfolio",
  "Watchlists",
  "Settings",
];

export default function Sidebar() {
  return (
    <aside className="hidden w-56 shrink-0 border-r border-slate-800 bg-slate-950 md:block">
      <nav className="flex flex-col gap-1 p-4">
        {NAV_ITEMS.map(function (item, i) {
          const activeClass = "bg-slate-800 text-white";
          const inactiveClass = "text-slate-400 hover:bg-slate-900 hover:text-white";
          const linkClass = "rounded-md px-3 py-2 text-sm " + (i === 1 ? activeClass : inactiveClass);
          return (
            <a key={item} href="#" className={linkClass}>
              {item}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
