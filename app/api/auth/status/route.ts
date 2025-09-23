import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey"; // Use environment variable for secret

export async function GET() {
  const token = (await cookies()).get("jwt_token")?.value;

  if (!token) {
    return NextResponse.json({ isAuthenticated: false }, { status: 200 });
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    return NextResponse.json({ isAuthenticated: true }, { status: 200 });
  } catch {
    return NextResponse.json({ isAuthenticated: false }, { status: 200 });
  }
}
