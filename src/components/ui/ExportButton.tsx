import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

interface ExportButtonProps {
  reportId?: string;
  filename?: string;
  className?: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({ 
  reportId = 'analysis-report', 
  filename = 'TheTerminator-AI-Report.pdf',
  className
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState('');

  const handleExport = async () => {
    // Check if we can control the tabs from the window
    const windowObj = window as any;
    if (!windowObj.setActiveTab || !windowObj.availableTabs) {
      toast.error('Export system is not fully ready. Please wait or refresh.');
      return;
    }

    try {
      setIsExporting(true);
      const originalTab = windowObj.activeTab;
      const tabsToExport = windowObj.availableTabs;
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < tabsToExport.length; i++) {
        const tabId = tabsToExport[i];
        setExportProgress(`Exporting tab ${i + 1}/${tabsToExport.length}...`);
        
        // 1. Switch tab
        windowObj.setActiveTab(tabId);
        
        // 2. Wait for animations and rendering
        await new Promise(resolve => setTimeout(resolve, 800));

        // 3. Capture tab content
        const element = document.getElementById(reportId);
        if (!element) continue;

        // Force a brief delay to ensure high-quality Recharts and Framer Motion finish
        await new Promise(resolve => setTimeout(resolve, 500));

        const canvas = await html2canvas(element, {
          scale: 3,
          useCORS: true,
          logging: false,
          backgroundColor: '#030014',
          windowWidth: 1400, // Force a consistent desktop width for export
          windowHeight: element.scrollHeight,
          onclone: (clonedDoc) => {
            // Remove any scaling classes in the clone to ensure 1:1 capture
            const clonedEl = clonedDoc.getElementById(reportId);
            if (clonedEl) {
              clonedEl.style.transform = 'none';
              clonedEl.style.scale = '1';
            }
          }
        });

        const imgData = canvas.toDataURL('image/png', 1.0);
        
        // 4. Add to PDF
        if (i > 0) pdf.addPage();
        
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, (pdfHeight - 20) / imgHeight);
        
        const finalWidth = imgWidth * ratio;
        const finalHeight = imgHeight * ratio;
        
        const x = (pdfWidth - finalWidth) / 2;
        const y = 10;

        pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight, undefined, 'FAST');
      }

      // 5. Restore original tab
      windowObj.setActiveTab(originalTab);
      
      pdf.save(filename);
      toast.success('All tabs exported successfully');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export PDF');
    } finally {
      setIsExporting(false);
      setExportProgress('');
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className={`
        relative group flex items-center gap-2 px-6 py-3 rounded-xl 
        bg-primary text-white hover:bg-primary/90 transition-all 
        font-semibold shadow-lg shadow-primary/20 disabled:opacity-70
        ${className}
      `}
    >
      {isExporting ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <Download className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
      )}
      <span>{isExporting ? exportProgress : 'Export All Tabs PDF'}</span>
    </button>
  );
};

export default ExportButton;
