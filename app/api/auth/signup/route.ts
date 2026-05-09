import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, role, companyName, walletAddress } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const normalizedRole = role === "EMPLOYER" ? "COMPANY" : role;
    if (!["COMPANY", "EMPLOYEE"].includes(normalizedRole)) {
      return NextResponse.json({ error: "Invalid account type" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        role: normalizedRole,
        companyName: normalizedRole === "COMPANY" ? companyName ?? null : null,
        walletAddress: normalizedRole === "EMPLOYEE" ? walletAddress ?? null : null,
      },
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
