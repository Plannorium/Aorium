import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
import { safeCallModel } from "../../lib/aiClient";
import { getAuthenticatedUser } from "../../lib/auth";

export async function GET(req: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const results = await prisma.analysisResult.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const regionPrompt = `
    Based on the following business profile, generate a JSON array of objects representing the estimated market potential for a business in the GCC countries.
    Business Profile:
    - Business Name: ${user?.onboarding?.businessName || "the company"}
    - Business Type: ${user?.onboarding?.businessType || "not specified"}
    - Business Size: ${user?.onboarding?.businessSize || "not specified"}
    - Region: ${user?.onboarding?.region || "not specified"}
    - Key Goals: ${user?.onboarding?.goals.join(", ") || "not specified"}

    The JSON array should represent regional performance for GCC countries.
    Each object should have a "name" (the country name) and a "value" (a number between 100 and 500 representing market potential score).
    The countries are: Saudi Arabia, UAE, Qatar, Kuwait, Oman, Bahrain.
    The output should be only the JSON array.
  `;

    const regionCompletion: { model: string; content: string } | null =
      await safeCallModel([{ role: "user", content: regionPrompt }]);

    let regionData = [];
    if (regionCompletion && regionCompletion.content) {
      try {
        regionData = JSON.parse(regionCompletion.content);
      } catch (e) {
        console.error("Failed to parse region data from model:", e);
        regionData = [];
      }
    }

    return NextResponse.json({ results, user, regionData });
  } catch (error) {
    console.error("API Analytics GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics results" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { query } = body;

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    let prompt;
    if (query.startsWith("Analyze competitor:")) {
      const competitorName = query.replace("Analyze competitor:", "").trim();
      prompt = `
        Analyze the specified competitor against the user's brand and return a JSON object for charting.
        User Brand: ${user?.onboarding?.businessName || "the company"}
        Competitor: ${competitorName}

        The JSON object should have the following structure:
        {
          "followerGrowth": [{"name": "Your Brand", "value": <number>}, {"name": "${competitorName}", "value": <number>}],
          "engagementRate": [{"name": "Your Brand", "value": <number>}, {"name": "${competitorName}", "value": <number>}],
          "postReach": [{"name": "Your Brand", "value": <number>}, {"name": "${competitorName}", "value": <number>}],
          "sentiment": {
            "positive": [{"name": "Your Brand", "value": <number>}, {"name": "${competitorName}", "value": <number>}],
            "neutral": [{"name": "Your Brand", "value": <number>}, {"name": "${competitorName}", "value": <number>}],
            "negative": [{"name": "Your Brand", "value": <number>}, {"name": "${competitorName}", "value": <number>}]
          }
        }
        The output should be only the JSON object.
      `;
    } else if (query.startsWith("Compare")) {
      const brands = query
        .replace("Compare", "")
        .split("and")
        .map((b) => b.trim());
      const brandA = brands[0];
      const brandB = brands[1];
      prompt = `
        Compare the two specified brands and return a JSON object for charting.
        Brand A: ${brandA}
        Brand B: ${brandB}

        The JSON object should have the following structure:
        {
          "followerGrowth": [{"name": "${brandA}", "value": <number>}, {"name": "${brandB}", "value": <number>}],
          "engagementRate": [{"name": "${brandA}", "value": <number>}, {"name": "${brandB}", "value": <number>}],
          "postReach": [{"name": "${brandA}", "value": <number>}, {"name": "${brandB}", "value": <number>}],
          "sentiment": {
            "positive": [{"name": "${brandA}", "value": <number>}, {"name": "${brandB}", "value": <number>}],
            "neutral": [{"name": "${brandA}", "value": <number>}, {"name": "${brandB}", "value": <number>}],
            "negative": [{"name": "${brandA}", "value": <number>}, {"name": "${brandB}", "value": <number>}]
          }
        }
        The output should be only the JSON object.
      `;
    } else if (query.startsWith("Analyze historical data")) {
      const fileCount = await prisma.file.count({
        where: {
          ownerId: user.id,
          section: "historicalPerformance",
        },
      });

      const files = await prisma.file.findMany({
        where: {
          ownerId: user.id,
          section: "historicalPerformance",
        },
        orderBy: {
          uploadedAt: "desc",
        },
        ...(fileCount > 1 && { take: 2 }),
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
            const truncatedContent = fileContent.substring(0, 15000);
            fileContents += `--- ${file.filename} (${file.section}) ---\n${truncatedContent}\n\n`;
          } else {
            console.error(
              `Failed to fetch file content from ${file.url}. Status: ${fileResponse.status}`
            );
          }
        } catch (error) {
          console.error(`Error fetching file content:`, error);
        }
      }

      prompt = `
        Provide a comprehensive business analysis for ${user?.onboarding?.businessName || "the company"}
        },
        a ${user?.onboarding?.businessType || ""} business of ${user?.onboarding?.businessSize || ""} size
        operating in ${user?.onboarding?.region || ""}. Key goals include: ${user?.onboarding?.goals.join(", ") || ""}.

        Analyze the following historical data:
        ${fileContents}

        Structure the analysis into the following sections:
        1. Financial Performance: Trends, strengths, and weaknesses.
        2. Marketing Effectiveness: Campaign evaluation and initiatives.
        3. Sales Performance: Growth opportunities and insights.

        Ensure the analysis is professional, concise, and provides actionable insights. The total length should be under 1000 words.
      `;
    } else {
      return NextResponse.json({ error: "Invalid query" }, { status: 400 });
    }

    const completion: { model: string; content: string } | null =
      await safeCallModel([{ role: "user", content: prompt }]);

    if (completion && completion.content) {
      try {
        const data = JSON.parse(completion.content);
        return NextResponse.json(data);
      } catch (e) {
        console.error("Failed to parse model output:", e);
        return NextResponse.json(
          { error: "Failed to generate analysis" },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "Failed to generate analysis" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API Analytics POST Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}