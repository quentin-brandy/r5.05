// app/api/auth/signup/route.js
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "@/lib/auth";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req) {
  const { email, password } = await req.json();
  const hashedPassword = await hashPassword(password);

  const user = await prisma.users.create({
    data: { email, password: hashedPassword },
  });

  return NextResponse.json({ message: "User created", user });
}
