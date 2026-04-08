import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Clock, Hash, Zap, Sparkles, MessageSquare } from 'lucide-react';
import TabSectionCard from './TabSectionCard';

interface ContentData {
  best_type: { type: string; reason: string };
  caption_length: { ideal: string; reason: string };
  hashtags: { needed: boolean; recommendation: string };
  best_time: string;
  next_content: string;
}

const ContentTab = ({ data }: { data: ContentData }) => {
  if (!data || !data.best_type)
    return (
      <div className="p-8 text-center text-white/40" data-tab="content">
        No content data available.
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
      data-tab="content"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
        <motion.div variants={item}>
          <TabSectionCard
            icon={Palette}
            title="Winning format"
            description="The content shape that fits this audience and why it wins."
            accent="purple"
            data-section="content-best-type"
          >
            <div className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-purple-500/10 p-6 pt-4">
              <div className="pointer-events-none absolute -bottom-4 -right-4 opacity-10">
                <Zap size={100} className="text-purple-400" />
              </div>
              <div className="relative z-10 space-y-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">
                  Recommended format
                </span>
                <h4 className="text-2xl font-black text-white sm:text-3xl">
                  {data.best_type?.type || 'Mixed'}
                </h4>
                <p className="text-sm leading-relaxed text-white/70 italic">
                  &ldquo;{data.best_type?.reason || 'No specific reason provided.'}&rdquo;
                </p>
              </div>
            </div>
          </TabSectionCard>
        </motion.div>

        <motion.div variants={item}>
          <TabSectionCard
            icon={Clock}
            title="Prime time"
            description="When your audience is most likely to engage with new posts."
            accent="amber"
            data-section="content-best-time"
          >
            <div className="flex flex-col items-center justify-center space-y-4 rounded-3xl border border-amber-500/10 bg-amber-500/5 p-8 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/20 text-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                <Clock size={40} />
              </div>
              <div>
                <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-amber-500">
                  Peak engagement window
                </span>
                <h4 className="text-3xl font-black text-white sm:text-4xl">{data.best_time || 'N/A'}</h4>
              </div>
            </div>
          </TabSectionCard>
        </motion.div>

        <motion.div variants={item}>
          <TabSectionCard
            icon={MessageSquare}
            title="Caption strategy"
            description="Ideal length and narrative pacing for captions in this niche."
            accent="blue"
            data-section="content-caption"
          >
            <div className="space-y-4 pt-2">
              <div className="rounded-2xl border border-blue-500/10 bg-blue-500/5 p-4">
                <span className="mb-2 block text-[10px] font-black uppercase tracking-widest text-blue-400">
                  Ideal length
                </span>
                <p className="text-lg font-bold text-white">{data.caption_length?.ideal || 'N/A'}</p>
              </div>
              <p className="text-xs leading-relaxed text-white/50">{data.caption_length?.reason || ''}</p>
            </div>
          </TabSectionCard>
        </motion.div>

        <motion.div variants={item}>
          <TabSectionCard
            icon={Hash}
            title="Hashtag strategy"
            description="Whether tags are essential here and how to use them without noise."
            accent="emerald"
            data-section="content-hashtags"
          >
            <div className="space-y-4 pt-2">
              <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-4">
                <span className="mb-2 block text-[10px] font-black uppercase tracking-widest text-emerald-400">
                  Requirement
                </span>
                <p className="text-lg font-bold text-white">
                  {data.hashtags?.needed ? 'Mandatory' : 'Optional'}
                </p>
              </div>
              <p className="text-xs leading-relaxed text-white/50">{data.hashtags?.recommendation || ''}</p>
            </div>
          </TabSectionCard>
        </motion.div>

        <motion.div variants={item} className="md:col-span-2 xl:col-span-2">
          <TabSectionCard
            icon={Sparkles}
            title="Next big idea"
            description="A creative direction to test next based on what already resonates."
            accent="cyan"
            data-section="content-next"
          >
            <div className="flex min-h-[8rem] flex-col justify-center rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-6">
              <div className="mb-3 flex items-center gap-2 text-cyan-400">
                <Sparkles size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Creative hook</span>
              </div>
              <p className="text-sm font-medium leading-relaxed text-white">
                {data.next_content || 'Explore more creative variations of your top posts.'}
              </p>
            </div>
          </TabSectionCard>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ContentTab;
