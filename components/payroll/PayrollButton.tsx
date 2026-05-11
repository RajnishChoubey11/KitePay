"use client";

import { Send } from "lucide-react";
import { useState } from "react";

type PayrollButtonProps = {
  total: number;
};

export default function PayrollButton({ total }: PayrollButtonProps) {
  const [status, setStatus] = useState<"idle" | "running" | "sent">("idle");

  async function runPayroll() {
    setStatus("running");
    const token = localStorage.getItem("token");
    await fetch("/api/payroll", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ total }),
    });
    setStatus("sent");
  }

  return (
    <button className="cta-btn dash-action" disabled={status === "running"} onClick={runPayroll}>
      <Send className="icon" />
      {status === "idle" && "Run payroll"}
      {status === "running" && "Sending payroll..."}
      {status === "sent" && "Payroll completed"}
    </button>
  );
}
