import React from 'react';
import { motion } from 'framer-motion';
import { Target, CheckCircle2, AlertCircle, Rocket, Zap, ListChecks } from 'lucide-react';
import TabSectionCard from './TabSectionCard';
import Checklist from '../ui/Checklist';

interface ActionableData {
  do: string[];
  dont: string[];
  biggest_opportunity: string;
  quick_win: string;
  best_ad: string;
  checklist: { task: string; priority: 'high' | 'medium' | 'low'; deadline: string; done: boolean }[];
}

const ActionableTab = ({ data }: { data: ActionableData }) => {
  if (!data || !data.checklist)
    return (
      <div className="p-8 text-center text-white/40" data-tab="actionable">
        No actionable insights available.
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
      data-tab="actionable"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
        <motion.div variants={item}>
          <TabSectionCard
            icon={Target}
            title="Biggest opportunity"
            description="The single largest upside if you double down in the next cycle."
            accent="amber"
            data-section="actionable-opportunity"
          >
            <p className="rounded-3xl border border-amber-500/20 bg-amber-500/10 p-6 text-lg font-black leading-relaxed text-white">
              {data.biggest_opportunity || 'Identifying trends...'}
            </p>
          </TabSectionCard>
        </motion.div>

        <motion.div variants={item}>
          <TabSectionCard
            icon={Zap}
            title="Quick win (7 days)"
            description="A fast experiment you can ship this week without a full relaunch."
            accent="emerald"
            data-section="actionable-quick-win"
          >
            <p className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-6 text-lg font-black leading-relaxed text-white">
              {data.quick_win || 'Analyze comments for instant feedback.'}
            </p>
          </TabSectionCard>
        </motion.div>

        <motion.div variants={item}>
          <TabSectionCard
            icon={Rocket}
            title="Best ad angle"
            description="Messaging and proof points that tend to convert for this audience."
            accent="blue"
            data-section="actionable-best-ad"
          >
            <p className="rounded-3xl border border-blue-500/20 bg-blue-500/10 p-6 text-lg font-black leading-relaxed text-white">
              {data.best_ad || 'Focus on educational content for higher trust.'}
            </p>
          </TabSectionCard>
        </motion.div>

        <motion.div variants={item} className="md:col-span-2 xl:col-span-1">
          <TabSectionCard
            icon={CheckCircle2}
            title="Strategic do's"
            description="Moves that align with the data and compound over time."
            accent="emerald"
            data-section="actionable-dos"
          >
            <div className="space-y-3 pt-2">
              {data.do?.map((task, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-4"
                >
                  <div className="h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
                  <span className="text-sm font-medium text-white">{task}</span>
                </div>
              ))}
            </div>
          </TabSectionCard>
        </motion.div>

        <motion.div variants={item} className="md:col-span-2 xl:col-span-1">
          <TabSectionCard
            icon={AlertCircle}
            title="Strategic don'ts"
            description="Common mistakes that dilute reach or trust for this profile set."
            accent="red"
            data-section="actionable-donts"
          >
            <div className="space-y-3 pt-2">
              {data.dont?.map((task, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-2xl border border-red-500/10 bg-red-500/5 p-4 opacity-80"
                >
                  <div className="h-2 w-2 shrink-0 rounded-full bg-red-400" />
                  <span className="text-sm font-medium text-white">{task}</span>
                </div>
              ))}
            </div>
          </TabSectionCard>
        </motion.div>

        <motion.div variants={item} className="md:col-span-2 xl:col-span-3">
          <TabSectionCard
            icon={ListChecks}
            title="Implementation checklist"
            description="Prioritized tasks with deadlines — your roadmap for the next few weeks."
            accent="purple"
            data-section="actionable-checklist"
          >
            <p className="text-sm text-white/40">Your prioritized roadmap for the coming weeks:</p>
            <div className="mt-6">
              <Checklist items={data.checklist || []} />
            </div>
          </TabSectionCard>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ActionableTab;
