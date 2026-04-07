import React from 'react';
import { motion } from 'framer-motion';
import { Sword, Shield, Target, Zap, AlertTriangle, Lightbulb, Split } from 'lucide-react';
import Card from '../ui/Card';
import { cn } from '@/lib/utils';

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
  if (!data || !data.swot) return <div className="p-8 text-center text-white/40">No competitive data available.</div>;

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {/* Engagement Comparison Mini-Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.engagement_comparison?.map((comp, i) => (
          <motion.div key={i} variants={item} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all group">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1">{comp.page}</span>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-black text-white">{comp.rate}</span>
              <span className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded-md",
                comp.rank === 1 ? "bg-amber-500/20 text-amber-400" : "bg-white/10 text-white/40"
              )}>
                #{comp.rank}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* SWOT Matrix */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Sword className="text-primary" size={24} /> 360° SWOT Analysis
        </h3>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {data.swot?.map((s, idx) => (
            <motion.div key={idx} variants={item}>
              <Card title={s.page} className="h-full">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                      <Shield size={12} /> Strengths
                    </div>
                    <ul className="space-y-2">
                      {s.strengths?.map((st, i) => (
                        <li key={i} className="text-xs text-white/70 bg-emerald-500/5 p-2 rounded-lg border border-emerald-500/10">
                          {st}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-black text-red-400 uppercase tracking-widest">
                      <Zap size={12} /> Weaknesses
                    </div>
                    <ul className="space-y-2">
                      {s.weaknesses?.map((wk, i) => (
                        <li key={i} className="text-xs text-white/70 bg-red-500/5 p-2 rounded-lg border border-red-500/10">
                          {wk}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-widest">
                      <Target size={12} /> Opportunities
                    </div>
                    <ul className="space-y-2">
                      {s.opportunities?.map((op, i) => (
                        <li key={i} className="text-xs text-white/70 bg-blue-500/5 p-2 rounded-lg border border-blue-500/10">
                          {op}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-black text-amber-400 uppercase tracking-widest">
                      <AlertTriangle size={12} /> Threats
                    </div>
                    <ul className="space-y-2">
                      {s.threats?.map((th, i) => (
                        <li key={i} className="text-xs text-white/70 bg-amber-500/5 p-2 rounded-lg border border-amber-500/10">
                          {th}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Gaps and Differentiation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={item}>
          <Card title="Market Content Gaps" icon={Lightbulb} color="purple">
            <p className="text-sm text-white/40 mb-4">Unfilled needs discovered in competitor audiences:</p>
            <div className="space-y-3">
              {data.content_gaps?.map((gap, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-purple-500/5 border border-purple-500/10 group hover:bg-purple-500/10 transition-all">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                    {i + 1}
                  </div>
                  <span className="text-sm text-white font-medium">{gap}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card title="Differentiation Strategy" icon={Split} color="cyan">
            <div className="space-y-4">
              {data.differentiation?.map((diff, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">VS {diff.vs}</span>
                    <Zap size={14} className="text-cyan-400" />
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed">
                    {diff.strategy}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CompetitiveTab;
