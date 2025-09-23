import { cookies } from "next/headers";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function getUser() {
  try {
    const cookieStore = await cookies();
    const jwt_token = cookieStore.get("jwt_token")?.value;

    // Build headers: prefer forwarding the cookie (so server-side /api/user can read it),
    // and also include an Authorization header as a fallback.
    const headers: Record<string, string> = {};
    const cookieHeader = [];
    const cookieVal = cookieStore.get("jwt_token")?.value;
    if (cookieVal) {
      cookieHeader.push(`jwt_token=${cookieVal}`);
    }
    if (cookieHeader.length) {
      headers["cookie"] = cookieHeader.join("; ");
    }
    if (jwt_token) {
      headers["authorization"] = `Bearer ${jwt_token}`;
    }

    const response = await fetch(`${baseUrl}/api/user`, {
      headers,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    return { user: null };
  }
}
