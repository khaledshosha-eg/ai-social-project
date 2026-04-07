import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Clock, Hash, Zap, Sparkles, MessageSquare } from 'lucide-react';
import Card from '../ui/Card';

interface ContentData {
  best_type: { type: string; reason: string };
  caption_length: { ideal: string; reason: string };
  hashtags: { needed: boolean; recommendation: string };
  best_time: string;
  next_content: string;
}

const ContentTab = ({ data }: { data: ContentData }) => {
  if (!data || !data.best_type) return <div className="p-8 text-center text-white/40">No content data available.</div>;

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Best Content Type */}
        <motion.div variants={item}>
          <Card title="Winning Format" icon={Palette} color="purple">
            <div className="p-6 rounded-3xl bg-purple-500/10 border border-purple-500/20 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Zap size={120} className="text-purple-400" />
              </div>
              <div className="relative z-10 space-y-4">
                <div>
                  <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest block mb-1">Recommended Format</span>
                  <h4 className="text-3xl font-black text-white">{data.best_type?.type || 'Mixed'}</h4>
                </div>
                <p className="text-sm text-white/70 leading-relaxed italic">
                  "{data.best_type?.reason || 'No specific reason provided.'}"
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Posting Time */}
        <motion.div variants={item}>
          <Card title="Prime Time" icon={Clock} color="amber">
            <div className="flex flex-col items-center justify-center p-8 rounded-3xl bg-amber-500/5 border border-amber-500/10 text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                <Clock size={40} />
              </div>
              <div>
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest block mb-1">Peak Engagement Window</span>
                <h4 className="text-4xl font-black text-white">{data.best_time || 'N/A'}</h4>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Caption Length */}
        <motion.div variants={item}>
          <Card title="Caption Strategy" icon={MessageSquare} color="blue">
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-2">Ideal Length</span>
                <p className="text-lg font-bold text-white">{data.caption_length?.ideal || 'N/A'}</p>
              </div>
              <p className="text-xs text-white/50 leading-relaxed">
                {data.caption_length?.reason || ''}
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Hashtags */}
        <motion.div variants={item}>
          <Card title="Hashtag Strategy" icon={Hash} color="emerald">
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-2">Requirement</span>
                <p className="text-lg font-bold text-white">{data.hashtags?.needed ? 'Mandatory' : 'Optional'}</p>
              </div>
              <p className="text-xs text-white/50 leading-relaxed">
                {data.hashtags?.recommendation || ''}
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Next Content Idea */}
        <motion.div variants={item}>
          <Card title="Next Big Idea" icon={Sparkles} color="cyan">
            <div className="p-6 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 h-full flex flex-col justify-center">
              <div className="flex items-center gap-2 text-cyan-400 mb-3">
                <Sparkles size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Creative Hook</span>
              </div>
              <p className="text-sm font-medium text-white leading-relaxed">
                {data.next_content || 'Explore more creative variations of your top posts.'}
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ContentTab;
