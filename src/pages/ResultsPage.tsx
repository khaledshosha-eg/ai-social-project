import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Share2, Sparkles, Trophy, Target } from 'lucide-react';
import ComparisonTable from '@/components/results/ComparisonTable';
import { useLanguage } from '@/contexts/LanguageContext';

interface ActionStep {
  priority: string;
  action: string;
  reason: string;
  expected_result: string;
}

interface AnalysisData {
  market_score: number;
  ranking?: {
    position: string;
    strongest_competitor: string;
    gap_to_leader: string;
  };
  swot_analysis: {
    strengths: string[];
    weaknesses: string[];
    opportunities?: string[];
    threats?: string[];
  };
  action_plan?: ActionStep[];
  analysis_summary: string;
  comparison: { metric: string; client: string | number; competitor_avg: string | number }[];
}

const ResultsPage = () => {
  const navigate = useNavigate();
  const { t, dir } = useLanguage();
  const [data, setData] = useState<AnalysisData | null>(null);

  useEffect(() => {
    const result = localStorage.getItem('analysis_result');
    if (!result) {
      navigate('/dashboard');
      return;
    }
    try {
      setData(JSON.parse(result));
    } catch (e) {
      console.error("JSON Parse Error:", e);
    }
  }, [navigate]);

  const handleExport = () => {
    if (!data) return;
    const printContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8" />
        <title>تقرير التحليل - The Terminator AI</title>
        <style>
          body { font-family: Arial, sans-serif; background: #fff; color: #111; padding: 40px; direction: rtl; }
          h1 { color: #7c3aed; font-size: 28px; margin-bottom: 8px; }
          h2 { color: #7c3aed; font-size: 20px; border-bottom: 2px solid #7c3aed; padding-bottom: 6px; margin-top: 30px; }
          .score-box { background: #f3f0ff; border: 2px solid #7c3aed; border-radius: 12px; padding: 16px 24px; display: inline-block; margin: 16px 0; }
          .score { font-size: 48px; font-weight: 900; color: #7c3aed; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          th { background: #7c3aed; color: white; padding: 10px 16px; text-align: right; }
          td { padding: 10px 16px; border-bottom: 1px solid #e5e7eb; text-align: right; }
          tr:nth-child(even) { background: #f9f7ff; }
          .box { border-radius: 8px; padding: 16px; margin-top: 12px; }
          .strengths { background: #ecfdf5; border: 1px solid #6ee7b7; }
          .weaknesses { background: #fff1f2; border: 1px solid #fda4af; }
          .opportunities { background: #eff6ff; border: 1px solid #93c5fd; }
          .threats { background: #fffbeb; border: 1px solid #fcd34d; }
          .action-step { background: #f9f7ff; border-right: 4px solid #7c3aed; border-radius: 8px; padding: 14px 16px; margin-top: 10px; }
          ul { margin: 0; padding-right: 20px; }
          li { margin-bottom: 6px; font-size: 14px; }
          .summary { background: #f3f0ff; border-radius: 10px; padding: 20px; line-height: 1.9; font-size: 15px; margin-top: 12px; }
          .footer { margin-top: 40px; text-align: center; color: #9ca3af; font-size: 12px; }
        </style>
      </head>
      <body>
        <h1>📊 تقرير تحليل السوشيال ميديا</h1>
        <p style="color:#6b7280">تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}</p>
        <div class="score-box">
          <div style="font-size:13px;color:#6b7280;margin-bottom:4px">Market Score</div>
          <div class="score">${data.market_score}%</div>
        </div>
        ${data.ranking ? `<div style="background:#f3f0ff;border-radius:10px;padding:16px;margin-top:12px">
          <strong>🏆 ترتيبك:</strong> المرتبة ${data.ranking.position} من 4 &nbsp;|&nbsp;
          <strong>أقوى منافس:</strong> ${data.ranking.strongest_competitor} &nbsp;|&nbsp;
          <strong>الفجوة:</strong> ${data.ranking.gap_to_leader}
        </div>` : ''}
        <h2>📋 جدول المقارنة</h2>
        <table>
          <thead><tr><th>المعيار</th><th>صفحتك</th><th>متوسط المنافسين</th></tr></thead>
          <tbody>${data.comparison.map(r => `<tr><td>${r.metric}</td><td>${r.client}</td><td>${r.competitor_avg}</td></tr>`).join('')}</tbody>
        </table>
        <h2>💡 تحليل SWOT</h2>
        <div class="box strengths"><strong style="color:#059669">✅ نقاط القوة</strong><ul>${data.swot_analysis.strengths.map(s=>`<li>${s}</li>`).join('')}</ul></div>
        <div class="box weaknesses"><strong style="color:#e11d48">⚠️ نقاط الضعف</strong><ul>${data.swot_analysis.weaknesses.map(w=>`<li>${w}</li>`).join('')}</ul></div>
        ${data.swot_analysis.opportunities?.length ? `<div class="box opportunities"><strong style="color:#2563eb">🔵 الفرص</strong><ul>${data.swot_analysis.opportunities.map(o=>`<li>${o}</li>`).join('')}</ul></div>` : ''}
        ${data.swot_analysis.threats?.length ? `<div class="box threats"><strong style="color:#d97706">🔴 التهديدات</strong><ul>${data.swot_analysis.threats.map(th=>`<li>${th}</li>`).join('')}</ul></div>` : ''}
        ${data.action_plan?.length ? `<h2>🚀 خطة العمل المخصصة</h2>${data.action_plan.map(s=>`
          <div class="action-step">
            <strong>${s.priority}. ${s.action}</strong><br/>
            <span style="color:#6b7280;font-size:13px">📊 السبب: ${s.reason}</span><br/>
            <span style="color:#059669;font-size:13px">✅ المتوقع: ${s.expected_result}</span>
          </div>`).join('')}` : ''}
        <h2>🧠 التحليل الاستراتيجي</h2>
        <div class="summary">${data.analysis_summary}</div>
        <div class="footer">تم إنشاؤه بواسطة The Terminator AI</div>
      </body></html>`;
    const win = window.open('', '_blank');
    if (win) { win.document.write(printContent); win.document.close(); win.focus(); setTimeout(() => win.print(), 500); }
  };

  const handleShare = () => {
    if (!data) return;
    const text = `📊 The Terminator AI\nMarket Score: ${data.market_score}%\n${data.ranking ? `ترتيبي: ${data.ranking.position}/4\n` : ''}\n💪 نقاط القوة:\n${data.swot_analysis.strengths.map(s=>`• ${s}`).join('\n')}\n\n⚠️ نقاط الضعف:\n${data.swot_analysis.weaknesses.map(w=>`• ${w}`).join('\n')}\n\n🧠 ${data.analysis_summary}`;
    if (navigator.share) { navigator.share({ title: 'The_Terminator_AI Report', text }); }
    else { navigator.clipboard.writeText(text); alert('تم نسخ التقرير ✅'); }
  };

  if (!data) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center relative">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-800/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white font-['Montserrat'] relative overflow-x-hidden">

      {/* تأثير الإضاءة النبضي — نفس الداشبورد والرئيسية */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-800/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-6xl mx-auto p-6 space-y-10">

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
            <ArrowLeft className={`w-5 h-5 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
            <span>{t('backToDashboard')}</span>
          </button>
          <div className="flex gap-3">
            <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-bold transition-all">
              <Download className="w-4 h-4" /><span>Export PDF</span>
            </button>
            <button onClick={handleShare} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 transition-all">
              <Share2 className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Score Header */}
        <div className="text-center space-y-4">
          <motion.h1 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-4xl md:text-5xl font-bold tracking-tight">
            {t('results')} <span style={{ color: '#6B4FBB' }}>Ai</span> <span className="text-white">The Terminator AI</span>
          </motion.h1>
          <div className="inline-flex items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-xl">
            <div className={dir === 'rtl' ? 'text-right' : 'text-left'}>
              <p className="text-xs text-white/50 uppercase tracking-widest font-bold">{t('marketScore')}</p>
              <p className="text-3xl font-black text-accent">{data.market_score}%</p>
            </div>
            <div className="w-px h-10 bg-white/10"></div>
            <div className={dir === 'rtl' ? 'text-left' : 'text-right'}>
              <p className="text-xs text-white/50 uppercase tracking-widest font-bold">{t('marketOpportunity')}</p>
              <p className="text-lg font-bold text-emerald-400">{t('excellentOpportunity')}</p>
            </div>
          </div>
        </div>

        {/* Ranking Card */}
        {data.ranking && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-xl">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
              <Trophy className="w-5 h-5 text-accent" /> ترتيبك بين المنافسين
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-3xl font-black text-primary">{data.ranking.position}/4</p>
                <p className="text-xs text-white/50 mt-1">مرتبتك الحالية</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-sm font-bold text-white break-all">{data.ranking.strongest_competitor}</p>
                <p className="text-xs text-white/50 mt-1">أقوى منافس</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-sm font-bold text-rose-400">{data.ranking.gap_to_leader}</p>
                <p className="text-xs text-white/50 mt-1">الفجوة</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Comparison + SWOT */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ComparisonTable data={data.comparison || []} />
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-xl">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
              <span className="w-2 h-6 bg-accent rounded-full"></span>
              {t('swotAnalysis')}
            </h3>
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <h4 className="text-emerald-400 font-bold text-sm mb-2">{t('strengths')}</h4>
                <ul className="text-xs space-y-1 list-disc list-inside text-white/60">
                  {data.swot_analysis?.strengths?.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <h4 className="text-rose-400 font-bold text-sm mb-2">{t('weaknesses')}</h4>
                <ul className="text-xs space-y-1 list-disc list-inside text-white/60">
                  {data.swot_analysis?.weaknesses?.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </div>
              {data.swot_analysis?.opportunities && data.swot_analysis.opportunities.length > 0 && (
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <h4 className="text-blue-400 font-bold text-sm mb-2">الفرص</h4>
                  <ul className="text-xs space-y-1 list-disc list-inside text-white/60">
                    {data.swot_analysis.opportunities.map((o, i) => <li key={i}>{o}</li>)}
                  </ul>
                </div>
              )}
              {data.swot_analysis?.threats && data.swot_analysis.threats.length > 0 && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <h4 className="text-amber-400 font-bold text-sm mb-2">التهديدات</h4>
                  <ul className="text-xs space-y-1 list-disc list-inside text-white/60">
                    {data.swot_analysis.threats.map((th, i) => <li key={i}>{th}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Plan */}
        {data.action_plan && data.action_plan.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
              <div className="p-2 bg-accent/20 rounded-lg"><Target className="w-5 h-5 text-accent" /></div>
              خطة العمل المخصصة ليك
            </h3>
            <div className="space-y-4">
              {data.action_plan.map((step, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                  className="flex gap-4 p-5 rounded-xl bg-white/5 border border-white/10 hover:border-primary/30 transition-all">
                  <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-black text-sm shrink-0">
                    {step.priority}
                  </div>
                  <div className="space-y-2 flex-1">
                    <p className="font-bold text-white">{step.action}</p>
                    <p className="text-xs text-white/50">📊 السبب: {step.reason}</p>
                    <p className="text-xs text-emerald-400">✅ المتوقع: {step.expected_result}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Analysis Summary */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -mr-16 -mt-16 rounded-full group-hover:bg-primary/20 transition-all"></div>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-3 text-white">
            <div className="p-2 bg-primary/20 rounded-lg"><Sparkles className="w-5 h-5 text-primary" /></div>
            {t('analysisSummaryTitle')}
          </h3>
          <p className="text-lg text-white/60 leading-relaxed">{data.analysis_summary}</p>
        </motion.div>

        {/* Footer */}
        <div className="flex justify-center pt-6 pb-12">
          <button onClick={() => navigate('/dashboard')}
            className="bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-2xl font-bold shadow-2xl transition-all hover:scale-105 active:scale-95">
            {t('newAnalysis')}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ResultsPage;
