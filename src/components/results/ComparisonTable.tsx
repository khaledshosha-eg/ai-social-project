import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';

interface ComparisonRow {
  metric: string;
  client: string | number;
  competitor_avg: string | number;
}

interface ComparisonTableProps {
  data: ComparisonRow[];
}

const ComparisonTable = ({ data = [] }: ComparisonTableProps) => {
  const { t } = useLanguage();

  const parseValue = (val: string | number | null | undefined) => {
    if (val === null || val === undefined) return 0;
    if (typeof val === 'number') return val;
    const stringVal = String(val);
    const clean = stringVal.replace(/[^0-9.]/g, '');
    let num = parseFloat(clean) || 0;
    if (stringVal.includes('K')) num *= 1000;
    if (stringVal.includes('M')) num *= 1000000;
    return num;
  };

  const chartData = (data || []).map((row) => ({
    name: row.metric || '',
    you: parseValue(row.client),
    competitors: parseValue(row.competitor_avg),
    originalYou: row.client || '0',
    originalCompetitors: row.competitor_avg || '0'
  }));

  const CustomTooltip = ({ active, payload, label }: { active?: boolean, payload?: any, label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border p-3 rounded-xl shadow-2xl backdrop-blur-md">
          <p className="font-bold text-foreground mb-1">{label}</p>
          <p className="text-primary flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            {t('you') || 'You'}: {payload[0].payload.originalYou}
          </p>
          <p className="text-accent flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent" />
            {t('competitorAvg') || 'Competitors'}: {payload[0].payload.originalCompetitors}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="bg-card/50 border border-border p-6 rounded-2xl h-[400px] shadow-xl"
    >
      <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
        <span className="w-2 h-6 bg-primary rounded-full"></span>
        {t('comparisonTable') || 'Market Comparison'}
      </h3>
      <div className="w-full h-full pb-10">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis 
              dataKey="name" 
              tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} 
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Legend 
              verticalAlign="top" 
              align="right" 
              iconType="circle"
              wrapperStyle={{ paddingBottom: '20px' }}
            />
            <Bar 
              name={t('you') || 'You'} 
              dataKey="you" 
              fill="hsl(var(--primary))" 
              radius={[4, 4, 0, 0]} 
              barSize={30}
            />
            <Bar 
              name={t('competitorAvg') || 'Comp'} 
              dataKey="competitors" 
              fill="hsl(var(--accent))" 
              radius={[4, 4, 0, 0]} 
              barSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default ComparisonTable;