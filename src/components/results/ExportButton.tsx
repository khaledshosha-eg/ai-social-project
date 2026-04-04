import { motion } from 'framer-motion';
import { Download, Share2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

const ExportButton = () => {
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleDownloadPdf = () => {
    // Add print-specific styles dynamically if needed, though most are in index.css
    window.print();
    toast({ 
      title: t('exportPdf'), 
      description: t('exportPdfDesc'),
      variant: "default"
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SocialPulse AI Report',
          text: t('shareReportText'),
          url: window.location.href,
        });
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast({ title: t('linkCopied'), description: t('linkCopiedDesc') });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2 }}
      className="flex flex-wrap gap-3 print:hidden"
    >
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleDownloadPdf}
        className="flex items-center gap-2 px-6 py-3 rounded-lg btn-glow text-primary-foreground font-semibold transition-all cursor-pointer"
      >
        <Download className="w-4 h-4" />
        {t('downloadPdf')}
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleShare}
        className="flex items-center gap-2 px-6 py-3 rounded-lg glass-card border border-border text-foreground font-semibold hover:bg-secondary/50 transition-all cursor-pointer"
      >
        <Share2 className="w-4 h-4" />
        {t('shareReport')}
      </motion.button>
    </motion.div>
  );
};

export default ExportButton;
