import React from 'react';
import { motion } from 'framer-motion';
import { Target, CheckCircle2, AlertCircle, Rocket, Zap, ListChecks } from 'lucide-react';
import Card from '../ui/Card';
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
  if (!data || !data.checklist) return <div className="p-8 text-center text-white/40">No actionable insights available.</div>;

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
      {/* Strategic Focus Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={item}>
          <Card title="Biggest Opportunity" icon={Target} color="amber">
            <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/20 h-full flex flex-col justify-center">
              <p className="text-lg font-black text-white leading-relaxed">
                {data.biggest_opportunity || 'Identifying trends...'}
              </p>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card title="Quick Win (7 Days)" icon={Zap} color="emerald">
            <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 h-full flex flex-col justify-center">
              <p className="text-lg font-black text-white leading-relaxed">
                {data.quick_win || 'Analyze comments for instant feedback.'}
              </p>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card title="Best Ad Angle" icon={Rocket} color="blue">
            <div className="p-6 rounded-3xl bg-blue-500/10 border border-blue-500/20 h-full flex flex-col justify-center">
              <p className="text-lg font-black text-white leading-relaxed">
                {data.best_ad || 'Focus on educational content for higher trust.'}
              </p>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Do's and Don'ts */}
        <motion.div variants={item} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="text-emerald-400" size={24} /> Strategic Do's
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {data.do?.map((task, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-sm text-white font-medium">{task}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <AlertCircle className="text-red-400" size={24} /> Strategic Don'ts
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {data.dont?.map((task, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/5 border border-red-500/10 opacity-70">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <span className="text-sm text-white font-medium">{task}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Implementation Checklist */}
        <motion.div variants={item}>
          <Card title="Implementation Checklist" icon={ListChecks} color="purple">
            <p className="text-sm text-white/40 mb-6">Your prioritized roadmap for the coming weeks:</p>
            <Checklist items={data.checklist || []} />
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ActionableTab;
