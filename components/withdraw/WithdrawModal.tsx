"use client";

import { useState } from "react";

export default function WithdrawModal() {
  const [method, setMethod] = useState("INR bank transfer");
  const [status, setStatus] = useState("");

  async function withdraw() {
    setStatus("Processing payout...");
    const response = await fetch("/api/withdraw", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 1200, method }),
    });
    const data = await response.json();
    setStatus(`${data.status}: ${data.message}`);
  }

  return (
    <div className="demo-card">
      <h2>Withdraw salary</h2>
      <p className="muted small">Convert stablecoins to your native currency or keep crypto.</p>

      <div className="stack" style={{ marginTop: "1.5rem" }}>
        <select value={method} onChange={(event) => setMethod(event.target.value)}>
          <option>INR bank transfer</option>
          <option>USDC wallet</option>
          <option>AED bank transfer</option>
        </select>

        <button className="cta-btn full" onClick={withdraw} type="button">
          Request Payout
        </button>
      </div>

      {status && <p className="status-note">{status}</p>}
    </div>
  );
}
