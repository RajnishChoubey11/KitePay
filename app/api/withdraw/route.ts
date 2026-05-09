import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));

  return NextResponse.json({
    status: "Queued",
    message: `Demo ${body.method ?? "payout"} request created for $${body.amount ?? 0}.`,
    reference: `wd_${Date.now().toString(16)}`,
  });
}
