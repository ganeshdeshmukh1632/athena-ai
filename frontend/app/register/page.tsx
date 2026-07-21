"use client";

import { useState } from "react";
import { registerUser } from "@/services/api";
import { useAuth, navigateWithPrefix } from "@/lib/auth";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const token = await registerUser(email, password);
      login(token);
      navigateWithPrefix("/");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex h-screen items-center justify-center bg-slate-950">
      <div className="w-full max-w-sm rounded-lg border border-slate-800 bg-slate-900 p-8">
        <h1 className="mb-6 text-xl font-semibold text-white">Create your Athena account</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-white placeholder-slate-500 focus:border-blue-600 focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password (min 8 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-white placeholder-slate-500 focus:border-blue-600 focus:outline-none"
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>
        <p className="mt-4 text-sm text-slate-400">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigateWithPrefix("/login")}
            className="text-blue-400 hover:underline"
          >
            Log in
          </button>
        </p>
      </div>
    </main>
  );
}
