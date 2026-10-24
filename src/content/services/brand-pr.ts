import type { Service } from "./schema";

/** Brand, creative and PR services. Arabic copy is a first draft and needs native review. */
export const brandServices: Service[] = [
  {
    slug: "branding",
    category: "brand",
    related: ["graphic-design", "personal-branding", "web-development", "ui-ux-3d"],
    content: {
      en: {
        title: "Brand Strategy & Identity",
        metaTitle: "Brand Strategy, Identity & Logo Design",
        metaDescription:
          "Brand positioning, messaging, logo and visual identity systems that make your business recognisable, credible and consistent across every channel.",
        summary: "Positioning, messaging and a visual identity system that makes your business recognisable and credible.",
        intro:
          "A brand is how people remember and describe your business. Strong branding starts with clear positioning: who you serve, what makes you different and how you speak. We turn that into a practical identity system, including logo, colours, typography and guidelines, so every touchpoint feels consistent whether your team or a partner creates it.",
        signals: [
          "Your business has outgrown its original logo and look.",
          "Different materials look like they come from different companies.",
          "You struggle to explain what makes you different.",
          "You are moving from freelancing or a startup to a more established company.",
        ],
        includes: [
          { title: "Positioning workshop", text: "Audience, competitors, value proposition and brand personality." },
          { title: "Messaging", text: "Tagline options, key messages and tone of voice." },
          { title: "Visual identity", text: "Logo suite, colour palette, typography and graphic elements." },
          { title: "Brand guidelines", text: "A practical guide with usage rules and examples." },
        ],
        deliverables: [
          "Brand positioning summary",
          "Logo files in standard formats",
          "Colour, typography and visual element system",
          "Brand guidelines document",
          "Key templates such as social posts or presentations",
        ],
        faqs: [
          {
            q: "How long does a brand identity project take?",
            a: "A focused identity project typically takes several weeks, depending on research depth, the number of concepts and how quickly feedback is given.",
          },
          {
            q: "Will we own the logo and brand assets?",
            a: "Yes. On final payment, ownership of the delivered brand assets transfers to you, subject to licences for any third-party fonts or stock elements, which we document.",
          },
        ],
      },
      ar: {
        title: "استراتيجية العلامة التجارية والهوية",
        metaTitle: "استراتيجية العلامة والهوية البصرية وتصميم الشعار",
        metaDescription:
          "تموضع العلامة والرسائل والشعار وأنظمة الهوية البصرية التي تجعل عملك مميزاً وموثوقاً ومتسقاً عبر كل القنوات.",
        summary: "تموضع ورسائل ونظام هوية بصرية يجعل عملك مميزاً وموثوقاً.",
        intro:
          "العلامة التجارية هي الطريقة التي يتذكر بها الناس عملك ويصفونه. تبدأ العلامة القوية بتموضع واضح: من تخدم، وما الذي يميزك، وكيف تتحدث. نحول ذلك إلى نظام هوية عملي يشمل الشعار والألوان والخطوط والإرشادات، لتبدو كل نقطة تواصل متسقة سواء أنشأها فريقك أو شريك خارجي.",
        signals: [
          "تجاوز عملك شعاره ومظهره الأصلي.",
          "تبدو موادك المختلفة وكأنها من شركات مختلفة.",
          "تجد صعوبة في شرح ما يميزك.",
          "تنتقل من العمل الحر أو الشركة الناشئة إلى شركة أكثر رسوخاً.",
        ],
        includes: [
          { title: "ورشة التموضع", text: "الجمهور والمنافسون والقيمة المقدمة وشخصية العلامة." },
          { title: "الرسائل", text: "خيارات الشعار اللفظي والرسائل الأساسية ونبرة الصوت." },
          { title: "الهوية البصرية", text: "مجموعة الشعار والألوان والخطوط والعناصر الرسومية." },
          { title: "دليل العلامة", text: "دليل عملي بقواعد الاستخدام وأمثلة." },
        ],
        deliverables: [
          "ملخص تموضع العلامة",
          "ملفات الشعار بالصيغ القياسية",
          "نظام الألوان والخطوط والعناصر البصرية",
          "دليل العلامة التجارية",
          "قوالب أساسية مثل منشورات التواصل أو العروض التقديمية",
        ],
        faqs: [
          {
            q: "كم يستغرق مشروع الهوية البصرية؟",
            a: "يستغرق مشروع الهوية المركز عادةً عدة أسابيع، حسب عمق البحث وعدد المفاهيم وسرعة الملاحظات.",
          },
          {
            q: "هل سنملك الشعار وأصول العلامة؟",
            a: "نعم. عند السداد النهائي تنتقل إليك ملكية الأصول المسلمة، مع مراعاة تراخيص أي خطوط أو عناصر من أطراف ثالثة، ونوثق ذلك.",
          },
        ],
      },
    },
  },
  {
    slug: "graphic-design",
    category: "brand",
    related: ["branding", "social-media", "meta-ads", "video-production"],
    content: {
      en: {
        title: "Graphic Design",
        metaTitle: "Graphic Design for Marketing, Social & Print",
        metaDescription:
          "On-brand graphic design for social media, adverts, presentations, brochures, infographics and print, delivered in the formats your team needs.",
        summary: "On-brand design for social media, adverts, presentations, brochures and print.",
        intro:
          "Design shapes first impressions and makes information easier to understand. We produce marketing and business materials that follow your brand system, are built for their channel and are delivered in editable formats where useful, so your team can reuse them.",
        signals: [
          "You need regular design support but not a full-time designer.",
          "Your sales materials look dated next to competitors.",
          "Ad creative is produced in a rush and performs poorly.",
          "Complex information needs to be explained visually.",
        ],
        includes: [
          { title: "Marketing creative", text: "Social posts, ad sets, banners and email graphics." },
          { title: "Business documents", text: "Pitch decks, proposals, company profiles and reports." },
          { title: "Print", text: "Brochures, flyers, signage and event materials prepared for print." },
          { title: "Infographics", text: "Data and processes turned into clear visuals." },
        ],
        deliverables: [
          "Final design files in agreed formats",
          "Editable source or template files where agreed",
          "Export sizes for each channel",
        ],
        faqs: [
          {
            q: "Can you work with our existing brand guidelines?",
            a: "Yes. We follow your existing guidelines and will flag any gaps we find while working.",
          },
          {
            q: "How many revisions are included?",
            a: "Revision rounds are agreed in each proposal. Clear feedback early in the process usually keeps revisions quick.",
          },
        ],
      },
      ar: {
        title: "التصميم الجرافيكي",
        metaTitle: "تصميم جرافيكي للتسويق ووسائل التواصل والطباعة",
        metaDescription:
          "تصميم جرافيكي متوافق مع هويتك لوسائل التواصل والإعلانات والعروض التقديمية والكتيبات والإنفوجرافيك والطباعة، بالصيغ التي يحتاجها فريقك.",
        summary: "تصاميم متوافقة مع هويتك لوسائل التواصل والإعلانات والعروض والكتيبات والطباعة.",
        intro:
          "يشكل التصميم الانطباع الأول ويجعل المعلومات أسهل فهماً. ننتج مواد تسويقية وتجارية تتبع نظام علامتك وتناسب قناتها، ونسلمها بصيغ قابلة للتعديل عند الحاجة ليعيد فريقك استخدامها.",
        signals: [
          "تحتاج دعم تصميم منتظماً دون مصمم بدوام كامل.",
          "موادك البيعية تبدو قديمة مقارنة بالمنافسين.",
          "تُنتج تصاميم الإعلانات على عجل ويكون أداؤها ضعيفاً.",
          "تحتاج إلى شرح معلومات معقدة بصرياً.",
        ],
        includes: [
          { title: "تصاميم تسويقية", text: "منشورات تواصل ومجموعات إعلانية ولافتات رقمية وصور بريد." },
          { title: "مستندات الأعمال", text: "عروض تقديمية ومقترحات وملفات تعريفية وتقارير." },
          { title: "المطبوعات", text: "كتيبات ومنشورات ولافتات ومواد فعاليات جاهزة للطباعة." },
          { title: "الإنفوجرافيك", text: "تحويل البيانات والعمليات إلى رسومات واضحة." },
        ],
        deliverables: [
          "ملفات التصميم النهائية بالصيغ المتفق عليها",
          "ملفات مصدرية أو قوالب قابلة للتعديل عند الاتفاق",
          "مقاسات تصدير لكل قناة",
        ],
        faqs: [
          {
            q: "هل يمكنكم العمل وفق دليل علامتنا الحالي؟",
            a: "نعم. نتبع دليلك الحالي وننبهك إلى أي نقص نلاحظه أثناء العمل.",
          },
          {
            q: "كم عدد التعديلات المشمولة؟",
            a: "تُحدد جولات التعديل في كل مقترح، والملاحظات الواضحة في البداية تجعل التعديلات سريعة عادةً.",
          },
        ],
      },
    },
  },
  {
    slug: "video-production",
    category: "brand",
    related: ["social-media", "meta-ads", "branding", "public-relations"],
    content: {
      en: {
        title: "Video Production & Motion",
        metaTitle: "Video Production, Editing & Motion Graphics",
        metaDescription:
          "Short-form social video, explainer animations, product videos and editing, planned around a clear message and the platform where it will be watched.",
        summary: "Short-form social video, explainers, product videos and motion graphics planned around one clear message.",
        intro:
          "Video can explain an offer quickly and hold attention on crowded feeds. We plan each video around a single message and the platform it is made for, then handle scripting, editing, motion graphics and captions. Filming can be arranged with local partners or done by your team with our shot list.",
        signals: [
          "Your product or service is hard to explain in text.",
          "Social platforms favour video and you have very little.",
          "You have raw footage but no time to edit it.",
          "Ads need fresh creative more often than you can produce it.",
        ],
        includes: [
          { title: "Concept and script", text: "Message, structure, storyboard and shot list." },
          { title: "Editing", text: "Cutting, pacing, colour, sound and subtitles." },
          { title: "Motion graphics", text: "Animated explainers, titles and branded elements." },
          { title: "Platform versions", text: "Cut-downs and aspect ratios for each channel." },
        ],
        deliverables: [
          "Script and storyboard",
          "Final videos in required formats and ratios",
          "Captioned versions for silent viewing",
        ],
        faqs: [
          {
            q: "Do you film on location?",
            a: "Depending on your location, we can coordinate filming through vetted local partners or guide your team to capture footage for us to edit.",
          },
          {
            q: "How long should a social video be?",
            a: "Most short-form social videos work best when the key message lands in the first few seconds. Length depends on platform and purpose, so we plan it per video.",
          },
        ],
      },
      ar: {
        title: "إنتاج الفيديو والموشن جرافيك",
        metaTitle: "إنتاج الفيديو والمونتاج والموشن جرافيك",
        metaDescription:
          "فيديوهات قصيرة لوسائل التواصل ورسوم توضيحية متحركة وفيديوهات منتجات ومونتاج، مخططة حول رسالة واضحة والمنصة التي ستُشاهد عليها.",
        summary: "فيديوهات قصيرة ورسوم توضيحية وفيديوهات منتجات وموشن جرافيك مخططة حول رسالة واحدة واضحة.",
        intro:
          "يشرح الفيديو العرض بسرعة ويجذب الانتباه وسط المحتوى المزدحم. نخطط كل فيديو حول رسالة واحدة والمنصة المخصص لها، ثم نتولى كتابة النص والمونتاج والموشن جرافيك والترجمة النصية. يمكن ترتيب التصوير مع شركاء محليين أو يصوّر فريقك وفق قائمة لقطات نعدها.",
        signals: [
          "يصعب شرح منتجك أو خدمتك نصياً.",
          "تفضّل منصات التواصل الفيديو ولديك القليل منه.",
          "لديك لقطات خام ولا وقت لمونتاجها.",
          "تحتاج الإعلانات إلى تصاميم جديدة أسرع مما تستطيع إنتاجه.",
        ],
        includes: [
          { title: "الفكرة والنص", text: "الرسالة والهيكل واللوحة القصصية وقائمة اللقطات." },
          { title: "المونتاج", text: "القص والإيقاع والألوان والصوت والترجمة." },
          { title: "الموشن جرافيك", text: "شروحات متحركة وعناوين وعناصر بهوية العلامة." },
          { title: "نسخ للمنصات", text: "نسخ مختصرة ونسب عرض مناسبة لكل قناة." },
        ],
        deliverables: [
          "النص واللوحة القصصية",
          "الفيديوهات النهائية بالصيغ والنسب المطلوبة",
          "نسخ مترجمة نصياً للمشاهدة دون صوت",
        ],
        faqs: [
          {
            q: "هل تصورون في الموقع؟",
            a: "حسب موقعك، يمكننا تنسيق التصوير عبر شركاء محليين موثوقين أو توجيه فريقك لتصوير اللقطات ثم نتولى المونتاج.",
          },
          {
            q: "ما المدة المناسبة لفيديو التواصل الاجتماعي؟",
            a: "تعمل معظم الفيديوهات القصيرة بشكل أفضل عندما تصل الرسالة الأساسية في الثواني الأولى. تعتمد المدة على المنصة والهدف، لذلك نخططها لكل فيديو.",
          },
        ],
      },
    },
  },
];

