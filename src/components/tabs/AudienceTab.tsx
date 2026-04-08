import React from 'react';
import { motion } from 'framer-motion';
import { Users, Heart, MessageCircle, UserPlus, Info, Target, TrendingUp } from 'lucide-react';
import TabSectionCard from './TabSectionCard';

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
  if (!data)
    return (
      <div className="p-8 text-center text-white/40" data-tab="audience">
        No audience data available.
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
      data-tab="audience"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
        <motion.div variants={item} className="md:col-span-2 xl:col-span-2">
          <TabSectionCard
            icon={Heart}
            title="Sentiment analysis"
            description="How audiences feel — and the themes driving positive, neutral, and negative signal."
            accent="purple"
            data-section="audience-sentiment"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-4">
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-center">
                <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-emerald-400">
                  Positive
                </span>
                <span className="text-3xl font-black text-white">{data.sentiment?.positive || 0}%</span>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-white/40">
                  Neutral
                </span>
                <span className="text-3xl font-black text-white">{data.sentiment?.neutral || 0}%</span>
              </div>
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-center sm:col-span-1">
                <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-red-400">
                  Negative
                </span>
                <span className="text-3xl font-black text-white">{data.sentiment?.negative || 0}%</span>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white/60">
                <Info size={14} /> Key sentiment drivers
              </h4>
              <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {(data.sentiment?.reasons || []).map((reason, i) => (
                  <li
                    key={i}
                    className="flex gap-3 rounded-xl border border-white/5 bg-white/5 p-3 text-sm text-white/70"
                  >
                    <span className="font-bold text-purple-400">#</span> {reason}
                  </li>
                ))}
              </ul>
            </div>
          </TabSectionCard>
        </motion.div>

        <motion.div variants={item} className="md:col-span-2 xl:col-span-1">
          <TabSectionCard
            icon={Target}
            title="Purchase intent"
            description="Share of audience showing buying signals, with real voice-of-customer examples."
            accent="amber"
            data-section="audience-purchase-intent"
          >
            <div className="flex flex-col items-center pt-2">
              <div className="relative inline-block">
                <svg className="h-32 w-32 -rotate-90 transform">
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-white/5"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={364.4}
                    strokeDashoffset={
                      364.4 - (364.4 * (data.purchase_intent?.percentage || 0)) / 100
                    }
                    className="text-amber-500"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-white">
                    {data.purchase_intent?.percentage || 0}%
                  </span>
                  <span className="text-[10px] font-bold uppercase text-amber-500">Intent</span>
                </div>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                Voice of customer
              </h4>
              {(data.purchase_intent?.examples || []).map((example, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-amber-500/10 bg-amber-500/5 p-3 text-sm italic text-white/80"
                >
                  &ldquo;{example}&rdquo;
                </div>
              ))}
            </div>
          </TabSectionCard>
        </motion.div>

        <motion.div variants={item} className="md:col-span-2 xl:col-span-2">
          <TabSectionCard
            icon={Users}
            title="Ideal customer persona"
            description="Demographics, interests, and pain points your content should speak to."
            accent="blue"
            data-section="audience-persona"
          >
            <div className="space-y-6 pt-2">
              <div className="rounded-2xl border border-blue-500/10 bg-blue-500/5 p-4">
                <p className="text-sm leading-relaxed text-white/90 italic">
                  &ldquo;{data.persona?.description || 'No description available'}&rdquo;
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
                    Age range
                  </h4>
                  <span className="text-lg font-bold text-white">{data.persona?.age_range || 'N/A'}</span>
                </div>
                <div>
                  <h4 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
                    Core interests
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(data.persona?.interests || []).map((int, i) => (
                      <span
                        key={i}
                        className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-white/70"
                      >
                        {int}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <h4 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
                  Top pain points
                </h4>
                <ul className="space-y-2">
                  {(data.persona?.pain_points || []).map((point, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-white/70">
                      <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" /> {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </TabSectionCard>
        </motion.div>

        <motion.div variants={item} className="md:col-span-2 xl:col-span-1">
          <TabSectionCard
            icon={MessageCircle}
            title="Crisis to opportunity"
            description="Reframe negative momentum into a concrete strategic narrative."
            accent="emerald"
            data-section="audience-opportunity"
          >
            <div className="space-y-6 pt-2">
              <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-6">
                <div className="pointer-events-none absolute -bottom-4 -right-4 opacity-5">
                  <TrendingUp size={120} />
                </div>
                <h4 className="mb-4 text-sm font-bold uppercase tracking-widest text-emerald-400">
                  Strategic flip
                </h4>
                <p className="relative z-10 text-lg font-medium leading-relaxed text-white">
                  {data.negative_to_opportunity || 'No strategic insights available at the moment.'}
                </p>
              </div>
              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                  <UserPlus size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Conversion tip</p>
                  <p className="text-xs text-white/40">
                    Engage directly with neutral comments to flip sentiment.
                  </p>
                </div>
              </div>
            </div>
          </TabSectionCard>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AudienceTab;
