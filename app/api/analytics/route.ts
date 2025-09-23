import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { prisma } from "../../../app/lib/prisma";
import OpenAI from "openai";

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
  if (!process.env.DEEPSEEK_API_KEY) {
    return NextResponse.json(
      { error: "DEEPSEEK_API_KEY is not set" },
      { status: 500 }
    );
  }

  const openai = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: "https://api.deepseek.com/v1",
  });

  try {
    const userId = await getUserFromToken(req);
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const files = await prisma.file.findMany({
      where: {
        ownerId: userId,
        section: {
          in: ["financial", "marketing", "sales"],
        },
      },
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
          fileContents += `--- ${file.filename} (${file.section}) ---\n${fileContent}\n\n`;
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
      As a business analyst, your task is to provide a comprehensive analysis of the user's company based on the provided historical data.

      **User's Business Context:**
      - Business Name: ${user?.onboarding?.businessName}
      - Business Type: ${user?.onboarding?.businessType}
      - Business Size: ${user?.onboarding?.businessSize}
      - Region: ${user?.onboarding?.region}
      - Goals: ${user?.onboarding?.goals.join(", ")}

      **Historical Data:**
      ${fileContents}

      **Analysis Request:**
      Please provide a detailed analysis of the company's performance based on the historical data. Structure your analysis into the following sections:
      1.  **Financial Analysis:** Analyze the financial data to identify trends, strengths, and weaknesses.
      2.  **Marketing Analysis:** Evaluate the effectiveness of marketing campaigns and initiatives.
      3.  **Sales Analysis:** Analyze sales performance and identify opportunities for growth.

      Your analysis should be well-structured, easy to understand, and provide actionable insights for the user.
    `;

    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
    });

    const analysisResult = completion.choices[0].message.content;

    if (analysisResult) {
      const formattingPrompt = `Please format the following business analysis into a clean, human-readable format. Use markdown for headings, lists, and emphasis. The analysis should be easy to read and understand. Here is the analysis: ${analysisResult}`;
      const formattedCompletion = await openai.chat.completions.create({
        model: "deepseek-chat",
        messages: [{ role: "user", content: formattingPrompt }],
      });

      const formattedResult = formattedCompletion.choices[0].message.content;

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
          }),
        },
      });
      return NextResponse.json({ success: true, result: formattedResult });
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
