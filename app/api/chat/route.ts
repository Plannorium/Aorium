import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "../../lib/auth";
import { safeCallModel } from "../../lib/aiClient";

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const formData = await req.formData();
    const message = formData.get("message") as string;
    const file = formData.get("file") as File | null;

    let fileContent = "";
    if (file) {
      fileContent = await file.text();
    }

    if (!message && !fileContent) {
      return NextResponse.json(
        { error: "Message or file is required" },
        { status: 400 }
      );
    }

    const completion: { model: string; content: string } | null =
      await safeCallModel([
        {
          role: "user",
          content: `${message}${
            fileContent ? `\n\nFile content:\n${fileContent}` : ""
          }`,
        },
      ]);

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
