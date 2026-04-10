import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Target, Zap, Ban, Megaphone, CheckSquare, Square,
  Calendar, TrendingUp, Flag, ChevronDown, ChevronUp
} from 'lucide-react';
import TabSectionCard from './TabSectionCard';

interface ChecklistItem {
  task: string;
  priority: 'High' | 'Medium' | 'Low';
  deadline: string;
  done: boolean;
}

interface PhasePlan {
  goal: string;
  tasks: string[];
  kpi: string;
}

interface Plan306090 {
  days_30: PhasePlan;
  days_60: PhasePlan;
  days_90: PhasePlan;
}

interface ActionableData {
  do: string[];
  dont: string[];
  biggest_opportunity: string;
  quick_win: string;
  best_ad: string;
  plan_30_60_90: Plan306090;
  checklist: ChecklistItem[];
}

const priorityColor = {
  High:   { bg: 'bg-rose-500/10',   border: 'border-rose-500/30',   text: 'text-rose-400'   },
  Medium: { bg: 'bg-amber-500/10',  border: 'border-amber-500/30',  text: 'text-amber-400'  },
  Low:    { bg: 'bg-blue-500/10',   border: 'border-blue-500/30',   text: 'text-blue-400'   },
};

const phaseConfig = [
  {
    key: 'days_30' as const,
    label: 'الشهر الأول',
    sublabel: '30 يوم',
    color: 'emerald',
    bgClass:     'bg-emerald-500/10',
    borderClass: 'border-emerald-500/30',
    textClass:   'text-emerald-400',
    dotClass:    'bg-emerald-400',
  },
  {
    key: 'days_60' as const,
    label: 'الشهر الثاني',
    sublabel: '60 يوم',
    color: 'blue',
    bgClass:     'bg-blue-500/10',
    borderClass: 'border-blue-500/30',
    textClass:   'text-blue-400',
    dotClass:    'bg-blue-400',
  },
  {
    key: 'days_90' as const,
    label: 'الشهر الثالث',
    sublabel: '90 يوم',
    color: 'purple',
    bgClass:     'bg-purple-500/10',
    borderClass: 'border-purple-500/30',
    textClass:   'text-purple-400',
    dotClass:    'bg-purple-400',
  },
];

