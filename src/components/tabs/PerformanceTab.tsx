import React from 'react';
import { motion } from 'framer-motion';
import { Activity, TrendingUp, AlertCircle, Lightbulb, BarChart as BarChartIcon } from 'lucide-react';
import Card from '../ui/Card';
import ProgressBar from '../ui/ProgressBar';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';

interface PerformanceData {
  data: { name: string; value: number }[];
  engagement_rates: { page: string; rate: number }[];
  urgent_improvements: { page: string; issue: string; solution: string }[];
  hidden_insights: string[];
}

const PerformanceTab = ({ data }: { data: PerformanceData }) => {
  if (!data || !data.data) return <div className="p-8 text-center text-white/40">No performance data available.</div>;

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const COLORS = ['#6B4FBB', '#8B5CF6', '#D8B4FE', '#F3E8FF'];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Engagement Scores Chart */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card title="Intelligence Score Comparison" icon={BarChartIcon} color="blue">
            <div className="h-80 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.data || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="name" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#030014', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
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
          </Card>
        </motion.div>

        {/* Engagement Rates List */}
        <motion.div variants={item}>
          <Card title="Engagement Rates" icon={Activity} color="purple">
            <div className="space-y-6">
              {data.engagement_rates?.map((rate, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-white">{rate.page}</span>
                    <span className="text-sm font-black text-purple-400">{rate.rate}%</span>
                  </div>
                  <ProgressBar value={rate.rate * 10} color="purple" />
                </div>
              ))}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mt-4">
                <p className="text-[10px] text-white/40 uppercase tracking-widest leading-relaxed">
                  Calculated based on average interaction density per follower.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Urgent Improvements */}
        <motion.div variants={item}>
          <Card title="Urgent Improvements" icon={AlertCircle} color="red">
            <div className="space-y-4">
              {data.urgent_improvements?.map((imp, i) => (
                <div key={i} className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-red-400 uppercase tracking-widest">{imp.page}</span>
                    <span className="px-2 py-0.5 rounded-md bg-red-500/20 text-red-400 text-[10px] font-bold">URGENT</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white mb-1">Issue: {imp.issue}</p>
                    <p className="text-sm text-white/60">Solution: {imp.solution}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Hidden Insights */}
        <motion.div variants={item}>
          <Card title="Deep Data Insights" icon={Lightbulb} color="amber">
            <div className="space-y-4">
              {data.hidden_insights?.map((insight, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 group hover:bg-amber-500/10 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                    <TrendingUp size={20} />
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed italic">
                    "{insight}"
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

export default PerformanceTab;
