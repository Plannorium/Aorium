import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

async function getUserIdFromToken(req: Request) {
  // Try Authorization header first (Bearer token)
  const authHeader = req.headers.get("authorization");
  let token: string | null = null;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else {
    // Fallback: try cookie jwt_token
    const cookieHeader = req.headers.get("cookie") || "";
    const match = cookieHeader.match(/jwt_token=([^;]+)/);
    token = match ? decodeURIComponent(match[1]) : null;
  }
  if (!token) {
    return null;
  }
  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );
    const payload = verified.payload as { userId?: string };
    return payload.userId || null;
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  try {
    const userId = await getUserIdFromToken(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const onboarding = await prisma.onboarding.findUnique({
      where: { userId },
    });

    if (!onboarding) {
      return NextResponse.json(
        { error: "Onboarding not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ onboarding });
  } catch (error) {
    console.error("ONBOARDING_FETCH_ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getUserIdFromToken(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      businessName,
      businessType,
      businessSize,
      region,
      goals,
      uploadedFiles,
      competitors,
      targetAudience,
      industryChallenges,
      contentFocus,
      preferredPlatforms,
      contentKPIs,
    } = body;
    // Basic validation
    if (
      !businessName ||
      !businessType ||
      !businessSize ||
      !region ||
      !goals ||
      !competitors ||
      !targetAudience ||
      !industryChallenges ||
      !contentFocus ||
      !preferredPlatforms ||
      !contentKPIs
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Mark onboarding as completed and set step to final value (using 5 here)
    const FINAL_STEP = 5;
    const onboarding = await prisma.onboarding.upsert({
      where: { userId },
      update: {
        businessName,
        businessType,
        businessSize,
        region,
        goals: { set: goals },
        uploadedFiles: { set: uploadedFiles },
        competitors,
        targetAudience,
        industryChallenges,
        contentFocus: { set: contentFocus },
        preferredPlatforms: { set: preferredPlatforms },
        contentKPIs: { set: contentKPIs },
        completed: true,
        step: FINAL_STEP,
      },
      create: {
        userId,
        businessName,
        businessType,
        businessSize,
        region,
        goals: { set: goals },
        uploadedFiles: { set: uploadedFiles },
        competitors,
        targetAudience,
        industryChallenges,
        contentFocus: { set: contentFocus },
        preferredPlatforms: { set: preferredPlatforms },
        contentKPIs: { set: contentKPIs },
        completed: true,
        step: FINAL_STEP,
      },
    });

    return NextResponse.json({ success: true, onboarding }, { status: 200 });
  } catch (error) {
    console.error("ONBOARDING_POST_ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const userId = await getUserIdFromToken(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { step, completed } = await req.json();

    const updatedOnboarding = await prisma.onboarding.update({
      where: { userId },
      data: {
        step,
        completed,
      },
    });

    return NextResponse.json({
      message: "Onboarding status updated",
      onboarding: updatedOnboarding,
    });
  } catch (error) {
    console.error("ONBOARDING_UPDATE_ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
