import React from 'react';
import { motion } from 'framer-motion';
import { Activity, TrendingUp, AlertCircle, Lightbulb, BarChart as BarChartIcon } from 'lucide-react';
import ProgressBar from '../ui/ProgressBar';
import TabSectionCard from './TabSectionCard';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';

interface PerformanceData {
  data: { name: string; value: number }[];
  engagement_rates: { page: string; rate: number }[];
  urgent_improvements: { page: string; issue: string; solution: string }[];
  hidden_insights: string[];
}

const PerformanceTab = ({ data }: { data: PerformanceData }) => {
  if (!data || !data.data)
    return (
      <div className="p-8 text-center text-white/40" data-tab="performance">
        No performance data available.
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

  const COLORS = ['#6B4FBB', '#8B5CF6', '#D8B4FE', '#F3E8FF'];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 lg:space-y-10"
      data-tab="performance"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
        <motion.div variants={item} className="md:col-span-2 xl:col-span-2">
          <TabSectionCard
            icon={BarChartIcon}
            title="Intelligence score comparison"
            description="Relative performance scores across analyzed pages or brands."
            accent="blue"
            data-section="performance-scores-chart"
          >
            <div className="mt-2 h-72 w-full min-h-[16rem] sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.data || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#ffffff40"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#030014',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                    }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={40}>
                    {data.data?.map?.((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabSectionCard>
        </motion.div>

        <motion.div variants={item} className="md:col-span-2 xl:col-span-1">
          <TabSectionCard
            icon={Activity}
            title="Engagement rates"
            description="Interaction density per follower — with a visual progress read per page."
            accent="purple"
            data-section="performance-engagement-rates"
          >
            <div className="space-y-6 pt-2">
              {data.engagement_rates?.map((rate, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{rate.page}</span>
                    <span className="text-sm font-black text-purple-400">{rate.rate}%</span>
                  </div>
                  <ProgressBar value={rate.rate * 10} color="purple" />
                </div>
              ))}
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-[10px] uppercase leading-relaxed tracking-widest text-white/40">
                  Calculated based on average interaction density per follower.
                </p>
              </div>
            </div>
          </TabSectionCard>
        </motion.div>

        <motion.div variants={item} className="md:col-span-2 xl:col-span-2">
          <TabSectionCard
            icon={AlertCircle}
            title="Urgent improvements"
            description="High-impact issues paired with practical fixes, grouped by page."
            accent="red"
            data-section="performance-urgent"
          >
            <div className="space-y-4 pt-2">
              {data.urgent_improvements?.map((imp, i) => (
                <div
                  key={i}
                  className="space-y-3 rounded-2xl border border-red-500/10 bg-red-500/5 p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-widest text-red-400">
                      {imp.page}
                    </span>
                    <span className="rounded-md bg-red-500/20 px-2 py-0.5 text-[10px] font-bold text-red-400">
                      Urgent
                    </span>
                  </div>
                  <div>
                    <p className="mb-1 text-sm font-bold text-white">Issue: {imp.issue}</p>
                    <p className="text-sm text-white/60">Solution: {imp.solution}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabSectionCard>
        </motion.div>

        <motion.div variants={item} className="md:col-span-2 xl:col-span-1">
          <TabSectionCard
            icon={Lightbulb}
            title="Deep data insights"
            description="Non-obvious patterns worth testing in creative and media."
            accent="amber"
            data-section="performance-insights"
          >
            <div className="space-y-4 pt-2">
              {data.hidden_insights?.map((insight, i) => (
                <div
                  key={i}
                  className="flex gap-4 rounded-2xl border border-amber-500/10 bg-amber-500/5 p-4 transition-all hover:bg-amber-500/10"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-500">
                    <TrendingUp size={20} />
                  </div>
                  <p className="text-sm leading-relaxed italic text-white/80">
                    &ldquo;{insight}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </TabSectionCard>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PerformanceTab;
