import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Employee from "@/models/Employee";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const employee = await Employee.findOne({ email });
    if (!employee) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 }
      );
    }

    const isValid = await bcrypt.compare(password, employee.password);
    if (!isValid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      {
        id: employee._id,
        email: employee.email,
        type: "EMPLOYEE",
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    const res = NextResponse.json({
      message: "Employee login successful",
      employee: {
        id: employee._id,
        companyId: employee.companyId,
        name: employee.name,
        email: employee.email,
        position: employee.position,
        salary: employee.salary,
        walletAddress: employee.walletAddress,
      },
    });

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (error) {
    console.error("Employee login error:", error);
    return NextResponse.json(
      { message: "Server error during employee login" },
      { status: 500 }
    );
  }
}