import { NextRequest, NextResponse } from "next/server";
import htmlToDocx from "html-to-docx";

export async function POST(req: NextRequest) {
  try {
    const { htmlString } = await req.json();

    if (!htmlString) {
      return new NextResponse("htmlString is required", { status: 400 });
    }

    const fileBuffer = await htmlToDocx(htmlString);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition":
          'attachment; filename="benchmarking-analysis.docx"',
      },
    });
  } catch (error) {
    console.error("Error exporting file:", error);
    return new NextResponse("Error exporting file", { status: 500 });
  }
}
