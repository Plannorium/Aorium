import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("jwt_token")?.value;
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/auth") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    // Allow requests for files in `public` (e.g. /Aorium.png) or other static assets
    // by letting any path that contains an extension (a dot) through.
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  if (!token) {
    if (pathname !== "/") {
      // If no token and not the home page, redirect to login page for protected routes
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  // if we are on the onboarding page, we don't need to check for onboarding status
  if (pathname.startsWith("/onboarding")) {
    const onboardingResponse = await fetch(
      `${request.nextUrl.origin}/api/onboarding`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (onboardingResponse.ok) {
      const { onboarding } = await onboardingResponse.json();
      if (onboarding?.completed) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
    return NextResponse.next();
  }

  const onboardingResponse = await fetch(
    `${request.nextUrl.origin}/api/onboarding`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (onboardingResponse.ok) {
    const { onboarding } = await onboardingResponse.json();
    if (!onboarding?.completed) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
  } else {
    // If the onboarding status check fails, it might be because the user has not started onboarding yet.
    // In that case, we should redirect to the onboarding page.
    if (onboardingResponse.status === 404) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
    // For other errors, it's safer to redirect to login.
    console.error("Middleware: Onboarding status check failed");
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
