import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ContentItem {
  day: string;
  topic: string;
  platform: string;
  best_time: string;
  detail: string;
}

const TypingText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1));
          i++;
        } else {
          setDone(true);
          clearInterval(interval);
        }
      }, 15);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [text, delay]);

  return <span className={done ? '' : 'typing-cursor'}>{displayed}</span>;
};

const ContentRoadmap = ({ plan }: { plan: ContentItem[] }) => {
  const { t } = useLanguage();
  const [showPlan, setShowPlan] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowPlan(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-primary" /> {t('contentPlan')}
      </h3>

      {!showPlan ? (
        <div className="glass-card p-8 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
            className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-3"
          />
          <p className="text-muted-foreground typing-cursor">{t('aiGenerating')}</p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[18px] top-4 bottom-4 w-0.5 bg-border hidden sm:block" />

          <div className="space-y-4">
            {plan.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.12 }}
                className="glass-card glow-hover p-5 sm:ml-10 relative"
              >
                {/* Timeline dot */}
                <div className="absolute -left-[calc(2.5rem+5px)] top-6 w-3 h-3 rounded-full bg-primary border-2 border-background hidden sm:block" />

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="shrink-0 sm:w-28">
                    <span className="text-sm font-bold text-primary">{item.day}</span>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{item.best_time}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground text-sm">{item.topic}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Globe className="w-3 h-3 text-accent-foreground" />
                      <span className="text-xs text-accent-foreground font-medium">{item.platform}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      <TypingText text={item.detail} delay={600 + i * 250} />
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ContentRoadmap;
