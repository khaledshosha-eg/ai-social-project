import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CardProps {
  title?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  color?: string;
  className?: string;
  delay?: number;
}

/**
 * Reusable glassmorphism card component.
 */
export const Card: React.FC<CardProps> = ({ 
  title, 
  icon: Icon, 
  children, 
  color = 'blue', 
  className,
  delay = 0 
}) => {
  const colorMap: Record<string, string> = {
    blue: 'border-blue-500/20 text-blue-400',
    purple: 'border-purple-500/20 text-purple-400',
    green: 'border-green-500/20 text-green-400',
    red: 'border-red-500/20 text-red-400',
    orange: 'border-orange-500/20 text-orange-400',
    cyan: 'border-cyan-500/20 text-cyan-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        "bg-card/30 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative group overflow-hidden",
        className
      )}
    >
      {/* Decorative gradient glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl pointer-events-none" />

      {(title || Icon) && (
        <div className="flex items-center gap-3 mb-4">
          {Icon && (
            <div className={cn("p-2 rounded-xl bg-white/5", colorMap[color] || colorMap.blue)}>
              <Icon size={20} />
            </div>
          )}
          {title && <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>}
        </div>
      )}
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export default Card;
