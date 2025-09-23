import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  (await cookies()).delete("jwt_token");
  return NextResponse.json({ message: "Logout successful" });
}
