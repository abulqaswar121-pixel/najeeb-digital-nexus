import { useState, useEffect } from "react";
import { ServiceDepartment } from "../types/ndh";

export type SupportedCurrency = "USD" | "NGN" | "GBP" | "EUR" | "AED";
export type SupportedLanguage = "en" | "fr" | "ar";

export interface CurrencyConfig {
  code: SupportedCurrency;
  symbol: string;
  name: string;
  flag: string;
  marketLabel: string;
  countryName: string;
}

export const CURRENCIES: Record<SupportedCurrency, CurrencyConfig> = {
  NGN: {
    code: "NGN",
    symbol: "₦",
    name: "Nigerian Naira",
    flag: "🇳🇬",
    marketLabel: "Nigeria (Local Market PPP Rate)",
    countryName: "Nigeria",
  },
  USD: {
    code: "USD",
    symbol: "$",
    name: "US Dollar",
    flag: "🇺🇸",
    marketLabel: "United States & Americas",
    countryName: "United States",
  },
  GBP: {
    code: "GBP",
    symbol: "£",
    name: "British Pound",
    flag: "🇬🇧",
    marketLabel: "United Kingdom & London",
    countryName: "United Kingdom",
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    name: "Euro",
    flag: "🇪🇺",
    marketLabel: "European Union",
    countryName: "Europe",
  },
  AED: {
    code: "AED",
    symbol: "AED ",
    name: "UAE Dirham",
    flag: "🇦🇪",
    marketLabel: "UAE & Middle East",
    countryName: "United Arab Emirates",
  },
};

export interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

