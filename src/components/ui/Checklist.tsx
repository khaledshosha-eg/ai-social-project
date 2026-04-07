import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChecklistItem {
  task: string;
  priority: 'high' | 'medium' | 'low';
  deadline: string;
  done: boolean;
}

interface ChecklistProps {
  items: ChecklistItem[];
  className?: string;
}

const Checklist: React.FC<ChecklistProps> = ({ items, className }) => {
  const priorityColors = {
    high: 'text-red-400 bg-red-400/10 border-red-400/20',
    medium: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    low: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  };

  return (
    <div className={cn("space-y-3", className)}>
      {items.map((item, index) => (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          key={index}
          className={cn(
            "group flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all",
            item.done && "opacity-60"
          )}
        >
          <div className="flex items-center gap-4">
            <div className="shrink-0">
              {item.done ? (
                <CheckCircle2 className="text-primary w-5 h-5" />
              ) : (
                <Circle className="text-white/20 w-5 h-5 group-hover:text-white/40 transition-colors" />
              )}
            </div>
            <div className="space-y-1">
              <p className={cn(
                "text-sm font-medium transition-all",
                item.done ? "text-white/40 line-through" : "text-white"
              )}>
                {item.task}
              </p>
              <div className="flex items-center gap-3">
                <span className={cn(
                  "text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider",
                  priorityColors[item.priority]
                )}>
                  {item.priority}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-white/40">
                  <Clock size={10} /> {item.deadline}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Checklist;
