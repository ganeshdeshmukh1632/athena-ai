export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">Athena OS</h1>
        <p className="text-slate-400 text-lg">
          One Question. Multiple AI Experts. One Intelligent Answer.
        </p>

        <button className="mt-8 px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition">
          Start Analysis
        </button>
      </div>
    </main>
  );
}
