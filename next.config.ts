import type { NextConfig } from "next";

/** Baseline security headers. A full Content-Security-Policy is added in the security phase. */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // No other site may frame these pages. The studio preview may be framed by the studio itself.
      { source: "/((?!studio/preview/).*)", headers: [{ key: "X-Frame-Options", value: "DENY" }] },
      { source: "/studio/preview/:path*", headers: [{ key: "X-Frame-Options", value: "SAMEORIGIN" }] },
      // The private studio must never appear in search results.
      { source: "/studio/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/studio", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
};

export default nextConfig;
