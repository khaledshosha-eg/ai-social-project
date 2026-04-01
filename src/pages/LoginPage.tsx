import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const LoginPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // حفظ الإيميل في جدول user_emails
      const { error } = await supabase
        .from('user_emails')
        .insert([{ email, created_at: new Date().toISOString() }]);

      if (error) {
        console.error('Error saving email:', error);
        // حتى لو فشل الحفظ في الجدول، هنكمل عملية الدخول عشان ممانعش المستخدم
      }

      localStorage.setItem('user_email', email);
      setSent(true);
      toast({
        title: t('magicLinkSent'),
        description: t('enterEmail'),
      });

      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -start-40 w-96 h-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-40 -end-40 w-96 h-96 rounded-full bg-accent/20 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="glass-card glow-border p-8 md:p-12 w-full max-w-md relative"
      >
        <div className="flex items-center justify-center gap-2 mb-8">
          <Sparkles className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">{t('appName')}</h1>
        </div>

        <p className="text-muted-foreground text-center mb-8 text-sm">
          {t('enterEmail')}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">{t('email')}</label>
            <div className="relative">
              <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@example.com"
                required
                className="w-full ps-10 pe-4 py-3 rounded-lg bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-3 rounded-lg btn-glow text-primary-foreground font-semibold transition-all cursor-pointer ${sent || loading ? '' : 'pulse-glow'}`}
            disabled={sent || loading}
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
            ) : sent ? t('magicLinkSent') : t('sendMagicLink')}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;