export const LANGUAGES: Record<SupportedLanguage, LanguageConfig> = {
  en: { code: "en", name: "English", nativeName: "English (US/UK)", flag: "🇬🇧" },
  fr: { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  ar: { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇦🇪" },
};

// Automatic Country & Currency Detection Engine
export const detectUserCountryAndCurrency = (): {
  currency: SupportedCurrency;
  language: SupportedLanguage;
  country: string;
} => {
  if (typeof window === "undefined") {
    return { currency: "NGN", language: "en", country: "Nigeria" };
  }

  // Check saved preferences
  const savedCurrency = localStorage.getItem("ndh_currency") as SupportedCurrency;
  const savedLanguage = localStorage.getItem("ndh_language") as SupportedLanguage;

  if (savedCurrency && CURRENCIES[savedCurrency]) {
    return {
      currency: savedCurrency,
      language: savedLanguage || "en",
      country: CURRENCIES[savedCurrency].countryName,
    };
  }

  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    const browserLang = navigator.language || "";

    // Nigeria & West Africa detection
    if (
      tz.includes("Lagos") ||
      tz.includes("Africa/Lagos") ||
      tz.includes("Accra") ||
      browserLang.includes("en-NG") ||
      browserLang.includes("yo") ||
      browserLang.includes("ha") ||
      browserLang.includes("ig")
    ) {
      return { currency: "NGN", language: "en", country: "Nigeria" };
    }

    // UK detection
    if (tz.includes("London") || tz.includes("Europe/London") || browserLang.includes("en-GB")) {
      return { currency: "GBP", language: "en", country: "United Kingdom" };
    }

    // UAE / Gulf detection
    if (
      tz.includes("Dubai") ||
      tz.includes("Asia/Dubai") ||
      tz.includes("Riyadh") ||
      tz.includes("Qatar") ||
      browserLang.includes("ar")
    ) {
      return {
        currency: "AED",
        language: browserLang.includes("ar") ? "ar" : "en",
        country: "United Arab Emirates",
      };
    }

    // European Union detection
    if (
      tz.includes("Paris") ||
      tz.includes("Berlin") ||
      tz.includes("Amsterdam") ||
      tz.includes("Madrid") ||
      tz.includes("Rome") ||
      tz.includes("Europe") ||
      browserLang.includes("fr") ||
      browserLang.includes("de") ||
      browserLang.includes("es")
    ) {
      return {
        currency: "EUR",
        language: browserLang.includes("fr") ? "fr" : "en",
        country: "Europe",
      };
    }

    // Default to Americas / Global USD
    return { currency: "USD", language: "en", country: "United States" };
  } catch {
    return { currency: "NGN", language: "en", country: "Nigeria" };
  }
};

// 16 Complete Global Departments with Market-Realistic Accessible Pricing across all 5 currencies
export const REGIONAL_MARKET_PRICING: Record<
  SupportedCurrency,
  Record<
    ServiceDepartment,
    { starter: string; growth: string; enterprise: string; weeks: string; starterDesc: string }
  >
> = {
  NGN: {
    brand_strategy: {
      starter: "₦45,000",
      growth: "₦180,000",
      enterprise: "₦750,000",
      weeks: "1-3 weeks",
      starterDesc: "Logo & Brand Identity Kit",
    },
    ui_ux_design: {
      starter: "₦55,000",
      growth: "₦240,000",
      enterprise: "₦950,000",
      weeks: "1-3 weeks",
      starterDesc: "Figma UI Wireframe / Mobile UX",
    },
    web_app_development: {
      starter: "₦65,000",
      growth: "₦320,000",
      enterprise: "₦1,450,000",
      weeks: "2-5 weeks",
      starterDesc: "Fast Responsive Website / Landing Page",
    },
    mobile_app_development: {
      starter: "₦120,000",
      growth: "₦480,000",
      enterprise: "₦1,950,000",
      weeks: "3-6 weeks",
      starterDesc: "Cross-Platform MVP Mobile App",
    },
    ecommerce: {
      starter: "₦50,000",
      growth: "₦220,000",
      enterprise: "₦880,000",
      weeks: "1-3 weeks",
      starterDesc: "Shopify / Paystack Online Store",
    },
    fintech_payments: {
      starter: "₦85,000",
      growth: "₦420,000",
      enterprise: "₦1,850,000",
      weeks: "2-4 weeks",
      starterDesc: "Payment Gateway Integration & KYC",
    },
    cloud_devops: {
      starter: "₦60,000",
      growth: "₦280,000",
      enterprise: "₦1,100,000",
      weeks: "1-3 weeks",
      starterDesc: "Cloud Hosting Setup & Server Security",
    },
    cybersecurity_compliance: {
      starter: "₦70,000",
      growth: "₦350,000",
      enterprise: "₦1,250,000",
      weeks: "1-3 weeks",
      starterDesc: "NDPR / Website Security Audit",
    },
    digital_marketing: {
      starter: "₦40,000",
      growth: "₦160,000",
      enterprise: "₦650,000",
      weeks: "1-2 weeks",
      starterDesc: "High-Converting Ad Campaign Setup",
    },
    seo_growth: {
      starter: "₦35,000",
      growth: "₦150,000",
      enterprise: "₦580,000",
      weeks: "1-3 weeks",
      starterDesc: "Google SEO Audit & Local Ranking",
    },
    content_copywriting: {
      starter: "₦30,000",
      growth: "₦120,000",
      enterprise: "₦450,000",
      weeks: "3-7 days",
      starterDesc: "Landing Page Copy & Sales Deck",
    },
    social_media: {
      starter: "₦35,000",
      growth: "₦140,000",
      enterprise: "₦520,000",
      weeks: "1-2 weeks",
      starterDesc: "Monthly Social Posts & Reels Kit",
    },
    video_media: {
      starter: "₦50,000",
      growth: "₦210,000",
      enterprise: "₦850,000",
      weeks: "1-3 weeks",
      starterDesc: "3D Product Promo / Explainer Video",
    },
    data_business: {
      starter: "₦45,000",
      growth: "₦190,000",
      enterprise: "₦720,000",
      weeks: "1-2 weeks",
      starterDesc: "Market Research & BI Dashboard",
    },
    ai_automation: {
      starter: "₦75,000",
      growth: "₦340,000",
      enterprise: "₦1,350,000",
      weeks: "1-3 weeks",
      starterDesc: "Custom AI Bot / Auto WhatsApp CRM",
    },
    nocode_rapid_mvp: {
      starter: "₦35,000",
      growth: "₦150,000",
      enterprise: "₦550,000",
      weeks: "3-7 days",
      starterDesc: "Framer / Webflow Rapid Launch",
    },
  },
  USD: {
    brand_strategy: {
      starter: "$190",
      growth: "$750",
      enterprise: "$2,800",
      weeks: "1-3 weeks",
      starterDesc: "Logo & Visual Identity Package",
    },
    ui_ux_design: {
      starter: "$240",
      growth: "$950",
      enterprise: "$3,400",
      weeks: "1-3 weeks",
      starterDesc: "Figma UX Wireframe & App Prototypes",
    },
    web_app_development: {
      starter: "$290",
      growth: "$1,250",
      enterprise: "$4,800",
      weeks: "2-5 weeks",
      starterDesc: "High-Converting Website / Web App",
    },
    mobile_app_development: {
      starter: "$490",
      growth: "$1,850",
      enterprise: "$6,500",
      weeks: "3-6 weeks",
      starterDesc: "iOS & Android Native Mobile App",
    },
    ecommerce: {
      starter: "$220",
      growth: "$890",
      enterprise: "$3,200",
      weeks: "1-3 weeks",
      starterDesc: "Custom E-Commerce Store & Checkout",
    },
    fintech_payments: {
      starter: "$380",
      growth: "$1,450",
      enterprise: "$5,500",
      weeks: "2-4 weeks",
      starterDesc: "Stripe / Multi-Gateway Escrow Integration",
    },
    cloud_devops: {
      starter: "$260",
      growth: "$1,100",
      enterprise: "$3,800",
      weeks: "1-3 weeks",
      starterDesc: "AWS / Cloudflare Infrastructure Setup",
    },
    cybersecurity_compliance: {
      starter: "$310",
      growth: "$1,300",
      enterprise: "$4,200",
      weeks: "1-3 weeks",
      starterDesc: "SOC 2 / GDPR Penetration Audit",
    },
    digital_marketing: {
      starter: "$180",
      growth: "$680",
      enterprise: "$2,400",
      weeks: "1-2 weeks",
      starterDesc: "Targeted PPC Ads & Growth Funnel",
    },
    seo_growth: {
      starter: "$160",
      growth: "$620",
      enterprise: "$2,200",
      weeks: "1-3 weeks",
      starterDesc: "Technical SEO & Keyword Ranking Engine",
    },
    content_copywriting: {
      starter: "$140",
      growth: "$480",
      enterprise: "$1,650",
      weeks: "3-7 days",
      starterDesc: "Conversion Copywriting & Whitepaper",
    },
    social_media: {
      starter: "$160",
      growth: "$580",
      enterprise: "$1,950",
      weeks: "1-2 weeks",
      starterDesc: "Social Media Management & Creator Video",
    },
    video_media: {
      starter: "$230",
      growth: "$880",
      enterprise: "$3,100",
      weeks: "1-3 weeks",
      starterDesc: "Cinema Brand Film & 3D Motion Graphic",
    },
    data_business: {
      starter: "$190",
      growth: "$760",
      enterprise: "$2,600",
      weeks: "1-2 weeks",
      starterDesc: "Market Intelligence & PowerBI Telemetry",
    },
    ai_automation: {
      starter: "$320",
      growth: "$1,350",
      enterprise: "$4,600",
      weeks: "1-3 weeks",
      starterDesc: "Custom LLM Chatbot & n8n Automation",
    },
    nocode_rapid_mvp: {
      starter: "$150",
      growth: "$590",
      enterprise: "$1,950",
      weeks: "3-7 days",
      starterDesc: "Framer / Webflow 3-Day Rapid Launch",
    },
  },
  GBP: {
    brand_strategy: {
      starter: "£150",
      growth: "£590",
      enterprise: "£2,200",
      weeks: "1-3 weeks",
      starterDesc: "Brand Guidelines & Identity Suite",
    },
    ui_ux_design: {
      starter: "£190",
      growth: "£750",
      enterprise: "£2,700",
      weeks: "1-3 weeks",
      starterDesc: "Figma UI/UX Design System",
    },
    web_app_development: {
      starter: "£230",
      growth: "£980",
      enterprise: "£3,800",
      weeks: "2-5 weeks",
      starterDesc: "Responsive Full-Stack Web Platform",
    },
    mobile_app_development: {
      starter: "£390",
      growth: "£1,450",
      enterprise: "£5,200",
      weeks: "3-6 weeks",
      starterDesc: "Cross-Platform Mobile Application",
    },
    ecommerce: {
      starter: "£180",
      growth: "£720",
      enterprise: "£2,550",
      weeks: "1-3 weeks",
      starterDesc: "Shopify / Stripe Commerce Platform",
    },
    fintech_payments: {
      starter: "£300",
      growth: "£1,150",
      enterprise: "£4,400",
      weeks: "2-4 weeks",
      starterDesc: "UK Open Banking & Stripe Rails",
    },
    cloud_devops: {
      starter: "£210",
      growth: "£880",
      enterprise: "£3,000",
      weeks: "1-3 weeks",
      starterDesc: "Cloud DevOps & CI/CD Pipeline",
    },
    cybersecurity_compliance: {
      starter: "£250",
      growth: "£1,050",
      enterprise: "£3,400",
      weeks: "1-3 weeks",
      starterDesc: "GDPR / Cyber Essentials Security Audit",
    },
    digital_marketing: {
      starter: "£145",
      growth: "£540",
      enterprise: "£1,900",
      weeks: "1-2 weeks",
      starterDesc: "PPC & Growth Marketing Campaign",
    },
    seo_growth: {
      starter: "£130",
      growth: "£490",
      enterprise: "£1,750",
      weeks: "1-3 weeks",
      starterDesc: "SEO Optimization & Organic Ranking",
    },
    content_copywriting: {
      starter: "£115",
      growth: "£390",
      enterprise: "£1,350",
      weeks: "3-7 days",
      starterDesc: "Editorial Copy & Pitch Decks",
    },
    social_media: {
      starter: "£130",
      growth: "£460",
      enterprise: "£1,550",
      weeks: "1-2 weeks",
      starterDesc: "Social Media Strategy & Content Assets",
    },
    video_media: {
      starter: "£185",
      growth: "£700",
      enterprise: "£2,450",
      weeks: "1-3 weeks",
      starterDesc: "3D Renders & Promotional Video",
    },
    data_business: {
      starter: "£150",
      growth: "£610",
      enterprise: "£2,100",
      weeks: "1-2 weeks",
      starterDesc: "Business Intelligence & Data Pipeline",
    },
    ai_automation: {
      starter: "£260",
      growth: "£1,080",
      enterprise: "£3,700",
      weeks: "1-3 weeks",
      starterDesc: "Enterprise AI Agent & Workflow Engine",
    },
    nocode_rapid_mvp: {
      starter: "£120",
      growth: "£470",
      enterprise: "£1,550",
      weeks: "3-7 days",
      starterDesc: "Framer / Webflow 3-Day Turnaround",
    },
  },
  EUR: {
    brand_strategy: {
      starter: "€175",
      growth: "€690",
      enterprise: "€2,550",
      weeks: "1-3 weeks",
      starterDesc: "Visual Brand Guidelines & Logo",
    },
    ui_ux_design: {
      starter: "€220",
      growth: "€880",
      enterprise: "€3,100",
      weeks: "1-3 weeks",
      starterDesc: "UI/UX Interface & Interactive Prototypes",
    },
    web_app_development: {
      starter: "€270",
      growth: "€1,150",
      enterprise: "€4,400",
      weeks: "2-5 weeks",
      starterDesc: "Modern Web Application & Landing Page",
    },
    mobile_app_development: {
      starter: "€450",
      growth: "€1,700",
      enterprise: "€6,000",
      weeks: "3-6 weeks",
      starterDesc: "iOS/Android Native Mobile Solution",
    },
    ecommerce: {
      starter: "€205",
      growth: "€820",
      enterprise: "€2,950",
      weeks: "1-3 weeks",
      starterDesc: "Online Store & Multi-Currency Checkout",
    },
    fintech_payments: {
      starter: "€350",
      growth: "€1,350",
      enterprise: "€5,100",
      weeks: "2-4 weeks",
      starterDesc: "PSD2 / SEPA / Stripe Gateway Engine",
    },
    cloud_devops: {
      starter: "€240",
      growth: "€1,020",
      enterprise: "€3,500",
      weeks: "1-3 weeks",
      starterDesc: "Cloud DevOps & Kubernetes Cluster",
    },
    cybersecurity_compliance: {
      starter: "€290",
      growth: "€1,200",
      enterprise: "€3,900",
      weeks: "1-3 weeks",
      starterDesc: "GDPR Compliance & Vulnerability Audit",
    },
    digital_marketing: {
      starter: "€165",
      growth: "€630",
      enterprise: "€2,200",
      weeks: "1-2 weeks",
      starterDesc: "Performance Marketing & Lead Gen",
    },
    seo_growth: {
      starter: "€150",
      growth: "€570",
      enterprise: "€2,000",
      weeks: "1-3 weeks",
      starterDesc: "SEO Ranking & Content Strategy",
    },
    content_copywriting: {
      starter: "€130",
      growth: "€440",
      enterprise: "€1,500",
      weeks: "3-7 days",
      starterDesc: "High-Converting Sales & Web Copy",
    },
    social_media: {
      starter: "€150",
      growth: "€530",
      enterprise: "€1,800",
      weeks: "1-2 weeks",
      starterDesc: "Social Media Management & Creator Video",
    },
    video_media: {
      starter: "€215",
      growth: "€810",
      enterprise: "€2,850",
      weeks: "1-3 weeks",
      starterDesc: "3D Brand Video & Motion Graphics",
    },
    data_business: {
      starter: "€175",
      growth: "€700",
      enterprise: "€2,400",
      weeks: "1-2 weeks",
      starterDesc: "Market Telemetry & BI Analytics",
    },
    ai_automation: {
      starter: "€300",
      growth: "€1,250",
      enterprise: "€4,250",
      weeks: "1-3 weeks",
      starterDesc: "Custom AI Assistant & Process Automation",
    },
    nocode_rapid_mvp: {
      starter: "€140",
      growth: "€540",
      enterprise: "€1,800",
      weeks: "3-7 days",
      starterDesc: "Framer / Webflow Rapid Launchpad",
    },
  },
  AED: {
    brand_strategy: {
      starter: "AED 690",
      growth: "AED 2,750",
      enterprise: "AED 10,500",
      weeks: "1-3 weeks",
      starterDesc: "Luxury Brand Identity & Monogram",
    },
    ui_ux_design: {
      starter: "AED 880",
      growth: "AED 3,500",
      enterprise: "AED 12,500",
      weeks: "1-3 weeks",
      starterDesc: "Premium Mobile & Web UX Prototypes",
    },
    web_app_development: {
      starter: "AED 1,050",
      growth: "AED 4,600",
      enterprise: "AED 17,500",
      weeks: "2-5 weeks",
      starterDesc: "Enterprise Web Application / Platform",
    },
    mobile_app_development: {
      starter: "AED 1,800",
      growth: "AED 6,800",
      enterprise: "AED 24,000",
      weeks: "3-6 weeks",
      starterDesc: "Native iOS & Android Mobile Apps",
    },
    ecommerce: {
      starter: "AED 820",
      growth: "AED 3,300",
      enterprise: "AED 11,800",
      weeks: "1-3 weeks",
      starterDesc: "High-Conversion Luxury E-Commerce",
    },
    fintech_payments: {
      starter: "AED 1,400",
      growth: "AED 5,300",
      enterprise: "AED 20,000",
      weeks: "2-4 weeks",
      starterDesc: "Payment Rails & UAE Central Bank KYC",
    },
    cloud_devops: {
      starter: "AED 950",
      growth: "AED 4,000",
      enterprise: "AED 14,000",
      weeks: "1-3 weeks",
      starterDesc: "Middle East Edge Cloud & AWS Cluster",
    },
    cybersecurity_compliance: {
      starter: "AED 1,150",
      growth: "AED 4,800",
      enterprise: "AED 15,500",
      weeks: "1-3 weeks",
      starterDesc: "SOC 2 & Regional Cybersecurity Audit",
    },
    digital_marketing: {
      starter: "AED 660",
      growth: "AED 2,500",
      enterprise: "AED 8,800",
      weeks: "1-2 weeks",
      starterDesc: "UAE / GCC Paid Acquisition & PPC",
    },
    seo_growth: {
      starter: "AED 590",
      growth: "AED 2,300",
      enterprise: "AED 8,000",
      weeks: "1-3 weeks",
      starterDesc: "Multilingual Arabic/English SEO Engine",
    },
    content_copywriting: {
      starter: "AED 520",
      growth: "AED 1,750",
      enterprise: "AED 6,000",
      weeks: "3-7 days",
      starterDesc: "English & Arabic Corporate Copywriting",
    },
    social_media: {
      starter: "AED 590",
      growth: "AED 2,150",
      enterprise: "AED 7,200",
      weeks: "1-2 weeks",
      starterDesc: "GCC Social Media & Influencer Management",
    },
    video_media: {
      starter: "AED 850",
      growth: "AED 3,250",
      enterprise: "AED 11,400",
      weeks: "1-3 weeks",
      starterDesc: "Cinema Brand Film & 3D Motion Reel",
    },
    data_business: {
      starter: "AED 700",
      growth: "AED 2,800",
      enterprise: "AED 9,600",
      weeks: "1-2 weeks",
      starterDesc: "GCC Market Intelligence & BI Telemetry",
    },
    ai_automation: {
      starter: "AED 1,200",
      growth: "AED 5,000",
      enterprise: "AED 17,000",
      weeks: "1-3 weeks",
      starterDesc: "Enterprise AI Agent & WhatsApp Automation",
    },
    nocode_rapid_mvp: {
      starter: "AED 550",
      growth: "AED 2,150",
      enterprise: "AED 7,200",
      weeks: "3-7 days",
      starterDesc: "Framer / Webflow 3-Day Launch",
    },
  },
};

export const UI_TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    nav_services: "Services",
    nav_work: "Our Work",
    nav_how_it_works: "How It Works",
    nav_talent: "Talent Team",
    nav_about: "About Us",
    nav_insights: "Insights & Blog",
    nav_contact: "Contact",
    nav_request_quote: "Get Started",
    nav_client_login: "Client Portal",
    hero_badge: "✨ Top-Tier Digital Agency • Trusted in Nigeria & Worldwide",
    hero_title_1: "We Build World-Class Software & Brands",
    hero_title_2: "That Fast-Track Your Growth.",
    hero_desc:
      "From lean MVPs and fast websites to enterprise fintech platforms. Dedicated PM oversight, vetted senior talent, and guaranteed affordable on-time delivery.",
    hero_cta_primary: "Start Your Project",
    hero_cta_secondary: "Explore Services",
    hero_stat_1_val: "< 24 hrs",
    hero_stat_1_lbl: "Avg. Brief Response Time",
    hero_stat_2_val: "100%",
    hero_stat_2_lbl: "PM-Reviewed Before Handover",
    hero_stat_3_val: "16",
    hero_stat_3_lbl: "Specialized Service Departments",
    hero_stat_4_val: "5",
    hero_stat_4_lbl: "Regional Currencies Supported",
    estimator_title: "Instant Project Price & Time Estimator",
    estimator_desc:
      "Pick your service and scope to see exact, affordable regional pricing and delivery timelines instantly.",
    ticker_dept_line: "16 Service Departments • Every Project PM-Reviewed Before Handover",
    ticker_pm_line: "Dedicated Project Manager On Every Engagement",
    ticker_pricing_prefix: "Pricing shown automatically in",
    hero_price_prefix: "Prices shown in",
    hero_price_suffix: "Starter packages for solopreneurs & enterprises",
    stat_1_sub: "Every submitted brief gets a real reply, not an autoresponder",
    stat_2_sub: "No deliverable ships unchecked",
    stat_3_sub: "Web, mobile & cloud systems",
    marquee_heading: "Real Clients We've Delivered For",
    section_build_badge: "What We Build",
    section_build_title: "16 Core Service Departments.",
    section_build_desc:
      "From landing pages and rapid MVPs to enterprise mobile apps and AI agents. Assigned PM oversight with zero risk.",
    btn_explore_all_departments: "Explore All 16 Departments",
    label_key_capabilities: "Key Capabilities:",
    label_starter_plan: "Starter Plan",
    label_from_price: "From",
    btn_explore: "Explore",
    btn_view_all_departments:
      "View All 16 Service Departments (No-Code, AI, Mobile, Video, DevOps...)",
    label_select_service: "1. Select Service Discipline:",
    label_project_tier: "2. Project Tier & Requirements:",
    label_instant_budget: "Instant Estimated Budget",
    label_custom_scope: "Custom Scope:",
    label_estimated_delivery: "Estimated Delivery:",
    label_includes_pm_escrow: "Includes Dedicated Lead PM & IP Escrow",
    label_lets_talk_quote: "Let's Talk & Quote It",
    label_no_fixed_price_desc:
      "No fixed sticker price — tell us your exact scope and a PM gets back to you with a tailored quote & timeline.",
    btn_generate_proposal: "Generate Official Proposal",
    btn_start_custom_scoping: "Start Custom Scoping",
    section_results_badge: "Real Results",
    section_results_title: "Built for Scalability & Speed.",
    section_results_desc:
      "Explore real case studies from companies that scaled their products with NDH squads.",
    btn_build_similar: "Build Similar Solution",
    btn_read_full_dossier: "Read Full Dossier",
    label_delivered_by_ndh: "Delivered by NDH",
    label_verified_project: "Verified Project",
    label_completed: "Completed",
    label_case_study_prefix: "Case Study:",
    label_tech_stack_prefix: "Tech Stack:",
    btn_scope_this_project: "Scope This Project",
  },
  fr: {
    nav_services: "Services",
    nav_work: "Nos Réalisations",
    nav_how_it_works: "Comment Ça Marche",
    nav_talent: "Équipe d’Élite",
    nav_about: "À Propos",
    nav_insights: "Actualités & Blog",
    nav_contact: "Contact",
    nav_request_quote: "Démarrer un Projet",
    nav_client_login: "Portail Client",
    hero_badge: "✨ Agence Digitale d’Élite • Reconnue Mondialement",
    hero_title_1: "Nous Créons des Logiciels et des Marques",
    hero_title_2: "Qui Accélèrent Votre Croissance.",
    hero_desc:
      "Des MVPs rapides aux plateformes fintech d’entreprise. Gestionnaires dédiés et tarifs adaptés à votre pays.",
    hero_cta_primary: "Démarrer Votre Projet",
    hero_cta_secondary: "Explorer les Services",
    hero_stat_1_val: "< 24 h",
    hero_stat_1_lbl: "Délai de Réponse Moyen",
    hero_stat_2_val: "100%",
    hero_stat_2_lbl: "Revu par un Chef de Projet",
    hero_stat_3_val: "16",
    hero_stat_3_lbl: "Départements de Services Spécialisés",
    hero_stat_4_val: "5",
    hero_stat_4_lbl: "Devises Régionales Prises en Charge",
    estimator_title: "Estimateur Instantané de Prix et Délais",
    estimator_desc:
      "Sélectionnez vos besoins pour obtenir instantanément un budget clair et adapté.",
    ticker_dept_line: "16 Départements de Services • Chaque Projet Révisé par un Chef de Projet",
    ticker_pm_line: "Chef de Projet Dédié sur Chaque Mission",
    ticker_pricing_prefix: "Tarification affichée automatiquement en",
    hero_price_prefix: "Prix affichés en",
    hero_price_suffix: "Offres adaptées aux indépendants comme aux grandes entreprises",
    stat_1_sub: "Chaque brief soumis reçoit une vraie réponse, pas un message automatique",
    stat_2_sub: "Aucun livrable n'est envoyé sans vérification",
    stat_3_sub: "Systèmes web, mobiles et cloud",
    marquee_heading: "Clients Réels pour Qui Nous Avons Livré",
    section_build_badge: "Ce Que Nous Construisons",
    section_build_title: "16 Départements de Services Principaux.",
    section_build_desc:
      "Des pages d'atterrissage et MVP rapides aux applications mobiles d'entreprise et agents IA. Supervision dédiée par un chef de projet, sans risque.",
    btn_explore_all_departments: "Explorer les 16 Départements",
    label_key_capabilities: "Compétences Clés :",
    label_starter_plan: "Offre de Départ",
    label_from_price: "À partir de",
    btn_explore: "Explorer",
    btn_view_all_departments:
      "Voir les 16 Départements de Services (No-Code, IA, Mobile, Vidéo, DevOps...)",
    label_select_service: "1. Choisissez un Domaine de Service :",
    label_project_tier: "2. Niveau de Projet et Exigences :",
    label_instant_budget: "Budget Estimé Instantané",
    label_custom_scope: "Besoin Spécifique :",
    label_estimated_delivery: "Délai Estimé :",
    label_includes_pm_escrow: "Inclut un Chef de Projet Dédié et une Garantie Séquestre",
    label_lets_talk_quote: "Parlons-en et Faisons un Devis",
    label_no_fixed_price_desc:
      "Pas de prix fixe affiché — décrivez votre besoin exact et un chef de projet vous recontacte avec un devis et un calendrier sur mesure.",
    btn_generate_proposal: "Générer une Proposition Officielle",
    btn_start_custom_scoping: "Démarrer un Cadrage Personnalisé",
    section_results_badge: "Résultats Réels",
    section_results_title: "Conçu pour l'Évolutivité et la Rapidité.",
    section_results_desc:
      "Découvrez de vraies études de cas d'entreprises qui ont fait évoluer leurs produits avec les équipes NDH.",
    btn_build_similar: "Construire une Solution Similaire",
    btn_read_full_dossier: "Lire le Dossier Complet",
    label_delivered_by_ndh: "Livré par NDH",
    label_verified_project: "Projet Vérifié",
    label_completed: "Terminé en",
    label_case_study_prefix: "Étude de Cas :",
    label_tech_stack_prefix: "Technologies :",
    btn_scope_this_project: "Cadrer Ce Projet",
  },
  ar: {
    nav_services: "الخدمات",
    nav_work: "أعمالنا",
    nav_how_it_works: "كيف نعمل",
    nav_talent: "فريق الخبراء",
    nav_about: "من نحن",
    nav_insights: "المدونة والرؤى",
    nav_contact: "اتصل بنا",
    nav_request_quote: "ابدأ مشروعك",
    nav_client_login: "بوابة العملاء",
    hero_badge: "✨ وكالة رقمية رائدة عالمياً • أسعار محلية مناسبة للجميع",
    hero_title_1: "نبني برمجيات وهويات علامات تجارية عالمية",
    hero_title_2: "تسرع نمو أعمالك ومشاريعك.",
    hero_desc:
      "من النماذج الأولية والمواقع السريعة إلى أنظمة التكنولوجيا المالية المتقدمة. إدارة مشاريع مخصصة مع التزام صارم بالمواعيد.",
    hero_cta_primary: "ابدأ مشروعك اليوم",
    hero_cta_secondary: "استكشف الخدمات",
    hero_stat_1_val: "< 24 ساعة",
    hero_stat_1_lbl: "متوسط وقت الرد على العروض",
    hero_stat_2_val: "100%",
    hero_stat_2_lbl: "مراجعة مدير المشروع قبل التسليم",
    hero_stat_3_val: "16",
    hero_stat_3_lbl: "أقسام خدمات متخصصة",
    hero_stat_4_val: "5",
    hero_stat_4_lbl: "عملات إقليمية مدعومة",
    estimator_title: "حاسبة تقدير التكلفة والوقت الفورية",
    estimator_desc: "اختر الخدمة والمواصفات للحصول على تكلفة دقيقة مناسبة لبلدك فوراً.",
    ticker_dept_line: "16 قسم خدمات متخصص • كل مشروع تتم مراجعته من قبل مدير مشروع قبل التسليم",
    ticker_pm_line: "مدير مشروع مخصص لكل عملية تعاقد",
    ticker_pricing_prefix: "يتم عرض الأسعار تلقائياً بعملة",
    hero_price_prefix: "الأسعار معروضة بعملة",
    hero_price_suffix: "باقات مبتدئة لأصحاب المشاريع الفردية والمؤسسات الكبرى",
    stat_1_sub: "كل عرض يتم إرساله يحصل على رد حقيقي، وليس رسالة آلية",
    stat_2_sub: "لا يتم تسليم أي عمل دون مراجعة",
    stat_3_sub: "أنظمة ويب وجوال وسحابية",
    marquee_heading: "عملاء حقيقيون أنجزنا لهم مشاريع",
    section_build_badge: "ما نبنيه",
    section_build_title: "16 قسم خدمات أساسي.",
    section_build_desc:
      "من صفحات الهبوط والنماذج الأولية السريعة إلى تطبيقات الجوال المؤسسية ووكلاء الذكاء الاصطناعي. إشراف مدير مشروع مخصص دون أي مخاطرة.",
    btn_explore_all_departments: "استكشف الأقسام الـ16",
    label_key_capabilities: "القدرات الأساسية:",
    label_starter_plan: "باقة البداية",
    label_from_price: "ابتداءً من",
    btn_explore: "استكشف",
    btn_view_all_departments:
      "عرض جميع الأقسام الـ16 (بدون كود، ذكاء اصطناعي، جوال، فيديو، ديف أوبس...)",
    label_select_service: "١. اختر مجال الخدمة:",
    label_project_tier: "٢. فئة المشروع والمتطلبات:",
    label_instant_budget: "الميزانية التقديرية الفورية",
    label_custom_scope: "نطاق مخصص:",
    label_estimated_delivery: "مدة التسليم المقدرة:",
    label_includes_pm_escrow: "يشمل مدير مشروع مخصص وضمان ضمان الدفع",
    label_lets_talk_quote: "لنتحدث ونقدم عرض سعر",
    label_no_fixed_price_desc:
      "لا يوجد سعر ثابت — أخبرنا بنطاق مشروعك بدقة وسيتواصل معك مدير مشروع بعرض سعر وجدول زمني مخصصين.",
    btn_generate_proposal: "إنشاء عرض رسمي",
    btn_start_custom_scoping: "ابدأ تحديد النطاق المخصص",
    section_results_badge: "نتائج حقيقية",
    section_results_title: "مصمم للنمو والسرعة.",
    section_results_desc: "استكشف دراسات حالة حقيقية لشركات طورت منتجاتها مع فرق NDH.",
    btn_build_similar: "ابنِ حلاً مشابهاً",
    btn_read_full_dossier: "اقرأ الملف الكامل",
    label_delivered_by_ndh: "تم التسليم بواسطة NDH",
    label_verified_project: "مشروع موثق",
    label_completed: "اكتمل في",
    label_case_study_prefix: "دراسة حالة:",
    label_tech_stack_prefix: "التقنيات المستخدمة:",
    btn_scope_this_project: "حدد نطاق هذا المشروع",
  },
};

