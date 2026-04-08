import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain } from 'lucide-react';

const ROTATING_MESSAGES = [
  'Reading comments...',
  'Detecting sentiment...',
  'Scanning competitors...',
  'Mapping engagement patterns...',
  'Synthesizing insights...',
] as const;

const FIXED_HEADLINE_STEPS = new Set([
  'Extracting and parsing results...',
  'Finalizing report...',
]);

export interface AnalysisLoadingOverlayProps {
  open: boolean;
  /** Runtime step from the analysis flow; some steps pin the headline instead of rotating */
  loadingStep: string;
}

const AnalysisLoadingOverlay: React.FC<AnalysisLoadingOverlayProps> = ({ open, loadingStep }) => {
  const [cycleIndex, setCycleIndex] = useState(0);

  const headline = useMemo(() => {
    if (FIXED_HEADLINE_STEPS.has(loadingStep)) return loadingStep;
    return ROTATING_MESSAGES[cycleIndex % ROTATING_MESSAGES.length];
  }, [loadingStep, cycleIndex]);

  useEffect(() => {
    if (!open) {
      setCycleIndex(0);
      return;
    }
    const id = window.setInterval(() => {
      setCycleIndex((i) => (i + 1) % ROTATING_MESSAGES.length);
    }, 2000);
    return () => window.clearInterval(id);
  }, [open]);

  const ringSize = 128;
  const cx = ringSize / 2;
  const cy = ringSize / 2;
  const r = 52;
  const circumference = 2 * Math.PI * r;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#030014]/55 backdrop-blur-xl supports-[backdrop-filter]:bg-[#030014]/40"
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <motion.div
            className="relative mx-4 w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.06] p-10 shadow-[0_8px_40px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
            animate={{ scale: [1, 1.015, 1], opacity: [0.95, 1, 0.95] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="flex flex-col items-center gap-8">
              <div className="relative flex h-[8.5rem] w-[8.5rem] items-center justify-center">
                {/* Soft outer glow */}
                <div
                  className="pointer-events-none absolute inset-2 rounded-full bg-indigo-500/20 blur-2xl"
                  aria-hidden
                />
                <svg
                  width={ringSize}
                  height={ringSize}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 animate-[spin_2.2s_linear_infinite]"
                  aria-hidden
                >
                  <defs>
                    <linearGradient id="analysis-ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#22d3ee" />
                    </linearGradient>
                  </defs>
                  {/* Track */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={4}
                    className="text-white/10"
                  />
                  {/* Gradient arc */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill="none"
                    stroke="url(#analysis-ring-gradient)"
                    strokeWidth={4}
                    strokeLinecap="round"
                    strokeDasharray={`${circumference * 0.28} ${circumference}`}
                  />
                </svg>
                {/* Brain: perfectly centered in ring */}
                <div className="relative z-10 flex h-12 w-12 items-center justify-center">
                  <Brain
                    className="h-12 w-12 text-indigo-200 drop-shadow-[0_0_18px_rgba(99,102,241,0.75),0_0_36px_rgba(34,211,238,0.35)]"
                    strokeWidth={1.75}
                  />
                </div>
              </div>

              <div className="space-y-2 text-center">
                <AnimatePresence mode="wait">
                  <motion.h3
                    key={headline}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="bg-gradient-to-r from-indigo-300 via-cyan-200 to-indigo-300 bg-clip-text text-xl font-semibold tracking-tight text-transparent"
                  >
                    {headline}
                  </motion.h3>
                </AnimatePresence>
                <p className="text-sm text-white/45">This can take a moment — hang tight.</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnalysisLoadingOverlay;
