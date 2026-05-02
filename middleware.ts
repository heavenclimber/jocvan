import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { LOCALES, DEFAULT_LOCALE } from "@/lib/locales";
import type { Locale } from "@/lib/locales";

function getLocaleFromRequest(request: NextRequest): string {
  const acceptLang = request.headers.get("accept-language") ?? "";
  // Parse "id,en-US;q=0.9,en;q=0.8" → ["id", "en-US", "en"]
  const preferred = acceptLang
    .split(",")
    .map((part) => part.split(";")[0].trim().split("-")[0].toLowerCase());

  return (
    preferred.find((lang) => (LOCALES as readonly string[]).includes(lang)) ??
    DEFAULT_LOCALE
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the pathname already has a supported locale
  const pathnameHasLocale = LOCALES.some(
    (locale) =>
      pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return NextResponse.next();

  // Skip Next.js internals and static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Redirect to locale-prefixed URL
  const locale = getLocaleFromRequest(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
