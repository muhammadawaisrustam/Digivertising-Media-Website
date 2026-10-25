import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { serviceSlugs } from "@/content/services/slugs";
import { supabaseConfig } from "@/lib/supabase/config";

const knownServices = new Set<string>(serviceSlugs);
const NOT_FOUND_PATH = "/__not-found";

/**
 * Language routing.
 * - /ar/...  -> served as-is (Arabic)
 * - /en/...  -> permanently redirected to the unprefixed URL (avoids duplicate pages)
 * - anything else -> internally rewritten to /en/... (English, no prefix in the URL)
 * /ar/studio... -> redirected to /studio... (the private studio is English-only)
 * Unknown service slugs are sent to the 404 page so they return a real 404 status.
 * Studio requests with a Supabase session get the session refreshed here, because
 * pages cannot write cookies themselves.
 *
 * Keep this file small: it runs before every page request.
 */
export async function proxy(request: NextRequest): Promise<NextResponse> {
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
  if (pathname === "/studio" || pathname.startsWith("/studio/")) {
    return refreshStudioSession(request, () => NextResponse.rewrite(url, { request: { headers: request.headers } }));
  }
  return NextResponse.rewrite(url);
}

/** Refreshes an expiring Supabase sign-in and passes the new cookies to the page and the browser. */
async function refreshStudioSession(request: NextRequest, makeResponse: () => NextResponse): Promise<NextResponse> {
  const config = supabaseConfig();
  // Nothing to refresh without Supabase or without a Supabase sign-in cookie.
  if (!config || !request.cookies.getAll().some((c) => c.name.startsWith("sb-"))) return makeResponse();
  let response = makeResponse();
  const supabase = createServerClient(config.url, config.publishableKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        for (const { name, value } of list) request.cookies.set(name, value);
        response = makeResponse();
        for (const { name, value, options } of list) response.cookies.set(name, value, options);
      },
    },
  });
  try {
    await supabase.auth.getUser();
  } catch (err) {
    console.error("Studio session refresh failed", err);
  }
  return response;
}

export const config = {
  // Skip Next internals, API routes, metadata files and anything with a file extension.
  matcher: ["/((?!api|_next|sitemap.xml|robots.txt|manifest.webmanifest|.*\\..*).*)"],
};
