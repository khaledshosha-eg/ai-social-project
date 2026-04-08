import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Target, Zap, AlertTriangle, Lightbulb, Split } from 'lucide-react';
import { cn } from '@/lib/utils';
import TabSectionCard from './TabSectionCard';

interface SWOTData {
  page: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

interface CompetitiveData {
  swot: SWOTData[];
  content_gaps: string[];
  engagement_comparison: { page: string; rate: string; rank: number }[];
  differentiation: { vs: string; strategy: string }[];
}

const CompetitiveTab = ({ data }: { data: CompetitiveData }) => {
  if (!data || !data.swot)
    return (
      <div className="p-8 text-center text-white/40" data-tab="competitive">
        No competitive data available.
      </div>
    );

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 lg:space-y-10"
      data-tab="competitive"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
        {(data.engagement_comparison || []).map((comp, i) => (
          <motion.div key={i} variants={item}>
            <TabSectionCard
              icon={Shield}
              title={comp.page}
              description="Engagement rate benchmark versus peers in this analysis set."
              accent="cyan"
              data-section={`competitive-engagement-${i}`}
            >
              <div className="flex items-end justify-between gap-3 pt-2">
                <span className="text-3xl font-black text-white">{comp.rate}</span>
                <span className="text-xs font-semibold text-white/40">#{comp.rank}</span>
              </div>
            </TabSectionCard>
          </motion.div>
        ))}

        {data.swot?.map((s, idx) => (
          <motion.div key={idx} variants={item} className="md:col-span-2 xl:col-span-3">
            <TabSectionCard
              icon={Shield}
              title={s.page}
              description="Strengths, weaknesses, opportunities, and threats in one view."
              accent="purple"
              data-section={`competitive-swot-${idx}`}
            >
              <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                    <Shield size={12} /> Strengths
                  </div>
                  <ul className="space-y-2">
                    {s.strengths?.map((st, i) => (
                      <li
                        key={i}
                        className="rounded-lg border border-emerald-500/10 bg-emerald-500/5 p-2 text-xs text-white/70"
                      >
                        {st}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-400">
                    <Zap size={12} /> Weaknesses
                  </div>
                  <ul className="space-y-2">
                    {s.weaknesses?.map((wk, i) => (
                      <li
                        key={i}
                        className="rounded-lg border border-red-500/10 bg-red-500/5 p-2 text-xs text-white/70"
                      >
                        {wk}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-400">
                    <Target size={12} /> Opportunities
                  </div>
                  <ul className="space-y-2">
                    {s.opportunities?.map((op, i) => (
                      <li
                        key={i}
                        className="rounded-lg border border-blue-500/10 bg-blue-500/5 p-2 text-xs text-white/70"
                      >
                        {op}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-400">
                    <AlertTriangle size={12} /> Threats
                  </div>
                  <ul className="space-y-2">
                    {s.threats?.map((th, i) => (
                      <li
                        key={i}
                        className="rounded-lg border border-amber-500/10 bg-amber-500/5 p-2 text-xs text-white/70"
                      >
                        {th}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabSectionCard>
          </motion.div>
        ))}

        <motion.div variants={item} className="md:col-span-2 xl:col-span-1">
          <TabSectionCard
            icon={Lightbulb}
            title="Market content gaps"
            description="Unmet needs surfaced from competitor audiences you can own."
            accent="purple"
            data-section="competitive-gaps"
          >
            <p className="text-sm text-white/40">Themes competitors are not fully serving:</p>
            <div className="mt-4 space-y-3">
              {data.content_gaps?.map((gap, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-2xl border border-purple-500/10 bg-purple-500/5 p-4 transition-all hover:bg-purple-500/10"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-sm font-bold text-purple-400">
                    {i + 1}
                  </div>
                  <span className="text-sm font-medium text-white">{gap}</span>
                </div>
              ))}
            </div>
          </TabSectionCard>
        </motion.div>

        <motion.div variants={item} className="md:col-span-2 xl:col-span-2">
          <TabSectionCard
            icon={Split}
            title="Differentiation strategy"
            description="How to position against each named competitor or segment."
            accent="cyan"
            data-section="competitive-differentiation"
          >
            <div className="space-y-4 pt-2">
              {data.differentiation?.map((diff, i) => (
                <div
                  key={i}
                  className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">
                      VS {diff.vs}
                    </span>
                    <Zap size={14} className="text-cyan-400" />
                  </div>
                  <p className="text-sm leading-relaxed text-white/80">{diff.strategy}</p>
                </div>
              ))}
            </div>
          </TabSectionCard>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CompetitiveTab;
