import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Company from "@/models/Company";

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

    const company = await Company.findOne({ email });
    if (!company) {
      return NextResponse.json(
        { message: "Company not found" },
        { status: 404 }
      );
    }

    const isValid = await bcrypt.compare(password, company.password);
    if (!isValid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      {
        id: company._id,
        email: company.email,
        type: "COMPANY",
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    const res = NextResponse.json({
      message: "Company login successful",
      token,
      company: {
        id: company._id,
        companyName: company.companyName,
        ownerName: company.ownerName,
        email: company.email,
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
    console.error("Company login error:", error);
    return NextResponse.json(
      { message: "Server error during company login" },
      { status: 500 }
    );
  }
}