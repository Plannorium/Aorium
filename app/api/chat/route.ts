import { NextResponse } from "next/server";
import { safeCallModel } from "../../lib/aiClient";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const completion: { model: string; content: string } | null =
      await safeCallModel([{ role: "user", content: message }]);

    if (completion && completion.content) {
      return NextResponse.json({ reply: completion.content });
    }

    return NextResponse.json(
      { error: "Failed to get a response from the AI" },
      { status: 500 }
    );
  } catch (error) {
    console.error("API Chat Error:", error);
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
}
