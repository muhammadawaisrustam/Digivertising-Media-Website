import { describe, expect, it } from "vitest";
import { checkStudioConfig, createSessionToken, passwordMatches, verifySessionToken } from "@/lib/auth/session-token";

const SECRET = "a-test-secret-that-is-long-enough-123";

describe("studio session tokens", () => {
  it("accepts a fresh token and rejects expired, tampered or foreign ones", () => {
    const now = 1_000_000;
    const token = createSessionToken(SECRET, now);
    expect(verifySessionToken(token, SECRET, now + 1000)).toBe(true);
    expect(verifySessionToken(token, SECRET, now + 13 * 60 * 60 * 1000)).toBe(false);
    expect(verifySessionToken(token, "another-secret-that-is-long-enough-xx", now)).toBe(false);
    const [exp, sig] = token.split(".");
    expect(verifySessionToken(`${Number(exp) + 999999}.${sig}`, SECRET, now)).toBe(false);
    expect(verifySessionToken(`${token}.extra`, SECRET, now)).toBe(false);
    expect(verifySessionToken(undefined, SECRET, now)).toBe(false);
    expect(verifySessionToken("garbage", SECRET, now)).toBe(false);
  });

  it("compares passwords exactly", () => {
    expect(passwordMatches("correct horse battery", "correct horse battery")).toBe(true);
    expect(passwordMatches("correct horse batter", "correct horse battery")).toBe(false);
    expect(passwordMatches("", "correct horse battery")).toBe(false);
  });

  it("requires strong studio settings", () => {
    expect(checkStudioConfig(undefined, undefined).ok).toBe(false);
    expect(checkStudioConfig("short", SECRET).ok).toBe(false);
    expect(checkStudioConfig("long-enough-password", "short").ok).toBe(false);
    expect(checkStudioConfig("long-enough-password", SECRET).ok).toBe(true);
  });
});
