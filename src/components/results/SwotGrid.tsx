import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Lightbulb, Target } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SwotData {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

const swotConfig = [
  { key: 'strengths' as const, icon: Shield, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { key: 'weaknesses' as const, icon: AlertTriangle, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
  { key: 'opportunities' as const, icon: Lightbulb, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  { key: 'threats' as const, icon: Target, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
];

const SwotGrid = ({ swot }: { swot: SwotData }) => {
  const { t } = useLanguage();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
      <h3 className="text-lg font-semibold text-foreground mb-4">{t('swotAnalysis')}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {swotConfig.map(({ key, icon: Icon, color, bg, border }, idx) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + idx * 0.1 }}
            className={`glass-card p-5 space-y-3 border ${border}`}
          >
            <div className={`flex items-center gap-2 ${bg} w-fit px-3 py-1 rounded-full`}>
              <Icon className={`w-4 h-4 ${color}`} />
              <h4 className={`font-semibold text-sm ${color}`}>{t(key)}</h4>
            </div>
            <ul className="space-y-2">
              {(swot[key] || []).map((item: string, i: number) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${color.replace('text-', 'bg-')}`} />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default SwotGrid;
