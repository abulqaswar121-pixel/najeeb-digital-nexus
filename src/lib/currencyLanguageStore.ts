import { useState, useEffect } from 'react';

export type SupportedCurrency = 'USD' | 'NGN' | 'GBP' | 'EUR' | 'AED';
export type SupportedLanguage = 'en' | 'fr' | 'yo' | 'ha' | 'ig' | 'ar';

export interface CurrencyConfig {
  code: SupportedCurrency;
  symbol: string;
  name: string;
  rateToUSD: number; // Multiply USD by this to get local amount
  flag: string;
}

export const CURRENCIES: Record<SupportedCurrency, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', rateToUSD: 1, flag: '🇺🇸' },
  NGN: { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', rateToUSD: 1520, flag: '🇳🇬' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', rateToUSD: 0.78, flag: '🇬🇧' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', rateToUSD: 0.92, flag: '🇪🇺' },
  AED: { code: 'AED', symbol: 'AED ', name: 'UAE Dirham', rateToUSD: 3.67, flag: '🇦🇪' },
};

export interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

export const LANGUAGES: Record<SupportedLanguage, LanguageConfig> = {
  en: { code: 'en', name: 'English', nativeName: 'English (US/UK)', flag: '🇬🇧' },
  fr: { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  yo: { code: 'yo', name: 'Yoruba', nativeName: 'Èdè Yorùbá', flag: '🇳🇬' },
  ha: { code: 'ha', name: 'Hausa', nativeName: 'Harshen Hausa', flag: '🇳🇬' },
  ig: { code: 'ig', name: 'Igbo', nativeName: 'Asụsụ Igbo', flag: '🇳🇬' },
  ar: { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇦🇪' },
};

export const UI_TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    nav_services: 'Services',
    nav_work: 'Our Work',
    nav_how_it_works: 'How It Works',
    nav_talent: 'Talent Team',
    nav_about: 'About Us',
    nav_insights: 'Insights',
    nav_contact: 'Contact',
    nav_request_quote: 'Get Started',
    nav_client_login: 'Client Portal',
    hero_badge: '✨ Top-Tier Digital Agency • Trusted Worldwide',
    hero_title_1: 'We Build World-Class Software & Brands',
    hero_title_2: 'That Fast-Track Your Growth.',
    hero_desc: 'From high-speed apps and websites to stunning brand identities. We provide dedicated project managers, vetted senior engineers, and guaranteed on-time delivery.',
    hero_cta_primary: 'Start Your Project Today',
    hero_cta_secondary: 'See Our Work',
    hero_stat_1_val: '$180M+',
    hero_stat_1_lbl: 'Client Value Generated',
    hero_stat_2_val: '99.8%',
    hero_stat_2_lbl: 'On-Time Project Delivery',
    hero_stat_3_val: '100+',
    hero_stat_3_lbl: 'Successful Products Launched',
    hero_stat_4_val: '4.98 / 5',
    hero_stat_4_lbl: 'Client Satisfaction Rating',
    estimator_title: 'Instant Project Price & Time Estimator',
    estimator_desc: 'Pick what you need to build and see exact pricing and delivery timelines instantly.',
  },
  fr: {
    nav_services: 'Services',
    nav_work: 'Nos Réalisations',
    nav_how_it_works: 'Comment Ça Marche',
    nav_talent: 'Équipe d’Élite',
    nav_about: 'À Propos',
    nav_insights: 'Actualités',
    nav_contact: 'Contact',
    nav_request_quote: 'Démarrer un Projet',
    nav_client_login: 'Portail Client',
    hero_badge: '✨ Agence Digitale d’Élite • Reconnue Mondialement',
    hero_title_1: 'Nous Créons des Logiciels et des Marques',
    hero_title_2: 'Qui Accélèrent Votre Croissance.',
    hero_desc: 'Des applications ultra-rapides aux identités de marque d’exception. Gestionnaires de projet dédiés, ingénieurs seniors certifiés et délais garantis.',
    hero_cta_primary: 'Démarrer Votre Projet',
    hero_cta_secondary: 'Voir Nos Projets',
    hero_stat_1_val: '180M $+',
    hero_stat_1_lbl: 'Valeur Client Générée',
    hero_stat_2_val: '99.8%',
    hero_stat_2_lbl: 'Livraison dans les Délais',
    hero_stat_3_val: '100+',
    hero_stat_3_lbl: 'Produits Lancés avec Succès',
    hero_stat_4_val: '4.98 / 5',
    hero_stat_4_lbl: 'Satisfaction Client',
    estimator_title: 'Estimateur Instantané de Prix et Délais',
    estimator_desc: 'Sélectionnez vos besoins pour obtenir instantanément un budget clair et un calendrier précis.',
  },
  yo: {
    nav_services: 'Àwọn Iṣẹ́ Wa',
    nav_work: 'Àwọn Iṣẹ́ Àṣeyọrí',
    nav_how_it_works: 'Bí A Ṣe Ń Ṣiṣẹ́',
    nav_talent: 'Àwọn Akọ́ṣẹ́mọṣẹ́',
    nav_about: 'Nípa Wa',
    nav_insights: 'Ìmọ̀ Ọ̀tun',
    nav_contact: 'Kàn Sí Wa',
    nav_request_quote: 'Bẹ̀rẹ̀ Iṣẹ́ Rẹ',
    nav_client_login: 'Àbáwọle Oníbàárà',
    hero_badge: '✨ Ilé-Iṣẹ́ Tẹknọ́lọ́jì Tó Dán Mọ́ran • Ní Nàìjíríà àti Àgbáyé',
    hero_title_1: 'A Ń Kọ́ Àwọn Ẹ̀rọ Ayélujára àti Brand',
    hero_title_2: 'Tó Ń Mú Ìdàgbàsókè Bá Iṣẹ́ Rẹ.',
    hero_desc: 'Láti orí àwọn app tó yára kánkán dé orí àwọn àwòrán brand tó rẹwà. A ní àwọn olùdarí iṣẹ́ tó ní ìrírí pẹ̀lú àmúdájú àkókò.',
    hero_cta_primary: 'Bẹ̀rẹ̀ Iṣẹ́ Rẹ Lónìí',
    hero_cta_secondary: 'Wo Àwọn Iṣẹ́ Wa',
    hero_stat_1_val: '₦270B+',
    hero_stat_1_lbl: 'Iye Owó Tá A Ti Ṣẹ̀dá Fún Oníbàárà',
    hero_stat_2_val: '99.8%',
    hero_stat_2_lbl: 'Ìparí Iṣẹ́ Lásìkò',
    hero_stat_3_val: '100+',
    hero_stat_3_lbl: 'Àwọn Ẹ̀rọ Tí A Ti Ṣe',
    hero_stat_4_val: '4.98 / 5',
    hero_stat_4_lbl: 'Ìtẹ́lọ́rùn Oníbàárà',
    estimator_title: 'Èrò Iye Owó àti Àkókò Iṣẹ́',
    estimator_desc: 'Yan ohun tó o fẹ́ kọ́ kí o sì rí iye owó àti ọjọ́ ìparí rẹ̀ lẹ́sẹ̀kẹsẹ̀.',
  },
  ha: {
    nav_services: 'Ayyukanmu',
    nav_work: 'Ayyukan da Muka Yi',
    nav_how_it_works: 'Yadda Muke Aiki',
    nav_talent: 'Kwararrunmu',
    nav_about: 'Game da Mu',
    nav_insights: 'Bayanai',
    nav_contact: 'Tuntube Mu',
    nav_request_quote: 'Fara Aiki Yanzu',
    nav_client_login: 'Shafin Abokin Ciniki',
    hero_badge: '✨ Kamfanin Fasahar Dijital Na Duniya • Daga Najeriya',
    hero_title_1: 'Muna Gina Manhajoji da Zane Masu Kyau',
    hero_title_2: 'Don Habaka Kasuwancinku.',
    hero_desc: 'Daga manhajojin waya da shafukan yanar gizo masu sauri zuwa kyakkyawan tsarin alama. Tare da manajojin aiki da kwararrun injiniyoyi.',
    hero_cta_primary: 'Fara Aikinku Yau',
    hero_cta_secondary: 'Duba Ayyukanmu',
    hero_stat_1_val: '$180M+',
    hero_stat_1_lbl: 'Darajar da Muka Samar',
    hero_stat_2_val: '99.8%',
    hero_stat_2_lbl: 'Kammala Aiki a Kan Kari',
    hero_stat_3_val: '100+',
    hero_stat_3_lbl: 'Manhajojin da Aka Kaddamar',
    hero_stat_4_val: '4.98 / 5',
    hero_stat_4_lbl: 'Gamsuwar Abokan Ciniki',
    estimator_title: 'Kimanin Farashi da Lokacin Aiki',
    estimator_desc: 'Zabi abin da kuke son ginawa don ganin farashin da lokacin kammalawa nan take.',
  },
  ig: {
    nav_services: 'Ọrụ Anyị',
    nav_work: 'Ọrụ Anyị Rụrụ',
    nav_how_it_works: 'Otu Anyị Si Arụ Ọrụ',
    nav_talent: 'Ndị Ọkachamara Anyị',
    nav_about: 'Gbasara Anyị',
    nav_insights: 'Ihe Ọhụrụ',
    nav_contact: 'Kpọtụrụ Anyị',
    nav_request_quote: 'Bido Ọrụ',
    nav_client_login: 'Ọnụ Ụzọ Ndị Ahịa',
    hero_badge: '✨ Ụlọ Ọrụ Dijitalụ Kachasị Elu • Nke A Ma Ama n’Ụwa',
    hero_title_1: 'Anyị Na-ewu Ngwanrọ na Brand Dị Elu',
    hero_title_2: 'Maka Ịkwalite Azụmahịa Gị.',
    hero_desc: 'Site na ngwa ekwentị na webụsaịtị na-agba ọsọ ruo na akara brand mara mma. Anyị nwere ndị njikwa ọrụ nwere ahụmahụ.',
    hero_cta_primary: 'Bido Ọrụ Gị Taa',
    hero_cta_secondary: 'Lee Ọrụ Anyị',
    hero_stat_1_val: '$180M+',
    hero_stat_1_lbl: 'Uru Anyị Rụpụtara',
    hero_stat_2_val: '99.8%',
    hero_stat_2_lbl: 'Imecha Ọrụ n’Oge',
    hero_stat_3_val: '100+',
    hero_stat_3_lbl: 'Ngwa Ahịa Ewepụtara',
    hero_stat_4_val: '4.98 / 5',
    hero_stat_4_lbl: 'Afọ Ojuju Ndị Ahịa',
    estimator_title: 'Ihe Ngụkọ Ọnụ Ahịa na Oge Ọrụ',
    estimator_desc: 'Họrọ ihe ịchọrọ iwulite ka ị hụ ọnụ ahịa na oge ozugbo.',
  },
  ar: {
    nav_services: 'خدماتنا',
    nav_work: 'أعمالنا',
    nav_how_it_works: 'كيف نعمل',
    nav_talent: 'فريق الخبراء',
    nav_about: 'من نحن',
    nav_insights: 'المدونة والتقارير',
    nav_contact: 'اتصل بنا',
    nav_request_quote: 'ابدأ مشروعك',
    nav_client_login: 'بوابة العملاء',
    hero_badge: '✨ وكالة رقمية رائدة عالمياً • موثوقة من كبرى الشركات',
    hero_title_1: 'نطور برمجيات وعلامات تجارية عالمية',
    hero_title_2: 'تسرع نمو أعمالك وتضاعف أرباحك.',
    hero_desc: 'من تطبيقات الهواتف فائقة السرعة والمواقع المبتكرة إلى تصاميم الهوية التجارية الراقية. مع مدراء مشاريع مخصصين وضمان الالتزام بالمواعيد.',
    hero_cta_primary: 'ابدأ مشروعك اليوم',
    hero_cta_secondary: 'شاهد أعمالنا السابقة',
    hero_stat_1_val: '+$180M',
    hero_stat_1_lbl: 'قيمة مضافة للعملاء',
    hero_stat_2_val: '99.8%',
    hero_stat_2_lbl: 'تسليم في الموعد المحدد',
    hero_stat_3_val: '+100',
    hero_stat_3_lbl: 'مشروع رقمي تم إطلاقه بنجاح',
    hero_stat_4_val: '4.98 / 5',
    hero_stat_4_lbl: 'تقييم رضا العملاء',
    estimator_title: 'حاسبة التكلفة والجدول الزمني الفورية',
    estimator_desc: 'اختر متطلبات مشروعك للحصول على تسعيرة فورية وجدول زمني دقيق.',
  },
};

