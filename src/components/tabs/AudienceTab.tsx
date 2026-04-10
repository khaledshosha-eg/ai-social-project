import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, User, TrendingUp, MessageCircle } from 'lucide-react';
import TabSectionCard from './TabSectionCard';

const safe = (v: any, fallback = '—') =>
  v !== undefined && v !== null && v !== '' ? v : fallback;

const AudienceTab = ({ data }: { data: any }) => {
  if (!data) {
    return (
      <div className="p-12 text-center bg-white/5 rounded-3xl border border-white/10">
        <p className="text-white/40">Waiting for audience data...</p>
      </div>
    );
  }

  // ── sentiment ─────────────────────────────────────
  const sentiment  = data.sentiment || {};
  const positive   = Number(sentiment.positive)  || 0;
  const negative   = Number(sentiment.negative)  || 0;
  const neutral    = Number(sentiment.neutral)   || 0;
  const reasons: string[]  = Array.isArray(sentiment.reasons)  ? sentiment.reasons  : [];

  // ── purchase intent ──────────────────────────────
  const pi        = data.purchase_intent || {};
  const piPct     = Number(pi.percentage) || 0;
  const piExamples: string[] = Array.isArray(pi.examples) ? pi.examples : [];

  // ── persona ──────────────────────────────────────
  const persona   = data.persona || {};
  const interests: string[]  = Array.isArray(persona.interests)   ? persona.interests   : [];
  const painPoints: string[] = Array.isArray(persona.pain_points) ? persona.pain_points : [];

  // ── negative to opportunity ──────────────────────
  const n2o = safe(data.negative_to_opportunity);

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
  const item      = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8" data-tab="audience">

      {/* ── Sentiment + Purchase Intent row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Sentiment */}
        <motion.div variants={item}>
          <TabSectionCard
            icon={Heart}
            title="Sentiment analysis"
            description="How audiences feel — and the themes driving positive, neutral, and negative signal."
            accent="blue"
          >
            <div className="mt-4 space-y-4">
              {/* 3 bars */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'POSITIVE', value: positive, color: 'emerald' },
                  { label: 'NEUTRAL',  value: neutral,  color: 'blue'    },
                  { label: 'NEGATIVE', value: negative, color: 'rose'    },
                ].map(({ label, value, color }) => (
                  <div key={label} className={`p-3 rounded-xl bg-${color}-500/10 border border-${color}-500/20 text-center`}>
                    <p className={`text-xs font-black uppercase tracking-widest text-${color}-400 mb-1`}>{label}</p>
                    <p className={`text-2xl font-black text-${color}-400`}>{value}%</p>
                    <div className="mt-2 h-1.5 rounded-full bg-white/5">
                      <div className={`h-full rounded-full bg-${color}-400`} style={{ width: `${value}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Key sentiment drivers */}
              {reasons.length > 0 && (
                <div className="pt-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2">
                    Key Sentiment Drivers
                  </p>
                  <div className="space-y-2">
                    {reasons.map((r, i) => (
                      <div key={i} className="flex gap-2 items-start p-2 rounded-lg bg-white/5">
                        <MessageCircle size={13} className="text-primary shrink-0 mt-0.5" />
                        <p className="text-xs text-white/70">{r}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabSectionCard>
        </motion.div>

        {/* Purchase Intent */}
        <motion.div variants={item}>
          <TabSectionCard
            icon={ShoppingCart}
            title="Purchase intent"
            description="Share of audience showing buying signals, with real voice-of-customer examples."
            accent="amber"
          >
            <div className="mt-4 space-y-4">
              {/* Circular indicator */}
              <div className="flex items-center gap-5">
                <div className="relative w-24 h-24 shrink-0">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f59e0b" strokeWidth="3"
                      strokeDasharray={`${piPct} ${100 - piPct}`} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-black text-amber-400">{piPct}%</span>
                    <span className="text-[9px] text-white/40 uppercase">Intent</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Voice of Customer</p>
                  {piExamples.length > 0 ? (
                    <div className="space-y-2">
                      {piExamples.map((ex, i) => (
                        <p key={i} className="text-sm text-white/70 italic border-l-2 border-amber-400/40 pl-3">
                          &ldquo;{ex}&rdquo;
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-white/30 italic">"لا يوجد تعليقات"</p>
                  )}
                </div>
              </div>
            </div>
          </TabSectionCard>
        </motion.div>
      </div>

      {/* ── Persona + Crisis to Opportunity row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Persona */}
        <motion.div variants={item}>
          <TabSectionCard
            icon={User}
            title="Ideal customer persona"
            description="Demographics, interests, and pain points your content should speak to."
            accent="purple"
          >
            <div className="mt-4 space-y-4">
              <p className="text-sm text-white/70 italic border border-white/10 rounded-xl p-3 bg-white/5">
                &ldquo;{safe(persona.description, 'لا يوجد بيانات كافية')}&rdquo;
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-1">Age Range</p>
                  <p className="font-bold text-white">{safe(persona.age_range, 'لا يوجد بيانات')}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-1">Core Interests</p>
                  <div className="flex flex-wrap gap-1">
                    {interests.length > 0
                      ? interests.map((int, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs">{int}</span>
                        ))
                      : <span className="text-xs text-white/30">لا يوجد بيانات</span>}
                  </div>
                </div>
              </div>
              {painPoints.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Top Pain Points</p>
                  <ul className="space-y-1">
                    {painPoints.map((pp, i) => (
                      <li key={i} className="text-xs text-white/60 flex gap-2">
                        <span className="text-rose-400 shrink-0">•</span>{pp}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </TabSectionCard>
        </motion.div>

        {/* Crisis to Opportunity */}
        <motion.div variants={item}>
          <TabSectionCard
            icon={TrendingUp}
            title="Crisis to opportunity"
            description="Reframe negative momentum into a concrete strategic narrative."
            accent="emerald"
          >
            <div className="mt-4">
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">Strategic Flip</p>
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <p className="text-sm text-white/80 leading-relaxed">{n2o}</p>
              </div>
            </div>
          </TabSectionCard>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AudienceTab;
