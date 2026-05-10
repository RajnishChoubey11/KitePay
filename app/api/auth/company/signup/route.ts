import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Company from "@/models/Company";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { companyName, ownerName, email, password, walletAddress } = body;

    if (!companyName || !ownerName || !email || !password) {
      return NextResponse.json(
        { message: "All required fields are missing" },
        { status: 400 }
      );
    }

    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
      return NextResponse.json(
        { message: "Company already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const company = await Company.create({
      companyName,
      ownerName,
      email,
      password: hashedPassword,
      walletAddress: walletAddress || null,
    });

    const token = jwt.sign(
      {
        id: company._id,
        email: company.email,
        type: "COMPANY",
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    const res = NextResponse.json(
      {
        message: "Company signup successful",
        company: {
          id: company._id,
          companyName: company.companyName,
          ownerName: company.ownerName,
          email: company.email,
          walletAddress: company.walletAddress,
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
    console.error("Company signup error:", error);
    return NextResponse.json(
      { message: "Server error during company signup" },
      { status: 500 }
    );
  }
}