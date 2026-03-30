import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate, useLocation } from 'react-router-dom';
import ScoreGauge from '@/components/results/ScoreGauge';
import ComparisonTable from '@/components/results/ComparisonTable';
import SwotGrid from '@/components/results/SwotGrid';
import ContentRoadmap from '@/components/results/ContentRoadmap';
import ExportButton from '@/components/results/ExportButton';
import { Skeleton } from '@/components/ui/skeleton';

const ResultsSkeleton = () => (
  <div className="space-y-8">
    <div className="grid md:grid-cols-2 gap-6">
      <div className="glass-card glow-border p-8 flex flex-col items-center gap-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="w-52 h-52 rounded-full" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="glass-card glow-border p-6 space-y-4">
        <Skeleton className="h-6 w-40" />
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    </div>
    <div>
      <Skeleton className="h-6 w-36 mb-4" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card p-5 space-y-3">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ))}
      </div>
    </div>
    <div>
      <Skeleton className="h-6 w-48 mb-4" />
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-24 w-full mb-4" />
      ))}
    </div>
  </div>
);

const ResultsPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state;
  const hasData = state && state.market_score !== undefined;

  const marketScore = state?.market_score;
  const comparison = state?.comparison_table;
  const swot = state?.swot_analysis;
  const contentPlan = state?.content_plan;

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto space-y-10">
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="glass-card p-3 rounded-xl glow-hover cursor-pointer transition-all hover:scale-105 active:scale-95"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">{t('results')}</h1>
        </div>
      </motion.div>

      {!hasData ? (
        <ResultsSkeleton />
      ) : (
        <div className="space-y-12">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="grid md:grid-cols-2 gap-8"
          >
            <ScoreGauge score={marketScore} />
            <ComparisonTable data={comparison} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <SwotGrid swot={swot} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <ContentRoadmap plan={contentPlan} />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center pt-4"
          >
            <ExportButton />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ResultsPage;
