import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const accentStyles: Record<string, string> = {
  blue: 'border-blue-500/25 bg-blue-500/10 text-blue-400',
  purple: 'border-purple-500/25 bg-purple-500/10 text-purple-400',
  emerald: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-400',
  red: 'border-red-500/25 bg-red-500/10 text-red-400',
  amber: 'border-amber-500/25 bg-amber-500/10 text-amber-400',
  cyan: 'border-cyan-500/25 bg-cyan-500/10 text-cyan-400',
  orange: 'border-orange-500/25 bg-orange-500/10 text-orange-400',
  slate: 'border-white/15 bg-white/10 text-white/70',
};

export interface TabSectionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  accent?: keyof typeof accentStyles;
  className?: string;
  /** Grid column span at xl (e.g. "xl:col-span-2") */
  colSpanClass?: string;
  children?: React.ReactNode;
  'data-section'?: string;
}

/**
 * Glassmorphism section card: Lucide icon, title, short copy, then body.
 */
const TabSectionCard: React.FC<TabSectionCardProps> = ({
  icon: Icon,
  title,
  description,
  accent = 'blue',
  className,
  colSpanClass,
  children,
  'data-section': dataSection,
}) => {
  const accentClass = accentStyles[accent] ?? accentStyles.blue;

  return (
    <div
      className={cn(
        'flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-xl transition-shadow duration-300 hover:border-white/[0.14] hover:shadow-[0_12px_40px_rgba(0,0,0,0.22)]',
        colSpanClass,
        className
      )}
      data-section={dataSection}
    >
      <div className="flex flex-1 flex-col gap-3 min-h-0">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border',
              accentClass
            )}
          >
            <Icon className="h-5 w-5" strokeWidth={2} />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <h3 className="text-lg font-bold tracking-tight text-white">{title}</h3>
            <p className="text-sm leading-relaxed text-white/50">{description}</p>
          </div>
        </div>
        {children != null && <div className="min-h-0 flex-1 pt-1">{children}</div>}
      </div>
    </div>
  );
};

export default TabSectionCard;
