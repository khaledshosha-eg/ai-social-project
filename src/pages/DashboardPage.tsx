import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

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

const PageInputCard = ({ title, color, section, values, onChange }: { 
  title: string, color: string, section: keyof FormData, values: PageValues, onChange: (section: keyof FormData, field: keyof PageValues, value: string) => void 
}) => {
  const { t } = useLanguage();
  // Mapping to our theme colors: primary (purple) and accent (gold)
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
      className="p-6 rounded-2xl bg-card border border-border space-y-4 shadow-xl text-left" 
      style={{ direction: "ltr" }}
    >
      <h3 className={`text-lg font-bold ${colorMap[color] || 'text-foreground'} flex items-center gap-2 justify-start`}>
        <span className={`w-2 h-6 ${bgMap[color] || 'bg-foreground'} rounded-full`}></span>{title}
      </h3>
      <input 
        type="text" 
        placeholder={t('enterFacebookUrl')} 
        value={values?.url || ''} 
        className="w-full bg-secondary/50 border border-border rounded-xl p-3 text-sm text-foreground outline-none focus:border-primary placeholder:text-muted-foreground font-normal" 
        onChange={(e) => onChange(section, 'url', e.target.value)} 
      />
      <div className="grid grid-cols-2 gap-3">
        <input 
          type="text" 
          placeholder={t('followers')} 
          value={values?.followers || ''} 
          className="bg-secondary/50 border border-border rounded-lg p-2 text-xs text-foreground outline-none focus:border-primary placeholder:text-muted-foreground font-normal" 
          onChange={(e) => onChange(section, 'followers', e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="Total Posts" 
          value={values?.total_posts || ''} 
          className="bg-secondary/50 border border-border rounded-lg p-2 text-xs text-foreground outline-none focus:border-primary placeholder:text-muted-foreground font-normal" 
          onChange={(e) => onChange(section, 'total_posts', e.target.value)} 
        />
        <select 
          value={values?.content_type || ''} 
          className="bg-secondary/50 border border-border rounded-lg p-2 text-xs text-foreground outline-none focus:border-primary" 
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
          className="bg-secondary/50 border border-border rounded-lg p-2 text-xs text-foreground outline-none focus:border-primary" 
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
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);

  const defaultData: FormData = { 
    client: { url: '', followers: '', total_posts: '', content_type: '', frequency: '', ads: 'No' },
    comp1: { url: '', followers: '', total_posts: '', content_type: '', frequency: '', ads: 'No' },
    comp2: { url: '', followers: '', total_posts: '', content_type: '', frequency: '', ads: 'No' },
    comp3: { url: '', followers: '', total_posts: '', content_type: '', frequency: '', ads: 'No' }
  };

  const [formData, setFormData] = useState<FormData>(() => {
    try {
      const saved = localStorage.getItem('social_pulse_history_v3');
      return saved ? JSON.parse(saved) : defaultData;
    } catch {
      return defaultData;
    }
  });

  useEffect(() => {
  const saved = localStorage.getItem('social_pulse_history_v3');
  if (saved) {
    setFormData(JSON.parse(saved));
  }
}, []);

  const handleUpdate = (section: keyof FormData, field: keyof PageValues, value: string) => {
    setFormData((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  const startAnalysis = async () => {
    if (!formData.client.url) {
      alert(t('enterFacebookUrl'));
      return;
    }

    setLoading(true);

    try {
      const FUNCTION_URL = 'https://pkcrelvrhfvkdadlisnw.supabase.co/functions/v1/analyze-marketing';
      const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

      console.log('Calling analyze-marketing at:', FUNCTION_URL);
      
      const response = await fetch(FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ANON_KEY}`,
          'apikey': ANON_KEY,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Edge function error:', response.status, errorText);
        throw new Error(errorText || "Analysis failed.");
      }

      const data = await response.json();
      console.log("AI RESULT:", data);

      if (data) {
        localStorage.setItem('analysis_result', JSON.stringify(data));
        navigate('/results');
      }

    } catch (err: unknown) {
      const error = err as Error;
      console.error("Error:", error.message);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-6xl mx-auto space-y-10 text-center">
        <h1 className="text-5xl font-bold tracking-tighter">AI Social <span className="text-primary">Project</span></h1>
        <div className="grid md:grid-cols-2 gap-8 text-left">
          <PageInputCard title={t('you')} color="blue" section="client" values={formData.client} onChange={handleUpdate} />
          <PageInputCard title={`${t('competitor')} 1`} color="purple" section="comp1" values={formData.comp1} onChange={handleUpdate} />
          <PageInputCard title={`${t('competitor')} 2`} color="amber" section="comp2" values={formData.comp2} onChange={handleUpdate} />
          <PageInputCard title={`${t('competitor')} 3`} color="green" section="comp3" values={formData.comp3} onChange={handleUpdate} />
        </div>
        <div className="flex justify-center pt-10 pb-20 gap-4">
          <button 
            onClick={() => { localStorage.removeItem('social_pulse_history_v3'); window.location.reload(); }} 
            className="bg-secondary hover:bg-secondary/80 text-foreground px-8 py-4 rounded-2xl font-bold transition-all border border-border"
          >
            Clear
          </button>
          <button 
            disabled={loading} 
            onClick={startAnalysis} 
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-4 rounded-2xl font-bold shadow-lg disabled:bg-muted transition-all"
          >
            {loading ? t('analyzing') : t('analyze')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
