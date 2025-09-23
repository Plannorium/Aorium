import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { prisma } from "../../lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    // Prefer cookie token, but fall back to Authorization header (Bearer)
    let token = cookieStore.get("jwt_token")?.value;
    if (!token) {
      const authHeader =
        request.headers.get("authorization") ||
        request.headers.get("Authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.replace(/^Bearer /i, "");
        console.log("API /api/user: Received token from Authorization header");
      } else {
        console.log(
          "API /api/user: No token found in cookie or Authorization header"
        );
      }
    } else {
      console.log("API /api/user: Received token from cookie");
    }

    if (!token) {
      return NextResponse.json(
        { user: null, error: "Not authenticated" },
        { status: 401 }
      );
    }

    let decoded: { userId: string } | null = null;
    try {
      const verified = await jwtVerify(
        token,
        new TextEncoder().encode(JWT_SECRET)
      );
      decoded = verified.payload as { userId: string };
      console.log("API /api/user: Token decoded successfully:", decoded);
    } catch (verifyError) {
      console.error("API /api/user: Token verification failed:", verifyError);
      return NextResponse.json(
        { user: null, error: "Invalid token" },
        { status: 401 }
      );
    }
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { onboarding: true },
    });

    if (!user) {
      return NextResponse.json(
        { user: null, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("USER_FETCH_ERROR:", error);
    // Any verification/fetch error => treat as invalid token for this endpoint
    return NextResponse.json(
      { user: null, error: "Invalid token" },
      { status: 401 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // support token from cookie or Authorization header
    const cookieStore = await cookies();
    let token = cookieStore.get("jwt_token")?.value;
    if (!token) {
      const authHeader =
        request.headers.get("authorization") ||
        request.headers.get("Authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.replace(/^Bearer /i, "");
      }
    }

    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    let decoded: { userId: string } | null = null;
    try {
      const verified = await jwtVerify(
        token,
        new TextEncoder().encode(JWT_SECRET)
      );
      decoded = verified.payload as { userId: string };
    } catch (error) {
      console.log("JWT verification failed:", error);
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const { name, email, profilePicture } = await request.json();

    if (!name || !email) {
      return NextResponse.json(
        { message: "Name and email are required" },
        { status: 400 }
      );
    }

    // Build data object conditionally to avoid Prisma complaining about unknown fields
    const updateData: { name: string; email: string; profilePicture?: string } =
      {
        name,
        email,
      };
    if (typeof profilePicture !== "undefined") {
      updateData.profilePicture = profilePicture;
    }

    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data: updateData,
    });

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Failed to update user data:", error);
    return NextResponse.json(
      { message: "Failed to update user" },
      { status: 500 }
    );
  }
}
