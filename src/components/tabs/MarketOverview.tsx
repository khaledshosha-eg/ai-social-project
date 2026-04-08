import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Trophy, TrendingUp, Info } from 'lucide-react';
import ProgressBar from '../ui/ProgressBar';
import { cn } from '@/lib/utils';
import TabSectionCard from './TabSectionCard';

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
  const marketData: MarketOverviewData = data?.market_overview || data;

  const getRankStyles = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          color: 'text-amber-400',
          border: 'border-amber-400/30',
          bg: 'bg-amber-400/10',
          glow: 'shadow-[0_0_20px_rgba(251,191,36,0.2)]',
          accent: 'amber' as const,
        };
      case 2:
        return {
          color: 'text-slate-300',
          border: 'border-slate-300/30',
          bg: 'bg-slate-300/10',
          glow: 'shadow-[0_0_20px_rgba(203,213,225,0.1)]',
          accent: 'slate' as const,
        };
      case 3:
        return {
          color: 'text-orange-400',
          border: 'border-orange-400/30',
          bg: 'bg-orange-400/10',
          glow: 'shadow-[0_0_20px_rgba(251,146,60,0.1)]',
          accent: 'orange' as const,
        };
      default:
        return {
          color: 'text-white/40',
          border: 'border-white/10',
          bg: 'bg-white/5',
          glow: '',
          accent: 'slate' as const,
        };
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  if (!marketData || !marketData.ranking) {
    return (
      <div
        className="p-12 text-center bg-card/20 backdrop-blur-xl border border-white/10 rounded-3xl"
        data-tab="market"
      >
        <p className="text-muted-foreground">Waiting for analysis data...</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 lg:space-y-10"
      data-tab="market"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
        <motion.div variants={item} className="md:col-span-2 xl:col-span-3">
          <TabSectionCard
            icon={Crown}
            title="Current market leader"
            description="Who leads the space right now and the narrative behind their edge."
            accent="amber"
            data-section="market-leader"
            className={cn('border-amber-400/20 bg-amber-400/[0.06]')}
          >
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
                Leader
              </span>
              <p className="text-3xl font-black text-white md:text-4xl">
                {marketData.market_leader?.page}
              </p>
              <p className="max-w-3xl text-base leading-relaxed text-white/70 italic md:text-lg">
                &ldquo;{marketData.market_leader?.why}&rdquo;
              </p>
            </div>
          </TabSectionCard>
        </motion.div>

        {marketData.ranking.map((rankItem, idx) => {
          const styles = getRankStyles(rankItem.rank);
          return (
            <motion.div key={idx} variants={item}>
              <TabSectionCard
                icon={Trophy}
                title={rankItem.page}
                description="Intelligence score, rationale, and standout advantage for this profile."
                accent={styles.accent}
                data-section={`market-ranking-${rankItem.rank}`}
                className={cn('h-full', styles.glow)}
              >
                <div className="flex flex-col gap-4 pt-2">
                  <div className="flex items-end justify-between gap-3">
                    <div className="text-xs font-semibold text-white/40">
                      Rank #{rankItem.rank}
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-white">
                        {rankItem.score}
                        <span className="text-sm text-white/30">/100</span>
                      </span>
                    </div>
                  </div>
                  <ProgressBar
                    value={rankItem.score}
                    color={
                      rankItem.rank === 1 ? 'amber' : rankItem.rank === 2 ? 'blue' : 'purple'
                    }
                  />
                  <p className="flex gap-2 text-sm leading-relaxed text-white/60">
                    <Info size={16} className="mt-0.5 shrink-0 text-white/40" />
                    {rankItem.reason}
                  </p>
                  <div className="flex flex-wrap gap-2 border-t border-white/5 pt-4">
                    <span className="rounded-lg border border-primary/20 bg-primary/20 px-3 py-1 text-[10px] font-bold uppercase text-primary">
                      🏆 {rankItem.top_advantage}
                    </span>
                  </div>
                </div>
              </TabSectionCard>
            </motion.div>
          );
        })}

        <motion.div variants={item} className="md:col-span-2 xl:col-span-3">
          <TabSectionCard
            icon={TrendingUp}
            title="Quick comparison matrix"
            description="Side-by-side metrics across analyzed pages to spot deltas fast."
            accent="blue"
            data-section="market-quick-comparison"
          >
            <div className="overflow-x-auto rounded-2xl border border-white/5 pt-2">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-white/40">
                      Performance metric
                    </th>
                    {Object.keys(marketData.quick_comparison[0]?.values || {}).map((pageKey) => (
                      <th
                        key={pageKey}
                        className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-white"
                      >
                        {pageKey}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {marketData.quick_comparison.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className="border-b border-white/5 transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="px-4 py-3 text-sm font-semibold text-white/80">{row.metric}</td>
                      {Object.entries(row.values).map(([key, val], vIdx) => {
                        const isBest = val.includes('%') && parseFloat(val) >= 5;
                        return (
                          <td key={`${key}-${vIdx}`} className="px-4 py-3">
                            <span
                              className={cn(
                                'rounded-md px-2 py-1 text-sm font-medium',
                                isBest
                                  ? 'border border-emerald-500/20 bg-emerald-500/20 text-emerald-400'
                                  : 'text-white/60'
                              )}
                            >
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
          </TabSectionCard>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MarketOverview;
