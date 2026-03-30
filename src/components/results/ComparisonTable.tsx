import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
  PieChart,
  Pie
} from 'recharts';

interface ComparisonRow {
  metric: string;
  client: string;
  competitor_avg: string;
}

const ComparisonTable = ({ data }: { data: ComparisonRow[] }) => {
  const { t } = useLanguage();

  // Helper to parse string values like "4.2%" or "12.4K" to numbers
  const parseValue = (val: string) => {
    const clean = val.replace(/[^0-9.]/g, '');
    let num = parseFloat(clean);
    if (val.includes('K')) num *= 1000;
    if (val.includes('M')) num *= 1000000;
    return num;
  };

  const chartData = data.map(row => ({
    name: row.metric,
    you: parseValue(row.client),
    competitors: parseValue(row.competitor_avg),
    originalYou: row.client,
    originalCompetitors: row.competitor_avg
  }));

  // Demo Sentiment Data
  const sentimentData = [
    { name: t('positive'), value: 75, fill: '#10b981' },
    { name: t('negative'), value: 25, fill: '#ef4444' },
  ];

  interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
      payload: {
        originalYou: string;
        originalCompetitors: string;
      };
    }>;
    label?: string;
  }

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 border border-white/10 shadow-xl">
          <p className="font-bold text-foreground mb-1">{label}</p>
          <p className="text-primary flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            {t('you')}: {payload[0].payload.originalYou}
          </p>
          <p className="text-accent flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent" />
            {t('competitorAvg')}: {payload[0].payload.originalCompetitors}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card glow-border p-6 h-[400px] flex flex-col"
      >
        <h3 className="text-lg font-semibold text-foreground mb-6">{t('comparisonTable')}</h3>
        
        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
              barGap={8}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                dy={10}
              />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Legend 
                verticalAlign="top" 
                align="right" 
                iconType="circle"
                wrapperStyle={{ paddingBottom: '20px', fontSize: '12px' }}
              />
              <Bar 
                name={t('you')} 
                dataKey="you" 
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-you-${index}`} fill="url(#purpleGradient)" />
                ))}
              </Bar>
              <Bar 
                name={t('competitorAvg')} 
                dataKey="competitors" 
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-comp-${index}`} fill="url(#goldGradient)" />
                ))}
              </Bar>
              <defs>
                <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={1} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
                </linearGradient>
                <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={1} />
                  <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0.6} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card glow-border p-6 flex flex-col items-center"
      >
        <h3 className="text-lg font-semibold text-foreground mb-4 self-start">{t('sentimentAnalysis')}</h3>
        <div className="w-full h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sentimentData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                animationDuration={1500}
              >
                {sentimentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(30, 30, 46, 0.9)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px'
                }} 
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default ComparisonTable;
