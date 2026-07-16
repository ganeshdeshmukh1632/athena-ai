export default function Navbar() {
  return (
    <nav className="flex items-center justify-between border-b border-slate-800 px-8 py-5">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 font-bold text-white">
          A
        </div>

        <div>
          <h1 className="text-xl font-bold text-white">Athena OS</h1>
          <p className="text-xs text-slate-400">
            AI Investment Operating System
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="hidden gap-8 text-slate-300 md:flex">
        <a href="#" className="hover:text-white">Features</a>
        <a href="#" className="hover:text-white">Roadmap</a>
        <a href="#" className="hover:text-white">Documentation</a>
        <a href="#" className="hover:text-white">GitHub</a>
      </div>

      {/* Button */}
      <button className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700">
        Launch Athena
      </button>
    </nav>
  );
}
