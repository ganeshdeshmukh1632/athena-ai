import Navbar from "@/components/layout/Navbar";
import AskAthena from "@/components/workspace/AskAthena";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Navbar />
      <AskAthena />
    </main>
  );
}
