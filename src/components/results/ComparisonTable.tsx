import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';

const ComparisonTable = ({ data = [] }: { data: any[] }) => {
  const { t } = useLanguage();

  const parseValue = (val: any) => {
    if (!val) return 0;
    const stringVal = String(val);
    const clean = stringVal.replace(/[^0-9.]/g, '');
    let num = parseFloat(clean) || 0;
    if (stringVal.includes('K')) num *= 1000;
    if (stringVal.includes('M')) num *= 1000000;
    return num;
  };

  const chartData = (data || []).map((row: any) => ({
    name: row.metric || '',
    you: parseValue(row.client),
    competitors: parseValue(row.competitor_avg),
    originalYou: row.client || '0',
    originalCompetitors: row.competitor_avg || '0'
  }));

  const sentimentData = [
    { name: t('positive') || 'Positive', value: 75, fill: '#10b981' },
    { name: t('negative') || 'Negative', value: 25, fill: '#ef4444' },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-white/10 p-3 rounded-lg shadow-xl">
          <p className="font-bold mb-1">{label}</p>
          <p className="text-blue-400"> {t('you') || 'You'}: {payload[0].payload.originalYou}</p>
          <p className="text-amber-400"> {t('competitorAvg') || 'Competitors'}: {payload[0].payload.originalCompetitors}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 text-white">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-800/50 p-6 rounded-2xl h-[400px]">
        <h3 className="text-lg font-semibold mb-6">{t('comparisonTable') || 'Market Comparison'}</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="name" tick={{fill: '#94a3b8'}} />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar name={t('you') || 'You'} dataKey="you" fill="#6366f1" radius={[4, 4, 0, 0]} />
            <Bar name={t('competitorAvg') || 'Comp'} dataKey="competitors" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default ComparisonTable;
