import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { proxy } from "@/proxy";

const run = (path: string) => proxy(new NextRequest(`http://localhost:3000${path}`));

describe("language proxy", () => {
  it("rewrites unprefixed English URLs to the internal /en route", () => {
    const res = run("/services/seo");
    expect(res.headers.get("x-middleware-rewrite")).toBe("http://localhost:3000/en/services/seo");
  });

  it("rewrites the homepage", () => {
    expect(run("/").headers.get("x-middleware-rewrite")).toBe("http://localhost:3000/en");
  });

  it("passes Arabic URLs through unchanged", () => {
    const res = run("/ar/about");
    expect(res.headers.get("x-middleware-rewrite")).toBeNull();
    expect(res.headers.get("x-middleware-next")).toBe("1");
  });

  it("permanently redirects /en URLs to avoid duplicate content", () => {
    const res = run("/en/about?x=1");
    expect(res.status).toBe(308);
    expect(res.headers.get("location")).toBe("http://localhost:3000/about?x=1");
  });

  it("sends unknown service slugs to the 404 page in the right language", () => {
    expect(run("/services/made-up").headers.get("x-middleware-rewrite")).toBe("http://localhost:3000/en/__not-found");
    expect(run("/ar/services/made-up").headers.get("x-middleware-rewrite")).toBe("http://localhost:3000/ar/__not-found");
  });

  it("keeps the private studio English-only", () => {
    const res = run("/ar/studio/pages");
    expect(res.status).toBe(308);
    expect(res.headers.get("location")).toBe("http://localhost:3000/studio/pages");
    expect(run("/studio").headers.get("x-middleware-rewrite")).toBe("http://localhost:3000/en/studio");
  });
});
