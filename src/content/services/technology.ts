import type { Service } from "./schema";

/** Web, software and automation services. Arabic copy is a first draft and needs native review. */
export const technologyServices: Service[] = [
  {
    slug: "wordpress",
    category: "technology",
    related: ["web-development", "seo", "ecommerce", "ui-ux-3d"],
    content: {
      en: {
        title: "WordPress Development",
        metaTitle: "WordPress Website Development & Maintenance",
        metaDescription:
          "Custom WordPress websites, theme and plugin development, speed and security improvements, and maintenance that keeps your site fast and easy to edit.",
        summary: "Custom WordPress sites, speed and security improvements, and maintenance that keeps editing simple.",
        intro:
          "WordPress powers a large share of the web because it is flexible and easy for teams to edit. It also becomes slow and fragile when overloaded with plugins. We build clean, well-structured WordPress sites with editing experiences tailored to your content, and we maintain existing sites with updates, backups and performance work.",
        signals: [
          "Your WordPress site is slow or breaks after updates.",
          "Editing a page requires a developer.",
          "You have dozens of plugins and are not sure what they do.",
          "Your site was hacked or flagged for malware.",
        ],
        includes: [
          { title: "Custom builds", text: "Block-based themes and custom fields designed around your content." },
          { title: "Performance", text: "Caching, image optimisation and plugin clean-up." },
          { title: "Security and maintenance", text: "Updates, backups, monitoring and hardening." },
          { title: "Migrations", text: "Moving hosts or platforms with redirects and SEO preserved." },
        ],
        deliverables: [
          "WordPress site or improvement plan",
          "Editor guide for your team",
          "Maintenance and backup routine",
          "Performance before-and-after measurements",
        ],
        faqs: [
          {
            q: "Should we use WordPress or a custom-built website?",
            a: "WordPress suits content-heavy sites that non-technical teams update often. Custom builds suit complex applications, unusual interactions or strict performance needs. We recommend based on your requirements.",
          },
          {
            q: "Do you offer ongoing maintenance?",
            a: "Yes. Maintenance plans cover updates, backups, uptime checks and small changes, agreed in writing.",
          },
        ],
      },
      ar: {
        title: "تطوير مواقع ووردبريس",
        metaTitle: "تطوير وصيانة مواقع ووردبريس",
        metaDescription:
          "مواقع ووردبريس مخصصة وتطوير القوالب والإضافات وتحسين السرعة والأمان وصيانة تحافظ على موقعك سريعاً وسهل التعديل.",
        summary: "مواقع ووردبريس مخصصة وتحسين السرعة والأمان وصيانة تُبقي التعديل سهلاً.",
        intro:
          "يشغّل ووردبريس جزءاً كبيراً من الويب لأنه مرن وسهل التعديل للفرق، لكنه يصبح بطيئاً وهشاً عند تحميله بالإضافات. نبني مواقع ووردبريس نظيفة ومنظمة بتجربة تحرير مصممة حول محتواك، ونصون المواقع الحالية بالتحديثات والنسخ الاحتياطية وتحسين الأداء.",
        signals: [
          "موقع ووردبريس بطيء أو يتعطل بعد التحديثات.",
          "تعديل صفحة يتطلب مطوراً.",
          "لديك عشرات الإضافات ولا تعرف وظيفتها.",
          "تعرض موقعك للاختراق أو صُنف كمصاب ببرمجيات خبيثة.",
        ],
        includes: [
          { title: "بناء مخصص", text: "قوالب مبنية على الكتل وحقول مخصصة مصممة حول محتواك." },
          { title: "الأداء", text: "التخزين المؤقت وتحسين الصور وتنظيف الإضافات." },
          { title: "الأمان والصيانة", text: "التحديثات والنسخ الاحتياطية والمراقبة والتحصين." },
          { title: "النقل", text: "الانتقال بين الاستضافات أو المنصات مع الحفاظ على التحويلات وSEO." },
        ],
        deliverables: [
          "موقع ووردبريس أو خطة تحسين",
          "دليل تحرير لفريقك",
          "روتين صيانة ونسخ احتياطي",
          "قياسات الأداء قبل التحسين وبعده",
        ],
        faqs: [
          {
            q: "هل نستخدم ووردبريس أم موقعاً مبرمجاً خصيصاً؟",
            a: "يناسب ووردبريس المواقع الغنية بالمحتوى التي يحدّثها فريق غير تقني باستمرار، بينما يناسب البناء المخصص التطبيقات المعقدة أو التفاعلات الخاصة أو متطلبات الأداء الصارمة. نوصي حسب متطلباتك.",
          },
          {
            q: "هل تقدمون صيانة مستمرة؟",
            a: "نعم. تشمل خطط الصيانة التحديثات والنسخ الاحتياطية ومراقبة التشغيل والتعديلات الصغيرة، ويُتفق عليها كتابياً.",
          },
        ],
      },
    },
  },
  {
    slug: "web-development",
    category: "technology",
    related: ["ui-ux-3d", "backend-apis", "seo", "wordpress"],
    content: {
      en: {
        title: "Website & Web App Development",
        metaTitle: "Custom Website & Web Application Development",
        metaDescription:
          "Fast, accessible, search-friendly websites and web applications built with modern frameworks such as Next.js and React, with clean code you can maintain.",
        summary: "Fast, accessible, search-friendly websites and web applications built with modern, maintainable code.",
        intro:
          "Your website is often the first serious impression a buyer has of your business. We build sites and web applications with modern frameworks such as Next.js and React, focusing on speed, accessibility, search visibility and content your team can edit. Code is documented and stored in your own repository so you are never locked in.",
        signals: [
          "Your current site is slow, hard to update or not mobile-friendly.",
          "You need features a template cannot handle.",
          "Your website does not reflect the quality of your work.",
          "You need a customer portal, booking flow or internal tool.",
        ],
        includes: [
          { title: "Discovery and planning", text: "Goals, sitemap, content model and technical approach." },
          { title: "Front-end development", text: "Responsive, accessible interfaces with strong Core Web Vitals." },
          { title: "Content editing", text: "A CMS or editing tools suited to your team." },
          { title: "Launch and handover", text: "Testing, analytics, redirects, documentation and training." },
        ],
        deliverables: [
          "Technical plan and sitemap",
          "Production-ready website or application",
          "Source code in your repository",
          "Setup, deployment and editing documentation",
        ],
        faqs: [
          {
            q: "Which technology do you use?",
            a: "We often use Next.js, React and TypeScript for custom work and WordPress for content-led sites. The choice depends on your requirements, budget and who will maintain the site.",
          },
          {
            q: "Will the website be optimised for search engines?",
            a: "Yes. Technical SEO foundations such as clean URLs, metadata, sitemaps, structured data and performance are part of every build.",
          },
        ],
      },
      ar: {
        title: "تطوير المواقع وتطبيقات الويب",
        metaTitle: "تطوير مواقع وتطبيقات ويب مخصصة",
        metaDescription:
          "مواقع وتطبيقات ويب سريعة وسهلة الوصول ومتوافقة مع البحث، مبنية بأطر حديثة مثل Next.js وReact بشيفرة نظيفة قابلة للصيانة.",
        summary: "مواقع وتطبيقات ويب سريعة وسهلة الوصول ومتوافقة مع البحث، مبنية بشيفرة حديثة قابلة للصيانة.",
        intro:
          "غالباً ما يكون موقعك أول انطباع جاد لدى المشتري عن عملك. نبني المواقع وتطبيقات الويب بأطر حديثة مثل Next.js وReact مع التركيز على السرعة وسهولة الوصول والظهور في البحث ومحتوى يستطيع فريقك تعديله. تُوثّق الشيفرة وتُحفظ في مستودعك الخاص حتى لا تكون مقيداً بنا.",
        signals: [
          "موقعك الحالي بطيء أو صعب التحديث أو غير متوافق مع الجوال.",
          "تحتاج ميزات لا يستطيع القالب تقديمها.",
          "موقعك لا يعكس جودة عملك.",
          "تحتاج بوابة عملاء أو نظام حجز أو أداة داخلية.",
        ],
        includes: [
          { title: "الاستكشاف والتخطيط", text: "الأهداف وخريطة الموقع ونموذج المحتوى والنهج التقني." },
          { title: "تطوير الواجهات", text: "واجهات متجاوبة وسهلة الوصول بمؤشرات أداء قوية." },
          { title: "تحرير المحتوى", text: "نظام إدارة محتوى أو أدوات تحرير تناسب فريقك." },
          { title: "الإطلاق والتسليم", text: "الاختبار والتحليلات والتحويلات والتوثيق والتدريب." },
        ],
        deliverables: [
          "خطة تقنية وخريطة الموقع",
          "موقع أو تطبيق جاهز للتشغيل",
          "الشيفرة المصدرية في مستودعك",
          "توثيق الإعداد والنشر والتحرير",
        ],
        faqs: [
          {
            q: "ما التقنية التي تستخدمونها؟",
            a: "نستخدم غالباً Next.js وReact وTypeScript للأعمال المخصصة وووردبريس للمواقع المعتمدة على المحتوى. يعتمد الاختيار على متطلباتك وميزانيتك ومن سيصون الموقع.",
          },
          {
            q: "هل سيكون الموقع محسناً لمحركات البحث؟",
            a: "نعم. أسس SEO التقنية مثل الروابط النظيفة والبيانات الوصفية وخرائط الموقع والبيانات المنظمة والأداء جزء من كل مشروع.",
          },
        ],
      },
    },
  },
  {
    slug: "ecommerce",
    category: "technology",
    related: ["web-development", "google-ads", "email-marketing", "analytics-cro"],
    content: {
      en: {
        title: "E-commerce Development",
        metaTitle: "E-commerce Website Development: Shopify & WooCommerce",
        metaDescription:
          "Online stores on Shopify, WooCommerce or custom stacks, with clear product pages, smooth checkout, payment and shipping setup, and conversion tracking.",
        summary: "Online stores with clear product pages, smooth checkout and the tracking needed to grow sales.",
        intro:
          "An online store has to make browsing easy, build confidence and remove friction at checkout. We build and improve stores on platforms such as Shopify and WooCommerce, or custom stacks when needed, with attention to product data, payment and shipping setup, performance and analytics.",
        signals: [
          "Visitors add to cart but do not complete checkout.",
          "Managing products and stock takes too much time.",
          "Your store is slow on mobile.",
          "You want to start selling online and need the right platform.",
        ],
        includes: [
          { title: "Platform selection", text: "Shopify, WooCommerce or custom, based on catalogue and operations." },
          { title: "Store build", text: "Theme, product pages, collections and checkout configuration." },
          { title: "Integrations", text: "Payments, shipping, inventory, email and analytics." },
          { title: "Conversion improvements", text: "Product page, cart and checkout optimisation." },
        ],
        deliverables: [
          "Configured online store",
          "Product data import",
          "E-commerce tracking setup",
          "Store management guide",
        ],
        faqs: [
          {
            q: "Shopify or WooCommerce?",
            a: "Shopify is quicker to launch and maintain. WooCommerce offers more control and suits sites already on WordPress. We compare costs, features and your team's skills before recommending.",
          },
          {
            q: "Can you set up local payment gateways?",
            a: "Where the platform and gateway support it, yes. Availability varies by country, so we confirm options during planning.",
          },
        ],
      },
      ar: {
        title: "تطوير المتاجر الإلكترونية",
        metaTitle: "تطوير المتاجر الإلكترونية: شوبيفاي وووكومرس",
        metaDescription:
          "متاجر إلكترونية على شوبيفاي أو ووكومرس أو حلول مخصصة، بصفحات منتجات واضحة ودفع سلس وإعداد للدفع والشحن وتتبع التحويلات.",
        summary: "متاجر إلكترونية بصفحات منتجات واضحة ودفع سلس والتتبع اللازم لنمو المبيعات.",
        intro:
          "يجب أن يجعل المتجر الإلكتروني التصفح سهلاً ويبني الثقة ويزيل العوائق عند الدفع. نبني المتاجر ونحسنها على منصات مثل شوبيفاي وووكومرس أو حلول مخصصة عند الحاجة، مع الاهتمام ببيانات المنتجات وإعداد الدفع والشحن والأداء والتحليلات.",
        signals: [
          "يضيف الزوار منتجات إلى السلة لكنهم لا يكملون الشراء.",
          "إدارة المنتجات والمخزون تستهلك وقتاً كبيراً.",
          "متجرك بطيء على الجوال.",
          "تريد بدء البيع عبر الإنترنت وتحتاج المنصة المناسبة.",
        ],
        includes: [
          { title: "اختيار المنصة", text: "شوبيفاي أو ووكومرس أو حل مخصص حسب الكتالوج والعمليات." },
          { title: "بناء المتجر", text: "القالب وصفحات المنتجات والمجموعات وإعداد الدفع." },
          { title: "التكاملات", text: "الدفع والشحن والمخزون والبريد والتحليلات." },
          { title: "تحسين التحويل", text: "تحسين صفحات المنتجات والسلة وخطوات الدفع." },
        ],
        deliverables: [
          "متجر إلكتروني مُعد",
          "استيراد بيانات المنتجات",
          "إعداد تتبع التجارة الإلكترونية",
          "دليل إدارة المتجر",
        ],
        faqs: [
          {
            q: "شوبيفاي أم ووكومرس؟",
            a: "شوبيفاي أسرع في الإطلاق والصيانة، بينما يمنح ووكومرس تحكماً أكبر ويناسب المواقع المبنية على ووردبريس. نقارن التكاليف والميزات ومهارات فريقك قبل التوصية.",
          },
          {
            q: "هل يمكنكم إعداد بوابات دفع محلية؟",
            a: "نعم عندما تدعم المنصة والبوابة ذلك. يختلف التوفر حسب الدولة، لذلك نؤكد الخيارات أثناء التخطيط.",
          },
        ],
      },
    },
  },
  {
    slug: "mobile-apps",
    category: "technology",
    related: ["backend-apis", "ui-ux-3d", "web-development", "automation-ai-agents"],
    content: {
      en: {
        title: "Mobile App Development",
        metaTitle: "Mobile App Development for iOS & Android",
        metaDescription:
          "Cross-platform and native mobile apps for iOS and Android, from product planning and UX to development, testing and app store submission.",
        summary: "iOS and Android apps planned around real user needs, from first prototype to app store release.",
        intro:
          "A mobile app is worthwhile when it gives users something a website cannot do as well, such as offline access, notifications or device features. We help you validate that, then design and build cross-platform or native apps with a clear first release scope, reliable back-end services and a plan for updates.",
        signals: [
          "Customers ask for an app to manage orders, bookings or accounts.",
          "Your team relies on spreadsheets in the field.",
          "You have an app idea and need to scope a first version.",
          "An existing app has poor reviews or crashes often.",
        ],
        includes: [
          { title: "Product scoping", text: "Core user journeys and a realistic first release." },
          { title: "UX and UI design", text: "Prototypes tested before development starts." },
          { title: "Development", text: "Cross-platform frameworks such as React Native or Flutter, or native where needed." },
          { title: "Release", text: "Testing, store listing preparation and submission support." },
        ],
        deliverables: [
          "Product scope and roadmap",
          "Clickable prototype",
          "iOS and Android builds",
          "Release checklist and documentation",
        ],
        note: "App store approval is decided by Apple and Google. We prepare submissions to their guidelines but cannot guarantee approval timelines.",
        faqs: [
          {
            q: "Cross-platform or native?",
            a: "Cross-platform frameworks let one codebase serve iOS and Android and suit most business apps. Native development makes sense for heavy device integration or demanding performance.",
          },
          {
            q: "How much does an app cost?",
            a: "Cost depends on features, integrations and design complexity. We provide an estimate after a scoping session rather than a generic price.",
          },
        ],
      },
      ar: {
        title: "تطوير تطبيقات الجوال",
        metaTitle: "تطوير تطبيقات الجوال لنظامي iOS وأندرويد",
        metaDescription:
          "تطبيقات جوال متعددة المنصات وأصلية لنظامي iOS وأندرويد، من تخطيط المنتج وتجربة المستخدم إلى التطوير والاختبار والنشر في المتاجر.",
        summary: "تطبيقات iOS وأندرويد مخططة حول احتياجات المستخدمين الحقيقية، من النموذج الأول إلى النشر في المتاجر.",
        intro:
          "يكون التطبيق مجدياً عندما يقدم للمستخدمين ما لا يقدمه الموقع بالكفاءة نفسها، مثل العمل دون اتصال أو الإشعارات أو ميزات الجهاز. نساعدك في التحقق من ذلك، ثم نصمم ونبني تطبيقات متعددة المنصات أو أصلية بنطاق واضح للإصدار الأول وخدمات خلفية موثوقة وخطة للتحديثات.",
        signals: [
          "يطلب العملاء تطبيقاً لإدارة الطلبات أو الحجوزات أو الحسابات.",
          "يعتمد فريقك الميداني على جداول البيانات.",
          "لديك فكرة تطبيق وتحتاج إلى تحديد نطاق الإصدار الأول.",
          "تطبيقك الحالي حاصل على تقييمات ضعيفة أو يتعطل كثيراً.",
        ],
        includes: [
          { title: "تحديد نطاق المنتج", text: "رحلات المستخدم الأساسية وإصدار أول واقعي." },
          { title: "تصميم التجربة والواجهة", text: "نماذج أولية تُختبر قبل بدء التطوير." },
          { title: "التطوير", text: "أطر متعددة المنصات مثل React Native أو Flutter، أو تطوير أصلي عند الحاجة." },
          { title: "الإصدار", text: "الاختبار وإعداد صفحة المتجر ودعم التقديم." },
        ],
        deliverables: [
          "نطاق المنتج وخارطة الطريق",
          "نموذج أولي تفاعلي",
          "نسخ iOS وأندرويد",
          "قائمة تحقق الإصدار والتوثيق",
        ],
        note: "تقرر آبل وجوجل قبول التطبيقات في متاجرهما. نعد التقديم وفق إرشاداتهما لكن لا نضمن مدة الموافقة.",
        faqs: [
          {
            q: "متعدد المنصات أم أصلي؟",
            a: "تتيح الأطر متعددة المنصات قاعدة شيفرة واحدة لنظامي iOS وأندرويد وتناسب معظم تطبيقات الأعمال، بينما يكون التطوير الأصلي منطقياً للتكامل العميق مع الجهاز أو الأداء العالي.",
          },
          {
            q: "كم تكلفة التطبيق؟",
            a: "تعتمد التكلفة على الميزات والتكاملات وتعقيد التصميم. نقدم تقديراً بعد جلسة تحديد النطاق بدلاً من سعر عام.",
          },
        ],
      },
    },
  },
  {
    slug: "backend-apis",
    category: "technology",
    related: ["web-development", "mobile-apps", "erp-crm", "automation-ai-agents"],
    content: {
      en: {
        title: "Back-end & API Development",
        metaTitle: "Back-end, Database & API Development",
        metaDescription:
          "Secure back-end systems, databases and APIs that connect your website, apps and business tools, with authentication, documentation and monitoring.",
        summary: "Secure databases, APIs and integrations that connect your website, apps and business tools.",
        intro:
          "Behind most useful digital products is a back end that stores data safely, applies business rules and connects to other systems. We design databases and APIs with security, clear documentation and maintainability in mind, and integrate third-party services such as payments, CRMs and messaging platforms.",
        signals: [
          "Data is copied manually between systems.",
          "Your app needs a reliable API and user accounts.",
          "An existing back end is undocumented and hard to change.",
          "You need to integrate a payment, CRM or logistics service.",
        ],
        includes: [
          { title: "Architecture and data modelling", text: "Database design, access rules and scalability planning." },
          { title: "API development", text: "REST or GraphQL endpoints with validation and versioning." },
          { title: "Authentication and security", text: "Accounts, roles, permissions and secure secret handling." },
          { title: "Integrations", text: "Payment gateways, CRMs, email and third-party APIs." },
        ],
        deliverables: [
          "Architecture and data model documentation",
          "Tested API and database migrations",
          "API reference documentation",
          "Deployment and monitoring setup",
        ],
        faqs: [
          {
            q: "Which back-end technologies do you use?",
            a: "We commonly use Node.js and TypeScript with PostgreSQL, including managed platforms such as Supabase, and adapt to existing stacks when needed.",
          },
          {
            q: "Can you take over an existing system?",
            a: "Yes. We start with a code and infrastructure review, document what exists and agree priorities before making changes.",
          },
        ],
      },
      ar: {
        title: "تطوير الأنظمة الخلفية وواجهات البرمجة",
        metaTitle: "تطوير الأنظمة الخلفية وقواعد البيانات وواجهات API",
        metaDescription:
          "أنظمة خلفية وقواعد بيانات وواجهات برمجة آمنة تربط موقعك وتطبيقاتك وأدوات عملك، مع المصادقة والتوثيق والمراقبة.",
        summary: "قواعد بيانات وواجهات برمجة وتكاملات آمنة تربط موقعك وتطبيقاتك وأدوات عملك.",
        intro:
          "خلف معظم المنتجات الرقمية المفيدة نظام خلفي يحفظ البيانات بأمان ويطبق قواعد العمل ويتصل بأنظمة أخرى. نصمم قواعد البيانات وواجهات البرمجة مع مراعاة الأمان والتوثيق الواضح وسهولة الصيانة، وندمج خدمات خارجية مثل الدفع وأنظمة إدارة العملاء ومنصات المراسلة.",
        signals: [
          "تُنسخ البيانات يدوياً بين الأنظمة.",
          "يحتاج تطبيقك واجهة برمجة موثوقة وحسابات مستخدمين.",
          "النظام الخلفي الحالي غير موثق ويصعب تعديله.",
          "تحتاج إلى دمج خدمة دفع أو إدارة عملاء أو شحن.",
        ],
        includes: [
          { title: "البنية ونمذجة البيانات", text: "تصميم قاعدة البيانات وقواعد الوصول وتخطيط التوسع." },
          { title: "تطوير واجهات البرمجة", text: "واجهات REST أو GraphQL مع التحقق والإصدارات." },
          { title: "المصادقة والأمان", text: "الحسابات والأدوار والصلاحيات والتعامل الآمن مع الأسرار." },
          { title: "التكاملات", text: "بوابات الدفع وأنظمة إدارة العملاء والبريد وواجهات الأطراف الثالثة." },
        ],
        deliverables: [
          "توثيق البنية ونموذج البيانات",
          "واجهة برمجة مختبرة وترحيلات قاعدة البيانات",
          "توثيق مرجعي لواجهة البرمجة",
          "إعداد النشر والمراقبة",
        ],
        faqs: [
          {
            q: "ما التقنيات الخلفية التي تستخدمونها؟",
            a: "نستخدم عادةً Node.js وTypeScript مع PostgreSQL، بما في ذلك منصات مُدارة مثل Supabase، ونتكيف مع الأنظمة القائمة عند الحاجة.",
          },
          {
            q: "هل يمكنكم تولي نظام قائم؟",
            a: "نعم. نبدأ بمراجعة الشيفرة والبنية التحتية، ونوثق الموجود، ونتفق على الأولويات قبل إجراء أي تغييرات.",
          },
        ],
      },
    },
  },
  {
    slug: "erp-crm",
    category: "technology",
    related: ["automation-ai-agents", "backend-apis", "lead-generation", "analytics-cro"],
    content: {
      en: {
        title: "ERP & CRM Solutions",
        metaTitle: "ERP & CRM Implementation and Customisation",
        metaDescription:
          "CRM and ERP selection, setup, customisation and integration that organise sales, operations and customer data in one reliable system.",
        summary: "CRM and ERP setup and integration that bring sales, operations and customer data into one reliable place.",
        intro:
          "Growing businesses often run on disconnected spreadsheets, inboxes and tools. A well-configured CRM or ERP gives everyone the same view of customers, deals, orders and stock. We help you choose a platform, map your processes, configure and integrate it, migrate data and train your team so the system is actually used.",
        signals: [
          "Customer information is spread across inboxes and spreadsheets.",
          "Nobody knows which deals are active or who owns them.",
          "Orders, invoices and stock are tracked in different places.",
          "You bought a CRM but the team does not use it.",
        ],
        includes: [
          { title: "Process mapping", text: "How leads, deals, orders and support flow today and should flow." },
          { title: "Platform selection", text: "Options such as HubSpot, Zoho, Odoo or others, compared on fit and cost." },
          { title: "Configuration and integration", text: "Pipelines, fields, automations and connections to other tools." },
          { title: "Migration and training", text: "Clean data import and role-based training." },
        ],
        deliverables: [
          "Process map and requirements",
          "Configured CRM or ERP",
          "Data migration report",
          "User guides and training sessions",
        ],
        faqs: [
          {
            q: "Which CRM is best for a small business?",
            a: "There is no single best option. The right CRM depends on your sales process, team size, integrations and budget. We compare a short list against your requirements.",
          },
          {
            q: "Can you migrate our existing data?",
            a: "Yes. We clean, map and test the import with a sample first, then migrate and verify the full dataset.",
          },
        ],
      },
      ar: {
        title: "حلول تخطيط الموارد وإدارة العملاء",
        metaTitle: "تطبيق وتخصيص أنظمة ERP وCRM",
        metaDescription:
          "اختيار وإعداد وتخصيص ودمج أنظمة إدارة العملاء وتخطيط الموارد لتنظيم المبيعات والعمليات وبيانات العملاء في نظام واحد موثوق.",
        summary: "إعداد ودمج أنظمة إدارة العملاء وتخطيط الموارد لجمع المبيعات والعمليات وبيانات العملاء في مكان واحد موثوق.",
        intro:
          "تعمل الشركات النامية غالباً على جداول وصناديق بريد وأدوات منفصلة. يمنح نظام إدارة العملاء أو تخطيط الموارد المُعد جيداً الجميع رؤية واحدة للعملاء والصفقات والطلبات والمخزون. نساعدك في اختيار المنصة ورسم عملياتك وإعدادها ودمجها ونقل البيانات وتدريب فريقك حتى يُستخدم النظام فعلاً.",
        signals: [
          "معلومات العملاء موزعة بين البريد وجداول البيانات.",
          "لا أحد يعرف الصفقات النشطة أو المسؤول عنها.",
          "تُتابع الطلبات والفواتير والمخزون في أماكن مختلفة.",
          "اشتريت نظام إدارة عملاء لكن الفريق لا يستخدمه.",
        ],
        includes: [
          { title: "رسم العمليات", text: "كيف تسير العملاء المحتملون والصفقات والطلبات والدعم اليوم وكيف يجب أن تسير." },
          { title: "اختيار المنصة", text: "خيارات مثل HubSpot وZoho وOdoo وغيرها مقارنة حسب الملاءمة والتكلفة." },
          { title: "الإعداد والدمج", text: "مسارات البيع والحقول والأتمتة والربط بالأدوات الأخرى." },
          { title: "النقل والتدريب", text: "استيراد نظيف للبيانات وتدريب حسب الأدوار." },
        ],
        deliverables: [
          "خريطة العمليات والمتطلبات",
          "نظام إدارة عملاء أو تخطيط موارد مُعد",
          "تقرير نقل البيانات",
          "أدلة المستخدم وجلسات التدريب",
        ],
        faqs: [
          {
            q: "ما أفضل نظام إدارة عملاء للشركات الصغيرة؟",
            a: "لا يوجد خيار واحد هو الأفضل. يعتمد النظام المناسب على عملية البيع وحجم الفريق والتكاملات والميزانية، ونقارن قائمة مختصرة وفق متطلباتك.",
          },
          {
            q: "هل يمكنكم نقل بياناتنا الحالية؟",
            a: "نعم. ننظف البيانات ونطابقها ونختبر الاستيراد على عينة أولاً، ثم ننقل البيانات كاملة ونتحقق منها.",
          },
        ],
      },
    },
  },
  {
    slug: "automation-ai-agents",
    category: "technology",
    related: ["erp-crm", "backend-apis", "email-marketing", "lead-generation"],
    content: {
      en: {
        title: "Automation & AI Agents",
        metaTitle: "Business Automation & AI Agent Development",
        metaDescription:
          "Workflow automation and AI assistants that remove repetitive work, with human approval for important actions, clear logs and responsible data handling.",
        summary: "Workflow automation and AI assistants that remove repetitive work, with people approving the actions that matter.",
        intro:
          "Many teams spend hours copying data, sorting enquiries and writing similar documents. Automation and AI agents can take over much of that work when they are designed carefully. We map your workflows, automate the predictable steps, add AI where it genuinely helps, and keep a person in control of anything that leaves your business, such as emails, payments or published content.",
        signals: [
          "Staff repeat the same copy-and-paste tasks every day.",
          "Enquiries wait because someone has to sort them manually.",
          "You want to use AI but are worried about accuracy and data privacy.",
          "Reports take days to assemble from different tools.",
        ],
        includes: [
          { title: "Workflow discovery", text: "Which tasks to automate first, based on time saved and risk." },
          { title: "Automation build", text: "Integrations between your tools using APIs and automation platforms." },
          { title: "AI assistants", text: "Classification, drafting, research and summarisation with validated outputs." },
          { title: "Human approval and logs", text: "Approval steps, audit trails and error alerts." },
        ],
        deliverables: [
          "Automation opportunity map",
          "Working automations with documentation",
          "AI assistant configuration and safeguards",
          "Monitoring and error-handling guide",
        ],
        note: "AI output can be wrong. We design systems so that important actions are reviewed by a person, and we document what data is sent to any AI provider.",
        faqs: [
          {
            q: "What is an AI agent?",
            a: "An AI agent is software that uses a language model to carry out multi-step tasks, such as researching a company or drafting a reply, using tools it has been given permission to use. Good agents have clear limits, validated outputs and human oversight.",
          },
          {
            q: "Is our data safe with AI tools?",
            a: "It depends on the provider and configuration. We minimise the data sent, review provider terms, and agree with you in writing which data may be processed.",
          },
        ],
      },
      ar: {
        title: "الأتمتة ووكلاء الذكاء الاصطناعي",
        metaTitle: "أتمتة الأعمال وتطوير وكلاء الذكاء الاصطناعي",
        metaDescription:
          "أتمتة سير العمل ومساعدات ذكاء اصطناعي تزيل الأعمال المتكررة، مع موافقة بشرية على الإجراءات المهمة وسجلات واضحة وتعامل مسؤول مع البيانات.",
        summary: "أتمتة سير العمل ومساعدات ذكاء اصطناعي تزيل الأعمال المتكررة، مع موافقة بشرية على الإجراءات المهمة.",
        intro:
          "تقضي فرق كثيرة ساعات في نسخ البيانات وفرز الاستفسارات وكتابة مستندات متشابهة. يمكن للأتمتة ووكلاء الذكاء الاصطناعي تولي جزء كبير من هذا العمل عند تصميمها بعناية. نرسم سير عملك ونؤتمت الخطوات المتوقعة ونضيف الذكاء الاصطناعي حيث يفيد فعلاً، ونبقي شخصاً مسؤولاً عن أي شيء يخرج من عملك مثل الرسائل أو المدفوعات أو المحتوى المنشور.",
        signals: [
          "يكرر الموظفون مهام النسخ واللصق نفسها يومياً.",
          "تنتظر الاستفسارات لأن أحداً يجب أن يفرزها يدوياً.",
          "تريد استخدام الذكاء الاصطناعي لكنك قلق بشأن الدقة وخصوصية البيانات.",
          "تستغرق التقارير أياماً لتجميعها من أدوات مختلفة.",
        ],
        includes: [
          { title: "اكتشاف سير العمل", text: "أي المهام نؤتمت أولاً بناءً على الوقت الموفر والمخاطر." },
          { title: "بناء الأتمتة", text: "تكاملات بين أدواتك عبر واجهات البرمجة ومنصات الأتمتة." },
          { title: "مساعدات الذكاء الاصطناعي", text: "التصنيف والصياغة والبحث والتلخيص بمخرجات يُتحقق منها." },
          { title: "الموافقة البشرية والسجلات", text: "خطوات الموافقة وسجلات التدقيق وتنبيهات الأخطاء." },
        ],
        deliverables: [
          "خريطة فرص الأتمتة",
          "أتمتة عاملة مع التوثيق",
          "إعداد مساعد الذكاء الاصطناعي وضوابطه",
          "دليل المراقبة ومعالجة الأخطاء",
        ],
        note: "قد تكون مخرجات الذكاء الاصطناعي خاطئة. نصمم الأنظمة بحيث يراجع شخص الإجراءات المهمة، ونوثق البيانات التي تُرسل إلى أي مزود ذكاء اصطناعي.",
        faqs: [
          {
            q: "ما هو وكيل الذكاء الاصطناعي؟",
            a: "هو برنامج يستخدم نموذجاً لغوياً لتنفيذ مهام متعددة الخطوات، مثل البحث عن شركة أو صياغة رد، باستخدام أدوات مسموح له بها. الوكلاء الجيدون لديهم حدود واضحة ومخرجات يُتحقق منها وإشراف بشري.",
          },
          {
            q: "هل بياناتنا آمنة مع أدوات الذكاء الاصطناعي؟",
            a: "يعتمد ذلك على المزود والإعداد. نقلل البيانات المرسلة ونراجع شروط المزود ونتفق معك كتابياً على البيانات التي يمكن معالجتها.",
          },
        ],
      },
    },
  },
  {
    slug: "ui-ux-3d",
    category: "technology",
    related: ["web-development", "branding", "mobile-apps", "analytics-cro"],
    content: {
      en: {
        title: "UI/UX & 3D Web Experiences",
        metaTitle: "UI/UX Design & Interactive 3D Web Experiences",
        metaDescription:
          "User research, interface design, prototyping and interactive 3D web experiences that are memorable, accessible and fast on real devices.",
        summary: "Research-led interface design and interactive 3D experiences that stay fast and accessible.",
        intro:
          "Good design makes products easy to understand and pleasant to use. We combine user research, information architecture and interface design with interactive 3D and motion where it adds meaning, such as product visualisation or storytelling. Every experience includes fallbacks for low-powered devices and people who prefer reduced motion.",
        signals: [
          "Users get lost or abandon key tasks.",
          "Your product looks generic next to competitors.",
          "You want an interactive product or brand experience.",
          "A previous 3D or animation-heavy site was slow on mobile.",
        ],
        includes: [
          { title: "UX research", text: "User interviews, analytics review and usability testing." },
          { title: "UI design", text: "Design systems, components and responsive layouts." },
          { title: "Prototyping", text: "Interactive prototypes to validate ideas before development." },
          { title: "3D and motion", text: "WebGL scenes, product viewers and motion with performance budgets." },
        ],
        deliverables: [
          "Research findings and recommendations",
          "Design system and screen designs",
          "Interactive prototype",
          "Production 3D assets and implementation",
        ],
        note: "We treat 3D as an enhancement. Content and navigation always work without it.",
        faqs: [
          {
            q: "Does 3D slow down a website?",
            a: "It can if it is not planned carefully. We load 3D only when needed, keep assets small, measure performance and provide a lightweight fallback.",
          },
          {
            q: "What is the difference between UI and UX?",
            a: "UX (user experience) is about how a product works and whether people can achieve their goals. UI (user interface) is the visual layer: layout, typography, colour and components. Both matter.",
          },
        ],
      },
      ar: {
        title: "تصميم الواجهات والتجربة وتجارب الويب ثلاثية الأبعاد",
        metaTitle: "تصميم UI/UX وتجارب ويب تفاعلية ثلاثية الأبعاد",
        metaDescription:
          "بحث المستخدمين وتصميم الواجهات والنماذج الأولية وتجارب ويب تفاعلية ثلاثية الأبعاد لا تُنسى وسهلة الوصول وسريعة على الأجهزة الحقيقية.",
        summary: "تصميم واجهات مبني على البحث وتجارب تفاعلية ثلاثية الأبعاد تبقى سريعة وسهلة الوصول.",
        intro:
          "التصميم الجيد يجعل المنتجات سهلة الفهم وممتعة الاستخدام. نجمع بين بحث المستخدمين وبنية المعلومات وتصميم الواجهات مع التجارب ثلاثية الأبعاد والحركة عندما تضيف معنى، مثل عرض المنتجات أو السرد القصصي. تتضمن كل تجربة بدائل للأجهزة محدودة القدرة وللأشخاص الذين يفضلون تقليل الحركة.",
        signals: [
          "يضيع المستخدمون أو يتركون المهام الأساسية.",
          "منتجك يبدو عادياً مقارنة بالمنافسين.",
          "تريد تجربة تفاعلية لمنتجك أو علامتك.",
          "كان موقع سابق غني بالحركة أو ثلاثي الأبعاد بطيئاً على الجوال.",
        ],
        includes: [
          { title: "بحث تجربة المستخدم", text: "مقابلات المستخدمين ومراجعة التحليلات واختبار سهولة الاستخدام." },
          { title: "تصميم الواجهات", text: "أنظمة تصميم ومكونات وتخطيطات متجاوبة." },
          { title: "النماذج الأولية", text: "نماذج تفاعلية للتحقق من الأفكار قبل التطوير." },
          { title: "الأبعاد الثلاثة والحركة", text: "مشاهد WebGL وعارضات منتجات وحركة ضمن ميزانيات أداء." },
        ],
        deliverables: [
          "نتائج البحث والتوصيات",
          "نظام التصميم وتصاميم الشاشات",
          "نموذج أولي تفاعلي",
          "أصول ثلاثية الأبعاد جاهزة وتنفيذها",
        ],
        note: "نتعامل مع الأبعاد الثلاثة كإضافة تحسينية، فالمحتوى والتنقل يعملان دائماً بدونها.",
        faqs: [
          {
            q: "هل تبطئ الأبعاد الثلاثة الموقع؟",
            a: "قد يحدث ذلك دون تخطيط جيد. نحمّل العناصر ثلاثية الأبعاد عند الحاجة فقط، ونبقي الأصول صغيرة، ونقيس الأداء، ونوفر بديلاً خفيفاً.",
          },
          {
            q: "ما الفرق بين UI وUX؟",
            a: "تجربة المستخدم (UX) تتعلق بكيفية عمل المنتج وقدرة الناس على تحقيق أهدافهم، أما واجهة المستخدم (UI) فهي الطبقة المرئية من تخطيط وخطوط وألوان ومكونات، وكلاهما مهم.",
          },
        ],
      },
    },
  },
];
