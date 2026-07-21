"use client";
import { useEffect } from "react";
import { useAuth, navigateWithPrefix } from "@/lib/auth";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import ComingSoon from "@/components/workspace/ComingSoon";

export default function SettingsPage() {
  const { isAuthenticated } = useAuth();
  useEffect(() => {
    if (!isAuthenticated) navigateWithPrefix("/login");
  }, [isAuthenticated]);
  if (!isAuthenticated) return null;
  return (
    <main className="flex h-screen flex-col bg-slate-950">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar refreshKey={0} onSelectHistory={() => {}} />
        <ComingSoon title="Settings" />
      </div>
    </main>
  );
}
