import { NextRequest, NextResponse } from "next/server";
import { TwitterApi } from "twitter-api-v2";

export async function GET(req: NextRequest) {
  try {
    const client = new TwitterApi({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
    });

    const { url, codeVerifier, state } = client.generateOAuth2AuthLink(
      process.env.TWITTER_CALLBACK_URL!,
      {
        scope: ["tweet.read", "users.read", "offline.access"],
      }
    );

    const response = NextResponse.redirect(url);

    response.cookies.set("twitter_code_verifier", codeVerifier, {
      path: "/home",
      httpOnly: true,
      maxAge: 60 * 10, // 10 minutes
    });
    response.cookies.set("twitter_state", state, {
      path: "/home",
      httpOnly: true,
      maxAge: 60 * 10, // 10 minutes
    });

    return response;
  } catch (error) {
    console.error("Error generating Twitter auth link:", error);
    return NextResponse.json(
      { error: "Failed to generate auth link" },
      { status: 500 }
    );
  }
}
