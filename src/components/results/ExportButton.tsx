import { motion } from 'framer-motion';
import { Download, Share2, Loader2 } from 'lucide-react'; // أضفت Loader2 لشكل التحميل
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react'; // أضفت useState
import html2canvas from 'html2canvas'; // لازم تتأكد إنك سطبتها
import { jsPDF } from 'jspdf'; // لازم تتأكد إنك سطبتها

// أضفت الـ Props هنا عشان نقدر نتحكم في التابات من جوه الزرار
interface ExportButtonProps {
  setActiveTab?: (tab: string) => void;
}

const ExportButton: React.FC<ExportButtonProps> = ({ setActiveTab }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false); // حالة التحميل

  const handleDownloadPdf = async () => {
    if (isExporting) return;
    
    const allTabs = ['market', 'audience', 'competitive', 'performance', 'content', 'actionable'];
    
    if (!setActiveTab) {
      toast({ title: "Error", description: "Tab controller not found", variant: "destructive" });
      return;
    }

    setIsExporting(true);
    const pdf = new jsPDF('p', 'px');
    let isFirstPage = true;

    try {
      for (let i = 0; i < allTabs.length; i++) {
        const tabId = allTabs[i];
        
        // 1. تغيير التاب
        setActiveTab(tabId);

        // 2. الانتظار لضمان رندر العربي والمحتوى (1000ms كما طلبت)
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const element = document.getElementById('analysis-report');
        if (!element) continue;

        // 3. التقاط الشاشة بالإعدادات الدقيقة اللي طلبتها
        const canvas = await html2canvas(element, {
          scale: 2,
          backgroundColor: '#030014',
          useCORS: true,
          allowTaint: true,
          windowWidth: 1440,
          windowHeight: element.scrollHeight
        });

        const imgWidth = canvas.width / 2;
        const imgHeight = canvas.height / 2;

        // 4. إضافة الصفحة للـ PDF
        if (!isFirstPage) {
          pdf.addPage([imgWidth, imgHeight], imgWidth > imgHeight ? 'l' : 'p');
        } else {
          pdf.deletePage(1);
          pdf.addPage([imgWidth, imgHeight], imgWidth > imgHeight ? 'l' : 'p');
          isFirstPage = false;
        }

        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        
        toast({ title: t('exportPdf'), description: `Exporting tab ${i+1} of 6...` });
      }

      pdf.save('AiSocialProject-Report.pdf');
      toast({ title: t('exportPdf'), description: t('exportPdfDesc') });

    } catch (error) {
      console.error(error);
      toast({ title: "Export Error", description: "Failed to generate PDF", variant: "destructive" });
    } finally {
      setIsExporting(false);
    }
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
        disabled={isExporting}
        className="flex items-center gap-2 px-6 py-3 rounded-lg btn-glow text-primary-foreground font-semibold transition-all cursor-pointer disabled:opacity-70"
      >
        {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
        {isExporting ? 'Processing...' : t('downloadPdf')}
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