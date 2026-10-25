import type { Block, BlockType } from "@/features/pages/schema";

/**
 * Describes the editing form for each block type. The editor renders these
 * generically, so adding a field here is enough to make it editable.
 */

type Option = { value: string; label: string };

export type ItemField = { key: string; label: string; kind: "text" | "textarea"; max: number };

export type Field =
  | { key: string; label: string; kind: "text" | "textarea"; max: number; required?: boolean; hint?: string }
  | { key: string; label: string; kind: "select"; options: Option[] }
  | { key: string; label: string; kind: "checkbox"; hint: string }
  | { key: string; label: string; kind: "lines"; max: number; hint: string }
  | { key: string; label: string; kind: "link"; optional: boolean }
  | { key: string; label: string; kind: "image" }
  | { key: string; label: string; kind: "multiselect"; options: Option[]; hint: string }
  | { key: string; label: string; kind: "items"; itemLabel: string; fields: ItemField[]; min: number; max: number };

const eyebrow: Field = { key: "eyebrow", label: "Small label above the heading", kind: "text", max: 80 };
const heading: Field = { key: "heading", label: "Heading", kind: "text", max: 140, required: true };
const lead: Field = { key: "lead", label: "Intro text", kind: "textarea", max: 400 };

export const blockMeta: Record<BlockType, { label: string; description: string }> = {
  hero: { label: "Hero", description: "Main page heading with buttons, optional facts and the 3D globe." },
  text: { label: "Text", description: "Heading and paragraphs." },
  imageText: { label: "Image and text", description: "An image beside a heading, text and optional button." },
  serviceGrid: { label: "Services", description: "Interactive service explorer or a grid of service cards." },
  featureList: { label: "Feature list", description: "Cards with a title and short text." },
  process: { label: "Process steps", description: "Numbered steps of how you work." },
  testimonial: { label: "Testimonial", description: "A real client quote. Shown publicly only after you confirm permission." },
  caseStudy: { label: "Case study", description: "A real project. Shown publicly only after you confirm it is verified." },
  faq: { label: "FAQ", description: "Questions and answers (also added to search engine data)." },
  cta: { label: "Call to action", description: "Highlighted band with a button." },
  contactForm: { label: "Contact form", description: "The website contact form." },
  visual: { label: "3D visual section", description: "Text beside the AI workforce network or the globe." },
};

export const blockFields: Record<BlockType, Field[]> = {
  hero: [
    eyebrow,
    { key: "title", label: "Heading", kind: "text", max: 140, required: true },
    { key: "titleAccent", label: "Highlighted end of heading", kind: "text", max: 80 },
    { key: "lead", label: "Intro text", kind: "textarea", max: 400 },
    { key: "primaryCta", label: "Main button", kind: "link", optional: true },
    { key: "secondaryCta", label: "Second button", kind: "link", optional: true },
    { key: "facts", label: "Short facts (one per line, up to 4)", kind: "lines", max: 80, hint: "Only facts you can stand behind. No invented numbers." },
    { key: "visual", label: "Visual", kind: "select", options: [{ value: "globe", label: "3D globe" }, { value: "none", label: "None (simple page header)" }] },
  ],
  text: [eyebrow, { ...heading, required: false }, { key: "paragraphs", label: "Paragraphs (blank line between paragraphs)", kind: "lines", max: 2000, hint: "Separate paragraphs with an empty line." }],
  imageText: [
    heading,
    { key: "text", label: "Text", kind: "textarea", max: 2000, required: true },
    { key: "image", label: "Image", kind: "image" },
    { key: "imagePosition", label: "Image position", kind: "select", options: [{ value: "end", label: "After the text" }, { value: "start", label: "Before the text" }] },
    { key: "cta", label: "Button", kind: "link", optional: true },
  ],
  serviceGrid: [
    eyebrow,
    heading,
    lead,
    { key: "layout", label: "Layout", kind: "select", options: [{ value: "explorer", label: "Interactive explorer (tabs)" }, { value: "grid", label: "Grid of cards" }] },
    {
      key: "categories",
      label: "Categories to show",
      kind: "multiselect",
      hint: "Leave all unticked to show every category.",
      options: [
        { value: "growth", label: "Growth marketing" },
        { value: "search", label: "Search and AI visibility" },
        { value: "brand", label: "Brand and creative" },
        { value: "pr", label: "PR and reputation" },
        { value: "technology", label: "Technology" },
      ],
    },
  ],
  featureList: [eyebrow, heading, lead, { key: "items", label: "Cards", kind: "items", itemLabel: "Card", min: 1, max: 12, fields: [{ key: "title", label: "Title", kind: "text", max: 100 }, { key: "text", label: "Text", kind: "textarea", max: 400 }] }],
  process: [eyebrow, heading, { key: "steps", label: "Steps", kind: "items", itemLabel: "Step", min: 2, max: 8, fields: [{ key: "title", label: "Title", kind: "text", max: 80 }, { key: "text", label: "Text", kind: "textarea", max: 400 }] }],
  testimonial: [
    { key: "quote", label: "Quote (exact words of a real client)", kind: "textarea", max: 800, required: true },
    { key: "name", label: "Client name", kind: "text", max: 80, required: true },
    { key: "role", label: "Role", kind: "text", max: 80 },
    { key: "company", label: "Company", kind: "text", max: 80 },
    { key: "permissionConfirmed", label: "I have the client's written permission to publish this", kind: "checkbox", hint: "Until this is ticked, the testimonial is only visible in the studio preview." },
  ],
  caseStudy: [
    { key: "title", label: "Title", kind: "text", max: 140, required: true },
    { key: "client", label: "Client", kind: "text", max: 100, required: true },
    { key: "challenge", label: "Challenge", kind: "textarea", max: 1000, required: true },
    { key: "approach", label: "Approach", kind: "textarea", max: 1000, required: true },
    { key: "outcome", label: "Outcome (verified results only)", kind: "textarea", max: 1000, required: true },
    { key: "link", label: "Link", kind: "link", optional: true },
    { key: "verified", label: "This is a real project and the results are verified", kind: "checkbox", hint: "Until this is ticked, the case study is only visible in the studio preview." },
  ],
  faq: [heading, { key: "items", label: "Questions", kind: "items", itemLabel: "Question", min: 1, max: 20, fields: [{ key: "q", label: "Question", kind: "text", max: 200 }, { key: "a", label: "Answer", kind: "textarea", max: 1500 }] }],
  cta: [{ key: "title", label: "Heading", kind: "text", max: 140, required: true }, { key: "text", label: "Text", kind: "textarea", max: 400 }, { key: "button", label: "Button", kind: "link", optional: false }],
  contactForm: [heading, lead],
  visual: [
    eyebrow,
    heading,
    { key: "lead", label: "Intro text", kind: "textarea", max: 600 },
    { key: "points", label: "Bullet points (one per line, up to 6)", kind: "lines", max: 200, hint: "One point per line." },
    { key: "visual", label: "Visual", kind: "select", options: [{ value: "workforce", label: "AI workforce network" }, { value: "globe", label: "3D globe" }] },
  ],
};

