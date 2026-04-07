import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  FileText, Upload, Brain, Lightbulb, Download, Trash2,
  TrendingUp, Users, Target, Rocket, Activity, CheckCircle2
} from 'lucide-react';
import { callAI } from '@/services/aiService';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import Tabs from '@/components/tabs/Tabs';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

interface PageValues {
  url: string;
  followers: string;
  total_posts: string;
  content_type: string;
  frequency: string;
  ads: string;
  avg_likes: string;
  avg_comments: string;
  avg_shares: string;
  top_post_type: string;
  posting_time: string;
  sample_comments: string;
  posts_count: string;
}

interface FormData {
  client: PageValues;
  comp1: PageValues;
  comp2: PageValues;
  comp3: PageValues;
}

interface AnalysisResult {
  performance: { data: any[], insights: string[] };
  content: { data: any[], insights: string[] };
  audience: { data: any[], insights: string[] };
  competitors: { data: any[], insights: string[] };
  opportunities: { data: any[], insights: string[] };
  summary: string[];
}

const PageInputCard = React.memo(({ title, color, section, values, onChange }: { 
  title: string, color: string, section: keyof FormData, values: PageValues, onChange: (section: keyof FormData, field: keyof PageValues, value: string) => void 
}) => {
  const { t } = useLanguage();

  // Unified handleChange for consistency
  const handleChange = (field: keyof PageValues, value: string) => {
    onChange(section, field, value);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card/30 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-4 hover:border-primary/30 transition-all duration-500"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-3 h-3 rounded-full bg-${color}-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]`} />
        <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <input 
          type="text" 
          name={`${section}-url`}
          placeholder={t('enterFacebookUrl')} 
          value={values?.url || ''} 
          className="col-span-2 bg-secondary/30 backdrop-blur-md border border-white/5 rounded-lg p-2 text-xs text-foreground outline-none focus:border-primary placeholder:text-muted-foreground font-normal transition-all" 
          onChange={(e) => handleChange('url', e.target.value)} 
        />
        <input 
          type="text" 
          name={`${section}-followers`}
          placeholder={t('followers')} 
          value={values?.followers || ''} 
          className="bg-secondary/30 backdrop-blur-md border border-white/5 rounded-lg p-2 text-xs text-foreground outline-none focus:border-primary placeholder:text-muted-foreground font-normal" 
          onChange={(e) => handleChange('followers', e.target.value)} 
        />
        <input 
          type="text" 
          name={`${section}-total_posts`}
          placeholder="Total Posts" 
          value={values?.total_posts || ''} 
          className="bg-secondary/30 backdrop-blur-md border border-white/5 rounded-lg p-2 text-xs text-foreground outline-none focus:border-primary placeholder:text-muted-foreground font-normal" 
          onChange={(e) => handleChange('total_posts', e.target.value)} 
        />
        <select 
          name={`${section}-content_type`}
          value={values?.content_type || ''} 
          className="bg-secondary/30 backdrop-blur-md border border-white/5 rounded-lg p-2 text-xs text-foreground outline-none focus:border-primary" 
          onChange={(e) => handleChange('content_type', e.target.value)}
        >
          <option value="" className="text-muted-foreground">Content Type</option>
          <option value="Image">Image</option>
          <option value="Video">Video</option>
          <option value="Carousel">Carousel</option>
          <option value="Mixed">Mixed</option>
        </select>
        <select 
          name={`${section}-frequency`}
          value={values?.frequency || ''} 
          className="bg-secondary/30 backdrop-blur-md border border-white/5 rounded-lg p-2 text-xs text-foreground outline-none focus:border-primary" 
          onChange={(e) => handleChange('frequency', e.target.value)}
        >
          <option value="" className="text-muted-foreground">{t('postFrequency')}</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <input 
          type="text" 
          name={`${section}-avg_likes`}
          placeholder="Avg Likes per Post" 
          value={values?.avg_likes || ''} 
          className="bg-secondary/30 backdrop-blur-md border border-white/5 rounded-lg p-2 text-xs text-foreground outline-none focus:border-primary placeholder:text-muted-foreground font-normal" 
          onChange={(e) => handleChange('avg_likes', e.target.value)} 
        />
        <input 
          type="text" 
          name={`${section}-avg_comments`}
          placeholder="Avg Comments per Post" 
          value={values?.avg_comments || ''} 
          className="bg-secondary/30 backdrop-blur-md border border-white/5 rounded-lg p-2 text-xs text-foreground outline-none focus:border-primary placeholder:text-muted-foreground font-normal" 
          onChange={(e) => handleChange('avg_comments', e.target.value)} 
        />
        <input 
          type="text" 
          name={`${section}-avg_shares`}
          placeholder="Avg Shares per Post" 
          value={values?.avg_shares || ''} 
          className="bg-secondary/30 backdrop-blur-md border border-white/5 rounded-lg p-2 text-xs text-foreground outline-none focus:border-primary placeholder:text-muted-foreground font-normal" 
          onChange={(e) => handleChange('avg_shares', e.target.value)} 
        />
        <input 
          type="text" 
          name={`${section}-posting_time`}
          placeholder="Best Posting Time (e.g. 8PM)" 
          value={values?.posting_time || ''} 
          className="bg-secondary/30 backdrop-blur-md border border-white/5 rounded-lg p-2 text-xs text-foreground outline-none focus:border-primary placeholder:text-muted-foreground font-normal" 
          onChange={(e) => handleChange('posting_time', e.target.value)} 
        />
        <select 
          name={`${section}-top_post_type`}
          value={values?.top_post_type || ''} 
          className="bg-secondary/30 backdrop-blur-md border border-white/5 rounded-lg p-2 text-xs text-foreground outline-none focus:border-primary" 
          onChange={(e) => handleChange('top_post_type', e.target.value)}
        >
          <option value="" className="text-muted-foreground">Top Post Type</option>
          <option value="Educational">Educational</option>
          <option value="Promotional">Promotional</option>
          <option value="Entertaining">Entertaining</option>
          <option value="Behind the Scenes">Behind the Scenes</option>
        </select>
        <input 
          type="text" 
          name={`${section}-posts_count`}
          placeholder="Number of Posts" 
          value={values?.posts_count || ''} 
          className="col-span-2 bg-secondary/30 backdrop-blur-md border border-white/5 rounded-lg p-2 text-xs text-foreground outline-none focus:border-primary placeholder:text-muted-foreground font-normal" 
          onChange={(e) => handleChange('posts_count', e.target.value)} 
        />
      </div>
      <textarea 
        name={`${section}-sample_comments`}
        placeholder="3-5 real comments from this page..." 
        value={values?.sample_comments || ''} 
        className="w-full bg-secondary/30 backdrop-blur-md border border-white/5 rounded-xl p-3 text-sm text-foreground outline-none focus:border-primary placeholder:text-muted-foreground font-normal h-24 resize-none transition-all" 
        onChange={(e) => handleChange('sample_comments', e.target.value)} 
      />
    </motion.div>
  );
});

