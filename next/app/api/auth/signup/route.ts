// app/api/auth/signup/route.ts
import { Pool } from 'pg';
import { hashPassword } from "@/lib/auth";
import { NextResponse } from "next/server";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const hashedPassword = await hashPassword(password);

    const result = await pool.query(
      'INSERT INTO "Users" (email, password) VALUES ($1, $2) RETURNING *',
      [email, hashedPassword]
    );

    const user = result.rows[0];
    return NextResponse.json({ message: "User created", user });
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating user" }, 
      { status: 500 }
    );
  }
}