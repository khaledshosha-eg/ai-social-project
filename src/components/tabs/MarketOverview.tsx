import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Trophy, TrendingUp, Info } from 'lucide-react';
import ProgressBar from '../ui/ProgressBar';
import Card from '../ui/Card';
import { cn } from '@/lib/utils';

interface RankingItem {
  page: string;
  score: number;
  rank: number;
  reason: string;
  top_advantage: string;
}

interface QuickComparison {
  metric: string;
  values: Record<string, string>;
}

interface MarketOverviewData {
  ranking: RankingItem[];
  market_leader: {
    page: string;
    why: string;
  };
  quick_comparison: QuickComparison[];
}

const MarketOverview = ({ data }: { data: any }) => {
  // Use data.market_overview if passed from parent, or direct data
  const marketData: MarketOverviewData = data?.market_overview || data;

  const getRankStyles = (rank: number) => {
    switch (rank) {
      case 1: return { color: 'text-amber-400', border: 'border-amber-400/30', bg: 'bg-amber-400/10', glow: 'shadow-[0_0_20px_rgba(251,191,36,0.2)]' };
      case 2: return { color: 'text-slate-300', border: 'border-slate-300/30', bg: 'bg-slate-300/10', glow: 'shadow-[0_0_20px_rgba(203,213,225,0.1)]' };
      case 3: return { color: 'text-orange-400', border: 'border-orange-400/30', bg: 'bg-orange-400/10', glow: 'shadow-[0_0_20px_rgba(251,146,60,0.1)]' };
      default: return { color: 'text-white/40', border: 'border-white/10', bg: 'bg-white/5', glow: '' };
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (!marketData || !marketData.ranking) {
    return (
      <div className="p-12 text-center bg-card/20 backdrop-blur-xl border border-white/10 rounded-3xl">
        <p className="text-muted-foreground">Waiting for analysis data...</p>
      </div>
    );
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-10"
    >
      {/* Header & GIF */}
      <div className="flex flex-col items-center gap-4 mb-8">
        <motion.img 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          src="/gifs/market.gif" 
          className="w-16 h-16 rounded-2xl shadow-2xl" 
          alt="Market Analysis"
          onError={(e) => (e.currentTarget.style.display = 'none')}
        />
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white tracking-tight">Market Overview</h2>
          <p className="text-white/40 mt-1">Real-time competitive landscape analysis</p>
        </div>
      </div>

      {/* 1. Market Leader Card */}
      <motion.div variants={item}>
        <Card className="relative overflow-hidden border-amber-400/20 bg-amber-400/5 group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Crown size={120} className="text-amber-400" />
          </div>
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="p-6 rounded-full bg-amber-400/20 border border-amber-400/30">
              <Crown className="w-12 h-12 text-amber-400 animate-pulse" />
            </div>
            <div className="text-center md:text-left space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">Current Market Leader</span>
              <h3 className="text-4xl font-black text-white">{marketData.market_leader?.page}</h3>
              <p className="text-lg text-white/70 max-w-2xl leading-relaxed italic">
                "{marketData.market_leader?.why}"
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* 2. Ranking Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {marketData.ranking.map((rankItem, idx) => {
          const styles = getRankStyles(rankItem.rank);
          return (
            <motion.div key={idx} variants={item}>
              <Card className={cn("h-full border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all", styles.glow)}>
                <div className="flex items-start justify-between mb-6">
                  <div className={cn("px-4 py-2 rounded-xl border text-sm font-black flex items-center gap-2", styles.border, styles.color, styles.bg)}>
                    <Trophy size={14} />
                    RANK #{rankItem.rank}
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-widest text-white/30 block mb-1">Intelligence Score</span>
                    <span className="text-2xl font-black text-white">{rankItem.score}<span className="text-sm text-white/30">/100</span></span>
                  </div>
                </div>

                <h4 className="text-xl font-bold text-white mb-2">{rankItem.page}</h4>
                
                <ProgressBar 
                  value={rankItem.score} 
                  color={rankItem.rank === 1 ? 'amber' : rankItem.rank === 2 ? 'blue' : 'purple'} 
                  className="mb-6"
                />

                <p className="text-sm text-white/60 leading-relaxed mb-6 flex gap-2">
                  <Info size={16} className="shrink-0 mt-0.5 text-white/40" />
                  {rankItem.reason}
                </p>

                <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                  <span className="text-[10px] uppercase font-bold px-3 py-1 bg-primary/20 text-primary rounded-lg border border-primary/20">
                    🏆 {rankItem.top_advantage}
                  </span>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* 3. Quick Comparison Table */}
      <motion.div variants={item} className="pt-6">
        <Card title="Quick Comparison Matrix" icon={TrendingUp} className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-4 px-4 text-xs font-bold text-white/40 uppercase tracking-widest">Performance Metric</th>
                  {Object.keys(marketData.quick_comparison[0]?.values || {}).map((pageKey) => (
                    <th key={pageKey} className="py-4 px-4 text-xs font-bold text-white uppercase tracking-widest">
                      {pageKey}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {marketData.quick_comparison.map((row, idx) => (
                  <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-4 text-sm font-semibold text-white/80">{row.metric}</td>
                    {Object.entries(row.values).map(([key, val], vIdx) => {
                      // Logic to highlight best value (simple heuristic: if it contains highest number)
                      const isBest = val.includes('%') && parseFloat(val) >= 5; // Placeholder logic
                      return (
                        <td key={vIdx} className="py-4 px-4">
                          <span className={cn(
                            "text-sm font-medium px-2 py-1 rounded-md",
                            isBest ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20" : "text-white/60"
                          )}>
                            {val}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default MarketOverview;