export const prServices: Service[] = [
  {
    slug: "public-relations",
    category: "pr",
    related: ["reputation-management", "personal-branding", "content-marketing", "aeo-ai-search"],
    content: {
      en: {
        title: "Public Relations",
        metaTitle: "Public Relations & Digital PR Services",
        metaDescription:
          "Media relations, press releases, thought leadership and digital PR that build credibility, earn coverage and strengthen your reputation with the people who matter.",
        summary: "Media relations, announcements and thought leadership that build credibility with customers, partners and press.",
        intro:
          "Public relations builds trust through what others say about you. We help shape your story, identify relevant publications and journalists, prepare announcements and expert commentary, and turn coverage into assets for your website and sales team. Digital PR also supports SEO and AEO by earning genuine references from reputable sources.",
        signals: [
          "You have news to share but nobody outside your network hears it.",
          "Prospects search for you and find little independent information.",
          "Your leadership team has expertise but no public profile.",
          "You are entering a new market and need credibility quickly.",
        ],
        includes: [
          { title: "Story and messaging", text: "Key narratives, proof points and spokesperson preparation." },
          { title: "Media relations", text: "Targeted media lists and personalised pitching." },
          { title: "Announcements", text: "Press releases, media kits and launch support." },
          { title: "Thought leadership", text: "Bylined articles, commentary and speaking opportunities." },
        ],
        deliverables: [
          "PR plan and messaging framework",
          "Media list for your sector and markets",
          "Press release and media kit",
          "Coverage report with links",
        ],
        note: "Editors decide what they publish. We never guarantee coverage or pay for editorial placement presented as independent news.",
        faqs: [
          {
            q: "What is digital PR?",
            a: "Digital PR uses online publications, data stories and expert commentary to earn mentions and links. It builds credibility and can support search visibility at the same time.",
          },
          {
            q: "Do you guarantee media coverage?",
            a: "No. We improve your chances with strong stories and relevant targeting, and we report honestly on what was achieved.",
          },
        ],
      },
      ar: {
        title: "العلاقات العامة",
        metaTitle: "خدمات العلاقات العامة والعلاقات العامة الرقمية",
        metaDescription:
          "علاقات إعلامية وبيانات صحفية وقيادة فكرية وعلاقات عامة رقمية تبني المصداقية وتكسب التغطية وتعزز سمعتك لدى الجهات المهمة.",
        summary: "علاقات إعلامية وإعلانات وقيادة فكرية تبني المصداقية لدى العملاء والشركاء والصحافة.",
        intro:
          "تبني العلاقات العامة الثقة من خلال ما يقوله الآخرون عنك. نساعدك في صياغة قصتك وتحديد المنشورات والصحفيين المعنيين وإعداد الإعلانات والتعليقات المتخصصة، وتحويل التغطية إلى أصول لموقعك وفريق مبيعاتك. كما تدعم العلاقات العامة الرقمية SEO وAEO بكسب إشارات حقيقية من مصادر موثوقة.",
        signals: [
          "لديك أخبار لكن لا أحد خارج شبكتك يسمع بها.",
          "يبحث العملاء المحتملون عنك فيجدون معلومات مستقلة قليلة.",
          "لدى فريق القيادة خبرة دون حضور عام.",
          "تدخل سوقاً جديدة وتحتاج إلى مصداقية سريعة.",
        ],
        includes: [
          { title: "القصة والرسائل", text: "السرديات الأساسية والأدلة الداعمة وتجهيز المتحدثين." },
          { title: "العلاقات الإعلامية", text: "قوائم إعلامية مستهدفة وعروض مخصصة للصحفيين." },
          { title: "الإعلانات", text: "بيانات صحفية وحقائب إعلامية ودعم الإطلاق." },
          { title: "القيادة الفكرية", text: "مقالات موقعة وتعليقات وفرص للتحدث." },
        ],
        deliverables: [
          "خطة العلاقات العامة وإطار الرسائل",
          "قائمة إعلامية لقطاعك وأسواقك",
          "بيان صحفي وحقيبة إعلامية",
          "تقرير التغطية مع الروابط",
        ],
        note: "المحررون هم من يقررون ما يُنشر. لا نضمن التغطية ولا ندفع مقابل محتوى مدفوع يُقدَّم كخبر مستقل.",
        faqs: [
          {
            q: "ما هي العلاقات العامة الرقمية؟",
            a: "تستخدم المنشورات الإلكترونية وقصص البيانات والتعليقات المتخصصة لكسب الإشارات والروابط، فتبني المصداقية وقد تدعم الظهور في البحث في الوقت نفسه.",
          },
          {
            q: "هل تضمنون التغطية الإعلامية؟",
            a: "لا. نزيد فرصك بقصص قوية واستهداف مناسب، ونعرض بصدق ما تحقق.",
          },
        ],
      },
    },
  },
  {
    slug: "personal-branding",
    category: "pr",
    related: ["public-relations", "social-media", "content-marketing", "branding"],
    content: {
      en: {
        title: "Personal Branding",
        metaTitle: "Personal Branding for Founders & Executives",
        metaDescription:
          "Personal branding for founders, executives and professionals: positioning, LinkedIn presence, content and speaking that build trusted visibility.",
        summary: "Positioning, LinkedIn presence and content that help founders and leaders become trusted voices in their field.",
        intro:
          "People often trust people before they trust companies. A clear personal brand helps founders, executives and consultants attract opportunities, partners and talent. We help define what you want to be known for, refine your profiles and build a sustainable content routine in your own voice.",
        signals: [
          "Your profile does not reflect your experience or current focus.",
          "You want to be invited to speak, write or advise.",
          "Your company brand depends heavily on your personal reputation.",
          "You know you should post but do not know what to say.",
        ],
        includes: [
          { title: "Positioning", text: "Expertise areas, audience and signature topics." },
          { title: "Profile optimisation", text: "LinkedIn and other relevant profiles, bios and photography guidance." },
          { title: "Content support", text: "Interview-based ghostwriting that keeps your voice and views." },
          { title: "Visibility opportunities", text: "Podcasts, panels and publications aligned with your goals." },
        ],
        deliverables: [
          "Personal brand positioning summary",
          "Updated profiles and bios",
          "Monthly content plan and drafts for approval",
        ],
        faqs: [
          {
            q: "Will posts be written in my voice?",
            a: "Yes. We work from interviews and your own opinions, and nothing is published without your approval.",
          },
          {
            q: "Is personal branding only for large company executives?",
            a: "No. It is valuable for consultants, freelancers moving to agency models, founders and specialists in any field.",
          },
        ],
      },
      ar: {
        title: "بناء العلامة الشخصية",
        metaTitle: "العلامة الشخصية للمؤسسين والتنفيذيين",
        metaDescription:
          "بناء العلامة الشخصية للمؤسسين والتنفيذيين والمهنيين: التموضع والحضور على لينكدإن والمحتوى والمشاركات العامة التي تبني ظهوراً موثوقاً.",
        summary: "تموضع وحضور على لينكدإن ومحتوى يساعد المؤسسين والقادة على أن يصبحوا أصواتاً موثوقة في مجالهم.",
        intro:
          "كثيراً ما يثق الناس بالأشخاص قبل الشركات. تساعد العلامة الشخصية الواضحة المؤسسين والتنفيذيين والمستشارين على جذب الفرص والشركاء والكفاءات. نساعدك في تحديد ما تريد أن تُعرف به، وتحسين حساباتك، وبناء روتين محتوى مستدام بصوتك أنت.",
        signals: [
          "حسابك لا يعكس خبرتك أو تركيزك الحالي.",
          "تريد أن تُدعى للتحدث أو الكتابة أو تقديم المشورة.",
          "علامة شركتك تعتمد كثيراً على سمعتك الشخصية.",
          "تعرف أنه يجب أن تنشر لكنك لا تعرف ماذا تقول.",
        ],
        includes: [
          { title: "التموضع", text: "مجالات الخبرة والجمهور والموضوعات المميزة." },
          { title: "تحسين الحسابات", text: "لينكدإن والحسابات الأخرى ذات الصلة والنبذات وإرشادات الصور." },
          { title: "دعم المحتوى", text: "كتابة بالنيابة عنك قائمة على المقابلات تحافظ على صوتك وآرائك." },
          { title: "فرص الظهور", text: "بودكاست وندوات ومنشورات تتوافق مع أهدافك." },
        ],
        deliverables: [
          "ملخص تموضع العلامة الشخصية",
          "حسابات ونبذات محدثة",
          "خطة محتوى شهرية ومسودات للموافقة",
        ],
        faqs: [
          {
            q: "هل ستُكتب المنشورات بصوتي؟",
            a: "نعم. نعمل من المقابلات وآرائك الخاصة، ولا يُنشر شيء دون موافقتك.",
          },
          {
            q: "هل العلامة الشخصية للتنفيذيين في الشركات الكبرى فقط؟",
            a: "لا. هي مفيدة للمستشارين والمستقلين المنتقلين إلى نموذج الوكالة والمؤسسين والمتخصصين في أي مجال.",
          },
        ],
      },
    },
  },
  {
    slug: "reputation-management",
    category: "pr",
    related: ["public-relations", "personal-branding", "seo", "social-media"],
    content: {
      en: {
        title: "Online Reputation Management",
        metaTitle: "Online Reputation Management & Review Strategy",
        metaDescription:
          "Monitor and improve how your business appears online: review strategy, response guidelines, search result improvements and issue preparedness.",
        summary: "Monitoring, review strategy and response planning that improve how your business appears online.",
        intro:
          "What people find when they search your name influences whether they contact you. Reputation management combines monitoring, encouraging genuine reviews from real customers, responding professionally to criticism and publishing accurate, positive information that deserves to rank. We also help you prepare for difficult moments before they happen.",
        signals: [
          "A few negative reviews dominate your profile.",
          "Search results for your name show outdated or inaccurate information.",
          "You have no process for responding to complaints online.",
          "You want to be prepared for a potential public issue.",
        ],
        includes: [
          { title: "Monitoring", text: "Reviews, mentions and search results for your brand." },
          { title: "Review strategy", text: "Ethical processes for asking real customers for feedback." },
          { title: "Response guidelines", text: "Templates and escalation rules for comments and reviews." },
          { title: "Issue preparedness", text: "Holding statements and a simple response plan." },
        ],
        deliverables: [
          "Reputation audit",
          "Review request and response playbook",
          "Monthly monitoring summary",
          "Issue response plan",
        ],
        note: "We never write fake reviews, impersonate customers or use deceptive tactics. Removal of content is only possible when a platform's policies or the law allow it.",
        faqs: [
          {
            q: "Can you delete negative reviews?",
            a: "Only the platform can remove reviews, and usually only when they break its policies. We can help you report policy violations, respond professionally and build a stronger base of genuine reviews.",
          },
          {
            q: "How quickly can search results change?",
            a: "It varies widely. Improving what appears for your name usually takes sustained effort over months, especially when the existing results come from strong websites.",
          },
        ],
      },
      ar: {
        title: "إدارة السمعة الرقمية",
        metaTitle: "إدارة السمعة الرقمية واستراتيجية المراجعات",
        metaDescription:
          "راقب وحسّن طريقة ظهور عملك على الإنترنت: استراتيجية المراجعات وإرشادات الرد وتحسين نتائج البحث والاستعداد للأزمات.",
        summary: "مراقبة واستراتيجية مراجعات وخطط رد تحسّن طريقة ظهور عملك على الإنترنت.",
        intro:
          "ما يجده الناس عند البحث عن اسمك يؤثر في قرار تواصلهم معك. تجمع إدارة السمعة بين المراقبة وتشجيع المراجعات الحقيقية من عملاء حقيقيين والرد المهني على الانتقادات ونشر معلومات دقيقة وإيجابية تستحق الظهور. ونساعدك أيضاً على الاستعداد للمواقف الصعبة قبل حدوثها.",
        signals: [
          "بضع مراجعات سلبية تهيمن على صفحتك.",
          "نتائج البحث عن اسمك تعرض معلومات قديمة أو غير دقيقة.",
          "ليس لديك آلية للرد على الشكاوى عبر الإنترنت.",
          "تريد الاستعداد لأي مشكلة علنية محتملة.",
        ],
        includes: [
          { title: "المراقبة", text: "المراجعات والإشارات ونتائج البحث الخاصة بعلامتك." },
          { title: "استراتيجية المراجعات", text: "آليات أخلاقية لطلب آراء العملاء الحقيقيين." },
          { title: "إرشادات الرد", text: "قوالب وقواعد تصعيد للتعليقات والمراجعات." },
          { title: "الاستعداد للأزمات", text: "بيانات أولية وخطة رد مبسطة." },
        ],
        deliverables: [
          "مراجعة السمعة الحالية",
          "دليل طلب المراجعات والرد عليها",
          "ملخص مراقبة شهري",
          "خطة الاستجابة للأزمات",
        ],
        note: "لا نكتب مراجعات مزيفة ولا ننتحل صفة العملاء ولا نستخدم أساليب مضللة. إزالة المحتوى ممكنة فقط عندما تسمح بها سياسات المنصة أو القانون.",
        faqs: [
          {
            q: "هل يمكنكم حذف المراجعات السلبية؟",
            a: "المنصة وحدها يمكنها إزالة المراجعات، وعادةً فقط عند مخالفتها لسياساتها. يمكننا مساعدتك في الإبلاغ عن المخالفات والرد بمهنية وبناء قاعدة أقوى من المراجعات الحقيقية.",
          },
          {
            q: "ما سرعة تغير نتائج البحث؟",
            a: "تختلف كثيراً. تحسين ما يظهر لاسمك يحتاج عادةً جهداً مستمراً لأشهر، خاصة عندما تأتي النتائج الحالية من مواقع قوية.",
          },
        ],
      },
    },
  },
];
