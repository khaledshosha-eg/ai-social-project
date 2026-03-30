import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const getScoreColor = (score: number) => {
  if (score >= 80) return { stroke: 'hsl(142, 76%, 46%)', label: 'text-emerald-400' };
  if (score >= 60) return { stroke: 'hsl(48, 96%, 53%)', label: 'text-amber-400' };
  if (score >= 40) return { stroke: 'hsl(25, 95%, 53%)', label: 'text-orange-400' };
  return { stroke: 'hsl(0, 84%, 60%)', label: 'text-red-400' };
};

const ScoreGauge = ({ score }: { score: number }) => {
  const { t } = useLanguage();
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const colors = getScoreColor(score);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-card glow-border p-8 flex flex-col items-center gap-6"
    >
      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-primary" /> {t('marketScore')}
      </h3>
      <div className="relative w-52 h-52">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r={radius} fill="none" stroke="hsl(var(--border))" strokeWidth="10" opacity="0.3" />
          <motion.circle
            cx="100" cy="100" r={radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 2, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={`text-5xl font-bold ${colors.label}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, type: 'spring' }}
          >
            {score}
          </motion.span>
          <span className="text-sm text-muted-foreground font-medium">/100</span>
        </div>
      </div>
      <p className="text-sm text-muted-foreground text-center">
        {score >= 80 ? t('scoreExcellent') : score >= 60 ? t('scoreGood') : score >= 40 ? t('scoreFair') : t('scoreNeedsWork')}
      </p>
    </motion.div>
  );
};

export default ScoreGauge;
