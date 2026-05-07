"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function EmployerSignupForm() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const response = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name,
                companyName,
                email,
                password,
                role: "EMPLOYER",
            }),
        });

        setLoading(false);

        if (!response.ok) {
            const data = await response.json().catch(() => null);
            setError(data?.error ?? "Signup failed");
            return;
        }

        await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        router.push("/dashboard/employer");
    };

    return (
        <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-z