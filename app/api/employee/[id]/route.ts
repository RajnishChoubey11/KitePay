import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Employee from "@/models/Employee";

export async function GET(
  req: Request,
  { params: paramsPromise }: { params: Promise<{ id: string }> }
) {
  try {
    const params = await paramsPromise;

    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { message: "No authorization token provided" },
        { status: 401 }
      );
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET as string);

    await connectDB();

    let employee;

    // Handle demo employee
    if (params.id === "demo-employee-id") {
      employee = {
        _id: "demo-employee-id",
        name: "Demo Employee",
        email: "employee@kitepay.demo",
        position: "Software Engineer",
        walletAddress: "5Nq...Sol",
        createdAt: new Date().toISOString(),
      };
    } else {
      employee = await Employee.findById(params.id);

      if (!employee) {
        return NextResponse.json(
          { message: "Employee not found" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json({
      employee: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        position: employee.position,
        walletAddress: employee.walletAddress,
        createdAt: employee.createdAt,
      },
      salary: 4500, // Demo salary
      available: 2250, // Demo available balance
    });
  } catch (error: any) {
    if (error.name === "JsonWebTokenError") {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { message: error.message || "Server error" },
      { status: 500 }
    );
  }
}
