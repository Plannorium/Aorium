import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { prisma } from "../../lib/prisma";
import { safeCallModel } from "../../lib/aiClient";

async function getUserFromToken(req: Request) {
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(/jwt_token=([^;]+)/);
  const token = match ? decodeURIComponent(match[1]) : null;

  if (!token) {
    return null;
  }

  const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );
    const payload = verified.payload as { userId?: string };
    return payload.userId || null;
  } catch (e) {
    console.error("Analytics: JWT verification failed", e);
    return null;
  }
}

export async function GET(req: Request) {
  try {
    const userId = await getUserFromToken(req);
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const results = await prisma.analysisResult.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ results });
  } catch (error) {
    console.error("API Analytics GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics results" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  console.log("API Analytics GET Results:", "called");

  try {
    const userId = await getUserFromToken(req);
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const files = await prisma.file.findMany({
      where: {
        ownerId: userId,
        section: "historicalPerformance",
      },
      orderBy: {
        uploadedAt: "desc",
      },
      take: 3,
    });

    if (files.length === 0) {
      return NextResponse.json(
        {
          message:
            "Please upload your company's historical data for analysis. We require data for the following sections: Financials, Marketing, and Sales.",
        },
        { status: 400 }
      );
    }

    let fileContents = "";
    for (const file of files) {
      try {
        const fileResponse = await fetch(file.url);
        if (fileResponse.ok) {
          const fileContent = await fileResponse.text();
          fileContents += `--- ${file.filename} (${file.section}) ---
${fileContent}\n\n`;
        } else {
          console.error(
            `Failed to fetch file content from ${file.url}. Status: ${fileResponse.status}`
          );
        }
      } catch (error) {
        console.error(`Error fetching file content:`, error);
      }
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { onboarding: true },
    });

    const prompt = `
      Provide a comprehensive business analysis for ${
        user?.onboarding?.businessName || "the company"
      },
      a ${user?.onboarding?.businessType || ""} business of ${
      user?.onboarding?.businessSize || ""
    } size
      operating in ${user?.onboarding?.region || ""}. Key goals include: ${
      user?.onboarding?.goals.join(", ") || ""
    }.

      Analyze the following historical data:
      ${fileContents}

      Structure the analysis into the following sections:
      1. Financial Performance: Trends, strengths, and weaknesses.
      2. Marketing Effectiveness: Campaign evaluation and initiatives.
      3. Sales Performance: Growth opportunities and insights.

      Ensure the analysis is professional, concise, and provides actionable insights.
    `;

    const completion: { model: string; content: string } | null =
      await safeCallModel([{ role: "user", content: prompt }]);

    if (completion && completion.content) {
      const analysisResult = completion.content;
      const formattingPrompt = `Please format the following business analysis into a clean, human-readable format. Use markdown for headings, lists, and emphasis. The analysis should be easy to read and understand. Here is the analysis: ${analysisResult}`;

      const formattedCompletion: { model: string; content: string } | null =
        await safeCallModel([{ role: "user", content: formattingPrompt }]);

      if (formattedCompletion && formattedCompletion.content) {
        const formattedResult = formattedCompletion.content;
        const modelUsed = formattedCompletion.model;

        await prisma.analysisResult.create({
          data: {
            userId: userId,
            task: "Comprehensive Business Analysis",
            result: formattedResult,
            context: JSON.stringify({
              businessContext: {
                businessName: user?.onboarding?.businessName,
                businessType: user?.onboarding?.businessType,
                businessSize: user?.onboarding?.businessSize,
                region: user?.onboarding?.region,
                goals: user?.onboarding?.goals,
              },
              model: modelUsed,
            }),
          },
        });
        return NextResponse.json({
          success: true,
          result: formattedResult,
        });
      }
    }

    return NextResponse.json({ success: false, result: null });
  } catch (error) {
    console.error("API Analytics Error:", error);
    return NextResponse.json(
      { error: "Failed to process analytics request" },
      { status: 500 }
    );
  }
}
