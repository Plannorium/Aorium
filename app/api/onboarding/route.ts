import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
import { getAuthenticatedUser } from "../../lib/auth";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  try {
    let user = await getAuthenticatedUser();
    if (!user) {
      const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
      });
      if (token && token.sub) {
        user = await prisma.user.findUnique({ where: { id: token.sub }, include: { onboarding: true } });
      }
    }

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const onboarding = await prisma.onboarding.findUnique({
      where: { userId: user.id },
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

export async function POST(req: NextRequest) {
  try {
    let user = await getAuthenticatedUser();
    if (!user) {
      const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
      if (token && token.sub) {
        user = await prisma.user.findUnique({ where: { id: token.sub }, include: { onboarding: true } });
      }
    }

    if (!user) {
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
      where: { userId: user.id },
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
        userId: user.id,
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

export async function PUT(req: NextRequest) {
  try {
    let user = await getAuthenticatedUser();
    if (!user) {
      const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
      if (token && token.sub) {
        user = await prisma.user.findUnique({ where: { id: token.sub }, include: { onboarding: true } });
      }
    }

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { step, completed } = await req.json();

    const updatedOnboarding = await prisma.onboarding.update({
      where: { userId: user.id },
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
