import { describe, expect, it } from "vitest";
import { ar } from "@/i18n/dictionaries/ar";
import { en } from "@/i18n/dictionaries/en";
import { alternatePaths, localizedPath, splitLocale, switchLocalePath } from "@/i18n/paths";

describe("localized paths", () => {
  it("serves English without a prefix and Arabic under /ar", () => {
    expect(localizedPath("en", "/")).toBe("/");
    expect(localizedPath("en", "/services/seo")).toBe("/services/seo");
    expect(localizedPath("ar", "/")).toBe("/ar");
    expect(localizedPath("ar", "/services/seo")).toBe("/ar/services/seo");
  });

  it("splits locale prefixes, including internal /en paths", () => {
    expect(splitLocale("/ar/about")).toEqual({ locale: "ar", path: "/about" });
    expect(splitLocale("/ar")).toEqual({ locale: "ar", path: "/" });
    expect(splitLocale("/about")).toEqual({ locale: "en", path: "/about" });
    expect(splitLocale("/en/about")).toEqual({ locale: "en", path: "/about" });
    expect(splitLocale("/")).toEqual({ locale: "en", path: "/" });
  });

  it("switches language for the same page", () => {
    expect(switchLocalePath("/services/seo", "ar")).toBe("/ar/services/seo");
    expect(switchLocalePath("/ar/services/seo", "en")).toBe("/services/seo");
    expect(switchLocalePath("/ar", "en")).toBe("/");
    expect(alternatePaths("/about")).toEqual({ en: "/about", ar: "/ar/about" });
  });
});

describe("dictionaries", () => {
  function keys(obj: unknown, prefix = ""): string[] {
    if (obj && typeof obj === "object" && !Array.isArray(obj)) {
      return Object.entries(obj).flatMap(([k, v]) => keys(v, `${prefix}${k}.`));
    }
    return [prefix];
  }
  it("Arabic has exactly the same keys as English", () => {
    expect(keys(ar).sort()).toEqual(keys(en).sort());
  });
  it("list lengths match between languages", () => {
    expect(ar.home.process.steps.length).toBe(en.home.process.steps.length);
    expect(ar.about.values.length).toBe(en.about.values.length);
    expect(ar.contact.prepare.length).toBe(en.contact.prepare.length);
  });
});
