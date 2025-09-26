import { NextRequest, NextResponse } from "next/server";
import { TwitterApi } from "twitter-api-v2";

const client = new TwitterApi(process.env.TWITTER_BEARER_TOKEN || "");

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    const user = await client.v2.userByUsername(username, {
      "user.fields": ["public_metrics"],
    });

    if (user.errors) {
      return NextResponse.json({ error: user.errors }, { status: 500 });
    }

    return NextResponse.json(user.data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
