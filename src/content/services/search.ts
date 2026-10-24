import type { Service } from "./schema";

/** Search and content services. Arabic copy is a first draft and needs native review. */
export const searchServices: Service[] = [
  {
    slug: "seo",
    category: "search",
    related: ["aeo-ai-search", "content-marketing", "web-development", "analytics-cro"],
    content: {
      en: {
        title: "Search Engine Optimisation (SEO)",
        metaTitle: "SEO Services: Technical, On-Page & Content SEO",
        metaDescription:
          "Technical SEO, keyword research, on-page optimisation and content strategy that help the right people find your business in Google and other search engines.",
        summary: "Technical foundations, keyword strategy and useful content that help the right people find you in search.",
        intro:
          "SEO helps your website appear when potential customers search for problems you solve. It combines a technically sound website, pages that clearly match search intent, and content and references that demonstrate expertise. We start with an audit and keyword research, fix what is holding the site back, and build a content plan focused on searches that lead to business.",
        signals: [
          "Your site gets very little traffic from search.",
          "Competitors appear for searches you should own.",
          "You redesigned the website and traffic dropped.",
          "Pages are slow, poorly structured or not indexed.",
        ],
        includes: [
          { title: "Technical SEO", text: "Crawlability, indexing, site structure, Core Web Vitals and structured data." },
          { title: "Keyword and intent research", text: "Topics your customers search for, grouped by intent and value." },
          { title: "On-page optimisation", text: "Titles, headings, internal links and content improvements." },
          { title: "Content and authority", text: "Content planning and ethical approaches to earning references." },
        ],
        deliverables: [
          "SEO audit with prioritised issues",
          "Keyword and topic map",
          "On-page recommendations or implementation",
          "Monthly progress report using Search Console data",
        ],
        note: "No one can guarantee rankings in Google. We do not use link schemes or other tactics that break search engine guidelines.",
        faqs: [
          {
            q: "How long does SEO take?",
            a: "Technical fixes can show impact within weeks once pages are recrawled. Competitive rankings usually take several months of consistent work. We set expectations after reviewing your site and competition.",
          },
          {
            q: "What is the difference between SEO and Google Ads?",
            a: "Google Ads places paid adverts that stop when spending stops. SEO improves your organic visibility, which takes longer to build but does not charge per click.",
          },
          {
            q: "Do you build backlinks?",
            a: "We focus on earning references through useful content, digital PR and genuine partnerships. We do not buy links or use private link networks.",
          },
        ],
      },
      ar: {
        title: "تحسين محركات البحث (SEO)",
        metaTitle: "خدمات SEO: التحسين التقني والمحتوى والصفحات",
        metaDescription:
          "تحسين تقني وبحث كلمات مفتاحية وتحسين الصفحات واستراتيجية محتوى تساعد الأشخاص المناسبين على إيجاد عملك في جوجل ومحركات البحث الأخرى.",
        summary: "أسس تقنية واستراتيجية كلمات مفتاحية ومحتوى مفيد يساعد الأشخاص المناسبين على إيجادك في البحث.",
        intro:
          "يساعد تحسين محركات البحث موقعك على الظهور عندما يبحث العملاء المحتملون عن مشكلات تحلها. يجمع بين موقع سليم تقنياً وصفحات تطابق نية البحث بوضوح ومحتوى ومراجع تثبت الخبرة. نبدأ بمراجعة شاملة وبحث للكلمات المفتاحية، ونصلح ما يعيق الموقع، ونبني خطة محتوى تركز على عمليات البحث التي تؤدي إلى أعمال.",
        signals: [
          "يحصل موقعك على زيارات قليلة جداً من البحث.",
          "يظهر المنافسون في عمليات بحث يجب أن تكون لك.",
          "أعدت تصميم الموقع فانخفضت الزيارات.",
          "الصفحات بطيئة أو ضعيفة الهيكلة أو غير مفهرسة.",
        ],
        includes: [
          { title: "التحسين التقني", text: "قابلية الزحف والفهرسة وهيكل الموقع ومؤشرات أداء الويب الأساسية والبيانات المنظمة." },
          { title: "بحث الكلمات والنية", text: "الموضوعات التي يبحث عنها عملاؤك مجمعة حسب النية والقيمة." },
          { title: "تحسين الصفحات", text: "العناوين والترويسات والروابط الداخلية وتحسين المحتوى." },
          { title: "المحتوى والموثوقية", text: "تخطيط المحتوى وأساليب أخلاقية لكسب الإشارات من مواقع أخرى." },
        ],
        deliverables: [
          "مراجعة SEO مع مشكلات مرتبة حسب الأولوية",
          "خريطة الكلمات المفتاحية والموضوعات",
          "توصيات تحسين الصفحات أو تنفيذها",
          "تقرير تقدم شهري من بيانات Search Console",
        ],
        note: "لا أحد يستطيع ضمان الترتيب في جوجل. لا نستخدم مخططات الروابط أو أي أساليب تخالف إرشادات محركات البحث.",
        faqs: [
          {
            q: "كم يستغرق تحسين محركات البحث؟",
            a: "قد يظهر أثر الإصلاحات التقنية خلال أسابيع بعد إعادة الزحف، بينما يحتاج الترتيب في المجالات التنافسية عادةً عدة أشهر من العمل المنتظم. نحدد التوقعات بعد مراجعة موقعك ومنافسيك.",
          },
          {
            q: "ما الفرق بين SEO وإعلانات جوجل؟",
            a: "إعلانات جوجل مدفوعة وتتوقف بتوقف الإنفاق، أما SEO فيحسّن ظهورك الطبيعي الذي يستغرق وقتاً أطول لكنه لا يُدفع لكل نقرة.",
          },
          {
            q: "هل تبنون روابط خلفية؟",
            a: "نركز على كسب الإشارات عبر المحتوى المفيد والعلاقات العامة الرقمية والشراكات الحقيقية، ولا نشتري روابط أو نستخدم شبكات روابط خاصة.",
          },
        ],
      },
    },
  },
  {
    slug: "aeo-ai-search",
    category: "search",
    related: ["seo", "content-marketing", "public-relations", "personal-branding"],
    content: {
      en: {
        title: "AEO & AI Search Visibility",
        metaTitle: "AEO: Answer Engine & AI Search Optimisation",
        metaDescription:
          "Answer engine optimisation (AEO) helps your brand be understood and accurately described by AI assistants and AI search features, built on solid SEO and clear content.",
        summary: "Clear, consistent and well-structured information that helps AI assistants and answer engines understand and describe your business.",
        intro:
          "People increasingly ask AI assistants and AI-powered search features for recommendations and explanations. Answer engine optimisation (AEO) focuses on making your expertise easy to find, understand and cite: direct answers to real questions, consistent business information across the web, transparent authorship and a technically sound site. It builds on SEO rather than replacing it.",
        signals: [
          "AI assistants describe your business inaccurately or not at all.",
          "Your website does not directly answer the questions customers ask.",
          "Business details differ between your site, directories and profiles.",
          "Competitors are mentioned in AI answers for your category.",
        ],
        includes: [
          { title: "Question research", text: "Real questions from customers, sales calls, search data and forums." },
          { title: "Answer-first content", text: "Concise answers supported by detail, examples and sources." },
          { title: "Entity consistency", text: "Aligned business, service and author information across key profiles." },
          { title: "Technical clarity", text: "Clean HTML, accurate structured data and crawlable pages." },
        ],
        deliverables: [
          "AI visibility review across selected assistants and queries",
          "Question and answer content plan",
          "Entity and profile consistency checklist",
          "Content updates or new answer pages",
        ],
        note: "AI systems change frequently and do not disclose how they choose sources. We cannot guarantee citations or mentions; we improve the quality and clarity of the information available about you.",
        faqs: [
          {
            q: "What is the difference between SEO and AEO?",
            a: "SEO focuses on ranking pages in search results. AEO focuses on being the clear, trustworthy answer that AI assistants and answer features can understand and reference. Most AEO work depends on good SEO foundations.",
          },
          {
            q: "Can you get us mentioned in ChatGPT or Google AI answers?",
            a: "No one can promise that. What we can do is make accurate information about your business easier to find and understand, which improves the likelihood of being represented correctly.",
          },
        ],
      },
      ar: {
        title: "تحسين الظهور في محركات الإجابة والبحث بالذكاء الاصطناعي",
        metaTitle: "AEO: تحسين الظهور في البحث بالذكاء الاصطناعي",
        metaDescription:
          "يساعد تحسين محركات الإجابة (AEO) مساعدات الذكاء الاصطناعي وميزات البحث الذكي على فهم علامتك ووصفها بدقة، اعتماداً على SEO قوي ومحتوى واضح.",
        summary: "معلومات واضحة ومتسقة ومنظمة تساعد مساعدات الذكاء الاصطناعي ومحركات الإجابة على فهم عملك ووصفه.",
        intro:
          "يسأل الناس بشكل متزايد مساعدات الذكاء الاصطناعي وميزات البحث الذكي عن توصيات وشروحات. يركز تحسين محركات الإجابة على جعل خبرتك سهلة الإيجاد والفهم والاستشهاد: إجابات مباشرة على أسئلة حقيقية، ومعلومات متسقة عن عملك عبر الإنترنت، وتأليف واضح، وموقع سليم تقنياً. وهو مكمل لتحسين محركات البحث لا بديل عنه.",
        signals: [
          "تصف مساعدات الذكاء الاصطناعي عملك بشكل غير دقيق أو لا تذكره.",
          "موقعك لا يجيب مباشرة عن الأسئلة التي يطرحها العملاء.",
          "تختلف بيانات عملك بين موقعك والأدلة والحسابات.",
          "يُذكر المنافسون في إجابات الذكاء الاصطناعي في مجالك.",
        ],
        includes: [
          { title: "بحث الأسئلة", text: "أسئلة حقيقية من العملاء ومكالمات المبيعات وبيانات البحث والمنتديات." },
          { title: "محتوى يبدأ بالإجابة", text: "إجابات موجزة مدعومة بالتفاصيل والأمثلة والمصادر." },
          { title: "اتساق الهوية", text: "توحيد معلومات العمل والخدمات والمؤلفين عبر الحسابات الأساسية." },
          { title: "وضوح تقني", text: "HTML نظيف وبيانات منظمة دقيقة وصفحات قابلة للزحف." },
        ],
        deliverables: [
          "مراجعة الظهور في مساعدات واستفسارات مختارة",
          "خطة محتوى للأسئلة والإجابات",
          "قائمة تحقق لاتساق الهوية والحسابات",
          "تحديثات محتوى أو صفحات إجابات جديدة",
        ],
        note: "تتغير أنظمة الذكاء الاصطناعي باستمرار ولا تكشف كيف تختار مصادرها. لا يمكننا ضمان الاستشهاد أو الذكر، لكننا نحسّن جودة المعلومات المتاحة عنك ووضوحها.",
        faqs: [
          {
            q: "ما الفرق بين SEO وAEO؟",
            a: "يركز SEO على ترتيب الصفحات في نتائج البحث، بينما يركز AEO على أن تكون الإجابة الواضحة الموثوقة التي يمكن لمساعدات الذكاء الاصطناعي فهمها والإشارة إليها. ويعتمد معظم عمل AEO على أسس SEO جيدة.",
          },
          {
            q: "هل يمكنكم جعلنا نظهر في إجابات ChatGPT أو جوجل؟",
            a: "لا أحد يستطيع الوعد بذلك. ما يمكننا فعله هو جعل المعلومات الدقيقة عن عملك أسهل في الإيجاد والفهم، ما يزيد احتمال تمثيلك بشكل صحيح.",
          },
        ],
      },
    },
  },
  {
    slug: "content-marketing",
    category: "search",
    related: ["seo", "aeo-ai-search", "email-marketing", "social-media"],
    content: {
      en: {
        title: "Content Marketing",
        metaTitle: "Content Marketing & Strategy Services",
        metaDescription:
          "Content strategy, articles, guides, case studies and landing page copy that answer customer questions, support SEO and move buyers towards a decision.",
        summary: "Articles, guides, case studies and page copy that answer real customer questions and support sales.",
        intro:
          "Good content answers the questions buyers have at each stage, from understanding a problem to comparing options. We plan topics from search data and customer conversations, write original material with a clear point of view, and make sure each piece has a job: attracting search traffic, supporting sales conversations or nurturing leads.",
        signals: [
          "Your blog is outdated or covers topics nobody searches for.",
          "Sales keeps answering the same questions by email.",
          "Content is published but never promoted or measured.",
          "Your pages describe features but not customer outcomes.",
        ],
        includes: [
          { title: "Content strategy", text: "Audience questions, topic clusters and an editorial calendar." },
          { title: "Writing and editing", text: "Articles, guides, landing pages and service copy." },
          { title: "Case studies", text: "Structured stories built from verified project information." },
          { title: "Distribution", text: "Repurposing for email, social media and sales enablement." },
        ],
        deliverables: [
          "Content strategy and topic map",
          "Editorial calendar",
          "Briefs and finished content pieces",
          "Content performance review",
        ],
        note: "AI tools may assist research and drafting, but every piece is reviewed and edited by a person, and factual claims are checked against sources.",
        faqs: [
          {
            q: "Do you write in Arabic as well as English?",
            a: "Yes. We plan content for both languages and adapt it for each audience rather than translating word for word.",
          },
          {
            q: "How many articles should we publish per month?",
            a: "Quality and relevance matter more than volume. Two to four well-researched pieces per month is often more effective than many thin posts.",
          },
        ],
      },
      ar: {
        title: "التسويق بالمحتوى",
        metaTitle: "خدمات واستراتيجية التسويق بالمحتوى",
        metaDescription:
          "استراتيجية محتوى ومقالات وأدلة ودراسات حالة ونصوص صفحات هبوط تجيب عن أسئلة العملاء وتدعم SEO وتقرّب المشترين من القرار.",
        summary: "مقالات وأدلة ودراسات حالة ونصوص صفحات تجيب عن أسئلة العملاء الحقيقية وتدعم المبيعات.",
        intro:
          "المحتوى الجيد يجيب عن أسئلة المشترين في كل مرحلة، من فهم المشكلة إلى مقارنة الخيارات. نخطط الموضوعات من بيانات البحث ومحادثات العملاء، ونكتب مادة أصلية بوجهة نظر واضحة، ونتأكد أن لكل قطعة هدفاً: جذب زيارات البحث أو دعم محادثات المبيعات أو رعاية العملاء المحتملين.",
        signals: [
          "مدونتك قديمة أو تتناول موضوعات لا يبحث عنها أحد.",
          "فريق المبيعات يجيب عن الأسئلة نفسها بالبريد مراراً.",
          "يُنشر المحتوى دون ترويج أو قياس.",
          "صفحاتك تصف الميزات لا النتائج التي يحققها العميل.",
        ],
        includes: [
          { title: "استراتيجية المحتوى", text: "أسئلة الجمهور ومجموعات الموضوعات وتقويم النشر." },
          { title: "الكتابة والتحرير", text: "مقالات وأدلة وصفحات هبوط ونصوص الخدمات." },
          { title: "دراسات الحالة", text: "قصص منظمة مبنية على معلومات مشاريع موثقة." },
          { title: "التوزيع", text: "إعادة توظيف المحتوى للبريد ووسائل التواصل ودعم المبيعات." },
        ],
        deliverables: [
          "استراتيجية المحتوى وخريطة الموضوعات",
          "تقويم النشر",
          "موجزات ومحتوى مكتمل",
          "مراجعة أداء المحتوى",
        ],
        note: "قد تساعد أدوات الذكاء الاصطناعي في البحث والمسودات، لكن كل قطعة يراجعها ويحررها شخص، وتُتحقق الادعاءات من مصادرها.",
        faqs: [
          {
            q: "هل تكتبون بالعربية والإنجليزية؟",
            a: "نعم. نخطط المحتوى للغتين ونكيّفه لكل جمهور بدلاً من الترجمة الحرفية.",
          },
          {
            q: "كم مقالاً يجب أن ننشر شهرياً؟",
            a: "الجودة والملاءمة أهم من الكمية. غالباً ما تكون قطعتان إلى أربع قطع مدروسة جيداً شهرياً أكثر فاعلية من منشورات كثيرة سطحية.",
          },
        ],
      },
    },
  },
];
