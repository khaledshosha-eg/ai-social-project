import { motion } from 'framer-motion';
import { Download, Share2, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface ExportButtonProps {
  setActiveTab?: (tab: string) => void;
}

const ALL_TABS = ['market', 'audience', 'competitive', 'performance', 'content', 'actionable'];

const TAB_LABELS: Record<string, string> = {
  market:      'Market Overview',
  audience:    'Audience Intelligence',
  competitive: 'Competitive Intelligence',
  performance: 'Performance Intelligence',
  content:     'Content Intelligence',
  actionable:  'Actionable Insights',
};

const ExportButton: React.FC<ExportButtonProps> = ({ setActiveTab }) => {
  const { t } = useLanguage();
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  // ─── Helper: wait for all images/animations to settle ───
  const waitForRender = (ms = 900) => new Promise<void>(res => setTimeout(res, ms));

  // ─── Capture one tab as canvas ───
  const captureTab = async (tabId: string): Promise<HTMLCanvasElement | null> => {
    if (!setActiveTab) return null;

    setActiveTab(tabId);
    await waitForRender(1000); // give framer-motion time to finish

    // Target the tab panel, not the whole page (avoids capturing the nav bar twice)
    const panel =
      document.querySelector<HTMLElement>(`[data-tab-panel="${tabId}"]`) ||
      document.getElementById('analysis-report');

    if (!panel) return null;

    return html2canvas(panel, {
      scale: 1.8,
      backgroundColor: '#030014',
      useCORS: true,
      allowTaint: true,
      // Render at a fixed viewport so fonts/layout are consistent
      windowWidth: 1440,
      windowHeight: panel.scrollHeight + 100,
      scrollY: -window.scrollY,
      ignoreElements: (el) => el.classList?.contains('print:hidden'),
    });
  };

  // ─── Main export handler ───
  const handleDownloadPdf = async () => {
    if (isExporting) return;

    if (!setActiveTab) {
      toast.error('Tab controller not connected – please refresh and try again.');
      return;
    }

    setIsExporting(true);
    setProgress(0);

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      compress: true,
    });

    let firstPage = true;

    try {
      for (let i = 0; i < ALL_TABS.length; i++) {
        const tabId = ALL_TABS[i];
        toast.info(`Capturing ${TAB_LABELS[tabId]}… (${i + 1}/${ALL_TABS.length})`);

        const canvas = await captureTab(tabId);
        if (!canvas) continue;

        const imgData   = canvas.toDataURL('image/jpeg', 0.92); // JPEG is ~3× smaller than PNG
        const pageW     = canvas.width  / 1.8;
        const pageH     = canvas.height / 1.8;

        if (firstPage) {
          // jsPDF initialises with a default blank page – resize it
          pdf.deletePage(1);
          firstPage = false;
        }

        pdf.addPage([pageW, pageH], pageW > pageH ? 'landscape' : 'portrait');
        pdf.addImage(imgData, 'JPEG', 0, 0, pageW, pageH);

        setProgress(Math.round(((i + 1) / ALL_TABS.length) * 100));
      }

      const fileName = `AiSocialProject-Report-${new Date().toISOString().slice(0, 10)}.pdf`;
      pdf.save(fileName);
      toast.success(`✅ Report exported: ${fileName}`);

    } catch (error: any) {
      console.error('Export failed:', error);
      toast.error('Export failed: ' + (error?.message || 'Unknown error'));
    } finally {
      setIsExporting(false);
      setProgress(0);
      // Return to first tab after export
      setActiveTab?.('market');
    }
  };

  // ─── Share handler ───
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Ai Social Project Report', url });
      } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard ✅');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="flex flex-wrap gap-3 print:hidden"
    >
      {/* Export PDF */}
      <motion.button
        whileHover={{ scale: isExporting ? 1 : 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleDownloadPdf}
        disabled={isExporting}
        className="relative overflow-hidden flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold shadow-lg shadow-primary/20 transition-all disabled:opacity-70"
      >
        {/* Progress bar inside the button */}
        {isExporting && (
          <span
            className="absolute inset-0 bg-white/10 transition-all"
            style={{ width: `${progress}%` }}
          />
        )}
        <span className="relative flex items-center gap-2">
          {isExporting
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Exporting… {progress}%</>
            : <><Download className="w-4 h-4" /> Export Report</>}
        </span>
      </motion.button>

      {/* Share */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleShare}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all"
      >
        <Share2 className="w-4 h-4" />
        Share
      </motion.button>
    </motion.div>
  );
};

export default ExportButton;
