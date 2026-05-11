import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Employee from "@/models/Employee";
import jwt from "jsonwebtoken";

type EmployeeSearchResult = {
  _id: string;
  name: string;
  email: string;
  position?: string;
  country?: string;
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query || query.length < 2) {
      return NextResponse.json({ employees: [] });
    }

    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    jwt.verify(token, process.env.JWT_SECRET as string);

    await connectDB();

    const employees = await Employee.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } }
      ]
    })
      .limit(10) as EmployeeSearchResult[];

    return NextResponse.json({
      employees: employees.map((emp) => ({
        id: emp._id,
        name: emp.name,
        email: emp.email,
        position: emp.position || "",
        country: emp.country || "Unknown",
        salaryUsd: 0, // Placeholder
      }))
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
