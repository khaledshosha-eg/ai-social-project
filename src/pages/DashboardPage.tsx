import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  FileText, Upload, Brain, Lightbulb, Download, Trash2,
  TrendingUp, Users, Target, Rocket, Activity, CheckCircle2
} from 'lucide-react';
const callAI = async (prompt: string): Promise<string> => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  const response = await fetch(
    supabaseUrl + "/functions/v1/ai-proxy",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + supabaseKey,
      },
      body: JSON.stringify({ prompt }),
    }
  );
  const data = await response.json();
  console.log("API Response:", data);
  if (data.content && data.content[0]) {
    return data.content[0].text;
  } else {
    throw new Error(JSON.stringify(data));
  }
};
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
  const colorMap: Record<string, string> = { 
    blue: 'text-primary', 
    purple: 'text-primary', 
    amber: 'text-accent', 
    emerald: 'text-emerald-400', 
    green: 'text-emerald-400' 
  };
  const bgMap: Record<string, string> = { 
    blue: 'bg-primary', 
    purple: 'bg-primary', 
    amber: 'bg-accent', 
    emerald: 'bg-emerald-500', 
    green: 'bg-emerald-500' 
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="p-6 rounded-2xl bg-card/40 backdrop-blur-xl border border-white/10 space-y-4 shadow-2xl text-left" 
      style={{ direction: "ltr" }}
    >
      <h3 className={`text-lg font-bold ${colorMap[color] || 'text-foreground'} flex items-center gap-2 justify-start`}>
        <span className={`w-2 h-6 ${bgMap[color] || 'bg-foreground'} rounded-full`}></span>{title}
      </h3>
      <input 
        type="text" 
        placeholder={t('enterFacebookUrl')} 
        value={values?.url || ''} 
        className="w-full bg-secondary/30 backdrop-blur-md border border-white/5 rounded-xl p-3 text-sm text-foreground outline-none focus:border-primary placeholder:text-muted-foreground font-normal transition-all" 
        onChange={(e) => onChange(section, 'url', e.target.value)} 
      />
      <div className="grid grid-cols-2 gap-3">
        <input 
          type="text" 
          placeholder={t('followers')} 
          value={values?.followers || ''} 
          className="bg-secondary/30 backdrop-blur-md border border-white/5 rounded-lg p-2 text-xs text-foreground outline-none focus:border-primary placeholder:text-muted-foreground font-normal" 
          onChange={(e) => onChange(section, 'followers', e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="Total Posts" 
          value={values?.total_posts || ''} 
          className="bg-secondary/30 backdrop-blur-md border border-white/5 rounded-lg p-2 text-xs text-foreground outline-none focus:border-primary placeholder:text-muted-foreground font-normal" 
          onChange={(e) => onChange(section, 'total_posts', e.target.value)} 
        />
        <select 
          value={values?.content_type || ''} 
          className="bg-secondary/30 backdrop-blur-md border border-white/5 rounded-lg p-2 text-xs text-foreground outline-none focus:border-primary" 
          onChange={(e) => onChange(section, 'content_type', e.target.value)}
        >
          <option value="" className="text-muted-foreground">Content Type</option>
          <option value="Image">Image</option>
          <option value="Video">Video</option>
          <option value="Carousel">Carousel</option>
          <option value="Mixed">Mixed</option>
        </select>
        <select 
          value={values?.frequency || ''} 
          className="bg-secondary/30 backdrop-blur-md border border-white/5 rounded-lg p-2 text-xs text-foreground outline-none focus:border-primary" 
          onChange={(e) => onChange(section, 'frequency', e.target.value)}
        >
          <option value="" className="text-muted-foreground">{t('postFrequency')}</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>
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
    client: { url: 'https://www.facebook.com/SafetySourceCo', followers: '23K', total_posts: '5', content_type: 'Image', frequency: 'Medium', ads: 'No' },
    comp1: { url: 'https://www.facebook.com/flairsystems', followers: '9.3K', total_posts: '2', content_type: 'Mixed', frequency: 'Low', ads: 'No' },
    comp2: { url: 'https://www.facebook.com/Fastegy1', followers: '8.9', total_posts: '3', content_type: 'Mixed', frequency: 'Medium', ads: 'No' },
    comp3: { url: 'https://www.facebook.com/secu.group', followers: '4.6K', total_posts: '3', content_type: 'Mixed', frequency: 'Medium', ads: 'No' }
  };

  const [formData, setFormData] = useState<FormData>(() => {
    try {
      const saved = localStorage.getItem('social_pulse_history_v3');
      return saved ? JSON.parse(saved) : defaultData;
    } catch {
      return defaultData;
    }
  });

  // Auto-save effect
  useEffect(() => {
    localStorage.setItem('social_pulse_history_v3', JSON.stringify(formData));
  }, [formData]);

  const handleUpdate = useCallback((section: keyof FormData, field: keyof PageValues, value: string) => {
    setFormData((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  }, []);

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
      
      const prompt = `أنت خبير محرك الذكاء لمشروع Ai Social Project. حلل هذه البيانات لاستخراج الـ 17 ميزة التنافسية، وقم بتبويب النتائج في 5 محاور:
      
      Performance: تحليل أرقام التفاعل.
      Content: تقييم جودة الصور والفيديوهات والـ Copy.
      Audience: تحليل المشاعر (Sentiment) ونية الشراء.
      Competitors: نقاط القوة والضعف.
      Opportunities & Gaps: ما ينقص السوق الآن.

      البيانات المدخلة:
      ${JSON.stringify(formData, null, 2)}
      
      بيانات الملفات الإضافية:
      ${fileContent || 'لا توجد ملفات إضافية مرفوعة.'}

      يجب أن تكون الاستجابة بصيغة JSON فقط بهذا الهيكل:
      {
        "performance": { "data": [{"name": "Client", "value": 85}, {"name": "Comp1", "value": 70}], "insights": ["...", "..."] },
        "content": { "data": [{"name": "Images", "count": 45}, {"name": "Videos", "count": 25}], "insights": ["...", "..."] },
        "audience": { "data": [{"name": "Positive", "value": 60}, {"name": "Neutral", "value": 30}, {"name": "Negative", "value": 10}], "insights": ["...", "..."] },
        "competitors": { "data": [{"name": "Strength", "score": 90}, {"name": "Weakness", "score": 30}], "insights": ["...", "..."] },
        "opportunities": { "data": [{"name": "Trend X", "growth": 40}], "insights": ["...", "..."] },
        "summary": ["توصية 1", "توصية 2", "توصية 3"]
      }`;

      if (!prompt.trim()) {
        throw new Error('The analysis prompt is empty.');
      }

      setLoadingStep('Deep analysis in progress...');
      const text = await callAI(prompt);
      
      setLoadingStep('Extracting results...');
      // Find JSON block if it exists
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const cleanJson = jsonMatch ? jsonMatch[0] : text;
      const parsedResult = JSON.parse(cleanJson);
      
      setAnalysisResult(parsedResult);
      localStorage.setItem('analysis_result', JSON.stringify(parsedResult));
      toast.success('Analysis completed successfully!');
    } catch (err: any) {
      console.error("Error:", err);
      toast.error('Analysis failed: ' + err.message);
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
    <div className="min-h-screen bg-[#030014] text-foreground p-6 selection:bg-primary/30">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <header className="text-center space-y-6 pt-10">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-7xl font-bold tracking-tighter"
          >
            Social Project <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">AI</span>
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
                <h2 className="text-4xl font-bold mb-2">Market Intelligence Report</h2>
                <p className="text-muted-foreground">Comprehensive analysis generated by Gemini 1.5 Flash</p>
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

            {/* 5 Glass Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnalysisCard title="Performance" icon={Activity} color="blue">
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analysisResult.performance.data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                      <XAxis dataKey="name" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
                      <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <ul className="mt-6 space-y-3">
                  {analysisResult.performance.insights.map((insight, i) => (
                    <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                      <CheckCircle2 className="text-primary shrink-0" size={18} /> {insight}
                    </li>
                  ))}
                </ul>
              </AnalysisCard>

              <AnalysisCard title="Content Strategy" icon={Rocket} color="purple">
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analysisResult.content.data} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                      <XAxis type="number" stroke="#888" />
                      <YAxis dataKey="name" type="category" stroke="#888" />
                      <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
                      <Bar dataKey="count" fill="#F59E0B" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <ul className="mt-6 space-y-3">
                  {analysisResult.content.insights.map((insight, i) => (
                    <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                      <CheckCircle2 className="text-accent shrink-0" size={18} /> {insight}
                    </li>
                  ))}
                </ul>
              </AnalysisCard>

              <AnalysisCard title="Audience Sentiment" icon={Users} color="emerald">
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analysisResult.audience.data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {analysisResult.audience.data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <ul className="mt-6 space-y-3">
                  {analysisResult.audience.insights.map((insight, i) => (
                    <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                      <CheckCircle2 className="text-emerald-500 shrink-0" size={18} /> {insight}
                    </li>
                  ))}
                </ul>
              </AnalysisCard>

              <AnalysisCard title="Competitors" icon={Target} color="red">
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analysisResult.competitors.data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                      <XAxis dataKey="name" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip />
                      <Bar dataKey="score" fill="#EF4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <ul className="mt-6 space-y-3">
                  {analysisResult.competitors.insights.map((insight, i) => (
                    <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                      <CheckCircle2 className="text-red-500 shrink-0" size={18} /> {insight}
                    </li>
                  ))}
                </ul>
              </AnalysisCard>

              <AnalysisCard title="Opportunities" icon={TrendingUp} color="amber">
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analysisResult.opportunities.data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                      <XAxis dataKey="name" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip />
                      <Line type="monotone" dataKey="growth" stroke="#F59E0B" strokeWidth={3} dot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <ul className="mt-6 space-y-3">
                  {analysisResult.opportunities.insights.map((insight, i) => (
                    <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                      <CheckCircle2 className="text-amber-500 shrink-0" size={18} /> {insight}
                    </li>
                  ))}
                </ul>
              </AnalysisCard>

              <div className="lg:col-span-1">
                <AnalysisCard title="Insights Summary" icon={Lightbulb} color="primary">
                  <div className="space-y-4">
                    {analysisResult.summary.map((advice, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                            {i + 1}
                          </span>
                          <span className="font-semibold text-sm">Actionable Priority</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{advice}</p>
                      </div>
                    ))}
                  </div>
                </AnalysisCard>
              </div>
            </div>
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