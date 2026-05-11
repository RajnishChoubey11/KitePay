import { NextResponse } from "next/server";

export async function GET() {
  // Simulate fetching a "best" exchange rate
  const baseRate = 95.0;
  const variance = Math.random() * 0.8;
  const bestRate = (baseRate + variance).toFixed(2);

  return NextResponse.json({
    rate: Number(bestRate),
    currency: "INR",
    provider: "Jupiter Aggregator (Simulation)",
    timestamp: new Date().toISOString(),
  });
}
