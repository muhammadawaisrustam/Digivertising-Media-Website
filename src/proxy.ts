import { NextResponse, type NextRequest } from "next/server";
import { serviceSlugs } from "@/content/services/slugs";

const knownServices = new Set<string>(serviceSlugs);
const NOT_FOUND_PATH = "/__not-found";

/**
 * Language routing.
 * - /ar/...  -> served as-is (Arabic)
 * - /en/...  -> permanently redirected to the unprefixed URL (avoids duplicate pages)
 * - anything else -> internally rewritten to /en/... (English, no prefix in the URL)
 * /ar/studio... -> redirected to /studio... (the private studio is English-only)
 * Unknown service slugs are sent to the 404 page so they return a real 404 status.
 *
 * Keep this file small: it runs before every page request.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }

  // The studio is English-only.
  if (pathname === "/ar/studio" || pathname.startsWith("/ar/studio/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3);
    return NextResponse.redirect(url, 308);
  }

  const isArabic = pathname === "/ar" || pathname.startsWith("/ar/");
  const prefix = isArabic ? "/ar" : "/en";
  const rest = isArabic ? pathname.slice(3) || "/" : pathname;

  const service = /^\/services\/([^/]+)\/?$/.exec(rest);
  if (service && !knownServices.has(service[1]!)) {
    const url = request.nextUrl.clone();
    url.pathname = `${prefix}${NOT_FOUND_PATH}`;
    return NextResponse.rewrite(url);
  }

  if (isArabic) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/en${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip Next internals, API routes, metadata files and anything with a file extension.
  matcher: ["/((?!api|_next|sitemap.xml|robots.txt|manifest.webmanifest|.*\\..*).*)"],
};