// Global Store State
const detectedInit = detectUserCountryAndCurrency();
let currentCurrency: SupportedCurrency = detectedInit.currency;
let currentLanguage: SupportedLanguage = detectedInit.language;
let detectedCountryName: string = detectedInit.country;

const listeners = new Set<() => void>();

export const setCurrency = (c: SupportedCurrency) => {
  currentCurrency = c;
  detectedCountryName = CURRENCIES[c]?.countryName || "Global";
  if (typeof window !== "undefined") {
    localStorage.setItem("ndh_currency", c);
  }
  listeners.forEach((fn) => fn());
};

export const getCurrency = () => currentCurrency;
export const getDetectedCountry = () => detectedCountryName;

export const setLanguage = (l: SupportedLanguage) => {
  currentLanguage = l;
  if (typeof window !== "undefined") {
    localStorage.setItem("ndh_language", l);
  }
  listeners.forEach((fn) => fn());
};

export const getLanguage = () => currentLanguage;

export const getRegionalPricing = (
  dept: ServiceDepartment,
  tier: "starter" | "growth" | "enterprise",
  forceCurrency?: SupportedCurrency,
): { price: string; weeks: string; starterDesc: string } => {
  const curr = forceCurrency || currentCurrency;
  const table = REGIONAL_MARKET_PRICING[curr] || REGIONAL_MARKET_PRICING.NGN;
  const deptPricing = table[dept] || table.web_app_development;
  return {
    price: deptPricing[tier] || deptPricing.starter,
    weeks: deptPricing.weeks,
    starterDesc: deptPricing.starterDesc,
  };
};

