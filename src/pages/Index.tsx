import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap, Target, BarChart3, Users, Brain,
  Activity, Search, Shield, Swords, Trophy, Sparkles,
  ArrowRight, Mail, Phone, Globe, Linkedin, Twitter,
  Instagram, MapPin, Star, Award
} from 'lucide-react';

/* ─────────────────────────────────────────
   Floating Card Definitions
───────────────────────────────────────── */
const floatingCards = [
  {
    id: 'market-score',
    title: 'Market Score',
    icon: Trophy,
    color: '#6B4FBB',
    content: { value: '87%', label: 'Your position', trend: '+12%' },
  },
  {
    id: 'swot',
    title: 'SWOT Analysis',
    icon: Shield,
    color: '#3b82f6',
    content: {
      items: [
        { label: 'Strengths',     color: '#10b981', count: 6 },
        { label: 'Weaknesses',    color: '#ef4444', count: 5 },
        { label: 'Opportunities', color: '#3b82f6', count: 4 },
        { label: 'Threats',       color: '#f59e0b', count: 3 },
      ],
    },
  },
  {
    id: 'competitors',
    title: 'Competitor Analysis',
    icon: Swords,
    color: '#ef4444',
    content: {
      bars: [
        { label: 'You',    value: 87, color: '#6B4FBB' },
        { label: 'Comp 1', value: 63, color: '#3b82f6' },
        { label: 'Comp 2', value: 55, color: '#64748b' },
        { label: 'Comp 3', value: 70, color: '#14748b' },
      ],
    },
  },
  {
    id: 'engagement',
    title: 'Engagement Rate',
    icon: Activity,
    color: '#f59e0b',
    content: { value: '9.8%', label: 'vs 2.1% avg', trend: '+128%' },
  },
  {
    id: 'ai-insights',
    title: 'AI Insights',
    icon: Brain,
    color: '#6B4FBB',
    content: {
      metrics: [
        { label: 'Best Time',    value: 'Thu 7–9 PM', color: '#6B4FBB' },
        { label: 'Top Content',  value: 'Video',       color: '#3b82f6' },
        { label: 'Reach Score',  value: '94/100',      color: '#10b981' },
      ],
    },
  },
  {
    id: 'action-plan',
    title: 'Action Plan',
    icon: Sparkles,
    color: '#10b981',
    content: {
      steps: ['Post 3x per week', 'Focus on Video', 'Engage comments'],
    },
  },
] as const;