const ActionableTab = ({ data }: { data: any }) => {
  const d: ActionableData = data || {};
  const plan = d.plan_30_60_90 || {} as Plan306090;
  const [checklist, setChecklist] = useState<ChecklistItem[]>(d.checklist || []);
  const [openPhase, setOpenPhase] = useState<string | null>('days_30');

  const toggleTask = (idx: number) => {
    setChecklist(prev =>
      prev.map((item, i) => i === idx ? { ...item, done: !item.done } : item)
    );
  };

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">

      {/* Quick Wins Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Biggest Opportunity */}
        <motion.div variants={item}>
          <TabSectionCard icon={TrendingUp} title="Biggest opportunity" description="أكبر فرصة لزيادة المبيعات الآن" accent="emerald">
            <div className="mt-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-sm leading-relaxed text-white/80">{d.biggest_opportunity || '—'}</p>
            </div>
          </TabSectionCard>
        </motion.div>

        {/* Quick Win */}
        <motion.div variants={item}>
          <TabSectionCard icon={Zap} title="Quick win — 7 days" description="فوز سريع يمكن تحقيقه في 7 أيام" accent="amber">
            <div className="mt-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <p className="text-sm leading-relaxed text-white/80">{d.quick_win || '—'}</p>
            </div>
          </TabSectionCard>
        </motion.div>

        {/* Best Ad */}
        <motion.div variants={item}>
          <TabSectionCard icon={Megaphone} title="Best ad angle" description="أفضل زاوية إعلانية مقترحة" accent="blue">
            <div className="mt-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <p className="text-sm leading-relaxed text-white/80">{d.best_ad || '—'}</p>
            </div>
          </TabSectionCard>
        </motion.div>
      </div>

      {/* Do / Don't */}
      <motion.div variants={item}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TabSectionCard icon={Target} title="Do ✅" description="أفعال محددة لتحسين الأداء" accent="emerald">
            <ul className="mt-3 space-y-3">
              {(d.do || []).map((action, i) => (
                <li key={i} className="flex gap-3 items-start p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                  <span className="text-sm text-white/80">{action}</span>
                </li>
              ))}
            </ul>
          </TabSectionCard>

          <TabSectionCard icon={Ban} title="Don't ❌" description="أخطاء يجب تجنبها" accent="slate">
            <ul className="mt-3 space-y-3">
              {(d.dont || []).map((action, i) => (
                <li key={i} className="flex gap-3 items-start p-3 rounded-xl bg-rose-500/5 border border-rose-500/10">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-xs font-bold">✕</span>
                  <span className="text-sm text-white/80">{action}</span>
                </li>
              ))}
            </ul>
          </TabSectionCard>
        </div>
      </motion.div>

      {/* ════════════════════════════════════════
          خطة 30 / 60 / 90 يوم
      ════════════════════════════════════════ */}
      <motion.div variants={item}>
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 p-6 border-b border-white/10">
            <div className="p-2 rounded-xl bg-primary/20">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">خطة النمو 30 / 60 / 90 يوم</h3>
              <p className="text-xs text-white/40 mt-0.5">Growth roadmap to outperform all competitors</p>
            </div>
          </div>

          {/* Timeline bar */}
          <div className="flex border-b border-white/10">
            {phaseConfig.map((phase) => (
              <button
                key={phase.key}
                onClick={() => setOpenPhase(openPhase === phase.key ? null : phase.key)}
                className={`flex-1 py-4 px-3 flex flex-col items-center gap-1 transition-all
                  ${openPhase === phase.key ? phase.bgClass + ' ' + phase.borderClass : 'hover:bg-white/5'}`}
              >
                <span className={`text-xs font-black uppercase tracking-widest ${openPhase === phase.key ? phase.textClass : 'text-white/40'}`}>
                  {phase.sublabel}
                </span>
                <span className={`text-sm font-bold ${openPhase === phase.key ? 'text-white' : 'text-white/50'}`}>
                  {phase.label}
                </span>
                {openPhase === phase.key
                  ? <ChevronUp size={14} className={phase.textClass} />
                  : <ChevronDown size={14} className="text-white/30" />}
              </button>
            ))}
          </div>

          {/* Phase content */}
          {phaseConfig.map((phase) => {
            const phaseData = plan[phase.key];
            if (openPhase !== phase.key || !phaseData) return null;
            return (
              <motion.div
                key={phase.key}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 space-y-5"
              >
                {/* Goal */}
                <div className={`p-4 rounded-2xl ${phase.bgClass} border ${phase.borderClass}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Flag size={14} className={phase.textClass} />
                    <span className={`text-xs font-black uppercase tracking-widest ${phase.textClass}`}>الهدف</span>
                  </div>
                  <p className="text-base font-bold text-white">{phaseData.goal}</p>
                </div>

                {/* Weekly tasks */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">المهام الأسبوعية</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(phaseData.tasks || []).map((task, idx) => (
                      <div key={idx} className="flex gap-3 items-start p-4 rounded-xl bg-white/5 border border-white/10">
                        <span className={`shrink-0 w-7 h-7 rounded-full ${phase.bgClass} ${phase.textClass} flex items-center justify-center text-xs font-black border ${phase.borderClass}`}>
                          {idx + 1}
                        </span>
                        <p className="text-sm text-white/80 leading-relaxed">{task}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* KPI */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                  <TrendingUp size={16} className={`${phase.textClass} shrink-0 mt-0.5`} />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-1">مؤشر النجاح (KPI)</p>
                    <p className="text-sm font-semibold text-white">{phaseData.kpi}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Checklist */}
      {checklist.length > 0 && (
        <motion.div variants={item}>
          <TabSectionCard icon={CheckSquare} title="Action checklist" description="المهام الموصى بها مرتبة حسب الأولوية" accent="blue">
            <div className="mt-4 space-y-3">
              {checklist.map((task, idx) => {
                const style = priorityColor[task.priority] || priorityColor.Low;
                return (
                  <motion.div
                    key={idx}
                    whileHover={{ x: 4 }}
                    className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all border
                      ${task.done ? 'opacity-40 bg-white/[0.02]' : 'bg-white/5'} border-white/10`}
                    onClick={() => toggleTask(idx)}
                  >
                    {task.done
                      ? <CheckSquare size={18} className="text-emerald-400 shrink-0" />
                      : <Square      size={18} className="text-white/30 shrink-0" />}
                    <p className={`flex-1 text-sm ${task.done ? 'line-through text-white/30' : 'text-white/80'}`}>
                      {task.task}
                    </p>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase border ${style.bg} ${style.border} ${style.text}`}>
                        {task.priority}
                      </span>
                      <span className="text-xs text-white/30">{task.deadline}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </TabSectionCard>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ActionableTab;
