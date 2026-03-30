import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, BarChart3, Settings, LogOut, Sparkles, Trash2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const sidebarItems = [
  { icon: BarChart3, key: 'dashboard' },
  { icon: Search, key: 'results' },
  { icon: Settings, key: 'settings' },
];

const DashboardPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [facebookUrl, setFacebookUrl] = useState('');
  const [competitors, setCompetitors] = useState(['', '', '']);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!facebookUrl) return;
    setLoading(true);

    const clientUrl = facebookUrl.trim();
    const competitorList = competitors.filter(Boolean);

    try {
      const requestBody = {
        clientUrl,
        competitors: competitorList,
      };

      console.log('Calling analyze-market Edge Function');
      console.log('Request body:', requestBody);

      const [invokeResult] = await Promise.all([
        supabase.functions.invoke('analyze-market', {
          body: requestBody,
        }),
        new Promise((resolve) => setTimeout(resolve, 5000)),
      ]);

      const { data, error } = invokeResult;

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(`Edge function returned error: ${error.message}`);
      }

      console.log('Response data:', data);

      if (data?.error) {
        console.error('Edge function returned error payload:', data.error);
        throw new Error(data.error);
      }

      navigate('/results', { state: data });
    } catch (err: any) {
      console.error('Analysis failed:', err);
      toast({
        title: t('analyze'),
        description: err?.message || 'Analysis failed. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateCompetitor = (index: number, value: string) => {
    const updated = [...competitors];
    updated[index] = value;
    setCompetitors(updated);
  };

  return (
    <div className="min-h-screen flex">
      <motion.aside
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="glass-card w-16 md:w-64 min-h-screen flex flex-col items-center md:items-stretch p-4 gap-2 rounded-none border-e"
      >
        <div className="flex items-center gap-2 mb-8 px-2">
          <Sparkles className="w-6 h-6 text-primary shrink-0" />
          <span className="hidden md:block text-lg font-bold text-foreground">{t('appName')}</span>
        </div>

        <nav className="flex-1 space-y-1">
          {sidebarItems.map(({ icon: Icon, key }) => (
            <button
              key={key}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors cursor-pointer"
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="hidden md:block text-sm font-medium">{t(key)}</span>
            </button>
          ))}
        </nav>

        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span className="hidden md:block text-sm font-medium">{t('logout')}</span>
        </button>
      </motion.aside>

      <main className="flex-1 p-6 md:p-12 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card glow-border p-8 md:p-10 w-full max-w-2xl space-y-8"
        >
          <h2 className="text-2xl font-bold text-foreground">{t('dashboard')}</h2>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">{t('yourFacebookUrl')}</label>
            <input
              type="url"
              value={facebookUrl}
              onChange={(e) => setFacebookUrl(e.target.value)}
              placeholder={t('enterFacebookUrl')}
              className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">{t('competitorUrls')}</label>
            {competitors.map((url, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => updateCompetitor(i, e.target.value)}
                  placeholder={`${t('competitor')} ${i + 1}`}
                  className="flex-1 px-4 py-3 rounded-lg bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
                {url && (
                  <button onClick={() => updateCompetitor(i, '')} className="text-muted-foreground hover:text-destructive transition-colors cursor-pointer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAnalyze}
            disabled={loading || !facebookUrl}
            className="w-full py-3.5 rounded-lg btn-glow text-primary-foreground font-semibold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                />
                {t('analyzing')}
              </span>
            ) : (
              t('analyze')
            )}
          </motion.button>
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardPage;