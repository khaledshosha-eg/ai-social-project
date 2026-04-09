import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Trophy, TrendingUp, Info, Star, Zap, Target, Users, BarChart2, Award } from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  Cell
} from 'recharts';
import { cn } from '@/lib/utils';

// ثنائي اللغة
const i18n: Record<string, { en: string; ar: string }> = {
  marketLeader:       { en: 'Current Market Leader',        ar: 'قائد السوق الحالي' },
  leaderLabel:        { en: 'Leader',                       ar: 'الأفضل' },
  rankingsTitle:      { en: 'Intelligence Rankings',        ar: 'ترتيب الذكاء التنافسي' },
  rankingsDesc:       { en: 'Scores based on AI analysis',  ar: 'النتائج بناءً على تحليل الذكاء الاصطناعي' },
  radarTitle:         { en: 'Competitive Radar',            ar: 'الرادار التنافسي' },
  radarDesc:          { en: 'Multi-dimensional comparison', ar: 'مقارنة متعددة الأبعاد' },
  comparisonTitle:    { en: 'Quick Comparison Matrix',      ar: 'مصفوفة المقارنة السريعة' },
  comparisonDesc:     { en: 'Side-by-side metric overview', ar: 'مقارنة المقاييس جنباً إلى جنب' },
  metric:             { en: 'Metric',                       ar: 'المقياس' },
  rank:               { en: 'Rank',                         ar: 'الترتيب' },
  score:              { en: 'Score',                        ar: 'النتيجة' },
  topAdvantage:       { en: 'Top Advantage',                ar: 'الميزة الرئيسية' },
  noData:             { en: 'Waiting for analysis data...', ar: 'في انتظار بيانات التحليل...' },
};

const t = (key: string, lang: 'en' | 'ar') => i18n[key]?.[lang] ?? key;

// ألوان الترتيب
const RANK_CONFIG: Record<number, { color: string; bg: string; border: string; glow: string; hex: string }> = {
  1: { color: 'text-amber-400',  bg: 'bg-amber-400/10',  border: 'border-amber-400/30',  glow: 'shadow-[0_0_30px_rgba(251,191,36,0.25)]',  hex: '#FBBF24' },
  2: { color: 'text-slate-300',  bg: 'bg-slate-300/10',  border: 'border-slate-300/20',  glow: 'shadow-[0_0_20px_rgba(203,213,225,0.15)]', hex: '#CBD5E1' },
  3: { color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/25', glow: 'shadow-[0_0_20px_rgba(251,146,60,0.15)]',  hex: '#FB923C' },
  4: { color: 'text-white/40',   bg: 'bg-white/5',       border: 'border-white/10',      glow: '',                                          hex: '#6B7280' },
};

const RADAR_COLORS = ['#FBBF24', '#8B5CF6', '#10B981', '#3B82F6'];

// Custom Tooltip للـ BarChart
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0a0a1a] border border-white/10 rounded-xl px-4 py-3 shadow-2xl">
        <p className="text-white/60 text-xs mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="text-sm font-bold" style={{ color: p.fill }}>
            {p.name}: <span className="text-white">{p.value}/100</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Progress Bar مخصص
