import type { Locale } from "@/i18n/config";

/**
 * Legal page TEMPLATES. They are not legal advice and are marked noindex until
 * the owner and a qualified adviser review them. Text in [brackets] must be
 * completed before publication.
 */
export type LegalDoc = { title: string; metaDescription: string; sections: { heading: string; body: string[] }[] };

export const legalStatus = { reviewed: false, lastUpdated: null as string | null };

export const privacyPolicy: Record<Locale, LegalDoc> = {
  en: {
    title: "Privacy policy",
    metaDescription: "How Digivertising Media & PR collects, uses and protects personal information.",
    sections: [
      { heading: "Who we are", body: ["This website is operated by [registered business name], trading as Digivertising Media & PR, [registered address or country]. Contact: [privacy contact email]."] },
      { heading: "Information we collect", body: [
        "Information you choose to send us, such as your name, company, email address, phone number, website and project details when you contact us or request a proposal.",
        "Basic technical information needed to operate and secure the website, such as IP address, browser type and request logs kept by our hosting provider.",
      ] },
      { heading: "How we use information", body: [
        "To reply to enquiries, prepare proposals and deliver services you request.",
        "To keep the website secure, prevent spam and abuse, and fix technical problems.",
        "We do not sell personal information.",
      ] },
      { heading: "AI-assisted processing", body: [
        "We may use AI tools to help classify enquiries or draft documents. We minimise the personal information involved and only use providers under documented data-handling rules. A person reviews any proposal before it is sent to you. [Describe the providers used once selected.]",
      ] },
      { heading: "Sharing", body: ["We share information only with service providers that help us run the website and our business (for example hosting, database and email providers), or where required by law. [List providers once confirmed.]"] },
      { heading: "Cookies and analytics", body: ["At present this website does not use advertising or non-essential analytics cookies. If that changes, we will update this policy and ask for consent where required."] },
      { heading: "Retention", body: ["We keep enquiry information for [retention period] unless a longer period is needed for an ongoing client relationship or legal obligation."] },
      { heading: "Your rights", body: ["Depending on where you live, you may have the right to access, correct, delete or restrict the use of your personal information, and to complain to a data protection authority. Contact us at [privacy contact email] to make a request."] },
      { heading: "International transfers", body: ["Our providers may process data in other countries. [Describe safeguards once providers are confirmed.]"] },
      { heading: "Changes", body: ["We may update this policy. The date at the top shows when it last changed."] },
    ],
  },
  ar: {
    title: "سياسة الخصوصية",
    metaDescription: "كيف تجمع ديجيفرتايزنج للإعلام والعلاقات العامة المعلومات الشخصية وتستخدمها وتحميها.",
    sections: [
      { heading: "من نحن", body: ["يدير هذا الموقع [الاسم التجاري المسجل] باسم ديجيفرتايزنج للإعلام والعلاقات العامة، [العنوان المسجل أو الدولة]. للتواصل: [بريد الخصوصية]."] },
      { heading: "المعلومات التي نجمعها", body: [
        "المعلومات التي تختار إرسالها إلينا مثل اسمك وشركتك وبريدك الإلكتروني ورقم هاتفك وموقعك وتفاصيل مشروعك عند التواصل معنا أو طلب عرض.",
        "معلومات تقنية أساسية لازمة لتشغيل الموقع وحمايته، مثل عنوان IP ونوع المتصفح وسجلات الطلبات لدى مزود الاستضافة.",
      ] },
      { heading: "كيف نستخدم المعلومات", body: [
        "للرد على الاستفسارات وإعداد العروض وتقديم الخدمات التي تطلبها.",
        "للحفاظ على أمان الموقع ومنع الرسائل المزعجة وإساءة الاستخدام وإصلاح المشكلات التقنية.",
        "لا نبيع المعلومات الشخصية.",
      ] },
      { heading: "المعالجة بمساعدة الذكاء الاصطناعي", body: [
        "قد نستخدم أدوات ذكاء اصطناعي للمساعدة في تصنيف الاستفسارات أو صياغة المستندات. نقلل المعلومات الشخصية المستخدمة ونعتمد فقط مزودين وفق قواعد موثقة للتعامل مع البيانات، ويراجع شخص أي عرض قبل إرساله إليك. [اذكر المزودين بعد اختيارهم.]",
      ] },
      { heading: "المشاركة", body: ["نشارك المعلومات فقط مع مزودي الخدمات الذين يساعدوننا في تشغيل الموقع وأعمالنا (مثل الاستضافة وقواعد البيانات والبريد)، أو عندما يقتضي القانون ذلك. [اذكر المزودين بعد تأكيدهم.]"] },
      { heading: "ملفات تعريف الارتباط والتحليلات", body: ["لا يستخدم هذا الموقع حالياً ملفات تعريف ارتباط إعلانية أو تحليلية غير ضرورية. إذا تغير ذلك فسنحدّث هذه السياسة ونطلب الموافقة عند الحاجة."] },
      { heading: "مدة الاحتفاظ", body: ["نحتفظ بمعلومات الاستفسارات لمدة [مدة الاحتفاظ] ما لم تتطلب علاقة عمل قائمة أو التزام قانوني مدة أطول."] },
      { heading: "حقوقك", body: ["حسب مكان إقامتك، قد يحق لك الوصول إلى معلوماتك الشخصية أو تصحيحها أو حذفها أو تقييد استخدامها، وتقديم شكوى إلى جهة حماية البيانات. تواصل معنا عبر [بريد الخصوصية]."] },
      { heading: "النقل الدولي", body: ["قد يعالج مزودونا البيانات في دول أخرى. [صف الضمانات بعد تأكيد المزودين.]"] },
      { heading: "التغييرات", body: ["قد نحدّث هذه السياسة، ويوضح التاريخ في الأعلى آخر تعديل."] },
    ],
  },
};

