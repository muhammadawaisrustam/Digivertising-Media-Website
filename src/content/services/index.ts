import { z } from "zod";
import type { Locale } from "@/i18n/config";
import { brandServices, prServices } from "./brand-pr";
import { growthServices } from "./growth";
import { categoryIds, serviceSchema, type CategoryId, type Service } from "./schema";
import { searchServices } from "./search";
import { technologyServices } from "./technology";

export type { CategoryId, Service, ServiceLocaleContent } from "./schema";

/** Service categories, in display order. */
export const serviceCategories: Record<CategoryId, Record<Locale, { label: string; description: string }>> = {
  growth: {
    en: { label: "Growth Marketing", description: "Paid media, social, email and lead generation measured against business outcomes." },
    ar: { label: "تسويق النمو", description: "إعلانات مدفوعة وتواصل اجتماعي وبريد وجذب عملاء تُقاس بنتائج العمل." },
  },
  search: {
    en: { label: "Search & AI Visibility", description: "SEO, answer engine optimisation and content that earns attention." },
    ar: { label: "البحث والظهور في الذكاء الاصطناعي", description: "تحسين محركات البحث ومحركات الإجابة ومحتوى يستحق الاهتمام." },
  },
  brand: {
    en: { label: "Brand & Creative", description: "Identity, design and video that make you recognisable and credible." },
    ar: { label: "العلامة والإبداع", description: "هوية وتصميم وفيديو تجعلك مميزاً وموثوقاً." },
  },
  pr: {
    en: { label: "PR & Reputation", description: "Media relations, personal brands and reputation built on trust." },
    ar: { label: "العلاقات العامة والسمعة", description: "علاقات إعلامية وعلامات شخصية وسمعة مبنية على الثقة." },
  },
  technology: {
    en: { label: "Web, Software & AI", description: "Websites, apps, systems and automation engineered to last." },
    ar: { label: "الويب والبرمجيات والذكاء الاصطناعي", description: "مواقع وتطبيقات وأنظمة وأتمتة مبنية لتدوم." },
  },
};

export const categoryOrder: readonly CategoryId[] = categoryIds;

/** All services, validated when the module loads (an invalid entry fails the build). */
export const services: Service[] = z
  .array(serviceSchema)
  .parse([...growthServices, ...searchServices, ...brandServices, ...prServices, ...technologyServices]);

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function getServicesByCategory(category: CategoryId): Service[] {
  return services.filter((s) => s.category === category);
}

export function getRelatedServices(service: Service): Service[] {
  return service.related.map(getService).filter((s): s is Service => Boolean(s));
}
