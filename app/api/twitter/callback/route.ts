import { NextRequest, NextResponse } from "next/server";
import { TwitterApi } from "twitter-api-v2";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const state = searchParams.get("state");
    const code = searchParams.get("code");

    const codeVerifier = req.cookies.get("twitter_code_verifier")?.value;
    const storedState = req.cookies.get("twitter_state")?.value;

    if (!codeVerifier || !storedState || !state || !code) {
      return NextResponse.json(
        { error: "Invalid request. Missing parameters." },
        { status: 400 }
      );
    }

    if (state !== storedState) {
      return NextResponse.json(
        { error: "State mismatch. Possible CSRF attack." },
        { status: 403 }
      );
    }

    const client = new TwitterApi({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_API_KEY_SECRET!,
    });

    const { accessToken, refreshToken, expiresIn } =
      await client.loginWithOAuth2({
        code,
        codeVerifier,
        redirectUri: process.env.TWITTER_CALLBACK_URL!,
      });

    // In a real application, you would store the accessToken and refreshToken
    // in a secure way, associated with the user's account.
    console.log("Access Token:", accessToken);
    console.log("Refresh Token:", refreshToken);
    console.log("Expires In:", expiresIn);

    const response = NextResponse.redirect("/dashboard");

    // Clear the cookies
    response.cookies.delete("twitter_code_verifier");
    response.cookies.delete("twitter_state");

    return response;
  } catch (error) {
    console.error("Error in Twitter callback:", error);
    return NextResponse.json(
      { error: "Failed to process Twitter callback" },
      { status: 500 }
    );
  }
}