const AnalysisCard = ({ title, icon: Icon, children, color }: { title: string, icon: any, children: React.ReactNode, color: string }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-card/30 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl"
  >
    <div className="flex items-center gap-3 mb-6">
      <div className={`p-3 rounded-2xl bg-${color}/20 text-${color}`}>
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
    </div>
    {children}
  </motion.div>
);

const DashboardPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [fileContent, setFileContent] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const defaultData: FormData = { 
    client: { url: 'https://www.facebook.com/SafetySourceCo', followers: '23K', total_posts: '5', content_type: 'Image', frequency: 'Medium', ads: 'No', avg_likes: '', avg_comments: '', avg_shares: '', top_post_type: '', posting_time: '', sample_comments: '', posts_count: '' },
    comp1: { url: 'https://www.facebook.com/flairsystems', followers: '9.3K', total_posts: '2', content_type: 'Mixed', frequency: 'Low', ads: 'No', avg_likes: '', avg_comments: '', avg_shares: '', top_post_type: '', posting_time: '', sample_comments: '', posts_count: '' },
    comp2: { url: 'https://www.facebook.com/Fastegy1', followers: '8.9', total_posts: '3', content_type: 'Mixed', frequency: 'Medium', ads: 'No', avg_likes: '', avg_comments: '', avg_shares: '', top_post_type: '', posting_time: '', sample_comments: '', posts_count: '' },
    comp3: { url: 'https://www.facebook.com/secu.group', followers: '4.6K', total_posts: '3', content_type: 'Mixed', frequency: 'Medium', ads: 'No', avg_likes: '', avg_comments: '', avg_shares: '', top_post_type: '', posting_time: '', sample_comments: '', posts_count: '' }
  };

  const [formData, setFormData] = useLocalStorage<FormData>('social_pulse_form', defaultData);

  // Remove the old useEffect for localStorage since useLocalStorage handles it
  /*
  useEffect(() => {
    localStorage.setItem('social_pulse_history_v3', JSON.stringify(formData));
  }, [formData]);
  */

  const handleUpdate = useCallback((section: keyof FormData, field: keyof PageValues, value: string) => {
    setFormData((prev) => {
      // Robust functional update with deep spread to prevent any overwrites
      const newSectionData = { 
        ...(prev?.[section] || {}), 
        [field]: value 
      };
      
      return { 
        ...prev, 
        [section]: newSectionData as PageValues
      };
    });
  }, [setFormData]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(e.target.files || []);
    setFiles(uploadedFiles);
    
    let combinedContent = '';
    for (const file of uploadedFiles) {
      const content = await file.text();
      combinedContent += `\n--- File: ${file.name} ---\n${content}\n`;
    }
    setFileContent(combinedContent);
    toast.success(`${uploadedFiles.length} files uploaded successfully`);
  };

  const startAnalysis = async () => {
    if (!formData.client.url) {
      toast.error(t('enterFacebookUrl'));
      return;
    }

    setLoading(true);
    setLoadingStep('Collecting data...');
    
    try {
      setLoadingStep('Initializing Gemini AI...');
      
      const prompt = `أنت خبير محرك الذكاء لمشروع Ai Social Project. مهمتك هي تحليل البيانات المقدمة وتحويلها إلى تقرير استراتيجي متكامل.
      
      يجب أن يتضمن التحليل 6 محاور رئيسية:
      1. Market Overview: نظرة عامة على السوق والوضع الحالي.
      2. Audience Intelligence: تحليل الجمهور، المشاعر، وتوقعات السلوك.
      3. Competitive Intelligence: مقارنة تفصيلية مع المنافسين ونقاط القوة والضعف.
      4. Performance Intelligence: تحليل مقاييس التفاعل والأداء الرقمي.
      5. Content Intelligence: تقييم جودة المحتوى، أنواع المنشورات، وأوقات النشر.
      6. Actionable Insights: توصيات عملية وخطوات قادمة محددة.

      البيانات المدخلة:
      ${JSON.stringify(formData, null, 2)}
      
      بيانات الملفات الإضافية:
      ${fileContent || 'لا توجد ملفات إضافية مرفوعة.'}

      يجب أن تكون الاستجابة بصيغة JSON متوافقة تماماً مع هذا الهيكل:
      {
        "market": { "overview": "...", "trends": [...], "score": 85 },
        "audience": { "sentiment": "...", "demographics": "...", "behavior": "..." },
        "competitive": { "analysis": "...", "competitor_scores": { "comp1": 70, "comp2": 65, "comp3": 80 } },
        "performance": { "metrics": "...", "growth_potential": "..." },
        "content": { "strategy": "...", "top_performing_types": ["...", "..."] },
        "actionable": { "immediate_steps": ["...", "..."], "long_term_strategy": "..." }
      }`;

      if (!prompt.trim()) {
        throw new Error('The analysis prompt is empty.');
      }

      setLoadingStep('Deep analysis in progress...');
      const text = await callAI(formData, fileContent);
      
      if (typeof text !== 'string') {
        throw new Error('AI response is not a string.');
      }

      setLoadingStep('Extracting and parsing results...');
      
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const cleanJson = jsonMatch ? jsonMatch[0] : text;
        const parsedResult = JSON.parse(cleanJson);
        
        if (!parsedResult || typeof parsedResult !== 'object') {
          throw new Error('Invalid JSON structure from AI');
        }

        setLoadingStep('Finalizing report...');
        setAnalysisResult(parsedResult);
        localStorage.setItem('analysis_result', JSON.stringify(parsedResult));
        toast.success('Analysis completed successfully!');
      } catch (parseErr: any) {
        console.error("JSON Parse Error:", parseErr, text);
        throw new Error('AI returned an invalid format. Please try again.');
      }
    } catch (err: any) {
      console.error("Analysis Error:", err);
      toast.error('Analysis failed: ' + (err.message || 'Unknown error occurred'));
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  const exportPDF = async () => {
    const element = document.getElementById('analysis-report');
    if (!element) return;
    
    toast.info('Generating PDF...');
    const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#000000' });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('SocialPulse-Report.pdf');
    toast.success('Report exported successfully');
  };

  const COLORS = ['#8B5CF6', '#F59E0B', '#10B981', '#3B82F6', '#EF4444'];

  return (
    <div className="min-h-screen bg-[#030014] text-foreground p-4 md:p-8 relative overflow-x-hidden font-['Inter']">
      {/* 85% Scaling Container */}
      <div className="scale-[0.85] origin-top max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <header className="text-center space-y-6 pt-10">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-7xl font-bold tracking-tighter"
          >
            <span style={{ color: '#6B4FBB' }}>Ai</span> <span className="text-white">Social Project</span>
          </motion.h1>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
            Transforming data into strategic intelligence.
          </p>
        </header>

        {!analysisResult ? (
          <div className="space-y-12">
            {/* Input Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <PageInputCard title={t('you')} color="blue" section="client" values={formData.client} onChange={handleUpdate} />
              <PageInputCard title={`${t('competitor')} 1`} color="purple" section="comp1" values={formData.comp1} onChange={handleUpdate} />
              <PageInputCard title={`${t('competitor')} 2`} color="amber" section="comp2" values={formData.comp2} onChange={handleUpdate} />
              <PageInputCard title={`${t('competitor')} 3`} color="green" section="comp3" values={formData.comp3} onChange={handleUpdate} />
            </div>

            {/* Advanced Data & Action Section */}
            <div className="max-w-3xl mx-auto space-y-8">
              <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Upload className="text-primary" /> Advanced Data
                  </h3>
                  <span className="text-xs text-muted-foreground">CSV, Excel, Text</span>
                </div>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:border-primary/50 transition-all bg-white/5">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                  </div>
                  <input type="file" className="hidden" multiple onChange={handleFileUpload} accept=".csv,.txt,.xlsx" />
                </label>
                {files.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {files.map((file, i) => (
                      <span key={i} className="px-3 py-1 bg-primary/20 text-primary text-xs rounded-full flex items-center gap-2">
                        <FileText size={12} /> {file.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-center gap-6">
                <button 
                  onClick={() => { localStorage.removeItem('social_pulse_history_v3'); window.location.reload(); }} 
                  className="group flex items-center gap-2 px-8 py-4 rounded-2xl font-bold bg-white/5 hover:bg-red-500/10 hover:text-red-400 transition-all border border-white/10"
                >
                  <Trash2 size={20} /> Clear
                </button>
                <button 
                  disabled={loading} 
                  onClick={startAnalysis} 
                  className="relative group overflow-hidden px-12 py-4 rounded-2xl font-bold shadow-2xl transition-all disabled:opacity-50"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent group-hover:scale-110 transition-transform duration-500"></div>
                  <div className="relative flex items-center gap-3 text-white">
                    {loading ? (
                      <Activity className="animate-spin" />
                    ) : (
                      <Brain className="group-hover:animate-pulse" />
                    )}
                    {loading ? 'Analyzing...' : 'Analyze Market'}
                  </div>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div id="analysis-report" className="space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            {/* Results Header */}
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-4xl font-bold mb-2">
                  <span style={{ color: '#6B4FBB' }}>Ai</span> <span className="text-white">Social Project</span> Report
                </h2>
                <p className="text-muted-foreground">
                  Comprehensive analysis generated by <span style={{ color: '#6B4FBB' }}>Ai</span> <span className="text-white">Social Project</span> Engine
                </p>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setAnalysisResult(null)}
                  className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-semibold"
                >
                  New Analysis
                </button>
                <button 
                  onClick={exportPDF}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white hover:bg-primary/90 transition-all font-semibold shadow-lg shadow-primary/20"
                >
                  <Download size={18} /> Export Report
                </button>
              </div>
            </div>

            <Tabs data={analysisResult} />
          </div>
        )}

        {/* Loading Overlay */}
        <AnimatePresence>
          {loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-[#030014]/80 backdrop-blur-2xl"
            >
              <div className="text-center space-y-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full border-4 border-primary/20 animate-pulse"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Brain className="w-12 h-12 text-primary animate-bounce" />
                  </div>
                  <div className="absolute inset-0 w-32 h-32 rounded-full border-t-4 border-primary animate-spin"></div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {loadingStep}
                  </h3>
                  <p className="text-muted-foreground animate-pulse">Analyzing market dynamics...</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DashboardPage;