import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.MEDIASTACK_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Mediastack API key not found." },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `http://api.mediastack.com/v1/news?access_key=${apiKey}&keywords=business,finance&limit=10`
    );
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch news." },
      { status: 500 }
    );
  }
}
