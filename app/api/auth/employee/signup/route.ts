import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Employee from "@/models/Employee";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const {
      name,
      email,
      password,
      position,
      walletAddress,
      country,
      bankName,
      accountNumber,
      ifscCode,
    } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "name, email, and password are required" },
        { status: 400 }
      );
    }

    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return NextResponse.json(
        { message: "Employee already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const employee = await Employee.create({
      name,
      email,
      password: hashedPassword,
      position: position || "",
      walletAddress: walletAddress || null,
      country: country || "",
      bankName: bankName || null,
      accountNumber: accountNumber || null,
      ifscCode: ifscCode || null,
    });

    const token = jwt.sign(
      {
        id: employee._id,
        email: employee.email,
        type: "EMPLOYEE",
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    const res = NextResponse.json(
      {
        message: "Employee signup successful",
        token,
        employee: {
          id: employee._id,
          name: employee.name,
          email: employee.email,
          position: employee.position,
          walletAddress: employee.walletAddress,
        },
      },
      { status: 201 }
    );

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (error) {
    console.error("Employee signup error:", error);
    return NextResponse.json(
      { message: "Server error during employee signup" },
      { status: 500 }
    );
  }
}