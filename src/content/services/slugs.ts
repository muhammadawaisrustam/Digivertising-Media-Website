/**
 * Every published service slug. Kept in a tiny standalone file so the request
 * proxy can return a real 404 for unknown service URLs without loading content.
 * A unit test checks this list matches the service content exactly.
 */
export const serviceSlugs = [
  "digital-marketing", "google-ads", "meta-ads", "social-media", "email-marketing", "lead-generation",
  "analytics-cro", "seo", "aeo-ai-search", "content-marketing", "branding", "graphic-design",
  "video-production", "public-relations", "personal-branding", "reputation-management", "wordpress",
  "web-development", "ecommerce", "mobile-apps", "backend-apis", "erp-crm", "automation-ai-agents", "ui-ux-3d",
] as const;
