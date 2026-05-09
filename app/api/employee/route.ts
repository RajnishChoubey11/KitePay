import { NextResponse } from "next/server";
import { demoEmployees } from "@/lib/demoData";

export async function GET() {
  return NextResponse.json({ employees: demoEmployees });
}
