import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Share2, Sparkles } from 'lucide-react';
import ComparisonTable from '@/components/results/ComparisonTable';
import { useLanguage } from '@/contexts/LanguageContext';

interface AnalysisData {
  market_score: number;
  swot_analysis: {
    strengths: string[];
    weaknesses: string[];
  };
  analysis_summary: string;
  comparison: { metric: string; client: string | number; competitor_avg: string | number }[];
}

const ResultsPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [data, setData] = useState<AnalysisData | null>(null);

  useEffect(() => {
    const result = localStorage.getItem('analysis_result');
    console.log("Analysis Data Received:", result);

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

  if (!data) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground p-6" style={{ direction: "rtl" }}>
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Navigation & Actions */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5 rotate-180" />
            <span>العودة للوحة التحكم</span>
          </button>
          <div className="flex gap-3">
            <button className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 border border-border transition-all">
              <Download className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 border border-border transition-all">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Header Section */}
        <div className="text-center space-y-4">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-4xl md:text-5xl font-bold tracking-tight"
          >
            نتائج تحليل <span className="text-primary">AI Social Project</span>
          </motion.h1>
          <div className="inline-flex items-center gap-4 bg-card p-4 rounded-2xl border border-border shadow-xl">
            <div className="text-left">
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Market Score</p>
              <p className="text-3xl font-black text-accent">{data.market_score}%</p>
            </div>
            <div className="w-px h-10 bg-border"></div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">حالة السوق</p>
              <p className="text-lg font-bold text-emerald-400">فرصة ممتازة</p>
            </div>
          </div>
        </div>

        {/* Charts & SWOT Section */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Comparison Chart */}
          <div className="lg:col-span-2">
            <ComparisonTable data={data.comparison || []} />
          </div>

          {/* SWOT Analysis */}
          <div className="space-y-6">
            <div className="bg-card/50 border border-border p-6 rounded-2xl shadow-xl h-full">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-accent rounded-full"></span>
                تحليل SWOT
              </h3>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <h4 className="text-emerald-400 font-bold text-sm mb-2">نقاط القوة</h4>
                  <ul className="text-xs space-y-1 list-disc list-inside text-muted-foreground">
                    {data.swot_analysis?.strengths?.map((s, i)=><li key={i}>{s}</li>)}
                  </ul>
                </div>
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <h4 className="text-rose-400 font-bold text-sm mb-2">نقاط الضعف</h4>
                  <ul className="text-xs space-y-1 list-disc list-inside text-muted-foreground">
                    {data.swot_analysis?.weaknesses?.map((w, i)=><li key={i}>{w}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card border border-border p-8 rounded-3xl shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -mr-16 -mt-16 rounded-full group-hover:bg-primary/20 transition-all"></div>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            خلاصة التحليل الاستراتيجي
          </h3>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {data.analysis_summary}
          </p>
        </motion.div>

        {/* Footer Action */}
        <div className="flex justify-center pt-6 pb-12">
          <button 
            onClick={() => navigate('/dashboard')}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-4 rounded-2xl font-bold shadow-2xl transition-all hover:scale-105 active:scale-95"
          >
            إجراء تحليل جديد
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
