import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, middleName, lastName, suffix, fieldId, pronouns, email, password } = body;

    if (!firstName || !lastName || !email || !password || !fieldId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        firstName,
        middleName: middleName || null,
        lastName,
        suffix: suffix || null,
        email,
        password: hashedPassword,
        fieldId,
      },
      include: { field: true },
    });

    return NextResponse.json(
      { id: newUser.id, email: newUser.email, field: newUser.field?.name },
      { status: 201 }
    );

  } catch (err: any) {
    console.error("Create User Error:", err);
    return NextResponse.json({ error: "User creation failed" }, { status: 500 });
  }
}