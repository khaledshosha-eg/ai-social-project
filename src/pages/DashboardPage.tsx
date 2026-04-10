import React, { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Brain, Download, Trash2, Activity, RefreshCw, CheckCircle2, Loader2
} from 'lucide-react';
import { callAI } from '@/lib/aiService';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import Tabs from '@/components/tabs/Tabs';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { toast } from 'sonner';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// PageInputCard
// ─────────────────────────────────────────────
const PageInputCard = React.memo(
  ({
    title,
    color,
    section,
    values,
    onChange,
  }: {
    title: string;
    color: string;
    section: keyof FormData;
    values: PageValues;
    onChange: (section: keyof FormData, field: keyof PageValues, value: string) => void;
  }) => {
    const [fetchStatus, setFetchStatus] = useState<'idle' | 'fetching' | 'done'>('idle');

    const handleChange = (field: keyof PageValues, value: string) => {
      onChange(section, field, value);
    };

    const handleFetchData = async () => {
      if (!values?.url) {
        toast.error('Please enter a Facebook URL first');
        return;
      }
      setFetchStatus('fetching');
      toast.info('Starting fetch... this may take 1-2 minutes');
      const TOKEN = import.meta.env.VITE_APIFY_API_TOKEN;
      try {
        const runRes = await fetch(
          `https://api.apify.com/v2/acts/apify~facebook-posts-scraper/runs?token=${TOKEN}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ startUrls: [{ url: values.url }], resultsLimit: 10 }),
          }
        );
        if (!runRes.ok) throw new Error('Failed to start Apify run');
        const runData = await runRes.json();
        const runId: string | undefined = runData?.data?.id;
        if (!runId) throw new Error('No run ID returned from Apify');
        toast.info('Scraper started, waiting for results...');
        let attempts = 0;
        const maxAttempts = 24;
        while (attempts < maxAttempts) {
          await new Promise<void>((resolve) => setTimeout(resolve, 5000));
          attempts++;
          const statusRes = await fetch(
            `https://api.apify.com/v2/acts/apify~facebook-posts-scraper/runs/${runId}?token=${TOKEN}`
          );
          const statusData = await statusRes.json();
          const status: string = statusData?.data?.status;
          if (status === 'SUCCEEDED') {
            const dataRes = await fetch(
              `https://api.apify.com/v2/datasets/${statusData.data.defaultDatasetId}/items?token=${TOKEN}&limit=10`
            );
            const posts: any[] = await dataRes.json();
            if (!posts || posts.length === 0) {
              toast.error('No posts found for this page');
              setFetchStatus('idle');
              return;
            }
            const totalPosts = posts.length;
            const avgLikes    = Math.round(posts.reduce((s: number, p: any) => s + (p.likes    || 0), 0) / totalPosts);
            const avgComments = Math.round(posts.reduce((s: number, p: any) => s + (p.comments || 0), 0) / totalPosts);
            const avgShares   = Math.round(posts.reduce((s: number, p: any) => s + (p.shares   || 0), 0) / totalPosts);
            const followers: string = posts[0]?.pageFollowers || posts[0]?.pageLikes || '';
            const sampleComments: string = posts.slice(0, 3).map((p: any) => p.topComments?.[0]?.text || '').filter(Boolean).join('\n');
            onChange(section, 'total_posts',     String(totalPosts));
            onChange(section, 'avg_likes',       String(avgLikes));
            onChange(section, 'avg_comments',    String(avgComments));
            onChange(section, 'avg_shares',      String(avgShares));
            onChange(section, 'posts_count',     String(totalPosts));
            if (followers)      onChange(section, 'followers',       followers);
            if (sampleComments) onChange(section, 'sample_comments', sampleComments);
            setFetchStatus('done');
            toast.success('Data fetched successfully!');
            return;
          } else if (status === 'FAILED' || status === 'ABORTED' || status === 'TIMED-OUT') {
            throw new Error(`Apify run ${status}`);
          }
          toast.info(`Still fetching... (${attempts * 5}s elapsed)`);
        }
        throw new Error('Timeout: scraper took too long');
      } catch (error: any) {
        console.error('Fetch error:', error);
        toast.error('Failed to fetch: ' + (error.message || 'Unknown error'));
        setFetchStatus('idle');
      }
    };

    const buttonConfig = {
      idle:     { label: 'FETCH DATA FROM FACEBOOK', icon: <RefreshCw size={14} />,                              className: 'border border-primary/40 text-primary hover:bg-primary/10' },
      fetching: { label: 'FETCHING...',              icon: <RefreshCw size={14} className="animate-spin" />,     className: 'border border-yellow-400/40 text-yellow-400 cursor-not-allowed opacity-80' },
      done:     { label: 'FETCHED ✓',               icon: <CheckCircle2 size={14} />,                           className: 'border border-emerald-400/60 text-emerald-400 bg-emerald-400/10' },
    }[fetchStatus];

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card/30 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-4 hover:border-primary/30 transition-all duration-500"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-3 h-3 rounded-full bg-${color}-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]`} />
          <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
          {fetchStatus === 'done' && (
            <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-400 border border-emerald-400/30">
              DATA READY
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input type="text" placeholder="ENTER FACEBOOK URL" value={values?.url || ''}
            className="col-span-2 bg-white rounded-xl p-3 text-sm text-black outline-none font-semibold font-['Montserrat'] placeholder:text-gray-400"
            onChange={(e) => handleChange('url', e.target.value)} />
          <button onClick={handleFetchData} disabled={fetchStatus === 'fetching'}
            className={`col-span-2 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-transparent text-xs font-bold transition-all font-['Montserrat'] ${buttonConfig.className}`}>
            {buttonConfig.icon}{buttonConfig.label}
          </button>
          <input type="text" placeholder="FOLLOWERS" value={values?.followers || ''}
            className="col-span-2 bg-white rounded-lg p-2 text-xs text-black outline-none font-medium font-['Montserrat'] placeholder:text-gray-400"
            onChange={(e) => handleChange('followers', e.target.value)} />
          <select name={`${section}-content_type`} value={values?.content_type || ''}
            className="col-span-2 bg-secondary/30 backdrop-blur-md border border-white/5 rounded-lg p-2 text-xs text-foreground outline-none focus:border-primary"
            onChange={(e) => handleChange('content_type', e.target.value)}>
            <option value="">Content Type</option>
            <option value="Image">Image</option>
            <option value="Video">Video</option>
            <option value="Carousel">Carousel</option>
            <option value="Mixed">Mixed</option>
          </select>
          <input type="text" name={`${section}-avg_comments`} placeholder="Avg Comments per Post" value={values?.avg_comments || ''}
            className="col-span-2 bg-secondary/30 backdrop-blur-md border border-white/5 rounded-lg p-2 text-xs text-foreground outline-none focus:border-primary placeholder:text-muted-foreground font-normal"
            onChange={(e) => handleChange('avg_comments', e.target.value)} />
        </div>
        <textarea name={`${section}-sample_comments`} placeholder="3-5 real comments from this page..."
          value={values?.sample_comments || ''}
          className="w-full bg-secondary/30 backdrop-blur-md border border-white/5 rounded-xl p-3 text-sm text-foreground outline-none focus:border-primary placeholder:text-muted-foreground font-normal h-24 resize-none transition-all"
          onChange={(e) => handleChange('sample_comments', e.target.value)} />
      </motion.div>
    );
  }
);