export const termsOfService: Record<Locale, LegalDoc> = {
  en: {
    title: "Terms of service",
    metaDescription: "Terms that apply to using the Digivertising Media & PR website.",
    sections: [
      { heading: "About these terms", body: ["These terms apply to your use of this website, operated by [registered business name]. Client projects are governed by a separate written agreement."] },
      { heading: "Information on this website", body: ["Content is provided for general information. We work to keep it accurate but do not guarantee that it is complete or current."] },
      { heading: "Estimates and proposals", body: ["Any automated qualification, indicative scope or estimate produced through this website is for planning only and is not a binding quote. A commercial proposal is only valid when reviewed and issued in writing by our team."] },
      { heading: "No guaranteed results", body: ["Marketing, search, PR and advertising results depend on many factors outside our control. We do not guarantee rankings, media coverage, AI citations, leads or revenue."] },
      { heading: "Intellectual property", body: ["The website design, text, graphics and logo belong to [registered business name] unless stated otherwise. You may not copy them for commercial use without permission."] },
      { heading: "Acceptable use", body: ["Do not misuse the website, attempt to access private areas without authorisation, or submit false, harmful or automated spam content."] },
      { heading: "Third-party links", body: ["We are not responsible for the content or practices of websites we link to."] },
      { heading: "Liability", body: ["To the extent permitted by law, we are not liable for indirect losses arising from use of this website. [Have a legal adviser confirm wording for your jurisdiction.]"] },
      { heading: "Governing law", body: ["These terms are governed by the laws of [jurisdiction]."] },
      { heading: "Contact", body: ["Questions about these terms: [contact email]."] },
    ],
  },
  ar: {
    title: "شروط الخدمة",
    metaDescription: "الشروط التي تنطبق على استخدام موقع ديجيفرتايزنج للإعلام والعلاقات العامة.",
    sections: [
      { heading: "حول هذه الشروط", body: ["تنطبق هذه الشروط على استخدامك لهذا الموقع الذي يديره [الاسم التجاري المسجل]. تخضع مشاريع العملاء لاتفاقية مكتوبة منفصلة."] },
      { heading: "المعلومات على الموقع", body: ["المحتوى مقدم لأغراض المعلومات العامة. نسعى للحفاظ على دقته لكننا لا نضمن اكتماله أو حداثته."] },
      { heading: "التقديرات والعروض", body: ["أي تأهيل آلي أو نطاق مبدئي أو تقدير يصدر عبر هذا الموقع هو للتخطيط فقط وليس عرض سعر ملزماً. لا يكون العرض التجاري سارياً إلا بعد مراجعته وإصداره كتابياً من فريقنا."] },
      { heading: "لا نتائج مضمونة", body: ["تعتمد نتائج التسويق والبحث والعلاقات العامة والإعلانات على عوامل كثيرة خارج سيطرتنا، ولا نضمن الترتيب أو التغطية الإعلامية أو الاستشهاد في الذكاء الاصطناعي أو العملاء أو الإيرادات."] },
      { heading: "الملكية الفكرية", body: ["تصميم الموقع ونصوصه ورسومه وشعاره ملك لـ [الاسم التجاري المسجل] ما لم يُذكر خلاف ذلك، ولا يجوز نسخها للاستخدام التجاري دون إذن."] },
      { heading: "الاستخدام المقبول", body: ["لا تُسئ استخدام الموقع ولا تحاول الوصول إلى المناطق الخاصة دون تصريح ولا ترسل محتوى زائفاً أو ضاراً أو رسائل مزعجة آلية."] },
      { heading: "روابط الأطراف الثالثة", body: ["لسنا مسؤولين عن محتوى المواقع التي نرتبط بها أو ممارساتها."] },
      { heading: "المسؤولية", body: ["في الحدود التي يسمح بها القانون، لسنا مسؤولين عن الخسائر غير المباشرة الناتجة عن استخدام هذا الموقع. [يجب أن يؤكد مستشار قانوني الصياغة المناسبة لولايتك.]"] },
      { heading: "القانون الحاكم", body: ["تخضع هذه الشروط لقوانين [الولاية القضائية]."] },
      { heading: "التواصل", body: ["للأسئلة حول هذه الشروط: [بريد التواصل]."] },
    ],
  },
};
