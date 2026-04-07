import React from 'react';
import { motion } from 'framer-motion';
import { Users, Heart, MessageCircle, UserPlus, Info, Target } from 'lucide-react';
import Card from '../ui/Card';
import ProgressBar from '../ui/ProgressBar';
import { cn } from '@/lib/utils';

interface AudienceData {
  sentiment: {
    positive: number;
    negative: number;
    neutral: number;
    reasons: string[];
  };
  purchase_intent: {
    percentage: number;
    examples: string[];
  };
  persona: {
    description: string;
    age_range: string;
    interests: string[];
    pain_points: string[];
  };
  negative_to_opportunity: string;
}

const AudienceTab = ({ data }: { data: AudienceData }) => {
  if (!data) return <div className="p-8 text-center text-white/40">No audience data available.</div>;

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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sentiment Analysis */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card title="Sentiment Analysis" icon={Heart} color="purple">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-1">Positive</span>
                <span className="text-3xl font-black text-white">{data.sentiment.positive}%</span>
              </div>
              <div className="text-center p-4 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-xs font-bold text-white/40 uppercase tracking-widest block mb-1">Neutral</span>
                <span className="text-3xl font-black text-white">{data.sentiment.neutral}%</span>
              </div>
              <div className="text-center p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
                <span className="text-xs font-bold text-red-400 uppercase tracking-widest block mb-1">Negative</span>
                <span className="text-3xl font-black text-white">{data.sentiment.negative}%</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white/60 uppercase tracking-widest flex items-center gap-2">
                <Info size={14} /> Key Sentiment Drivers
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {data.sentiment.reasons.map((reason, i) => (
                  <li key={i} className="flex gap-3 text-sm text-white/70 p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-purple-400 font-bold">#</span> {reason}
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </motion.div>

        {/* Purchase Intent */}
        <motion.div variants={item}>
          <Card title="Purchase Intent" icon={Target} color="amber">
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={364.4} strokeDashoffset={364.4 - (364.4 * data.purchase_intent.percentage) / 100} className="text-amber-500" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-white">{data.purchase_intent.percentage}%</span>
                  <span className="text-[10px] font-bold text-amber-500 uppercase">Intent</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Voice of Customer</h4>
              {data.purchase_intent.examples.map((example, i) => (
                <div key={i} className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 italic text-sm text-white/80">
                  "{example}"
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Target Persona */}
        <motion.div variants={item}>
          <Card title="Ideal Customer Persona" icon={Users} color="blue">
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                <p className="text-sm text-white/90 leading-relaxed italic">"{data.persona.description}"</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Age Range</h4>
                  <span className="text-lg font-bold text-white">{data.persona.age_range}</span>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Core Interests</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.persona.interests.map((int, i) => (
                      <span key={i} className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] text-white/70">{int}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Top Pain Points</h4>
                <ul className="space-y-2">
                  {data.persona.pain_points.map((point, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-white/70">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400" /> {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Opportunity Card */}
        <motion.div variants={item}>
          <Card title="Crisis to Opportunity" icon={MessageCircle} color="emerald">
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 relative overflow-hidden group">
                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <TrendingUp size={120} />
                </div>
                <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-4">Strategic Flip</h4>
                <p className="text-lg text-white font-medium leading-relaxed relative z-10">
                  {data.negative_to_opportunity}
                </p>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <UserPlus size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Conversion Tip</p>
                  <p className="text-xs text-white/40">Engage directly with neutral comments to flip sentiment.</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AudienceTab;