const ScoreBar = ({ value, color }: { value: number; color: string }) => (
  <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/5">
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${value}%` }}
      transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
      className="absolute inset-y-0 left-0 rounded-full"
      style={{ background: `linear-gradient(90deg, ${color}88, ${color})` }}
    />
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: [0, 1, 0], x: [0, 8, 0] }}
      transition={{ duration: 1.5, delay: 0.5, repeat: Infinity, repeatDelay: 3 }}
      className="absolute inset-y-0 w-8 rounded-full blur-sm"
      style={{ left: `${value - 5}%`, background: color }}
    />
  </div>
);

// بطاقة KPI
const KpiCard = ({ icon: Icon, label, value, sub, color }: { icon: any; label: string; value: string | number; sub?: string; color: string }) => (
  <motion.div
    whileHover={{ scale: 1.03, y: -2 }}
    className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 cursor-default"
  >
    <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
      style={{ background: `radial-gradient(circle at 50% 0%, ${color}15, transparent 70%)` }} />
    <div className="flex items-start justify-between gap-2">
      <div className="flex flex-col gap-1">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-white/40">{label}</span>
        <span className="text-2xl font-black text-white">{value}</span>
        {sub && <span className="text-xs text-white/40">{sub}</span>}
      </div>
      <div className="rounded-xl p-2" style={{ background: `${color}20` }}>
        <Icon size={18} style={{ color }} />
      </div>
    </div>
  </motion.div>
);

// بطاقة الترتيب
const RankCard = ({ rankItem, lang }: { rankItem: any; lang: 'en' | 'ar' }) => {
  const [hovered, setHovered] = useState(false);
  const cfg = RANK_CONFIG[rankItem.rank] ?? RANK_CONFIG[4];

  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className={cn(
        'relative overflow-hidden rounded-2xl border p-5 cursor-default transition-all duration-300',
        cfg.border, cfg.bg, hovered ? cfg.glow : ''
      )}
    >
      {/* خلفية متحركة عند الـ hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(circle at 50% 0%, ${cfg.hex}12, transparent 65%)` }}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col gap-4">
        {/* الرأس */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={cn('text-xs font-bold uppercase tracking-widest', cfg.color)}>
              #{rankItem.rank}
            </span>
            {rankItem.rank === 1 && <Crown size={14} className="text-amber-400" />}
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-white">{rankItem.score}</span>
            <span className="text-xs text-white/30">/100</span>
          </div>
        </div>

        {/* الاسم */}
        <p className="text-lg font-black text-white leading-tight">{rankItem.page}</p>

        {/* شريط التقدم */}
        <ScoreBar value={rankItem.score} color={cfg.hex} />

        {/* السبب */}
        <p className="flex gap-2 text-xs leading-relaxed text-white/55">
          <Info size={13} className="mt-0.5 shrink-0 text-white/30" />
          {rankItem.reason}
        </p>

        {/* الميزة */}
        <div className="border-t border-white/5 pt-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 block mb-1">
            {t('topAdvantage', lang)}
          </span>
          <span
            className="inline-block rounded-lg px-3 py-1 text-[11px] font-bold"
            style={{ background: `${cfg.hex}20`, color: cfg.hex, border: `1px solid ${cfg.hex}30` }}
          >
            🏆 {rankItem.top_advantage}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// المكوّن الرئيسي
const MarketOverview = ({ data }: { data: any }) => {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const marketData = data?.market_overview || data;

  if (!marketData?.ranking) {
    return (
      <div className="p-12 text-center bg-card/20 backdrop-blur-xl border border-white/10 rounded-3xl" data-tab="market">
        <p className="text-muted-foreground">{t('noData', lang)}</p>
      </div>
    );
  }

  // بيانات الرادار
  const radarData = ['Engagement', 'Content', 'Followers', 'Consistency', 'Growth'].map((dim, i) => {
    const obj: any = { subject: dim };
    marketData.ranking.forEach((r: any, ri: number) => {
      obj[r.page] = Math.max(20, r.score - i * 5 + ri * 3);
    });
    return obj;
  });

  // بيانات الـ BarChart
  const barData = marketData.ranking.map((r: any) => ({
    name: r.page.length > 12 ? r.page.slice(0, 12) + '…' : r.page,
    score: r.score,
  }));

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.07 } },
  };

  return (
    <motion.div
      variants={container} initial="hidden" animate="show"
      className="space-y-8" data-tab="market"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* زرار اللغة */}
      <div className="flex justify-end">
        <div className="flex rounded-xl border border-white/10 overflow-hidden">
          {(['en', 'ar'] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={cn(
                'px-4 py-2 text-xs font-bold transition-all',
                lang === l ? 'bg-primary text-white' : 'text-white/40 hover:text-white/70'
              )}
            >
              {l === 'en' ? 'EN' : 'عربي'}
            </button>
          ))}
        </div>
      </div>

      {/* قائد السوق */}
      <motion.div
        variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
        whileHover={{ scale: 1.005 }}
        className="relative overflow-hidden rounded-3xl border border-amber-400/20 bg-amber-400/[0.05] p-8 cursor-default"
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(circle at 20% 50%, rgba(251,191,36,0.08), transparent 60%)' }} />
        <div className="absolute top-0 right-0 w-64 h-64 opacity-5">
          <Crown className="w-full h-full text-amber-400" />
        </div>
        <div className="relative z-10 flex flex-col gap-3">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400">
            {t('leaderLabel', lang)} — {t('marketLeader', lang)}
          </span>
          <p className="text-4xl font-black text-white md:text-5xl">
            {marketData.market_leader?.page}
          </p>
          <p className="max-w-3xl text-base leading-relaxed text-white/65 italic md:text-lg">
            &ldquo;{marketData.market_leader?.why}&rdquo;
          </p>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard icon={Award}    label={t('rank', lang) + ' #1 Score'} value={marketData.ranking[0]?.score + '/100'} sub={marketData.ranking[0]?.page} color="#FBBF24" />
        <KpiCard icon={Users}    label="Pages Analyzed"                 value={marketData.ranking.length}           sub="Competitors"                             color="#8B5CF6" />
        <KpiCard icon={Target}   label="Avg Score"                      value={Math.round(marketData.ranking.reduce((s: number, r: any) => s + r.score, 0) / marketData.ranking.length) + '/100'} sub="Market Average" color="#10B981" />
        <KpiCard icon={Zap}      label="Score Gap"                      value={(marketData.ranking[0]?.score - (marketData.ranking[marketData.ranking.length - 1]?.score || 0)) + 'pts'} sub="Leader vs Last" color="#3B82F6" />
      </div>

      {/* بطاقات الترتيب */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-4">
          {t('rankingsTitle', lang)} — {t('rankingsDesc', lang)}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {marketData.ranking.map((r: any, i: number) => (
            <RankCard key={i} rankItem={r} lang={lang} />
          ))}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <motion.div
          variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } }}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Star size={16} className="text-primary" />
            <div>
              <p className="text-sm font-bold text-white">{t('radarTitle', lang)}</p>
              <p className="text-xs text-white/40">{t('radarDesc', lang)}</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 11 }} />
              {marketData.ranking.map((r: any, i: number) => (
                <Radar
                  key={r.page} name={r.page} dataKey={r.page}
                  stroke={RADAR_COLORS[i]} fill={RADAR_COLORS[i]} fillOpacity={0.12}
                  strokeWidth={2}
                />
              ))}
              <Legend wrapperStyle={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Bar Chart */}
        <motion.div
          variants={{ hidden: { opacity: 0, x: 20 }, show: { opacity: 1, x: 0 } }}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 size={16} className="text-primary" />
            <div>
              <p className="text-sm font-bold text-white">Intelligence Score</p>
              <p className="text-xs text-white/40">Comparative scoring overview</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                {barData.map((_: any, i: number) => (
                  <Cell key={i} fill={RADAR_COLORS[i] || '#6B7280'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Comparison Table */}
      {marketData.quick_comparison?.length > 0 && (
        <motion.div
          variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp size={16} className="text-primary" />
            <div>
              <p className="text-sm font-bold text-white">{t('comparisonTitle', lang)}</p>
              <p className="text-xs text-white/40">{t('comparisonDesc', lang)}</p>
            </div>
          </div>
          <div className="overflow-x-auto rounded-xl border border-white/5">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-white/40">
                    {t('metric', lang)}
                  </th>
                  {Object.keys(marketData.quick_comparison[0]?.values || {}).map((pageKey, i) => (
                    <th key={pageKey} className="px-4 py-3 text-xs font-bold uppercase tracking-widest" style={{ color: RADAR_COLORS[i] || '#fff' }}>
                      {pageKey}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {marketData.quick_comparison.map((row: any, rIdx: number) => (
                  <motion.tr
                    key={rIdx}
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
                    className="border-b border-white/5 transition-colors cursor-default"
                  >
                    <td className="px-4 py-3 text-sm font-semibold text-white/80">{row.metric}</td>
                    {Object.entries(row.values).map(([key, val]: [string, any], vIdx) => {
                      const numVal = parseFloat(val);
                      const isHigh = !isNaN(numVal) && numVal >= 5;
                      return (
                        <td key={`${key}-${vIdx}`} className="px-4 py-3">
                          <motion.span
                            whileHover={{ scale: 1.05 }}
                            className={cn(
                              'inline-block rounded-lg px-3 py-1 text-sm font-semibold transition-all',
                              isHigh
                                ? 'border border-emerald-500/25 bg-emerald-500/15 text-emerald-400'
                                : 'text-white/60 hover:text-white/80'
                            )}
                          >
                            {val}
                          </motion.span>
                        </td>
                      );
                    })}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MarketOverview;