export const getStarterPrice = (
  dept: ServiceDepartment,
  forceCurrency?: SupportedCurrency,
): string => {
  const curr = forceCurrency || currentCurrency;
  const table = REGIONAL_MARKET_PRICING[curr] || REGIONAL_MARKET_PRICING.NGN;
  const deptPricing = table[dept] || table.web_app_development;
  return deptPricing.starter;
};

export const useCurrencyLanguage = () => {
  const [currency, setCurr] = useState<SupportedCurrency>(currentCurrency);
  const [language, setLang] = useState<SupportedLanguage>(currentLanguage);
  const [detectedCountry, setCountry] = useState<string>(detectedCountryName);

  useEffect(() => {
    const update = () => {
      setCurr(currentCurrency);
      setLang(currentLanguage);
      setCountry(detectedCountryName);
    };
    listeners.add(update);
    return () => {
      listeners.delete(update);
    };
  }, []);

  const t = (key: string): string => {
    return UI_TRANSLATIONS[language]?.[key] || UI_TRANSLATIONS.en[key] || key;
  };

  return {
    currency,
    setCurrency,
    currencies: CURRENCIES,
    language,
    setLanguage,
    languages: LANGUAGES,
    detectedCountry,
    getRegionalPricing: (dept: ServiceDepartment, tier: "starter" | "growth" | "enterprise") =>
      getRegionalPricing(dept, tier, currency),
    getStarterPrice: (dept: ServiceDepartment) => getStarterPrice(dept, currency),
    t,
  };
};