// ─────────────────────────────────────────────
// DashboardPage
// ─────────────────────────────────────────────
const DashboardPage = () => {
  const { t } = useLanguage();
  const [loading, setLoading]           = useState(false);
  const [loadingStep, setLoadingStep]   = useState('');
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [isExporting, setIsExporting]   = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  // ref to the Tabs setActiveTab function exposed on window
  const setTabRef = useRef<((tab: string) => void) | null>(null);

  const defaultData: FormData = {
    client: { url: 'https://www.facebook.com/SafetySourceCo', followers: '23000', total_posts: '5', content_type: 'Image', frequency: 'Medium', ads: 'No', avg_likes: '', avg_comments: '', avg_shares: '', top_post_type: '', posting_time: '', sample_comments: '', posts_count: '' },
    comp1:  { url: 'https://www.facebook.com/flairsystems',   followers: '9300',  total_posts: '2', content_type: 'Mixed', frequency: 'Low',    ads: 'No', avg_likes: '', avg_comments: '', avg_shares: '', top_post_type: '', posting_time: '', sample_comments: '', posts_count: '' },
    comp2:  { url: 'https://www.facebook.com/Fastegy1',       followers: '8900',  total_posts: '3', content_type: 'Mixed', frequency: 'Medium', ads: 'No', avg_likes: '', avg_comments: '', avg_shares: '', top_post_type: '', posting_time: '', sample_comments: '', posts_count: '' },
    comp3:  { url: 'https://www.facebook.com/secu.group',     followers: '4600',  total_posts: '3', content_type: 'Mixed', frequency: 'Medium', ads: 'No', avg_likes: '', avg_comments: '', avg_shares: '', top_post_type: '', posting_time: '', sample_comments: '', posts_count: '' },
  };

  const [formData, setFormData] = useLocalStorage<FormData>('TheTerminator_Ai_form', defaultData);

  const handleUpdate = useCallback(
    (section: keyof FormData, field: keyof PageValues, value: string) => {
      setFormData((prev) => ({
        ...prev,
        [section]: { ...(prev?.[section] || {}), [field]: value } as PageValues,
      }));
    },
    [setFormData]
  );

  // ─── Analysis ───────────────────────────────
  const startAnalysis = async () => {
    if (!formData.client.url) {
      toast.error(t('enterFacebookUrl'));
      return;
    }
    setLoading(true);
    setLoadingStep('Collecting data...');
    try {
      setLoadingStep('Deep analysis in progress...');
      const text = await callAI(formData, '');
      if (typeof text !== 'string') throw new Error('AI response is not a string.');
      setLoadingStep('Extracting and parsing results...');
      try {
        const jsonMatch  = text.match(/\{[\s\S]*\}/);
        const cleanJson  = jsonMatch ? jsonMatch[0] : text;
        const parsed     = JSON.parse(cleanJson);
        if (!parsed || typeof parsed !== 'object') throw new Error('Invalid JSON');

        // ── compute summary_stats from ranking ──
        const ranking: any[] = parsed.market_overview?.ranking || [];
        const clientRank     = ranking[0];
        const allScores      = ranking.map((r: any) => Number(r.score) || 0);
        const avgScore       = allScores.length ? Math.round(allScores.reduce((a: number, b: number) => a + b, 0) / allScores.length) : 0;
        const maxScore       = Math.max(...allScores, 0);

        const fixed = {
          ...parsed,
          market_overview: {
            ...(parsed.market_overview || {}),
            summary_stats: {
              rank_score:     Number(clientRank?.score) || 0,
              pages_analyzed: ranking.length || 4,
              avg_score:      avgScore,
              score_gap:      maxScore - (Number(clientRank?.score) || 0),
            },
          },
          audience:    parsed.audience    || {},
          competitive: parsed.competitive || {},
          performance: parsed.performance || {},
          content:     parsed.content     || {},
          actionable:  parsed.actionable  || {},
          summary:     parsed.summary     || [],
        };

        setLoadingStep('Finalizing report...');
        setAnalysisResult(fixed);
        localStorage.setItem('analysis_result', JSON.stringify(fixed));
        toast.success('Analysis completed successfully!');
      } catch (parseErr: any) {
        console.error('JSON Parse Error:', parseErr, text);
        throw new Error('AI returned an invalid format. Please try again.');
      }
    } catch (err: any) {
      console.error('Analysis Error:', err);
      toast.error('Analysis failed: ' + (err.message || 'Unknown error occurred'));
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  // ─── Export PDF — all tabs ───────────────────
  const ALL_TABS = ['market', 'audience', 'competitive', 'performance', 'content', 'actionable'];
  const TAB_LABELS: Record<string, string> = {
    market:      'Market Overview',
    audience:    'Audience Intelligence',
    competitive: 'Competitive Intelligence',
    performance: 'Performance Intelligence',
    content:     'Content Intelligence',
    actionable:  'Actionable Insights',
  };

  const exportPDF = async () => {
    if (isExporting) return;

    // get setActiveTab from window (set by Tabs component)
    const setTab = (window as any).setActiveTab as ((id: string) => void) | undefined;
    if (!setTab) {
      toast.error('Cannot find tab controller. Please try again.');
      return;
    }

    setIsExporting(true);
    setExportProgress(0);
    toast.info('Starting export — capturing all 6 tabs...');

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', compress: true });
    let firstPage = true;

    try {
      for (let i = 0; i < ALL_TABS.length; i++) {
        const tabId = ALL_TABS[i];

        // 1. switch tab
        setTab(tabId);

        // 2. wait for React to re-render + animations to settle
        await new Promise<void>((r) => setTimeout(r, 1100));

        // 3. find the panel — prefer the tab-panel wrapper, fallback to whole report
        const panel =
          document.querySelector<HTMLElement>(`[data-tab-panel="${tabId}"]`) ||
          document.getElementById('analysis-report');

        if (!panel) {
          toast.warning(`Could not capture tab: ${TAB_LABELS[tabId]}`);
          continue;
        }

        // 4. scroll panel into view
        panel.scrollIntoView({ behavior: 'instant' });
        await new Promise<void>((r) => setTimeout(r, 200));

        // 5. capture
        const canvas = await html2canvas(panel, {
          scale: 1.6,
          backgroundColor: '#030014',
          useCORS: true,
          allowTaint: true,
          windowWidth: 1440,
          windowHeight: panel.scrollHeight + 80,
          scrollY: 0,
          ignoreElements: (el) =>
            el.classList?.contains('print:hidden') ||
            el.id === 'loading-overlay',
        });

        // 6. add page
        const pw = canvas.width  / 1.6;
        const ph = canvas.height / 1.6;
        if (firstPage) { pdf.deletePage(1); firstPage = false; }
        pdf.addPage([pw, ph], pw > ph ? 'landscape' : 'portrait');
        pdf.addImage(canvas.toDataURL('image/jpeg', 0.9), 'JPEG', 0, 0, pw, ph);

        const progress = Math.round(((i + 1) / ALL_TABS.length) * 100);
        setExportProgress(progress);
        toast.info(`Captured: ${TAB_LABELS[tabId]} (${progress}%)`);
      }

      const fileName = `TheTerminatorAI-${new Date().toISOString().slice(0, 10)}.pdf`;
      pdf.save(fileName);
      toast.success(`✅ PDF saved: ${fileName}`);

    } catch (err: any) {
      console.error('Export error:', err);
      toast.error('Export failed: ' + (err.message || 'Unknown'));
    } finally {
      setIsExporting(false);
      setExportProgress(0);
      // return to first tab
      setTab('market');
    }
  };

  // ─── Render ──────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white overflow-x-hidden font-['Montserrat'] relative">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-800/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="scale-[0.85] origin-top max-w-7xl mx-auto space-y-12">

        {/* Header */}
        <header className="text-center space-y-6 pt-10">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-7xl font-bold tracking-tighter">
                        <span className="text-white">The Terminator</span>
                        <span style={{ color: '#6B4FBB' }}> Ai</span>{' '}
          </motion.h1>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
          Terminate Competition .. Begin Domination.
          </p>
        </header>

        {!analysisResult ? (
          <div className="space-y-12">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <PageInputCard title={t('you')}               color="blue"   section="client" values={formData.client} onChange={handleUpdate} />
              <PageInputCard title={`${t('competitor')} 1`} color="purple" section="comp1"  values={formData.comp1}  onChange={handleUpdate} />
              <PageInputCard title={`${t('competitor')} 2`} color="amber"  section="comp2"  values={formData.comp2}  onChange={handleUpdate} />
              <PageInputCard title={`${t('competitor')} 3`} color="green"  section="comp3"  values={formData.comp3}  onChange={handleUpdate} />
            </div>
            <div className="flex justify-center gap-6">
              <button onClick={() => { localStorage.removeItem('TheTerminator_AI_history_v3'); window.location.reload(); }}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold bg-white/5 hover:bg-red-500/10 hover:text-red-400 transition-all border border-white/10">
                <Trash2 size={20} /> Clear
              </button>
              <button disabled={loading} onClick={startAnalysis}
                className="relative group overflow-hidden px-12 py-4 rounded-2xl font-bold shadow-2xl transition-all disabled:opacity-50">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent group-hover:scale-110 transition-transform duration-500" />
                <div className="relative flex items-center gap-3 text-white">
                  {loading ? <Activity className="animate-spin" /> : <Brain className="group-hover:animate-pulse" />}
                  {loading ? 'Analyzing...' : 'Analyze Market'}
                </div>
              </button>
            </div>
          </div>
        ) : (
          <div id="analysis-report" className="space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-1000">

            {/* ── Report Header with Export button ── */}
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-4xl font-bold mb-2">
                  <span style={{ color: '#6B4FBB' }}>Ai</span>{' '}
                  <span className="text-white">The Terminator</span> Report
                </h2>
                <p className="text-muted-foreground">
                  Comprehensive analysis generated by{' '}
                  <span style={{ color: '#6B4FBB' }}>Ai</span>{' '}
                  <span className="text-white">The Terminator</span> Engine
                </p>
              </div>
              <div className="flex gap-4 print:hidden">
                <button onClick={() => setAnalysisResult(null)}
                  className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-semibold">
                  New Analysis
                </button>

                {/* ── Export Report button ── */}
                <button
                  onClick={exportPDF}
                  disabled={isExporting}
                  className="relative overflow-hidden flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white hover:bg-primary/90 transition-all font-semibold shadow-lg shadow-primary/20 disabled:opacity-70 min-w-[160px] justify-center"
                >
                  {/* progress bar inside button */}
                  {isExporting && (
                    <span
                      className="absolute inset-0 bg-white/10 transition-all duration-300"
                      style={{ width: `${exportProgress}%` }}
                    />
                  )}
                  <span className="relative flex items-center gap-2">
                    {isExporting
                      ? <><Loader2 size={16} className="animate-spin" /> {exportProgress}% Exporting…</>
                      : <><Download size={16} /> Export Report</>}
                  </span>
                </button>
              </div>
            </div>

            <Tabs data={analysisResult} />
          </div>
        )}

        {/* Loading Overlay */}
        <AnimatePresence>
          {loading && (
            <motion.div id="loading-overlay"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-[#030014]/80 backdrop-blur-2xl">
              <div className="text-center space-y-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full border-4 border-primary/20 animate-pulse" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Brain className="w-12 h-12 text-primary animate-bounce" />
                  </div>
                  <div className="absolute inset-0 w-32 h-32 rounded-full border-t-4 border-primary animate-spin" />
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
