import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Brain, Sword, BarChart3, Palette, Target } from 'lucide-react';
import MarketOverview from './MarketOverview';
import AudienceTab from './AudienceTab';
import CompetitiveTab from './CompetitiveTab';
import PerformanceTab from './PerformanceTab';
import ContentTab from './ContentTab';
import ActionableTab from './ActionableTab';

interface TabsProps {
  data: any;
}

const tabs = [
  { id: 'market', label: 'Market Overview', icon: Trophy, component: MarketOverview },
  { id: 'audience', label: 'Audience Intelligence', icon: Brain, component: AudienceTab },
  { id: 'competitive', label: 'Competitive Intelligence', icon: Sword, component: CompetitiveTab },
  { id: 'performance', label: 'Performance Intelligence', icon: BarChart3, component: PerformanceTab },
  { id: 'content', label: 'Content Intelligence', icon: Palette, component: ContentTab },
  { id: 'actionable', label: 'Actionable Insights', icon: Target, component: ActionableTab },
];

const Tabs: React.FC<TabsProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  // Expose the active tab and a way to change it to the window for the export button
  if (typeof window !== 'undefined') {
    (window as any).setActiveTab = setActiveTab;
    (window as any).activeTab = activeTab;
    (window as any).availableTabs = tabs.map(t => t.id);
  }

  const ActiveComponent = tabs.find((t) => t.id === activeTab)?.component || MarketOverview;

  return (
    <div className="w-full space-y-8 lg:space-y-10" data-tabs-root>
      {/* Tab Navigation */}
      <div
        className="flex flex-wrap gap-2 p-2 sm:p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
        role="tablist"
        aria-label="Report sections"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`tab-trigger-${tab.id}`}
              data-tab-id={tab.id}
              aria-selected={isActive}
              aria-controls={`tab-panel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-5 py-3 sm:px-6 rounded-xl transition-all duration-300 relative overflow-hidden min-h-[44px]
                ${isActive ? 'text-white' : 'text-white/40 hover:text-white/70 hover:bg-white/5'}
              `}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Icon size={18} />
                <span className="font-semibold text-sm whitespace-nowrap">{tab.label}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          id={`tab-panel-${activeTab}`}
          role="tabpanel"
          data-tab-panel={activeTab}
          aria-labelledby={`tab-trigger-${activeTab}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          {activeTab === 'market' && <MarketOverview data={data.market_overview} />}
          {activeTab === 'audience' && <AudienceTab data={data.audience} />}
          {activeTab === 'competitive' && <CompetitiveTab data={data.competitive} />}
          {activeTab === 'performance' && <PerformanceTab data={data.performance} />}
          {activeTab === 'content' && <ContentTab data={data.content} />}
          {activeTab === 'actionable' && <ActionableTab data={data.actionable} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Tabs;
