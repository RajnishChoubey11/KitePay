"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function EmployeeLoginForm() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        setLoading(false);

        if (result?.error) {
            setError("Invalid employee credentials");
            return;
        }

        router.push("/dashboard/employee");
    };

    return (
        <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl">
            <h1 className="mb-2 text-3xl font-bold text-white">
                Employee Login
            </h1>

            <p className="mb-6 text-zinc-400">
                Login to view salary and payouts
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label className="mb-2 block text-sm text-zinc-300">
                        Email
                    </label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="employee@example.com"
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm text-zinc-300">
                        Password
                    </label>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
                    />
                </div>

                {error && (
                    <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
                >
                    {loading ? "Logging in..." : "Login as Employee"}
                </button>
            </form>

            <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-zinc-700" />
                <span className="text-sm text-zinc-500">OR</span>
                <div className="h-px flex-1 bg-zinc-700" />
            </div>

            <button
                onClick={() =>
                    signIn("google", {
                        callbackUrl: "/dashboard/employee",
                    })
                }
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-700 bg-zinc-950 py-3 text-white transition hover:bg-zinc-800"
            >
                Continue with Google
            </button>
        </div>
    );
}