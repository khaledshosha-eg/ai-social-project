import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Zap, 
  Target, 
  BarChart3, 
  Users, 
  Sparkles,
  Search,
  Globe,
  Brain,
  Activity,
  Moon,
  Sun,
  Languages
} from 'lucide-react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isDark, setIsDark] = useState(true);
  const [lang, setLang] = useState<'en' | 'ar'>('en');

  // تفعيل البحث عند الضغط على Enter أو الأيقونة
  const handleAction = () => {
    if (email.trim()) navigate('/dashboard');
  };

  const handleEmailSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAction();
  };

  const content = {
    en: {
      home: "Home",
      what: "What is Ai Social Project?",
      about: "About Us",
      contact: "Contact Us",
      accel: "Accelerate Your",
      biz: "Business Intelligence",
      sub: "immerse yourself in an elegant blend of professionalism and innovation. let's make your business stronger",
      eco: "Ai Social Project Ecosystem",
      ecoSub: "Integrated smart tools for analyzing and managing social media with high efficiency",
      start: "Get Started",
      placeholder: "Enter your email address...",
    },
    ar: {
      home: "الرئيسية",
      what: "ما هو المشروع؟",
      about: "من نحن",
      contact: "تواصل معنا",
      accel: "سرّع أعمالك مع",
      biz: "ذكاء الأعمال",
      sub: "انغمس في مزيج أنيق من الاحتراف والابتكار. لنجعل عملك أقوى.",
      eco: "منظومة Ai Social Project",
      ecoSub: "أدوات ذكية متكاملة لتحليل وإدارة وسائل التواصل الاجتماعي بكفاءة عالية",
      start: "ابدأ الآن",
      placeholder: "أدخل بريدك الإلكتروني...",
    }
  };

  const t = content[lang];

  return (
    <div className={`${isDark ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white' : 'bg-slate-50 text-slate-900'} min-h-screen transition-colors duration-500 overflow-x-hidden ${lang === 'ar' ? 'font-["Cairo"]' : 'font-["Poppins"]'}`}>
      
      {/* Container 80% Scale */}
      <div className="transform scale-[0.85] lg:scale-[0.8] origin-top transition-all duration-500">
        
        {/* Animated Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-800/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-700/10 rounded-full blur-3xl"></div>
        </div>

        {/* Navbar - Slim & Rounded */}
        <nav className="relative z-50 px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <div className={`backdrop-blur-xl ${isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'} border rounded-full px-8 py-3 shadow-2xl flex items-center justify-between`}>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-lg shadow-blue-500/50">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                    Ai Social Project
                  </span>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
                <a href="#" className="text-sm font-medium hover:text-blue-400 hover:drop-shadow-[0_0_10px_rgba(59,130,246,0.8)] transition-all">{t.home}</a>
                <a href="#about" className="text-sm font-medium opacity-70 hover:opacity-100 hover:text-blue-400 transition-all">{t.what}</a>
                <a href="#who" className="text-sm font-medium opacity-70 hover:opacity-100 hover:text-blue-400 transition-all">{t.about}</a>
              </div>

              <div className="flex items-center gap-4">
                <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} className="p-2 rounded-full hover:bg-blue-500/20 transition-all hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                  <Languages size={18} />
                </button>
                <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-full hover:bg-blue-500/20 transition-all hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <button className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-xs font-semibold transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/60 hover:scale-105 active:scale-95">
                  {t.contact}
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative z-10 px-6 pt-10 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-5xl mx-auto flex flex-col items-center">
              
              {/* Get Started - Animated & At Top */}
              <div className="inline-flex items-center gap-2 px-6 py-2 mb-8 rounded-full bg-blue-600/20 backdrop-blur-sm border border-blue-500/30 shadow-lg animate-[bounce_3s_infinite] hover:shadow-blue-400/40 cursor-pointer">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-white font-semibold text-sm">{t.start}</span>
              </div>

              {/* Main Heading */}
              <h1 className="font-bold text-5xl md:text-7xl leading-tight mb-8">
                <span className="block bg-gradient-to-b from-white via-white to-gray-400 bg-clip-text text-transparent drop-shadow-2xl">
                  {t.accel}
                </span>
                <span className="block bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent drop-shadow-2xl">
                  {t.biz}
                </span>
              </h1>

              {/* Subtitle - Matched size with Ecosystem sub */}
              <p className="text-gray-400 text-lg md:text-xl font-light max-w-2xl mx-auto mb-12 leading-relaxed">
                {t.sub}
              </p>

              {/* Floating Icons with Glowing White Brain */}
              <div className="flex items-center justify-center gap-10 mb-16">
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 shadow-xl hover:scale-110 hover:shadow-blue-500/50 hover:bg-white/10 transition-all cursor-pointer">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                </div>
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 shadow-xl hover:scale-110 hover:shadow-blue-500/50 hover:bg-white/10 transition-all cursor-pointer">
                  <Target className="w-5 h-5 text-blue-400" />
                </div>

                <div className="relative">
                  <div className="absolute inset-0 bg-white rounded-full blur-3xl opacity-30 animate-pulse"></div>
                  <div className="relative backdrop-blur-xl bg-gradient-to-br from-blue-600/40 to-blue-800/40 border border-blue-400/50 rounded-full p-12 shadow-2xl shadow-blue-500/50 hover:shadow-white/40 transition-all cursor-pointer group">
                    <Brain className="w-20 h-20 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] group-hover:scale-110 transition-transform" />
                  </div>
                </div>

                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 shadow-xl hover:scale-110 hover:shadow-blue-500/50 hover:bg-white/10 transition-all cursor-pointer">
                  <Zap className="w-5 h-5 text-blue-400" />
                </div>
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 shadow-xl hover:scale-110 hover:shadow-blue-500/50 hover:bg-white/10 transition-all cursor-pointer">
                  <Globe className="w-5 h-5 text-blue-400" />
                </div>
              </div>

              {/* Email Input Bar - Wide & Gradient */}
              <div className="w-full max-w-3xl relative flex items-center gap-4">
                <div className="flex-1 relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={handleEmailSubmit}
                    placeholder={t.placeholder}
                    className="w-full px-10 py-5 bg-gradient-to-r from-white to-gray-200 text-gray-800 placeholder-gray-400 outline-none rounded-full font-bold shadow-2xl focus:ring-4 focus:ring-blue-500/50 transition-all"
                  />
                </div>
                <div 
                  onClick={handleAction}
                  className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-full p-5 shadow-xl hover:bg-white/20 hover:shadow-blue-400/40 cursor-pointer transition-all active:scale-90"
                >
                  <Search className="w-7 h-7 text-gray-400 hover:text-blue-400 transition-colors" />
                </div>
              </div>

              <div className="mt-4">
                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  Press Enter to go to Dashboard
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Ecosystem Section */}
        <section className="relative z-10 px-6 py-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                {t.eco}
              </h2>
              <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
                {t.ecoSub}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Growth Card */}
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl hover:border-blue-500/50 hover:shadow-blue-500/20 transition-all duration-300 group cursor-default">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600/30 to-blue-800/30 border border-blue-500/30">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Growth</h3>
                </div>
                <div className="flex items-end justify-between gap-2 h-32 mb-4">
                  {[40, 60, 35, 80, 55, 90, 70, 45, 85, 100, 65, 75].map((height, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-300 group-hover:from-blue-400 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]" style={{ height: `${height}%` }}></div>
                  ))}
                </div>
                <div className="border-t border-white/10 pt-6">
                  <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">4,598,807</div>
                </div>
              </div>

              {/* AI Agents Card */}
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl hover:border-blue-500/50 hover:shadow-blue-500/20 transition-all duration-300 group cursor-default">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600/30 to-blue-800/30 border border-blue-500/30">
                      <Users className="w-5 h-5 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">AI Agents</h3>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mb-6 leading-relaxed">Over 60 types of specialized AI agents for content and audience analysis</p>
                <div className="flex items-end justify-between border-t border-white/10 pt-6">
                  <div>
                    <div className="text-4xl font-bold mb-1 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">4,762</div>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/60">+1.08%</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Glow */}
        <div className="relative z-10 h-1 bg-gradient-to-r from-transparent via-blue-600 to-transparent opacity-50"></div>
      </div>

      {/* Global Style for Hover Effects */}
      <style>{`
        .transition-all:hover {
          filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.6));
        }
      `}</style>
    </div>
  );
};

export default HomePage;