import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ar';

interface Translations {
  [key: string]: {
    en: string;
    ar: string;
  };
}

const translations: Translations = {
  appName: { en: 'The Terminator AI', ar: 'مشروع The Terminator AI' },
  login: { en: 'Login', ar: 'تسجيل الدخول' },
  enterEmail: { en: 'Enter your email to receive a magic link', ar: 'أدخل بريدك الإلكتروني لتلقي رابط تسجيل الدخول' },
  sendMagicLink: { en: 'Send Magic Link', ar: 'إرسال رابط تسجيل الدخول' },
  magicLinkSent: { en: 'Magic link sent!', ar: 'تم إرسال رابط تسجيل الدخول!' },
  dashboard: { en: 'Dashboard', ar: 'لوحة التحكم' },
  results: { en: 'Results', ar: 'النتائج' },
  settings: { en: 'Settings', ar: 'الإعدادات' },
  yourFacebookUrl: { en: 'Your Facebook Page URL', ar: 'رابط صفحتك على فيسبوك' },
  enterFacebookUrl: { en: 'https://facebook.com/yourpage', ar: 'رابط صفحتك' },
  competitorUrls: { en: 'Competitor Page URLs (Optional)', ar: 'روابط صفحات المنافسين (اختياري)' },
  competitor: { en: 'Competitor', ar: 'منافس' },
  analyze: { en: 'Analyze Market', ar: 'تحليل السوق' },
  analyzing: { en: 'Analyzing...', ar: 'جاري التحليل...' },
  marketScore: { en: 'Market Score', ar: 'درجة السوق' },
  swotAnalysis: { en: 'SWOT Analysis', ar: 'تحليل SWOT' },
  strengths: { en: 'Strengths', ar: 'نقاط القوة' },
  weaknesses: { en: 'Weaknesses', ar: 'نقاط الضعف' },
  opportunities: { en: 'Opportunities', ar: 'الفرص' },
  threats: { en: 'Threats', ar: 'التهديدات' },
  contentRoadmap: { en: 'Content Roadmap', ar: 'خطة المحتوى' },
  comparisonTable: { en: 'Comparison Table', ar: 'جدول المقارنة' },
  metric: { en: 'Metric', ar: 'المقياس' },
  you: { en: 'You', ar: 'أنت' },
  competitorAvg: { en: 'Competitor Avg', ar: 'متوسط المنافسين' },
  followers: { en: 'Followers', ar: 'المتابعون' },
  engagement: { en: 'Engagement', ar: 'التفاعل' },
  postFrequency: { en: 'Post Frequency', ar: 'تكرار المنشورات' },
  topContent: { en: 'Top Content', ar: 'أفضل المحتوى' },
  exportPdf: { en: 'Export PDF', ar: 'تصدير PDF' },
  exportPdfDesc: { en: 'Generating your report...', ar: 'جاري إنشاء تقريرك...' },
  logout: { en: 'Logout', ar: 'تسجيل الخروج' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
