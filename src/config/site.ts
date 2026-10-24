/**
 * Site-wide settings. Business facts live here (not inside components) so they
 * can be changed in one place and later moved into the CMS/database.
 *
 * Values marked `null` are not confirmed by the owner yet. Components must
 * handle `null` honestly (hide the item) instead of showing invented details.
 */
export const siteConfig = {
  name: "Digivertising Media & PR",
  shortName: "Digivertising",
  /** Public base URL. Set NEXT_PUBLIC_SITE_URL once a domain is confirmed. */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  /** Public business email. Not confirmed yet, so it is hidden on the site. */
  contactEmail: null as string | null,
  /** Public social profile URLs (used in footer and Organization schema). */
  socialProfiles: [] as string[],
} as const;

export function absoluteUrl(path: string): string {
  return `${siteConfig.url}${path === "/" ? "" : path}`;
}