export const settingsOptions = {
  background: [{ value: "default", label: "Default" }, { value: "subtle", label: "Subtle panel" }, { value: "glow", label: "Soft glow" }],
  spacing: [{ value: "compact", label: "Compact" }, { value: "normal", label: "Normal" }, { value: "spacious", label: "Spacious" }],
  align: [{ value: "start", label: "Start" }, { value: "center", label: "Centre" }],
};

function newId(type: string) {
  const rand = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID().slice(0, 8) : Math.random().toString(36).slice(2, 10);
  return `${type}-${rand}`;
}

const settings = { background: "default", spacing: "normal", align: "start" } as const;

/** A new block with placeholder text that passes validation. Placeholders never claim results. */
export function createBlock(type: BlockType): Block {
  const id = newId(type);
  switch (type) {
    case "hero":
      return { id, type, settings, data: { eyebrow: "", title: "New page heading", titleAccent: "", lead: "", facts: [], visual: "none" } };
    case "text":
      return { id, type, settings, data: { eyebrow: "", heading: "New section", paragraphs: ["Write your text here."] } };
    case "imageText":
      return { id, type, settings, data: { heading: "New section", text: "Write your text here.", image: { src: "/og-default.png", alt: "" }, imagePosition: "end" } };
    case "serviceGrid":
      return { id, type, settings, data: { eyebrow: "", heading: "Our services", lead: "", layout: "grid", categories: [] } };
    case "featureList":
      return { id, type, settings, data: { eyebrow: "", heading: "New feature list", lead: "", items: [{ title: "Feature title", text: "Describe this feature." }] } };
    case "process":
      return { id, type, settings, data: { eyebrow: "", heading: "How we work", steps: [{ title: "Step one", text: "Describe this step." }, { title: "Step two", text: "Describe this step." }] } };
    case "testimonial":
      return { id, type, settings, data: { quote: "Paste the client's exact words here.", name: "Client name", role: "", company: "", permissionConfirmed: false } };
    case "caseStudy":
      return { id, type, settings, data: { title: "Project title", client: "Client name", challenge: "Describe the challenge.", approach: "Describe what you did.", outcome: "Describe verified results only.", verified: false } };
    case "faq":
      return { id, type, settings, data: { heading: "Frequently asked questions", items: [{ q: "Your question?", a: "Your answer." }] } };
    case "cta":
      return { id, type, settings, data: { title: "Ready to talk?", text: "", button: { label: "Request a proposal", href: "/request-a-proposal" } } };
    case "contactForm":
      return { id, type, settings, data: { heading: "Send us a message", lead: "" } };
    case "visual":
      return { id, type, settings, data: { eyebrow: "", heading: "New visual section", lead: "", points: [], visual: "workforce" } };
  }
}

/** Short title for lists: the block's heading or title. */
export function blockTitle(block: Block): string {
  const d = block.data as Record<string, unknown>;
  const t = (d.title ?? d.heading ?? d.quote ?? "") as string;
  return t.length > 60 ? `${t.slice(0, 57)}…` : t || blockMeta[block.type].label;
}
