import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  color?: string;
  label?: string;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  value, 
  color = 'blue', 
  label, 
  className 
}) => {
  const safeValue = Math.min(100, Math.max(0, value));
  
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]',
    purple: 'bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]',
    green: 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]',
    amber: 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]',
  };

  return (
    <div className={cn("w-full space-y-2", className)}>
      <div className="flex justify-between items-center px-1">
        {label && <span className="text-sm font-medium text-white/70">{label}</span>}
        <span className="text-sm font-bold text-white">{Math.round(safeValue)}%</span>
      </div>
      <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 p-[2px]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${safeValue}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn(
            "h-full rounded-full relative",
            colorMap[color] || colorMap.blue
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </motion.div>
      </div>
    </div>
  );
};

export default ProgressBar;
