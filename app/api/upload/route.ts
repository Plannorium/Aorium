import { NextResponse } from "next/server";
import cloudinaryModule, { UploadApiErrorResponse } from "cloudinary";
import { prisma } from "../../lib/prisma";
import { safeCallModel } from "../../lib/aiClient";
import { getAuthenticatedUser } from "../../lib/auth";

// Small filename -> mime heuristic for when file.type is empty in the FormData
function mimeFromFilename(name: string) {
  const lower = name.toLowerCase();
  if (lower.endsWith(".csv")) return "text/csv";
  if (lower.endsWith(".xls")) return "application/vnd.ms-excel";
  if (lower.endsWith(".xlsx"))
    return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  if (lower.endsWith(".json")) return "application/json";
  if (lower.endsWith(".pdf")) return "application/pdf";
  if (lower.endsWith(".doc")) return "application/msword";
  if (lower.endsWith(".docx"))
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".gif")) return "image/gif";
  return "";
}

const cloudinary = cloudinaryModule.v2;

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
  console.warn("Cloudinary credentials are not fully configured.");
} else {
  cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
    secure: true,
  });
}

export async function GET(req: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const section = searchParams.get("section");

    const whereClause: { ownerId: string; section?: string } = {
      ownerId: user.id,
    };
    if (section) {
      whereClause.section = section;
    }

    const files = await prisma.file.findMany({
      where: whereClause,
      orderBy: {
        uploadedAt: "desc",
      },
    });

    return NextResponse.json({ files });
  } catch (error) {
    console.error("API Upload GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch files" },
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
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const section = form.get("section") as string | null;
    if (!file)
      return NextResponse.json({ error: "No file provided" }, { status: 400 });

    // Small filename -> mime heuristic for when file.type is empty in the FormData
    function mimeFromFilename(name: string) {
      const lower = name.toLowerCase();
      if (lower.endsWith(".csv")) return "text/csv";
      if (lower.endsWith(".xls")) return "application/vnd.ms-excel";
      if (lower.endsWith(".xlsx"))
        return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      if (lower.endsWith(".json")) return "application/json";
      if (lower.endsWith(".pdf")) return "application/pdf";
      if (lower.endsWith(".doc")) return "application/msword";
      if (lower.endsWith(".docx"))
        return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      if (lower.endsWith(".png")) return "image/png";
      if (lower.endsWith(".jpg") || lower.endsWith(".jpeg"))
        return "image/jpeg";
      if (lower.endsWith(".gif")) return "image/gif";
      return "";
    }

    const cloudinary = cloudinaryModule.v2;

    const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
    const API_KEY = process.env.CLOUDINARY_API_KEY;
    const API_SECRET = process.env.CLOUDINARY_API_SECRET;

    if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
      console.warn("Cloudinary credentials are not fully configured.");
    } else {
      cloudinary.config({
        cloud_name: CLOUD_NAME,
        api_key: API_KEY,
        api_secret: API_SECRET,
        secure: true,
      });
    }

    // Broaden accepted types to include common Excel and JSON types
    const acceptedFileTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
      "application/octet-stream",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/csv",
      "application/json",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain",
    ];

    // If file.type is empty (some browsers for local files), attempt to infer from file name
    const fileType =
      file.type || (file.name ? mimeFromFilename(file.name) : "");

    if (!acceptedFileTypes.includes(fileType)) {
      return NextResponse.json(
        {
          message:
            "Invalid file type. Allowed: images, PDFs, Word, Excel, CSV, and JSON.",
        },
        { status: 400 }
      );
    }

    if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
      return NextResponse.json(
        { error: "Cloudinary not configured" },
        { status: 500 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    type UploadResult = {
      secure_url?: string;
      public_id?: string;
      original_filename?: string;
      bytes?: number;
      resource_type?: string;
      format?: string;
    };

    // Determine Cloudinary resource type: use 'image' for images, otherwise 'auto'
    // 'auto' lets Cloudinary detect non-image resource types like PDF, CSV, etc.
    const isImage = fileType.startsWith("image/");
    const resource_type = isImage ? "image" : "auto";

    // Upload using upload_stream and the chosen resource_type. Handle upload errors explicitly
    let uploadResult: UploadResult | null = null;
    try {
      uploadResult = (await new Promise<UploadResult>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "aorium_uploads", resource_type },
          (
            error: UploadApiErrorResponse | undefined,
            result?: UploadResult
          ) => {
            if (error) return reject(error);
            resolve(result as UploadResult);
          }
        );
        stream.end(buffer);
      })) as UploadResult;
    } catch (cloudErr) {
      console.error("CLOUDINARY_UPLOAD_ERROR:", cloudErr);
      const ce = cloudErr as { message?: string; http_code?: number };
      return NextResponse.json(
        { error: ce?.message || "Cloudinary upload failed" },
        { status: ce?.http_code || 400 }
      );
    }

    if (!uploadResult || !uploadResult.secure_url) {
      console.error("Cloudinary did not return an upload result", uploadResult);
      return NextResponse.json(
        { error: "Invalid upload result from Cloudinary" },
        { status: 500 }
      );
    }

    const response = {
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      original_filename: uploadResult.original_filename,
      size: uploadResult.bytes,
      format: uploadResult.format,
    };

    let analysisResult: string | null = null;
    // Persist file metadata to Prisma
    try {
      if (user.id) {
        await prisma.file.create({
          data: {
            ownerId: user.id,
            filename: response.original_filename || "unknown",
            url: response.url || "",
            publicId: response.public_id,
            mime: response.format,
            size: response.size || undefined,
            section: section || "",
          },
        });

        // Perform AI analysis on the uploaded file
        let fileContentForAnalysis = "";
        const textMimes = ["text/csv", "application/json", "text/plain"];
        // Also check for file extensions for robustness
        const fileName = file.name.toLowerCase();
        if (
          textMimes.includes(fileType) ||
          fileName.endsWith(".csv") ||
          fileName.endsWith(".json") ||
          fileName.endsWith(".txt")
        ) {
          fileContentForAnalysis = buffer.toString("utf-8");
        }

        if (fileContentForAnalysis) {
          const messages = [
            {
              role: "user",
              content: `Analyze the content of the file named '${
                response.original_filename || file.name
              }'. Provide insights relevant to business strategy in the GCC region. The file content is below:\n\n${fileContentForAnalysis}`,
            },
          ];

          const analysisResultObj = await safeCallModel(messages);
          const content = analysisResultObj?.content;

          if (content) {
            analysisResult =
              typeof content === "string" ? content : JSON.stringify(content);
          }
        }

        if (analysisResult) {
          await prisma.analysisResult.create({
            data: {
              userId: user.id,
              task: "file-analysis",
              result: analysisResult,
              context: JSON.stringify({
                file: response.original_filename,
                url: response.url,
              }),
            },
          });
        }
      }
    } catch (dbErr) {
      console.error("Failed to save file metadata to DB:", dbErr);
    }

    return NextResponse.json({ ok: true, file: response, analysisResult });
  } catch (err) {
    console.error("CLOUD_UPLOAD_ERROR:", err);
    const e = err as { message?: string; http_code?: number };
    const errorMessage = e?.message || "Upload failed";
    const statusCode = e?.http_code || 500;
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
