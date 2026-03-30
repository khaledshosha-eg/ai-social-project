import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ar';

interface Translations {
  [key: string]: { en: string; ar: string };
}

const translations: Translations = {
  appName: { en: 'AI Social Project', ar: 'AI Social Project' },
  login: { en: 'Login', ar: 'تسجيل الدخول' },
  email: { en: 'Email Address', ar: 'البريد الإلكتروني' },
  sendMagicLink: { en: 'Send Magic Link', ar: 'إرسال رابط الدخول' },
  magicLinkSent: { en: 'Magic link sent! Check your inbox.', ar: 'تم إرسال الرابط! تحقق من بريدك.' },
  enterEmail: { en: 'Enter your email to get started', ar: 'أدخل بريدك الإلكتروني للبدء' },
  dashboard: { en: 'Dashboard', ar: 'لوحة التحكم' },
  results: { en: 'Results', ar: 'النتائج' },
  settings: { en: 'Settings', ar: 'الإعدادات' },
  analyze: { en: 'Analyze', ar: 'تحليل' },
  analyzing: { en: 'Analyzing...', ar: 'جاري التحليل...' },
  yourFacebookUrl: { en: 'Your Facebook Page URL', ar: 'رابط صفحتك على فيسبوك' },
  competitorUrls: { en: 'Competitor URLs (up to 3)', ar: 'روابط المنافسين (حتى 3)' },
  competitor: { en: 'Competitor', ar: 'منافس' },
  enterFacebookUrl: { en: 'https://facebook.com/yourpage', ar: 'https://facebook.com/yourpage' },
  marketScore: { en: 'Market Score', ar: 'نقاط السوق' },
  comparisonTable: { en: 'Comparison Table', ar: 'جدول المقارنة' },
  swotAnalysis: { en: 'SWOT Analysis', ar: 'تحليل SWOT' },
  contentPlan: { en: 'Weekly Content Plan', ar: 'خطة المحتوى الأسبوعية' },
  strengths: { en: 'Strengths', ar: 'نقاط القوة' },
  weaknesses: { en: 'Weaknesses', ar: 'نقاط الضعف' },
  opportunities: { en: 'Opportunities', ar: 'الفرص' },
  threats: { en: 'Threats', ar: 'التهديدات' },
  metric: { en: 'Metric', ar: 'المقياس' },
  you: { en: 'You', ar: 'أنت' },
  avg: { en: 'Avg', ar: 'المتوسط' },
  followers: { en: 'Followers', ar: 'المتابعون' },
  engagement: { en: 'Engagement Rate', ar: 'معدل التفاعل' },
  postFrequency: { en: 'Post Frequency', ar: 'معدل النشر' },
  responseTime: { en: 'Response Time', ar: 'وقت الاستجابة' },
  backToDashboard: { en: 'Back to Dashboard', ar: 'العودة للوحة التحكم' },
  aiGenerating: { en: 'AI is generating your content plan...', ar: 'الذكاء الاصطناعي يقوم بإنشاء خطة المحتوى...' },
  logout: { en: 'Logout', ar: 'تسجيل الخروج' },
  competitorAvg: { en: 'Competitor Avg', ar: 'متوسط المنافسين' },
  scoreExcellent: { en: 'Excellent market position', ar: 'موقع ممتاز في السوق' },
  scoreGood: { en: 'Good market position', ar: 'موقع جيد في السوق' },
  scoreFair: { en: 'Fair market position — room for growth', ar: 'موقع مقبول — مجال للنمو' },
  scoreNeedsWork: { en: 'Needs improvement', ar: 'يحتاج تحسين' },
  downloadPdf: { en: 'Download as PDF', ar: 'تحميل كـ PDF' },
  shareReport: { en: 'Share Report', ar: 'مشاركة التقرير' },
  exportPdf: { en: 'Export', ar: 'تصدير' },
  exportPdfDesc: { en: 'Use the print dialog to save as PDF', ar: 'استخدم نافذة الطباعة للحفظ كـ PDF' },
  linkCopied: { en: 'Link Copied', ar: 'تم نسخ الرابط' },
  linkCopiedDesc: { en: 'Report link copied to clipboard', ar: 'تم نسخ رابط التقرير' },
  shareReportText: { en: 'Check out my AI Social Project market analysis report!', ar: 'تحقق من تقرير تحليل السوق الخاص بي من AI Social Project!' },
  sentimentAnalysis: { en: 'Sentiment Analysis', ar: 'تحليل المشاعر' },
  positive: { en: 'Positive', ar: 'إيجابي' },
  negative: { en: 'Negative', ar: 'سلبي' },
  demoModeTitle: { en: 'Demo report shown', ar: 'تم عرض تقرير تجريبي' },
  demoModeDescription: { en: 'AI credits are exhausted, so a demo analysis was generated instead.', ar: 'تم استهلاك رصيد الذكاء الاصطناعي، لذلك تم إنشاء تحليل تجريبي بدلاً من ذلك.' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');
  const dir = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [language, dir]);

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