let currentCurrency: SupportedCurrency = 'USD';
let currentLanguage: SupportedLanguage = 'en';

const listeners = new Set<() => void>();

export const getCurrency = () => currentCurrency;
export const setCurrency = (c: SupportedCurrency) => {
  currentCurrency = c;
  listeners.forEach((l) => l());
};

export const getLanguage = () => currentLanguage;
export const setLanguage = (l: SupportedLanguage) => {
  currentLanguage = l;
  listeners.forEach((fn) => fn());
};

export const formatPrice = (usdAmount: number, forceCurrency?: SupportedCurrency): string => {
  const curr = forceCurrency || currentCurrency;
  const config = CURRENCIES[curr] || CURRENCIES.USD;
  const converted = usdAmount * config.rateToUSD;

  if (curr === 'NGN') {
    return `₦${converted.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  } else if (curr === 'GBP') {
    return `£${converted.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  } else if (curr === 'EUR') {
    return `€${converted.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  } else if (curr === 'AED') {
    return `AED ${converted.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  }
  return `$${converted.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
};

export const useCurrencyLanguage = () => {
  const [currency, setCurr] = useState<SupportedCurrency>(currentCurrency);
  const [language, setLang] = useState<SupportedLanguage>(currentLanguage);

  useEffect(() => {
    const update = () => {
      setCurr(currentCurrency);
      setLang(currentLanguage);
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
    formatPrice,
    t,
  };
};
