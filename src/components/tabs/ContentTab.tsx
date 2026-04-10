import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Clock, Hash, Lightbulb, MessageSquare } from 'lucide-react';
import TabSectionCard from './TabSectionCard';

const safe = (v: any, fallback = '—') =>
  v !== undefined && v !== null && v !== '' ? String(v) : fallback;

const ContentTab = ({ data }: { data: any }) => {
  if (!data) {
    return (
      <div className="p-12 text-center bg-white/5 rounded-3xl border border-white/10">
        <p className="text-white/40">Waiting for content data...</p>
      </div>
    );
  }

  const bestType    = data.best_type     || {};
  const caption     = data.caption_length || {};
  const hashtags    = data.hashtags      || {};
  const bestTime    = safe(data.best_time);
  const nextContent = safe(data.next_content);

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
  const item      = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8" data-tab="content">

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {/* Winning format */}
        <motion.div variants={item}>
          <TabSectionCard
            icon={Palette}
            title="Winning format"
            description="The content shape that fits this audience and why it wins."
            accent="purple"
          >
            <div className="mt-4 space-y-3">
              <p className="text-xs font-black uppercase tracking-widest text-purple-400">Recommended Format</p>
              <p className="text-3xl font-black text-white">{safe(bestType.type, 'Mixed')}</p>
              {bestType.reason && (
                <p className="text-sm text-white/60 italic border-l-2 border-purple-400/40 pl-3">
                  &ldquo;{bestType.reason}&rdquo;
                </p>
              )}
            </div>
          </TabSectionCard>
        </motion.div>

        {/* Prime time */}
        <motion.div variants={item}>
          <TabSectionCard
            icon={Clock}
            title="Prime time"
            description="When your audience is most likely to engage with new posts."
            accent="amber"
          >
            <div className="mt-4 space-y-3">
              <p className="text-xs font-black uppercase tracking-widest text-amber-400">Peak Engagement Window</p>
              {bestTime !== '—' ? (
                <p className="text-lg font-bold text-white leading-relaxed">{bestTime}</p>
              ) : (
                <p className="text-sm text-white/30 italic">لا يوجد بيانات</p>
              )}
            </div>
          </TabSectionCard>
        </motion.div>

        {/* Caption strategy */}
        <motion.div variants={item}>
          <TabSectionCard
            icon={MessageSquare}
            title="Caption strategy"
            description="Ideal length and narrative pacing for captions in this niche."
            accent="blue"
          >
            <div className="mt-4 space-y-3">
              <p className="text-xs font-black uppercase tracking-widest text-blue-400">Ideal Length</p>
              <p className="text-2xl font-black text-white">{safe(caption.ideal, 'لا يوجد بيانات')}</p>
              {caption.reason && (
                <p className="text-sm text-white/60">{caption.reason}</p>
              )}
            </div>
          </TabSectionCard>
        </motion.div>

        {/* Hashtag strategy */}
        <motion.div variants={item}>
          <TabSectionCard
            icon={Hash}
            title="Hashtag strategy"
            description="Whether tags are essential here and how to use them without noise."
            accent="emerald"
          >
            <div className="mt-4 space-y-3">
              <p className="text-xs font-black uppercase tracking-widest text-emerald-400">Requirement</p>
              <p className="text-xl font-black text-white">
                {hashtags.needed !== undefined
                  ? (hashtags.needed ? 'Mandatory' : 'Optional')
                  : 'Mandatory'}
              </p>
              {hashtags.recommendation && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-sm text-white/70">{hashtags.recommendation}</p>
                </div>
              )}
            </div>
          </TabSectionCard>
        </motion.div>

        {/* Next big idea */}
        <motion.div variants={item} className="md:col-span-2 xl:col-span-2">
          <TabSectionCard
            icon={Lightbulb}
            title="Next big idea"
            description="A creative direction to test next based on what already resonates."
            accent="amber"
          >
            <div className="mt-4">
              <p className="text-xs font-black uppercase tracking-widest text-amber-400 mb-2">Creative Hook</p>
              {nextContent !== '—' ? (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <p className="text-base font-semibold text-white/90 leading-relaxed">{nextContent}</p>
                </div>
              ) : (
                <p className="text-sm text-white/30 italic">فكرة محتوى إبداعية للمنشور القادم</p>
              )}
            </div>
          </TabSectionCard>
        </motion.div>

      </div>
    </motion.div>
  );
};

export default ContentTab;
