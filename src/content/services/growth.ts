import type { Service } from "./schema";

/** Growth marketing services. Arabic copy is a first draft and needs native review. */
export const growthServices: Service[] = [
  {
    slug: "digital-marketing",
    category: "growth",
    related: ["google-ads", "seo", "analytics-cro", "content-marketing"],
    content: {
      en: {
        title: "Digital Marketing Strategy",
        metaTitle: "Digital Marketing Strategy & Management",
        metaDescription:
          "A joined-up digital marketing plan across search, paid media, social, content and email, built around your goals, budget and measurable outcomes.",
        summary:
          "A joined-up plan across search, paid media, social, content and email, built around the outcomes your business actually needs.",
        intro:
          "Many businesses run ads, post on social media and publish content without a plan that connects them. Digital marketing strategy brings those channels together: who you are trying to reach, what you want them to do, which channels deserve budget, and how success will be measured. It suits companies that are ready to grow beyond ad-hoc activity and want decisions based on evidence.",
        signals: [
          "You spend on several channels but cannot say which ones bring customers.",
          "Marketing activity depends on whoever has time that week.",
          "You are entering a new market or launching a new offer.",
          "Leads arrive, but their quality is inconsistent.",
        ],
        includes: [
          { title: "Audience and market research", text: "Customer segments, buying journeys, search demand and competitor positioning." },
          { title: "Channel plan", text: "Which channels to use, in what order, with a budget split you can defend." },
          { title: "Measurement framework", text: "Goals, KPIs, conversion tracking requirements and a reporting rhythm." },
          { title: "Ongoing management", text: "Optional monthly execution, testing and optimisation across the agreed channels." },
        ],
        deliverables: [
          "Written strategy with priorities for the next 90 days",
          "Channel and budget allocation recommendations",
          "KPI definitions and tracking plan",
          "Content and campaign calendar outline",
          "Monthly performance reports when managed by us",
        ],
        note: "Results depend on your market, offer, budget and sales follow-up. We set realistic targets with you rather than promising fixed outcomes.",
        faqs: [
          {
            q: "How long before a digital marketing strategy shows results?",
            a: "Paid channels can produce measurable traffic within days of launch. SEO and content usually take several months to compound. A good strategy combines both so you are not waiting on one channel alone.",
          },
          {
            q: "Do I need a large budget?",
            a: "No. A smaller budget simply means focusing on fewer channels and doing them well. Part of the strategy is deciding where a limited budget will work hardest.",
          },
          {
            q: "Can you work with our in-house team?",
            a: "Yes. We can provide the strategy and measurement framework while your team executes, or manage specific channels alongside them.",
          },
        ],
      },
      ar: {
        title: "استراتيجية التسويق الرقمي",
        metaTitle: "استراتيجية وإدارة التسويق الرقمي",
        metaDescription:
          "خطة تسويق رقمي متكاملة تجمع البحث والإعلانات المدفوعة ووسائل التواصل والمحتوى والبريد الإلكتروني حول أهدافك وميزانيتك ونتائج قابلة للقياس.",
        summary: "خطة متكاملة تربط البحث والإعلانات المدفوعة ووسائل التواصل والمحتوى والبريد الإلكتروني بالنتائج التي يحتاجها عملك فعلاً.",
        intro:
          "تدير شركات كثيرة إعلانات وتنشر على وسائل التواصل وتكتب محتوى دون خطة تربط هذه القنوات ببعضها. استراتيجية التسويق الرقمي تجمع هذه القنوات: من تستهدف، وما الإجراء الذي تريده من العميل، وأي القنوات تستحق الميزانية، وكيف يُقاس النجاح. تناسب هذه الخدمة الشركات المستعدة للانتقال من النشاط العشوائي إلى قرارات مبنية على البيانات.",
        signals: [
          "تنفق على عدة قنوات لكنك لا تعرف أيها يجلب العملاء.",
          "النشاط التسويقي يعتمد على من لديه وقت في ذلك الأسبوع.",
          "تدخل سوقاً جديدة أو تطلق عرضاً جديداً.",
          "تصلك طلبات لكن جودتها متفاوتة.",
        ],
        includes: [
          { title: "بحث الجمهور والسوق", text: "شرائح العملاء ورحلة الشراء وحجم البحث وتموضع المنافسين." },
          { title: "خطة القنوات", text: "أي القنوات نستخدم وبأي ترتيب، مع توزيع ميزانية مبرر." },
          { title: "إطار القياس", text: "الأهداف ومؤشرات الأداء ومتطلبات تتبع التحويلات وإيقاع التقارير." },
          { title: "إدارة مستمرة", text: "تنفيذ شهري اختياري مع الاختبار والتحسين عبر القنوات المتفق عليها." },
        ],
        deliverables: [
          "استراتيجية مكتوبة بأولويات الأيام التسعين القادمة",
          "توصيات توزيع القنوات والميزانية",
          "تعريفات مؤشرات الأداء وخطة التتبع",
          "مخطط أولي لتقويم المحتوى والحملات",
          "تقارير أداء شهرية عند الإدارة من قبلنا",
        ],
        note: "تعتمد النتائج على سوقك وعرضك وميزانيتك ومتابعة المبيعات. نضع معك أهدافاً واقعية بدلاً من الوعود بنتائج ثابتة.",
        faqs: [
          {
            q: "متى تظهر نتائج استراتيجية التسويق الرقمي؟",
            a: "القنوات المدفوعة قد تجلب زيارات قابلة للقياس خلال أيام من الإطلاق، بينما يحتاج تحسين محركات البحث والمحتوى عادةً عدة أشهر. الاستراتيجية الجيدة تجمع الاثنين حتى لا تنتظر قناة واحدة.",
          },
          {
            q: "هل أحتاج إلى ميزانية كبيرة؟",
            a: "لا. الميزانية الأصغر تعني التركيز على قنوات أقل وتنفيذها جيداً، وجزء من الاستراتيجية هو تحديد أين تعمل الميزانية المحدودة بأفضل شكل.",
          },
          {
            q: "هل يمكنكم العمل مع فريقنا الداخلي؟",
            a: "نعم. يمكننا تقديم الاستراتيجية وإطار القياس بينما ينفذ فريقك، أو إدارة قنوات محددة إلى جانبه.",
          },
        ],
      },
    },
  },
  {
    slug: "google-ads",
    category: "growth",
    related: ["analytics-cro", "lead-generation", "seo", "digital-marketing"],
    content: {
      en: {
        title: "Google Ads Management",
        metaTitle: "Google Ads Management & PPC Campaigns",
        metaDescription:
          "Google Ads setup, audits and ongoing management: search, Performance Max, YouTube and remarketing campaigns built around conversions, not clicks.",
        summary: "Search, Performance Max, YouTube and remarketing campaigns built around qualified conversions rather than clicks.",
        intro:
          "Google Ads can put your business in front of people at the moment they search for what you sell. It can also spend money quickly on irrelevant searches. We plan, build and manage campaigns with clean account structure, accurate conversion tracking and disciplined search-term management, so spend goes towards enquiries and sales you can measure.",
        signals: [
          "Your cost per lead keeps rising and nobody can explain why.",
          "Conversions are not tracked, or are counted twice.",
          "Campaigns were set up years ago and run on autopilot.",
          "You want to test paid search before committing a bigger budget.",
        ],
        includes: [
          { title: "Account audit", text: "Structure, tracking, bidding, search terms, ads and landing page review." },
          { title: "Campaign build", text: "Keyword research, match types, negatives, ad copy and extensions." },
          { title: "Conversion tracking", text: "Google tag and GA4 setup with clear primary and secondary conversions." },
          { title: "Optimisation", text: "Regular search-term reviews, bid strategy tuning and ad testing." },
        ],
        deliverables: [
          "Audit report with prioritised fixes",
          "Campaign and keyword structure",
          "Ad copy variations for testing",
          "Conversion tracking documentation",
          "Monthly performance summary with next actions",
        ],
        note: "Ad spend is paid directly to Google and is separate from management fees. We never change budgets or launch campaigns without your approval.",
        faqs: [
          {
            q: "How much should I spend on Google Ads?",
            a: "It depends on how competitive your keywords are and what a customer is worth to you. We estimate costs from keyword data before launch and usually recommend a test budget that can produce enough data to make decisions.",
          },
          {
            q: "Will I own the Google Ads account?",
            a: "Yes. The account should be in your name with your billing. We work through manager access that you can remove at any time.",
          },
          {
            q: "What is Performance Max and do I need it?",
            a: "Performance Max is a campaign type that uses Google's automation across Search, YouTube, Display and other placements. It can work well with good conversion data, but it is not always the right starting point. We decide case by case.",
          },
        ],
      },
      ar: {
        title: "إدارة إعلانات جوجل",
        metaTitle: "إدارة إعلانات جوجل وحملات الدفع لكل نقرة",
        metaDescription:
          "إعداد ومراجعة وإدارة مستمرة لإعلانات جوجل: حملات البحث وPerformance Max ويوتيوب وإعادة الاستهداف مبنية على التحويلات لا النقرات.",
        summary: "حملات بحث وPerformance Max ويوتيوب وإعادة استهداف مبنية على تحويلات مؤهلة بدلاً من مجرد نقرات.",
        intro:
          "تضع إعلانات جوجل عملك أمام الناس في لحظة بحثهم عما تبيعه، لكنها قد تستهلك المال بسرعة على عمليات بحث غير ذات صلة. نخطط الحملات ونبنيها وندِيرها بهيكل حساب واضح وتتبع دقيق للتحويلات وإدارة منضبطة لعبارات البحث، حتى يذهب الإنفاق نحو طلبات ومبيعات يمكن قياسها.",
        signals: [
          "تكلفة العميل المحتمل ترتفع ولا أحد يفسر السبب.",
          "التحويلات غير متتبعة أو تُحسب مرتين.",
          "أُعدت الحملات منذ سنوات وتعمل دون متابعة.",
          "تريد تجربة إعلانات البحث قبل الالتزام بميزانية أكبر.",
        ],
        includes: [
          { title: "مراجعة الحساب", text: "مراجعة الهيكل والتتبع والمزايدة وعبارات البحث والإعلانات وصفحات الهبوط." },
          { title: "بناء الحملات", text: "بحث الكلمات المفتاحية وأنواع المطابقة والكلمات السلبية ونصوص الإعلانات والإضافات." },
          { title: "تتبع التحويلات", text: "إعداد وسم جوجل وGA4 مع تحويلات أساسية وثانوية واضحة." },
          { title: "التحسين", text: "مراجعة دورية لعبارات البحث وضبط استراتيجية المزايدة واختبار الإعلانات." },
        ],
        deliverables: [
          "تقرير مراجعة بإصلاحات مرتبة حسب الأولوية",
          "هيكل الحملات والكلمات المفتاحية",
          "نسخ إعلانية متعددة للاختبار",
          "توثيق تتبع التحويلات",
          "ملخص أداء شهري مع الخطوات التالية",
        ],
        note: "تُدفع الميزانية الإعلانية مباشرة إلى جوجل وهي منفصلة عن رسوم الإدارة. لا نغير الميزانيات أو نطلق حملات دون موافقتك.",
        faqs: [
          {
            q: "كم يجب أن أنفق على إعلانات جوجل؟",
            a: "يعتمد ذلك على تنافسية كلماتك المفتاحية وقيمة العميل بالنسبة لك. نقدّر التكاليف من بيانات الكلمات قبل الإطلاق ونوصي عادةً بميزانية تجريبية تكفي لاتخاذ قرارات.",
          },
          {
            q: "هل سأملك حساب إعلانات جوجل؟",
            a: "نعم. يجب أن يكون الحساب باسمك وبوسيلة دفعك، ونعمل من خلال صلاحية مدير يمكنك إزالتها في أي وقت.",
          },
          {
            q: "ما هي حملات Performance Max وهل أحتاجها؟",
            a: "هي نوع حملات يعتمد على أتمتة جوجل عبر البحث ويوتيوب والشبكة الإعلانية وغيرها. قد تعمل جيداً مع بيانات تحويل جيدة، لكنها ليست دائماً نقطة البداية المناسبة، ونقرر ذلك حسب كل حالة.",
          },
        ],
      },
    },
  },
  {
    slug: "meta-ads",
    category: "growth",
    related: ["social-media", "graphic-design", "video-production", "lead-generation"],
    content: {
      en: {
        title: "Meta Ads (Facebook & Instagram)",
        metaTitle: "Meta Ads Management for Facebook & Instagram",
        metaDescription:
          "Facebook and Instagram advertising: audience strategy, creative testing, pixel and Conversions API setup, and campaigns optimised for leads and sales.",
        summary: "Facebook and Instagram campaigns with structured creative testing and reliable tracking.",
        intro:
          "Meta's platforms reach people before they start searching, which makes them strong for demand creation, product launches and lead generation. Performance depends heavily on creative and tracking quality. We combine audience strategy, systematic creative testing and properly configured tracking so you can see which ads lead to real business.",
        signals: [
          "Your boosted posts get likes but no enquiries.",
          "Ad performance drops quickly after launch.",
          "Tracking broke after browser privacy changes and nobody fixed it.",
          "You need a steady flow of leads for a sales team.",
        ],
        includes: [
          { title: "Tracking setup", text: "Meta Pixel and Conversions API configuration with event verification." },
          { title: "Audience strategy", text: "Prospecting, lookalike and retargeting structure suited to your funnel." },
          { title: "Creative testing", text: "Hooks, formats and messages tested in a structured way." },
          { title: "Lead form workflows", text: "Instant forms with qualifying questions and CRM hand-off when available." },
        ],
        deliverables: [
          "Campaign architecture and testing plan",
          "Creative briefs and ad copy",
          "Tracking verification checklist",
          "Monthly report with creative learnings",
        ],
        note: "Meta's ad policies and reporting change often. We report what the platform and your own data show, and flag where numbers are modelled or estimated.",
        faqs: [
          {
            q: "Are Facebook ads still worth it?",
            a: "For many consumer and B2B offers, yes, especially when you have strong creative and a clear offer. They are less suitable when your audience is very small or rarely uses Meta platforms.",
          },
          {
            q: "Do you create the ad creative?",
            a: "We write copy and briefs, and our design and video team can produce static, carousel and short video assets as part of the engagement.",
          },
        ],
      },
      ar: {
        title: "إعلانات ميتا (فيسبوك وإنستغرام)",
        metaTitle: "إدارة إعلانات ميتا على فيسبوك وإنستغرام",
        metaDescription:
          "إعلانات فيسبوك وإنستغرام: استراتيجية الجمهور واختبار التصاميم وإعداد البكسل وواجهة التحويلات، وحملات محسنة للعملاء المحتملين والمبيعات.",
        summary: "حملات فيسبوك وإنستغرام مع اختبار منهجي للتصاميم وتتبع موثوق.",
        intro:
          "تصل منصات ميتا إلى الناس قبل أن يبدؤوا البحث، ما يجعلها قوية لصناعة الطلب وإطلاق المنتجات وجذب العملاء المحتملين. يعتمد الأداء كثيراً على جودة التصميم والتتبع، لذلك نجمع بين استراتيجية الجمهور والاختبار المنهجي للتصاميم والتتبع المضبوط حتى ترى أي الإعلانات تؤدي إلى أعمال حقيقية.",
        signals: [
          "منشوراتك المروّجة تحصد إعجابات دون استفسارات.",
          "ينخفض أداء الإعلانات بسرعة بعد الإطلاق.",
          "تعطل التتبع بعد تغييرات الخصوصية في المتصفحات ولم يُصلح.",
          "تحتاج إلى تدفق ثابت من العملاء المحتملين لفريق المبيعات.",
        ],
        includes: [
          { title: "إعداد التتبع", text: "ضبط بكسل ميتا وواجهة التحويلات مع التحقق من الأحداث." },
          { title: "استراتيجية الجمهور", text: "هيكل للاستهداف الجديد والجماهير المشابهة وإعادة الاستهداف بما يناسب مسار البيع." },
          { title: "اختبار التصاميم", text: "اختبار منظم للمقدمات والصيغ والرسائل." },
          { title: "نماذج العملاء المحتملين", text: "نماذج فورية بأسئلة تأهيل وربط بنظام إدارة العملاء عند توفره." },
        ],
        deliverables: [
          "هيكل الحملات وخطة الاختبار",
          "موجزات التصاميم ونصوص الإعلانات",
          "قائمة تحقق من التتبع",
          "تقرير شهري بما تعلمناه من التصاميم",
        ],
        note: "تتغير سياسات ميتا الإعلانية وتقاريرها باستمرار. نعرض ما تظهره المنصة وبياناتك الخاصة، ونوضح متى تكون الأرقام تقديرية.",
        faqs: [
          {
            q: "هل ما زالت إعلانات فيسبوك مجدية؟",
            a: "لكثير من العروض الاستهلاكية والموجهة للشركات نعم، خاصة مع تصاميم قوية وعرض واضح. وهي أقل ملاءمة عندما يكون جمهورك صغيراً جداً أو نادراً ما يستخدم منصات ميتا.",
          },
          {
            q: "هل تصممون الإعلانات؟",
            a: "نكتب النصوص والموجزات، ويمكن لفريق التصميم والفيديو إنتاج صور ثابتة ودوّارة ومقاطع فيديو قصيرة ضمن الخدمة.",
          },
        ],
      },
    },
  },
  {
    slug: "social-media",
    category: "growth",
    related: ["meta-ads", "content-marketing", "graphic-design", "personal-branding"],
    content: {
      en: {
        title: "Social Media Management",
        metaTitle: "Social Media Management & Strategy",
        metaDescription:
          "Social media strategy, content planning, design and community management for LinkedIn, Instagram, Facebook, TikTok and X, with approval before anything is posted.",
        summary: "Strategy, content planning, design and community management, with every post approved before it goes live.",
        intro:
          "Consistent, useful social content builds familiarity and trust long before someone is ready to buy. We help you choose the platforms that matter for your audience, define content themes, produce posts and manage the calendar. Nothing is published without your sign-off.",
        signals: [
          "Your accounts go quiet for weeks at a time.",
          "Posts look inconsistent and off-brand.",
          "You are unsure which platforms your customers actually use.",
          "Comments and messages go unanswered.",
        ],
        includes: [
          { title: "Platform strategy", text: "Which platforms to prioritise and what role each one plays." },
          { title: "Content pillars and calendar", text: "Recurring themes and a monthly plan aligned with campaigns." },
          { title: "Post production", text: "Copywriting, graphics and short-form video coordination." },
          { title: "Community management", text: "Agreed response guidelines for comments and messages." },
        ],
        deliverables: [
          "Social media strategy document",
          "Monthly content calendar for approval",
          "Designed posts and captions",
          "Monthly insights summary",
        ],
        faqs: [
          {
            q: "How often should we post?",
            a: "Consistency matters more than volume. For most businesses, two to four quality posts per week on the main platform is a sustainable starting point.",
          },
          {
            q: "Will you post without asking us?",
            a: "No. Content is shared for approval first. Our process requires an explicit approval before anything is published.",
          },
        ],
      },
      ar: {
        title: "إدارة وسائل التواصل الاجتماعي",
        metaTitle: "إدارة واستراتيجية وسائل التواصل الاجتماعي",
        metaDescription:
          "استراتيجية وتخطيط محتوى وتصميم وإدارة مجتمع لمنصات لينكدإن وإنستغرام وفيسبوك وتيك توك وإكس، مع موافقتك قبل نشر أي شيء.",
        summary: "استراتيجية وتخطيط محتوى وتصميم وإدارة مجتمع، مع موافقتك على كل منشور قبل نشره.",
        intro:
          "المحتوى المفيد والمنتظم على وسائل التواصل يبني الألفة والثقة قبل أن يكون العميل مستعداً للشراء بوقت طويل. نساعدك في اختيار المنصات المهمة لجمهورك وتحديد محاور المحتوى وإنتاج المنشورات وإدارة التقويم، ولا يُنشر شيء دون موافقتك.",
        signals: [
          "حساباتك تتوقف عن النشر لأسابيع.",
          "المنشورات غير متناسقة ولا تعكس هويتك.",
          "لست متأكداً من المنصات التي يستخدمها عملاؤك فعلاً.",
          "التعليقات والرسائل تبقى دون رد.",
        ],
        includes: [
          { title: "استراتيجية المنصات", text: "أي المنصات نعطيها الأولوية وما دور كل منها." },
          { title: "محاور المحتوى والتقويم", text: "موضوعات متكررة وخطة شهرية متوافقة مع الحملات." },
          { title: "إنتاج المنشورات", text: "كتابة النصوص والتصاميم وتنسيق مقاطع الفيديو القصيرة." },
          { title: "إدارة المجتمع", text: "إرشادات متفق عليها للرد على التعليقات والرسائل." },
        ],
        deliverables: [
          "وثيقة استراتيجية وسائل التواصل",
          "تقويم محتوى شهري للموافقة",
          "منشورات مصممة مع نصوصها",
          "ملخص شهري للمؤشرات",
        ],
        faqs: [
          {
            q: "كم مرة يجب أن ننشر؟",
            a: "الانتظام أهم من الكمية. لمعظم الشركات، يعد نشر منشورين إلى أربعة منشورات جيدة أسبوعياً على المنصة الرئيسية بداية قابلة للاستمرار.",
          },
          {
            q: "هل ستنشرون دون الرجوع إلينا؟",
            a: "لا. يُرسل المحتوى للموافقة أولاً، وتتطلب آلية عملنا موافقة صريحة قبل نشر أي شيء.",
          },
        ],
      },
    },
  },
  {
    slug: "email-marketing",
    category: "growth",
    related: ["content-marketing", "lead-generation", "analytics-cro", "automation-ai-agents"],
    content: {
      en: {
        title: "Email Marketing & Automation",
        metaTitle: "Email Marketing, Newsletters & Automation",
        metaDescription:
          "Email strategy, welcome and nurture sequences, newsletters and deliverability setup (SPF, DKIM, DMARC) that turn subscribers and leads into customers.",
        summary: "Welcome sequences, nurture flows and newsletters, with the technical setup that keeps email out of spam.",
        intro:
          "Email remains one of the few channels you fully own. Done well, it nurtures leads who are not ready to buy yet and keeps existing customers engaged. We plan sequences around your sales cycle, write the emails, set up automation in your platform and make sure authentication is configured so messages reach the inbox.",
        signals: [
          "You collect email addresses but rarely send anything.",
          "New leads receive no follow-up after the first contact.",
          "Open rates dropped suddenly or emails land in spam.",
          "Every campaign is written from scratch at the last minute.",
        ],
        includes: [
          { title: "Deliverability setup", text: "SPF, DKIM and DMARC checks and list hygiene recommendations." },
          { title: "Automated sequences", text: "Welcome, lead nurture, onboarding and re-engagement flows." },
          { title: "Newsletters and campaigns", text: "Planning, copywriting and template design." },
          { title: "Consent and compliance", text: "Opt-in, unsubscribe and data-handling practices aligned with applicable rules." },
        ],
        deliverables: [
          "Email strategy and sequence map",
          "Written and designed email templates",
          "Automation configured in your platform",
          "Deliverability checklist and results",
        ],
        note: "We only email people who have given appropriate consent. We do not buy or rent email lists.",
        faqs: [
          {
            q: "Which email platform should we use?",
            a: "It depends on your size, budget and integrations. We commonly work with tools such as Mailchimp, Brevo, HubSpot and Klaviyo, and will recommend one based on your needs rather than a fixed preference.",
          },
          {
            q: "Can you send cold emails for us?",
            a: "We focus on permission-based email. Any outreach to new contacts must follow the rules of the countries involved and is always reviewed and approved by you first.",
          },
        ],
      },
      ar: {
        title: "التسويق عبر البريد الإلكتروني والأتمتة",
        metaTitle: "التسويق بالبريد الإلكتروني والنشرات والأتمتة",
        metaDescription:
          "استراتيجية بريد إلكتروني وسلاسل ترحيب ورعاية ونشرات دورية وإعداد التسليم (SPF وDKIM وDMARC) لتحويل المشتركين إلى عملاء.",
        summary: "سلاسل ترحيب ورعاية ونشرات دورية مع الإعداد التقني الذي يبعد رسائلك عن البريد المزعج.",
        intro:
          "يبقى البريد الإلكتروني من القنوات القليلة التي تملكها بالكامل. عند تنفيذه جيداً يرعى العملاء المحتملين غير المستعدين للشراء بعد، ويحافظ على تفاعل العملاء الحاليين. نخطط السلاسل وفق دورة مبيعاتك ونكتب الرسائل ونعد الأتمتة في منصتك ونتأكد من ضبط المصادقة لتصل الرسائل إلى صندوق الوارد.",
        signals: [
          "تجمع عناوين بريد لكنك نادراً ما ترسل شيئاً.",
          "لا يتلقى العملاء الجدد أي متابعة بعد التواصل الأول.",
          "انخفضت معدلات الفتح فجأة أو تصل الرسائل إلى البريد المزعج.",
          "تُكتب كل حملة من الصفر في اللحظة الأخيرة.",
        ],
        includes: [
          { title: "إعداد التسليم", text: "فحص SPF وDKIM وDMARC وتوصيات تنظيف القوائم." },
          { title: "سلاسل مؤتمتة", text: "رسائل ترحيب ورعاية وتهيئة وإعادة تفاعل." },
          { title: "النشرات والحملات", text: "التخطيط وكتابة المحتوى وتصميم القوالب." },
          { title: "الموافقة والامتثال", text: "ممارسات الاشتراك وإلغاء الاشتراك والتعامل مع البيانات وفق القواعد المعمول بها." },
        ],
        deliverables: [
          "استراتيجية البريد وخريطة السلاسل",
          "قوالب رسائل مكتوبة ومصممة",
          "أتمتة معدّة في منصتك",
          "قائمة تحقق التسليم ونتائجها",
        ],
        note: "نراسل فقط من أعطوا موافقة مناسبة، ولا نشتري قوائم بريدية أو نستأجرها.",
        faqs: [
          {
            q: "أي منصة بريد إلكتروني يجب أن نستخدم؟",
            a: "يعتمد ذلك على حجمك وميزانيتك والتكاملات المطلوبة. نعمل عادةً مع أدوات مثل Mailchimp وBrevo وHubSpot وKlaviyo، ونوصي بإحداها وفق احتياجك لا وفق تفضيل ثابت.",
          },
          {
            q: "هل يمكنكم إرسال رسائل لجهات لا تعرفنا؟",
            a: "نركز على البريد المبني على الإذن. أي تواصل مع جهات جديدة يجب أن يتبع قواعد الدول المعنية، ويُراجع ويُعتمد منك أولاً دائماً.",
          },
        ],
      },
    },
  },
  {
    slug: "lead-generation",
    category: "growth",
    related: ["google-ads", "meta-ads", "analytics-cro", "erp-crm"],
    content: {
      en: {
        title: "Lead Generation",
        metaTitle: "B2B & B2C Lead Generation Services",
        metaDescription:
          "Lead generation systems that combine targeting, landing pages, offers, qualification and CRM follow-up to deliver enquiries your sales team can work with.",
        summary: "Targeting, offers, landing pages and qualification working together so sales receives enquiries worth following up.",
        intro:
          "Lead generation is more than collecting form submissions. A useful system attracts the right people, explains your offer clearly, asks the right qualifying questions and hands leads to sales quickly. We design that whole path and measure it from first click to qualified opportunity.",
        signals: [
          "Your sales team complains about lead quality.",
          "Leads wait days before anyone responds.",
          "You rely entirely on referrals and want a second source.",
          "Your landing pages ask for too much or too little information.",
        ],
        includes: [
          { title: "Offer and funnel design", text: "Lead magnets, consultations or quotes matched to buying intent." },
          { title: "Landing pages", text: "Focused pages with clear messaging and qualifying forms." },
          { title: "Qualification rules", text: "Criteria and scoring agreed with your sales team." },
          { title: "Follow-up workflow", text: "Notifications, CRM entry and nurture sequences." },
        ],
        deliverables: [
          "Lead funnel map",
          "Landing page copy and design",
          "Qualification and scoring criteria",
          "Lead reporting from source to outcome",
        ],
        note: "We do not sell lead lists or scrape personal data. Leads come from permitted channels and people who chose to contact you.",
        faqs: [
          {
            q: "Do you guarantee a number of leads?",
            a: "No. Lead volume depends on budget, market, offer and seasonality. We forecast ranges from available data and report actual results transparently.",
          },
          {
            q: "Can you connect leads to our CRM?",
            a: "Yes, where your CRM supports it. We commonly connect forms to CRMs through native integrations or automation tools.",
          },
        ],
      },
      ar: {
        title: "جذب العملاء المحتملين",
        metaTitle: "خدمات جذب العملاء المحتملين للشركات والأفراد",
        metaDescription:
          "أنظمة لجذب العملاء المحتملين تجمع الاستهداف وصفحات الهبوط والعروض والتأهيل والمتابعة في نظام إدارة العملاء لتقديم طلبات يمكن لفريق المبيعات العمل عليها.",
        summary: "استهداف وعروض وصفحات هبوط وتأهيل تعمل معاً ليصل إلى فريق المبيعات طلبات تستحق المتابعة.",
        intro:
          "جذب العملاء المحتملين أكثر من جمع النماذج. النظام المفيد يجذب الأشخاص المناسبين ويشرح عرضك بوضوح ويطرح أسئلة التأهيل الصحيحة ويسلّم الطلبات للمبيعات بسرعة. نصمم هذا المسار كاملاً ونقيسه من أول نقرة حتى الفرصة المؤهلة.",
        signals: [
          "فريق المبيعات يشتكي من جودة العملاء المحتملين.",
          "تنتظر الطلبات أياماً قبل أن يرد أحد.",
          "تعتمد بالكامل على التوصيات وتريد مصدراً آخر.",
          "صفحات الهبوط تطلب معلومات أكثر أو أقل من اللازم.",
        ],
        includes: [
          { title: "تصميم العرض والمسار", text: "محتوى مجاني أو استشارات أو عروض أسعار تناسب نية الشراء." },
          { title: "صفحات الهبوط", text: "صفحات مركزة برسائل واضحة ونماذج تأهيل." },
          { title: "قواعد التأهيل", text: "معايير وتقييم متفق عليها مع فريق المبيعات." },
          { title: "مسار المتابعة", text: "إشعارات وإدخال في نظام إدارة العملاء وسلاسل رعاية." },
        ],
        deliverables: [
          "خريطة مسار العملاء المحتملين",
          "نصوص وتصميم صفحات الهبوط",
          "معايير التأهيل والتقييم",
          "تقارير العملاء المحتملين من المصدر إلى النتيجة",
        ],
        note: "لا نبيع قوائم عملاء ولا نجمع بيانات شخصية بطرق غير مصرح بها. يأتي العملاء من قنوات مسموح بها وأشخاص اختاروا التواصل معك.",
        faqs: [
          {
            q: "هل تضمنون عدداً معيناً من العملاء المحتملين؟",
            a: "لا. يعتمد العدد على الميزانية والسوق والعرض والموسم. نتوقع نطاقات من البيانات المتاحة ونعرض النتائج الفعلية بشفافية.",
          },
          {
            q: "هل يمكن ربط الطلبات بنظام إدارة العملاء لدينا؟",
            a: "نعم إذا كان نظامك يدعم ذلك. نربط النماذج عادةً عبر تكاملات مباشرة أو أدوات أتمتة.",
          },
        ],
      },
    },
  },
  {
    slug: "analytics-cro",
    category: "growth",
    related: ["google-ads", "web-development", "lead-generation", "digital-marketing"],
    content: {
      en: {
        title: "Analytics & Conversion Optimisation",
        metaTitle: "Analytics, GA4 & Conversion Rate Optimisation",
        metaDescription:
          "GA4 and tag setup, privacy-conscious tracking, dashboards and conversion rate optimisation that improve how many visitors become enquiries or customers.",
        summary: "Trustworthy tracking, clear dashboards and structured experiments that turn more visitors into customers.",
        intro:
          "Marketing decisions are only as good as the data behind them. We set up analytics that you can trust, with consent-aware tracking and clearly defined conversions, then use that data to find where visitors drop off and test improvements to pages, forms and offers.",
        signals: [
          "Your analytics numbers do not match your sales or CRM.",
          "You moved to GA4 but nobody configured it properly.",
          "Traffic is steady but enquiries are not growing.",
          "Website changes are made on opinion rather than evidence.",
        ],
        includes: [
          { title: "Tracking audit and setup", text: "GA4, tag manager, events and conversion definitions." },
          { title: "Consent-aware measurement", text: "Analytics configured to respect visitor consent choices." },
          { title: "Dashboards", text: "Reports focused on the few metrics that drive decisions." },
          { title: "Conversion experiments", text: "Hypotheses, page changes and A/B tests where traffic allows." },
        ],
        deliverables: [
          "Measurement plan and event specification",
          "Configured analytics and dashboards",
          "Conversion audit with prioritised recommendations",
          "Experiment log with results",
        ],
        note: "Reliable A/B tests need enough traffic. On lower-traffic sites we use qualitative research and best-practice fixes instead of claiming statistical results.",
        faqs: [
          {
            q: "What is conversion rate optimisation?",
            a: "It is the process of improving a website or landing page so a larger share of visitors take a desired action, such as sending an enquiry. It relies on data, user research and testing rather than guesswork.",
          },
          {
            q: "Do we need a cookie banner for analytics?",
            a: "It depends on where your visitors are and how analytics is configured. Many regions require consent for non-essential tracking. Your legal adviser should confirm the requirements for your business.",
          },
        ],
      },
      ar: {
        title: "التحليلات وتحسين معدل التحويل",
        metaTitle: "التحليلات وGA4 وتحسين معدل التحويل",
        metaDescription:
          "إعداد GA4 والوسوم وتتبع يحترم الخصوصية ولوحات معلومات وتحسين معدل التحويل لزيادة عدد الزوار الذين يصبحون عملاء.",
        summary: "تتبع موثوق ولوحات واضحة وتجارب منظمة تحول عدداً أكبر من الزوار إلى عملاء.",
        intro:
          "قرارات التسويق جيدة بقدر جودة البيانات التي تستند إليها. نعد تحليلات يمكنك الوثوق بها مع تتبع يراعي موافقة الزوار وتحويلات معرّفة بوضوح، ثم نستخدم هذه البيانات لمعرفة أين يغادر الزوار ونختبر تحسينات على الصفحات والنماذج والعروض.",
        signals: [
          "أرقام التحليلات لا تطابق المبيعات أو نظام إدارة العملاء.",
          "انتقلت إلى GA4 لكن أحداً لم يضبطه جيداً.",
          "الزيارات ثابتة لكن الطلبات لا تزيد.",
          "تُجرى تغييرات الموقع بناءً على الآراء لا الأدلة.",
        ],
        includes: [
          { title: "مراجعة التتبع وإعداده", text: "GA4 ومدير الوسوم والأحداث وتعريف التحويلات." },
          { title: "قياس يراعي الموافقة", text: "تحليلات مضبوطة لاحترام اختيارات الزوار." },
          { title: "لوحات المعلومات", text: "تقارير تركز على المؤشرات القليلة التي تقود القرارات." },
          { title: "تجارب التحويل", text: "فرضيات وتعديلات على الصفحات واختبارات A/B عندما تسمح الزيارات." },
        ],
        deliverables: [
          "خطة القياس ومواصفات الأحداث",
          "تحليلات ولوحات معلومات مُعدة",
          "مراجعة التحويل مع توصيات مرتبة",
          "سجل التجارب ونتائجها",
        ],
        note: "تحتاج اختبارات A/B الموثوقة إلى زيارات كافية. في المواقع ذات الزيارات المحدودة نستخدم البحث النوعي وأفضل الممارسات بدلاً من ادعاء نتائج إحصائية.",
        faqs: [
          {
            q: "ما هو تحسين معدل التحويل؟",
            a: "هو تحسين الموقع أو صفحة الهبوط بحيث تقوم نسبة أكبر من الزوار بالإجراء المطلوب مثل إرسال طلب. يعتمد على البيانات وأبحاث المستخدمين والاختبار لا على التخمين.",
          },
          {
            q: "هل نحتاج إلى شريط موافقة على ملفات تعريف الارتباط؟",
            a: "يعتمد ذلك على مواقع زوارك وطريقة إعداد التحليلات، فكثير من المناطق تشترط الموافقة على التتبع غير الضروري. يجب أن يؤكد مستشارك القانوني المتطلبات الخاصة بعملك.",
          },
        ],
      },
    },
  },
];