/* ─── Single Floating Card ─── */
const FloatingCard: React.FC<{ card: (typeof floatingCards)[number] }> = ({ card }) => {
  const Icon = card.icon;
  return (
    <div
      className="w-44 rounded-2xl border backdrop-blur-xl shadow-2xl p-3 cursor-default"
      style={{
        background: 'rgba(8, 14, 36, 0.88)',
        borderColor: `${card.color}40`,
        boxShadow: `0 0 20px ${card.color}22, 0 8px 24px rgba(0,0,0,0.6)`,
      }}
    >
      <div className="flex items-center gap-1.5 mb-2.5">
        <div className="p-1 rounded-md"
          style={{ background: `${card.color}22`, border: `1px solid ${card.color}44` }}>
          <Icon size={12} style={{ color: card.color }} />
        </div>
        <span className="text-[10px] font-bold text-white/80 tracking-wide truncate">{card.title}</span>
      </div>

      {card.id === 'market-score' && 'value' in card.content && (
        <div>
          <div className="text-2xl font-black text-white mb-1">{card.content.value}</div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] text-white/40">{card.content.label}</span>
            <span className="text-[9px] font-bold text-emerald-400">{card.content.trend}</span>
          </div>
          <div className="h-1 rounded-full bg-white/10">
            <div className="h-full rounded-full w-[87%]"
              style={{ background: `linear-gradient(90deg, ${card.color}, #3b82f6)` }} />
          </div>
        </div>
      )}

      {card.id === 'swot' && 'items' in card.content && (
        <div className="grid grid-cols-2 gap-1">
          {card.content.items.map((item) => (
            <div key={item.label} className="rounded-lg p-1 text-center"
              style={{ background: `${item.color}14`, border: `1px solid ${item.color}28` }}>
              <div className="text-sm font-black" style={{ color: item.color }}>{item.count}</div>
              <div className="text-[8px] text-white/50">{item.label}</div>
            </div>
          ))}
        </div>
      )}

      {card.id === 'competitors' && 'bars' in card.content && (
        <div className="space-y-1">
          {card.content.bars.map((bar) => (
            <div key={bar.label} className="flex items-center gap-1.5">
              <span className="text-[8px] text-white/50 w-10 shrink-0">{bar.label}</span>
              <div className="flex-1 h-1 rounded-full bg-white/10">
                <div className="h-full rounded-full" style={{ width: `${bar.value}%`, background: bar.color }} />
              </div>
              <span className="text-[8px] font-bold text-white/60">{bar.value}</span>
            </div>
          ))}
        </div>
      )}

      {card.id === 'action-plan' && 'steps' in card.content && (
        <div className="space-y-1">
          {card.content.steps.map((step, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7px] font-black shrink-0"
                style={{ background: card.color, color: '#fff' }}>{i + 1}</div>
              <span className="text-[9px] text-white/70">{step}</span>
            </div>
          ))}
        </div>
      )}

      {card.id === 'engagement' && 'value' in card.content && (
        <div>
          <div className="text-2xl font-black text-white mb-1">{card.content.value}</div>
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-white/40">{card.content.label}</span>
            <span className="text-[9px] font-bold text-emerald-400">{card.content.trend}</span>
          </div>
        </div>
      )}

      {card.id === 'ai-insights' && 'metrics' in card.content && (
        <div className="space-y-1.5">
          {card.content.metrics.map((m) => (
            <div key={m.label} className="flex items-center justify-between">
              <span className="text-[8px] text-white/40">{m.label}</span>
              <span className="text-[9px] font-bold" style={{ color: m.color }}>{m.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────
   Static Title
───────────────────────────────────────── */
const AnimatedTitle: React.FC = () => {
  return (
    <div className="select-none">
      <div className="font-['Montserrat'] text-4xl md:text-5xl font-black tracking-tighter leading-none mb-1">
        <span className="text-white">The Terminator </span>
        <span style={{
          background: 'linear-gradient(90deg, #f5f0e8, #e8d9b8, #f5f0e8)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>Ai</span>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   Facebook SVG Icon
───────────────────────────────────────── */
const FacebookIcon: React.FC<{ size?: number; color?: string }> = ({ size = 15, color = '#1877f2' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

/* ─────────────────────────────────────────
   Behance SVG Icon
───────────────────────────────────────── */
const BehanceIcon: React.FC<{ size?: number; color?: string }> = ({ size = 15, color = '#1769ff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M6.938 4.503c.702 0 1.34.06 1.92.188.577.13 1.07.33 1.485.61.41.28.733.65.96 1.12.225.47.34 1.05.34 1.73 0 .74-.17 1.36-.507 1.86-.338.5-.837.9-1.502 1.22.906.26 1.576.72 2.022 1.37.448.66.665 1.45.665 2.36 0 .75-.13 1.39-.41 1.93-.28.55-.67 1-1.16 1.35-.49.36-1.065.62-1.72.78-.66.17-1.355.25-2.09.25H0V4.51h6.938v-.007zM16.955 4h5.993v1.58h-5.993V4zm-10.27 5.38H3.93v3.5h2.52c.43 0 .82-.04 1.175-.12.35-.08.65-.21.9-.38.25-.18.44-.4.58-.67.14-.27.2-.6.2-.97 0-.78-.225-1.33-.67-1.65-.45-.32-1.05-.48-1.82-.48-.27 0-.54.02-.81.07l-.32.02v.1zm10.27 2.54h-5.99v1.78h5.99v-1.78zM6.4 14.13H3.93v3.96H6.4c.46 0 .89-.04 1.29-.14.4-.09.74-.24 1.03-.45.29-.21.51-.47.68-.8.17-.33.25-.73.25-1.2 0-.93-.27-1.62-.81-2.05-.54-.43-1.28-.64-2.22-.64l-.21.33zm10.83-.17c-.44.43-.73 1.04-.85 1.84h4.62c-.05-.81-.29-1.42-.73-1.84-.43-.43-1.01-.64-1.73-.64-.76 0-1.37.22-1.81.64h.5zm2.29-5.22c.53 0 1.02.09 1.47.27.45.18.84.43 1.17.77.33.34.59.74.77 1.22.18.47.28 1 .28 1.57v.98h-6.83c.08.86.36 1.53.83 2 .48.48 1.13.72 1.96.72.57 0 1.07-.1 1.49-.3.42-.2.77-.44 1.05-.73l1.57 1.6c-.5.5-1.08.88-1.73 1.12-.65.24-1.39.37-2.22.37-.84 0-1.59-.13-2.25-.4-.66-.27-1.22-.64-1.68-1.13-.46-.49-.81-1.07-1.05-1.74-.24-.67-.36-1.42-.36-2.23 0-.82.12-1.57.36-2.24.24-.67.58-1.25 1.03-1.73.45-.48 1-.85 1.63-1.11.64-.26 1.35-.39 2.14-.39l-.66.43z"/>
  </svg>
);

/* ─────────────────────────────────────────
   Main HomePage
───────────────────────────────────────── */
const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleEmailSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && email.trim()) navigate('/dashboard');
  };
  const handleSearch = () => { if (email.trim()) navigate('/dashboard'); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white overflow-visible">

      {/* ── CSS Animations ── */}
      <style>{`
        @keyframes fc-float-a {
          0%, 100% { transform: translateY(0px);   }
          50%       { transform: translateY(-10px); }
        }
        @keyframes fc-float-b {
          0%, 100% { transform: translateY(0px);  }
          50%       { transform: translateY(-8px); }
        }
        @keyframes fc-float-c {
          0%, 100% { transform: translateY(0px);   }
          50%       { transform: translateY(-13px); }
        }
        @keyframes fc-float-d {
          0%, 100% { transform: translateY(0px);   }
          50%       { transform: translateY(-11px); }
        }
        .fc-float-a { animation: fc-float-a 4.0s ease-in-out infinite; }
        .fc-float-b { animation: fc-float-b 4.6s ease-in-out infinite; }
        .fc-float-c { animation: fc-float-c 3.8s ease-in-out infinite; }
        .fc-float-d { animation: fc-float-d 5.0s ease-in-out infinite; }

        @keyframes heroReveal {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
        @keyframes floatIn {
          from { opacity: 0; transform: translateY(24px) scale(0.92); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        @keyframes scanline {
          0%   { top: -5%;  }
          100% { top: 105%; }
        }
        @keyframes redGlow {
          0%, 100% { filter: drop-shadow(0 0 8px #ef4444) drop-shadow(0 0 20px #ef444455); }
          50%       { filter: drop-shadow(0 0 18px #ef4444) drop-shadow(0 0 40px #ef444488); }
        }
        @keyframes pulsGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(80, 35, 204, 0.5), 0 0 50px rgba(107,79,187,0.2); }
          50%       { box-shadow: 0 0 40px rgba(107,79,187,0.9), 0 0 80px rgba(107,79,187,0.4); }
        }

        .hero-stage   { animation: heroReveal 1s ease-out 0.2s both; }
        .card-reveal  { animation: floatIn   0.5s ease-out both;      }
        .scanline-fx  {
          position: absolute; left: 0; right: 0; height: 5px;
          background: linear-gradient(90deg, transparent, #3b82f6, #60a5fa, #3b82f6, transparent);
          box-shadow: 0 0 18px 6px rgba(59,130,246,0.85), 0 0 40px 10px rgba(59,130,246,0.4);
          animation: scanline 3s linear infinite;
          pointer-events: none; z-index: 25;
          border-radius: 2px;
        }
        .red-eye-fx   { animation: redGlow  2s ease-in-out infinite; }
        .pulse-glow   { animation: pulsGlow 2s ease-in-out infinite; }

        .hero-pentagon {
          clip-path: polygon(8% 0%, 92% 0%, 100% 60%, 50% 100%, 0% 60%);
        }

        /* ═══════════════════════════════════════
           3D CURVED CARDS — زي صورة VaultX
        ═══════════════════════════════════════ */
        .curved-cards-stage {
          perspective: 1200px;
          perspective-origin: 50% 40%;
        }

        .curved-card-item {
          transition: transform 0.4s ease, box-shadow 0.4s ease;
          transform-style: preserve-3d;
          will-change: transform;
        }

        .curved-card-item:hover {
          transform: translateY(-6px) scale(1.04) !important;
          z-index: 50 !important;
        }

        /* card-far-left */
        .card-far-left {
          transform: perspective(800px) rotateY(28deg) rotateX(10deg) translateX(-20px) translateZ(-60px);
          opacity: 0.75;
        }
        /* card-left */
        .card-left {
          transform: perspective(800px) rotateY(16deg) rotateX(5deg) translateX(-8px) translateZ(-20px);
          opacity: 0.9;
        }
        /* card-center */
        .card-center {
          transform: perspective(800px) rotateY(0deg) rotateX(0deg) translateZ(0px);
          opacity: 1;
        }
        /* card-right */
        .card-right {
          transform: perspective(800px) rotateY(-16deg) rotateX(5deg) translateX(8px) translateZ(-20px);
          opacity: 0.9;
        }
        /* card-far-right */
        .card-far-right {
          transform: perspective(800px) rotateY(-28deg) rotateX(10deg) translateX(20px) translateZ(-60px);
          opacity: 0.75;
        }

        @keyframes curvedFloat0 { 0%,100%{transform: perspective(800px) rotateY(28deg) rotateX(10deg) translateX(-20px) translateZ(-60px) translateY(0px);} 50%{transform: perspective(800px) rotateY(28deg) rotateX(10deg) translateX(-20px) translateZ(-60px) translateY(-10px);} }
        @keyframes curvedFloat1 { 0%,100%{transform: perspective(800px) rotateY(16deg) rotateX(5deg) translateX(-8px) translateZ(-20px) translateY(0px);} 50%{transform: perspective(800px) rotateY(16deg) rotateX(5deg) translateX(-8px) translateZ(-20px) translateY(-8px);} }
        @keyframes curvedFloat2 { 0%,100%{transform: perspective(800px) rotateY(0deg) rotateX(0deg) translateZ(0px) translateY(0px);} 50%{transform: perspective(800px) rotateY(0deg) rotateX(0deg) translateZ(0px) translateY(-13px);} }
        @keyframes curvedFloat3 { 0%,100%{transform: perspective(800px) rotateY(-16deg) rotateX(5deg) translateX(8px) translateZ(-20px) translateY(0px);} 50%{transform: perspective(800px) rotateY(-16deg) rotateX(5deg) translateX(8px) translateZ(-20px) translateY(-8px);} }
        @keyframes curvedFloat4 { 0%,100%{transform: perspective(800px) rotateY(-28deg) rotateX(10deg) translateX(20px) translateZ(-60px) translateY(0px);} 50%{transform: perspective(800px) rotateY(-28deg) rotateX(10deg) translateX(20px) translateZ(-60px) translateY(-10px);} }

        .curved-animate-0 { animation: curvedFloat0 4.2s ease-in-out infinite; }
        .curved-animate-1 { animation: curvedFloat1 3.8s ease-in-out infinite 0.4s; }
        .curved-animate-2 { animation: curvedFloat2 4.5s ease-in-out infinite 0.8s; }
        .curved-animate-3 { animation: curvedFloat3 3.8s ease-in-out infinite 0.4s; }
        .curved-animate-4 { animation: curvedFloat4 4.2s ease-in-out infinite; }
      `}</style>

      {/* ── 90% Scale Wrapper ── */}
      <div style={{ transform: 'scale(0.9)', transformOrigin: 'top center', width: '111.11%', marginLeft: '-5.55%' }}>

        {/* ── Background Orbs ── */}
        <div className="fixed inset-0 overflow-visible pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-800/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#6B4FBB]/5 rounded-full blur-3xl" />
        </div>

        {/* ── Navbar ── */}
        <nav className="relative z-50 px-6 py-4 flex justify-center">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-full px-6 py-2 shadow-2xl w-fit">
            <div className="flex items-center gap-8 md:gap-16">
              <div className="flex items-center gap-3">
                <img src="./Logo.png" alt="The Terminator Ai" className="w-10 h-10 object-contain" />
                <span className="px-5 py-1 rounded-full bg-gradient-to-r from-blue-800 to-blue-900 text-white text-lg font-semibold shadow-lg shadow-blue-500/30">
                  <span style={{ color: '#6B4FBB' }}></span>{' '}
                  <span className="text-white"> The Terminator Ai</span>
                </span>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <a href="https://ai-social-project.vercel.app"
                  className="px-3 py-1.5 rounded-full text-sm font-medium text-white/90 hover:text-blue-400 hover:bg-white/10 transition-all duration-300">Home</a>
                <a href="#about"
                  className="px-3 py-1.5 rounded-full text-sm font-medium text-white/70 hover:text-blue-400 hover:bg-white/10 transition-all duration-300">
                  What is <span style={{ color: '#6B4FBB' }}></span> The Terminator Ai?
                </a>
                <a href="#contact"
                  className="px-5 py-1.5 rounded-full text-sm font-medium text-white/70 hover:text-blue-400 hover:bg-white/10 transition-all duration-300">Contact Us</a>
              </div>
            </div>
          </div>
        </nav>

        {/* ── HERO SECTION ── */}
        <section className="relative z-10 px-6 pt-4 pb-0">
          <div className="max-w-7xl mx-auto">

            {/* ── Animated Title + Slogans ── */}
            <div className="text-center mb-6 card-reveal" style={{ animationDelay: '0.1s' }}>
              <AnimatedTitle />
              <p className="font-['Montserrat'] text-xl md:text-xl font-Bold tracking-widest uppercase mt-3 mb-2"
                style={{
                  background: 'linear-gradient(90deg, #6B4FBB, #3b82f6, #6B4FBB)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                Terminate Competition .. Begin Domination
              </p>
              <p className="text-white/40 text-sm font-light max-w-xl mx-auto">
                ai-powered social media intelligence — out think, out perform, dominate.
              </p>
            </div>

            {/* ══════════════════════════════════════════
                HERO COMPOSITE — Pentagon + 3D Curved Cards
            ══════════════════════════════════════════ */}
            <div className="relative mx-auto" style={{ width: '900px', minHeight: '900px' }}>

              {/* ── LEFT COLUMN — 3 cards stacked ── */}
              <div className="absolute top-0 left-0 z-20 flex flex-col gap-3" style={{ width: '176px' }}>
                <FloatingCard card={floatingCards[0]} />
                <FloatingCard card={floatingCards[1]} />
                <FloatingCard card={floatingCards[2]} />
              </div>

              {/* ── RIGHT COLUMN — 3 cards stacked ── */}
              <div className="absolute top-0 right-0 z-20 flex flex-col gap-3" style={{ width: '176px' }}>
                <FloatingCard card={floatingCards[3]} />
                <FloatingCard card={floatingCards[4]} />
                <FloatingCard card={floatingCards[5]} />
              </div>

              {/* ── HERO STAGE: Pentagon shape ── */}
              <div
                className="hero-stage hero-pentagon relative mx-auto overflow-visible"
                style={{
                  width: '729px',
                  height: '900px',
                  border: '1px solid rgba(107,79,187,0.2)',
                  boxShadow: '0 0 80px rgba(107,79,187,0.12), 0 0 160px rgba(59,130,246,0.07)',
                }}
              >
                {/* Scanline */}
                <div className="scanline-fx" />

                {/* Robot image */}
                <img
                  src="./terminator-hero.png"
                  alt="The Terminator Ai"
                  className="w-full h-full object-cover object-top select-none"
                  style={{ filter: 'contrast(1.10) brightness(0.90)' }}
                  draggable={false}
                />

                {/* Vignette */}
                <div className="absolute inset-0 pointer-events-none" style={{
                  background: `
                    radial-gradient(ellipse 70% 70% at 50% 45%, transparent 30%, rgba(2,6,23,0.6) 100%),
                    linear-gradient(to bottom, rgba(2,6,23,0.25) 0%, transparent 18%, transparent 72%, rgba(2,6,23,0.8) 100%)
                  `,
                }} />

                {/* ════════════════════════════════════════
                    3D CURVED CARDS ROW — داخل المثلث في المنتصف
                ════════════════════════════════════════ */}
                <div
                  className="curved-cards-stage absolute z-30"
                  style={{
                    bottom: '28%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '680px',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    gap: '10px',
                  }}
                >
                  {/* Card 0 — Far Left */}
                  <div className="curved-card-item curved-animate-0" style={{ zIndex: 1, flexShrink: 0 }}>
                    <div className="w-36 rounded-2xl border backdrop-blur-xl p-3 cursor-default"
                      style={{
                        background: 'rgba(8,14,36,0.90)',
                        borderColor: `${floatingCards[0].color}40`,
                        boxShadow: `0 0 20px ${floatingCards[0].color}22, 0 8px 32px rgba(0,0,0,0.7)`,
                        transform: 'perspective(800px) rotateY(28deg) rotateX(10deg) translateX(-20px) translateZ(-60px)',
                        opacity: 0.75,
                      }}>
                      <div className="flex items-center gap-1.5 mb-2">
                        <div className="p-1 rounded-md" style={{ background: `${floatingCards[0].color}22` }}>
                          <Trophy size={11} style={{ color: floatingCards[0].color }} />
                        </div>
                        <span className="text-[9px] font-bold text-white/70 truncate">Market Score</span>
                      </div>
                      <div className="text-xl font-black text-white mb-1">87%</div>
                      <div className="h-1 rounded-full bg-white/10">
                        <div className="h-full rounded-full w-[87%]" style={{ background: `linear-gradient(90deg, ${floatingCards[0].color}, #3b82f6)` }} />
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-[8px] text-white/30">Your position</span>
                        <span className="text-[8px] font-bold text-emerald-400">+12%</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 1 — Left */}
                  <div className="curved-card-item curved-animate-1" style={{ zIndex: 2, flexShrink: 0 }}>
                    <div className="w-40 rounded-2xl border backdrop-blur-xl p-3 cursor-default"
                      style={{
                        background: 'rgba(8,14,36,0.92)',
                        borderColor: `${floatingCards[2].color}40`,
                        boxShadow: `0 0 24px ${floatingCards[2].color}22, 0 8px 32px rgba(0,0,0,0.7)`,
                        transform: 'perspective(800px) rotateY(16deg) rotateX(5deg) translateX(-8px) translateZ(-20px)',
                        opacity: 0.9,
                      }}>
                      <div className="flex items-center gap-1.5 mb-2">
                        <div className="p-1 rounded-md" style={{ background: `${floatingCards[2].color}22` }}>
                          <Swords size={11} style={{ color: floatingCards[2].color }} />
                        </div>
                        <span className="text-[9px] font-bold text-white/70 truncate">Competitors</span>
                      </div>
                      <div className="space-y-1">
                        {floatingCards[2].content.bars.map((bar) => (
                          <div key={bar.label} className="flex items-center gap-1">
                            <span className="text-[7px] text-white/40 w-8 shrink-0">{bar.label}</span>
                            <div className="flex-1 h-0.5 rounded-full bg-white/10">
                              <div className="h-full rounded-full" style={{ width: `${bar.value}%`, background: bar.color }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card 2 — Center (أكبر وفي المقدمة) */}
                  <div className="curved-card-item curved-animate-2" style={{ zIndex: 10, flexShrink: 0 }}>
                    <div className="w-48 rounded-2xl border-2 backdrop-blur-xl p-4 cursor-default"
                      style={{
                        background: 'rgba(8,14,36,0.95)',
                        borderColor: `${floatingCards[4].color}60`,
                        boxShadow: `0 0 40px ${floatingCards[4].color}44, 0 16px 48px rgba(0,0,0,0.8), 0 0 80px rgba(107,79,187,0.2)`,
                      }}>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-1.5 rounded-lg" style={{ background: `${floatingCards[4].color}22`, border: `1px solid ${floatingCards[4].color}44` }}>
                          <Brain size={14} style={{ color: floatingCards[4].color }} />
                        </div>
                        <span className="text-[10px] font-bold text-white/90">AI Insights</span>
                        <div className="ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      </div>
                      <div className="space-y-2">
                        {floatingCards[4].content.metrics.map((m) => (
                          <div key={m.label} className="flex items-center justify-between rounded-lg px-2 py-1" style={{ background: `${m.color}10` }}>
                            <span className="text-[9px] text-white/50">{m.label}</span>
                            <span className="text-[10px] font-black" style={{ color: m.color }}>{m.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card 3 — Right */}
                  <div className="curved-card-item curved-animate-3" style={{ zIndex: 2, flexShrink: 0 }}>
                    <div className="w-40 rounded-2xl border backdrop-blur-xl p-3 cursor-default"
                      style={{
                        background: 'rgba(8,14,36,0.92)',
                        borderColor: `${floatingCards[3].color}40`,
                        boxShadow: `0 0 24px ${floatingCards[3].color}22, 0 8px 32px rgba(0,0,0,0.7)`,
                        transform: 'perspective(800px) rotateY(-16deg) rotateX(5deg) translateX(8px) translateZ(-20px)',
                        opacity: 0.9,
                      }}>
                      <div className="flex items-center gap-1.5 mb-2">
                        <div className="p-1 rounded-md" style={{ background: `${floatingCards[3].color}22` }}>
                          <Activity size={11} style={{ color: floatingCards[3].color }} />
                        </div>
                        <span className="text-[9px] font-bold text-white/70">Engagement</span>
                      </div>
                      <div className="text-2xl font-black text-white">9.8%</div>
                      <div className="flex justify-between mt-1">
                        <span className="text-[8px] text-white/30">vs 2.1% avg</span>
                        <span className="text-[8px] font-bold text-emerald-400">+128%</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 4 — Far Right */}
                  <div className="curved-card-item curved-animate-4" style={{ zIndex: 1, flexShrink: 0 }}>
                    <div className="w-36 rounded-2xl border backdrop-blur-xl p-3 cursor-default"
                      style={{
                        background: 'rgba(8,14,36,0.90)',
                        borderColor: `${floatingCards[5].color}40`,
                        boxShadow: `0 0 20px ${floatingCards[5].color}22, 0 8px 32px rgba(0,0,0,0.7)`,
                        transform: 'perspective(800px) rotateY(-28deg) rotateX(10deg) translateX(20px) translateZ(-60px)',
                        opacity: 0.75,
                      }}>
                      <div className="flex items-center gap-1.5 mb-2">
                        <div className="p-1 rounded-md" style={{ background: `${floatingCards[5].color}22` }}>
                          <Sparkles size={11} style={{ color: floatingCards[5].color }} />
                        </div>
                        <span className="text-[9px] font-bold text-white/70">Action Plan</span>
                      </div>
                      <div className="space-y-1">
                        {floatingCards[5].content.steps.map((step, i) => (
                          <div key={i} className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full flex items-center justify-center text-[6px] font-black shrink-0"
                              style={{ background: floatingCards[5].color, color: '#fff' }}>{i + 1}</div>
                            <span className="text-[8px] text-white/60">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                {/* ═══ نهاية 3D Curved Cards ═══ */}

                {/* Red eye glow */}
                <div className="red-eye-fx absolute pointer-events-none"
                  style={{ top: '29%', left: '38%', width: '20px', height: '20px', zIndex: 20 }}>
                  <div className="w-full h-full rounded-full"
                    style={{ background: 'radial-gradient(circle, #ff6666 0%, #ef4444 40%, #991b1b 100%)' }} />
                </div>

                {/* Purple base glow */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-32 pointer-events-none" style={{
                  background: 'radial-gradient(ellipse 80% 100% at 50% 100%, rgba(107,79,187,0.3) 0%, transparent 70%)',
                  filter: 'blur(16px)', zIndex: 15,
                }} />
              </div>
              {/* ── نهاية المثلث ── */}

            </div>
            {/* ── نهاية Hero Composite ── */}

            {/* ── CTA Button ── */}
            <div className="flex justify-center relative z-30 -mt-16 mb-10">
              <button
                onClick={() => navigate('/dashboard')}
                className="pulse-glow flex items-center gap-3 px-8 py-4 rounded-full font-black text-white text-sm tracking-widest uppercase transition-all hover:scale-110 hover:brightness-125"
                style={{
                  background: 'linear-gradient(135deg, #6B4FBB, #3b82f6)',
                  boxShadow: '0 0 30px rgba(107,79,187,0.6)',
                }}
              >
                <Brain size={18} />
                Launch Analysis
                <ArrowRight size={18} />
              </button>
            </div>

            {/* Search Bar */}
            <div className="max-w-lg mx-auto mt-8 card-reveal" style={{ animationDelay: '0.5s' }}>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleEmailSubmit}
                  placeholder="Enter your email to get started..."
                  className="w-full px-6 py-4 pr-16 rounded-2xl text-sm text-white placeholder-white/30 outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(107,79,187,0.3)',
                    backdropFilter: 'blur(20px)',
                  }}
                />
                <button onClick={handleSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-xl transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #6B4FBB, #3b82f6)' }}>
                  <Search className="w-4 h-4 text-white" />
                </button>
              </div>
              <p className="text-center text-xs text-white/30 mt-3">Press Enter to go to Dashboard</p>
            </div>
          </div>
        </section>

        {/* ── ECOSYSTEM SECTION ── */}
        <section id="about" className="relative z-10 px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="font-['Montserrat'] text-4xl md:text-5xl font-black mb-4 tracking-tight">
                <span style={{ color: '#6B4FBB' }}>Ai</span>{' '}
                <span className="text-white">Social Project</span>{' '}
                <span className="text-white/30">Ecosystem</span>
              </h2>
              <p className="text-white/40 text-base max-w-2xl mx-auto">
                Integrated smart tools for analyzing and managing social media with high efficiency
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-10">
              {/* Growth Card */}
              <div className="rounded-2xl p-7 shadow-2xl hover:scale-[1.02] transition-all duration-300 group"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl" style={{ background: 'rgba(107,79,187,0.2)', border: '1px solid rgba(107,79,187,0.3)' }}>
                    <BarChart3 className="w-5 h-5" style={{ color: '#6B4FBB' }} />
                  </div>
                  <h3 className="text-lg font-bold text-white">Growth</h3>
                </div>
                <div className="flex items-end justify-between gap-1.5 h-28 mb-4">
                  {[40, 60, 35, 80, 55, 90, 70, 45, 85, 100, 65, 75].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t-md"
                      style={{ height: `${h}%`, background: 'linear-gradient(to top, #6B4FBB, #3b82f6)', opacity: 0.7 + (i / 12) * 0.3 }} />
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-white/30 mb-5">
                  <span>Nov. 10</span><span>Nov. 11</span><span>Today</span>
                </div>
                <div className="border-t border-white/5 pt-5">
                  <div className="text-4xl font-black text-white mb-1">4,598,807</div>
                  <p className="text-sm text-white/30">Active engagements across social media platforms</p>
                </div>
              </div>

              {/* AI Agents Card */}
              <div className="rounded-2xl p-7 shadow-2xl hover:scale-[1.02] transition-all duration-300 group"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)' }}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl" style={{ background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.3)' }}>
                      <Users className="w-5 h-5 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white">AI Agents</h3>
                  </div>
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-9 h-9 rounded-full border-2 border-slate-900"
                        style={{ background: 'linear-gradient(135deg, #6B4FBB, #3b82f6)' }} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-white/30 mb-6">Over 60 types of specialized AI agents for content and audience analysis</p>
                <div className="relative h-36 mb-5 rounded-xl overflow-visible" style={{ background: 'rgba(59,130,246,0.05)' }}>
                  <svg className="w-full h-full" viewBox="0 0 400 140">
                    <defs>
                      <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6B4FBB" />
                        <stop offset="50%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#6B4FBB" />
                      </linearGradient>
                    </defs>
                    <path d="M0,70 Q50,30 100,55 T200,90 T300,50 T400,70" fill="none" stroke="url(#waveGrad)" strokeWidth="2.5" />
                    <path d="M0,90 Q60,55 120,75 T240,60 T360,85 T400,75" fill="none" stroke="url(#waveGrad)" strokeWidth="1.5" opacity="0.4" />
                  </svg>
                </div>
                <div className="flex items-end justify-between border-t border-white/5 pt-5">
                  <div>
                    <div className="text-4xl font-black text-white mb-1">4,762</div>
                    <p className="text-xs text-white/30">Active analyses</p>
                  </div>
                  <div className="px-4 py-2 rounded-xl text-white text-sm font-bold"
                    style={{ background: 'linear-gradient(135deg, #6B4FBB, #3b82f6)' }}>+1.08%</div>
                </div>
              </div>
            </div>

            {/* Feature Pills */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
              {[
                { icon: Target, title: 'High Accuracy',         desc: 'Advanced analysis with up to 98% precision',  color: '#6B4FBB' },
                { icon: Zap,    title: 'Lightning Fast',         desc: 'Real-time data processing and insights',      color: '#3b82f6' },
                { icon: Users,  title: 'Seamless Collaboration', desc: 'Share results with your team effortlessly',   color: '#10b981' },
              ].map((f, i) => (
                <div key={i}
                  className="rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300 group"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)' }}>
                  <div className="inline-flex p-3.5 rounded-2xl mb-4 transition-all duration-300 group-hover:scale-110"
                    style={{ background: `${f.color}20`, border: `1px solid ${f.color}40` }}>
                    <f.icon className="w-7 h-7" style={{ color: f.color }} />
                  </div>
                  <h4 className="text-base font-bold text-white mb-2">{f.title}</h4>
                  <p className="text-sm text-white/30">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Separator ── */}
        <div className="relative z-10 h-px mx-6"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(107,79,187,0.6), transparent)' }} />

        {/* ══════════════════════════════════════════
            FOOTER
        ══════════════════════════════════════════ */}
        <footer id="contact" className="relative z-10 px-6 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-14">
              {/* Col 1 — Brand */}
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <img src="./Logo.png" alt="Logo" className="w-10 h-10 object-contain" />
                  <div>
                    <div className="font-['Montserrat'] font-black text-lg leading-tight">
                      <span style={{ color: '#6B4FBB' }}>The</span>{' '}
                      <span className="text-white">Terminator Ai</span>
                    </div>
                    <div className="text-[10px] text-white/30 tracking-widest uppercase">Social Media Intelligence</div>
                  </div>
                </div>
                <blockquote className="relative pl-4 text-sm text-white/50 italic leading-relaxed"
                  style={{ borderLeft: '3px solid #6B4FBB' }}>
                  "We don't just analyze your competitors — we help you dominate them."
                </blockquote>
                <div className="flex items-center gap-2">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-xs text-white/40 ml-1">4.9 / 5 — Trusted by 500+ marketers</span>
                </div>
              </div>

              {/* Col 2 — Owner */}
              <div className="space-y-4">
                <h4 className="text-white font-bold text-base tracking-wide flex items-center gap-2">
                  <Award size={16} style={{ color: '#6B4FBB' }} /> About the Creator
                </h4>
                <div className="space-y-1">
                  <p className="text-white font-bold text-lg">KHaled SHosha</p>
                  <p className="text-white/50 text-sm">Marketing Team Leader & Art Director</p>
                  <p className="text-white/30 text-xs">Smart Home · Automation · Security Systems</p>
                </div>
                <p className="text-white/40 text-sm leading-relaxed">
                  Senior-level strategist specializing in AI-driven marketing, brand development, and competitive intelligence for B2B markets in Egypt and the MENA region.
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {['AI Marketing', 'Social Strategy', 'Brand Design', 'B2B Growth'].map(tag => (
                    <span key={tag} className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                      style={{ background: 'rgba(107,79,187,0.2)', border: '1px solid rgba(107,79,187,0.4)', color: '#a78bfa' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Col 3 — Contact */}
              <div className="space-y-4">
                <h4 className="text-white font-bold text-base tracking-wide flex items-center gap-2">
                  <Globe size={16} style={{ color: '#3b82f6' }} /> Get In Touch
                </h4>
                <div className="space-y-3">
                  {[
                    { icon: Mail,   label: 'Email',    val: 'khaledshosha@gmail.com',    color: '#6B4FBB' },
                    { icon: Globe,  label: 'Website',  val: 'linktr.ee/khaledshosha.eg', color: '#3b82f6' },
                    { icon: MapPin, label: 'Location', val: 'Cairo, Egypt',               color: '#10b981' },
                  ].map(({ icon: Icon, label, val, color }) => (
                    <div key={label} className="flex items-center gap-3">
                      <div className="p-1.5 rounded-lg shrink-0"
                        style={{ background: `${color}20`, border: `1px solid ${color}40` }}>
                        <Icon size={13} style={{ color }} />
                      </div>
                      <div>
                        <div className="text-[9px] text-white/30 uppercase tracking-wider">{label}</div>
                        <div className="text-xs text-white/70">{val}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-2 flex-wrap">
                  <a href="#" className="p-2 rounded-xl transition-all hover:scale-110"
                    style={{ background: 'rgba(0,119,181,0.18)', border: '1px solid rgba(0,119,181,0.4)' }}>
                    <Linkedin size={15} style={{ color: '#0077b5' }} />
                  </a>
                  <a href="#" className="p-2 rounded-xl transition-all hover:scale-110"
                    style={{ background: 'rgba(29,161,242,0.18)', border: '1px solid rgba(29,161,242,0.4)' }}>
                    <Twitter size={15} style={{ color: '#1da1f2' }} />
                  </a>
                  <a href="#" className="p-2 rounded-xl transition-all hover:scale-110"
                    style={{ background: 'rgba(225,48,108,0.18)', border: '1px solid rgba(225,48,108,0.4)' }}>
                    <Instagram size={15} style={{ color: '#e1306c' }} />
                  </a>
                  <a href="#" className="p-2 rounded-xl transition-all hover:scale-110"
                    style={{ background: 'rgba(24,119,242,0.18)', border: '1px solid rgba(24,119,242,0.4)' }}>
                    <FacebookIcon size={15} color="#1877f2" />
                  </a>
                  <a href="#" className="p-2 rounded-xl transition-all hover:scale-110"
                    style={{ background: 'rgba(23,105,255,0.18)', border: '1px solid rgba(23,105,255,0.4)' }}>
                    <BehanceIcon size={15} color="#1769ff" />
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-xs text-white/20">
                © {new Date().getFullYear()} The Terminator Ai — Social Media Project. All rights reserved.
              </p>
              <p className="text-xs text-white/20 flex items-center gap-1.5">
                Built with precision by
                <span className="font-bold" style={{ color: '#6B4FBB' }}>KHaled SHosha</span>
                — Terminate Competition .. Begin Domination
              </p>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default HomePage;