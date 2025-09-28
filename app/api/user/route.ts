import { NextResponse, NextRequest } from "next/server";
import { prisma } from "../../lib/prisma";
import { getAuthenticatedUser } from "../../lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { user: null, error: "Not authenticated" },
        { status: 401 }
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
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
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
      where: { id: user.id },
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
