import { legalStatus } from "@/content/legal";
import { services } from "@/content/services";

/** Public, indexable pages only. Every page exists in English and Arabic. */
export function publicPaths(): string[] {
  return [
    "/",
    "/about",
    "/services",
    ...services.map((s) => `/services/${s.slug}`),
    "/contact",
    ...(legalStatus.reviewed ? ["/privacy", "/terms"] : []),
  ];
}
