import { getService, type CategoryId } from "@/content/services";
import type { Locale } from "@/i18n/config";
import type { ProposalInput } from "./schema";

/**
 * Automated, rule-based qualification of a proposal request. It is transparent
 * and deterministic (no AI), and it is NOT a quote: a person reviews every
 * request before any commercial proposal is sent.
 */

export type Qualification = {
  categories: CategoryId[];
  missingInfo: string[];
  discoveryQuestions: string[];
  priority: "low" | "medium" | "high";
  /** Typical deliverables for the selected services, taken from the service pages. */
  indicativeScope: { service: string; deliverables: string[] }[];
};

const questions: Record<CategoryId, Record<Locale, string[]>> = {
  growth: {
    en: ["Which channels have you used so far, and what results did they produce?", "How do you currently track enquiries and sales from marketing?"],
    ar: ["ما القنوات التي استخدمتها حتى الآن وما النتائج التي حققتها؟", "كيف تتابع حالياً الطلبات والمبيعات الناتجة عن التسويق؟"],
  },
  search: {
    en: ["Do you have access to Google Search Console and analytics for your site?", "Which searches or questions would you most like to be found for?"],
    ar: ["هل لديك وصول إلى Google Search Console والتحليلات لموقعك؟", "ما عمليات البحث أو الأسئلة التي تريد أن تظهر فيها أكثر؟"],
  },
  brand: {
    en: ["Do you have existing brand guidelines or assets we should build on?", "Which brands, inside or outside your industry, do you admire and why?"],
    ar: ["هل لديك دليل علامة أو أصول حالية نبني عليها؟", "ما العلامات التي تعجبك داخل مجالك أو خارجه ولماذا؟"],
  },
  pr: {
    en: ["What news, expertise or milestones could we share with media?", "Who will act as spokesperson, and how much time can they give?"],
    ar: ["ما الأخبار أو الخبرات أو الإنجازات التي يمكن مشاركتها مع الإعلام؟", "من سيكون المتحدث الرسمي وكم من الوقت يمكنه تخصيصه؟"],
  },
  technology: {
    en: ["Which systems or platforms does this need to work with?", "Who will maintain the solution after launch?"],
    ar: ["ما الأنظمة أو المنصات التي يجب أن يتكامل معها الحل؟", "من سيتولى صيانة الحل بعد الإطلاق؟"],
  },
};

const missing: Record<string, Record<Locale, string>> = {
  website: { en: "Current website or relevant links", ar: "الموقع الحالي أو الروابط ذات الصلة" },
  budget: { en: "Budget range", ar: "نطاق الميزانية" },
  goals: { en: "More detail on business goals", ar: "تفاصيل أكثر عن أهداف العمل" },
  scope: { en: "Project scope or requirements", ar: "نطاق المشروع أو متطلباته" },
  country: { en: "Country or main target market", ar: "الدولة أو السوق المستهدفة الرئيسية" },
};

const generalQuestion: Record<Locale, string> = {
  en: "What would make this project a clear success for you in 6 to 12 months?",
  ar: "ما الذي سيجعل هذا المشروع نجاحاً واضحاً بالنسبة لك خلال 6 إلى 12 شهراً؟",
};

export function qualifyProposal(input: Pick<ProposalInput, "services" | "goals" | "website" | "scope" | "timeline" | "budget" | "country">, locale: Locale): Qualification {
  const services = input.services.map(getService).filter((s) => s !== undefined);
  const categories = [...new Set(services.map((s) => s.category))];

  const missingInfo: string[] = [];
  if (!input.website.trim()) missingInfo.push(missing.website![locale]);
  if (input.budget === "not-sure" || input.budget === "prefer-not") missingInfo.push(missing.budget![locale]);
  if (input.goals.trim().length < 40) missingInfo.push(missing.goals![locale]);
  if (!input.scope.trim()) missingInfo.push(missing.scope![locale]);
  if (!input.country.trim()) missingInfo.push(missing.country![locale]);

  const discoveryQuestions = [generalQuestion[locale], ...categories.flatMap((c) => questions[c][locale])].slice(0, 6);

  const strongBudget = ["5k-15k", "15k-50k", "50k-plus"].includes(input.budget);
  const soon = input.timeline === "asap" || input.timeline === "1-3-months";
  const detailed = input.goals.trim().length >= 40 && Boolean(input.scope.trim());
  const priority: Qualification["priority"] =
    strongBudget && soon && detailed ? "high" : input.budget === "under-1k" || input.goals.trim().length < 40 ? "low" : "medium";

  return {
    categories,
    missingInfo,
    discoveryQuestions,
    priority,
    indicativeScope: services.map((s) => ({ service: s.content[locale].title, deliverables: s.content[locale].deliverables.slice(0, 4) })),
  };
}
