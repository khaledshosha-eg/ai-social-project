import React from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronDown, 
  ArrowRight, 
  Search, 
  HelpCircle, 
  Bell, 
  Settings, 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  Calendar, 
  Users,
  LayoutGrid,
  Share2,
  List,
  MoreHorizontal
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-orange-500/30">
      {/* Top Notification Bar */}
      <div className="w-full bg-[#111111] border-b border-white/5 py-2.5 px-4 flex items-center justify-center gap-3 relative overflow-hidden">
        <div className="flex gap-1.5 absolute left-6">
          <div className="w-2 h-2 rounded-full bg-white/20" />
          <div className="w-2 h-2 rounded-full bg-white/20" />
          <div className="w-2 h-2 rounded-full bg-white/20" />
        </div>
        <p className="text-[13px] text-white/50 font-medium tracking-wide">
          This bar serves as a means to notify visitors of important updates.
        </p>
      </div>

      {/* Navigation */}
      <nav className="max-w-[1200px] mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-6 h-6 rounded-full border-2 border-orange-500 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
          </div>
          <span className="text-xl font-bold tracking-tight">Onyx</span>
        </div>

        <div className="hidden md:flex items-center gap-10">
          {['About', 'Pricing', 'Product'].map((item) => (
            <a key={item} href="#" className="text-[15px] text-white/60 hover:text-white transition-colors font-medium">
              {item}
            </a>
          ))}
          <div className="flex items-center gap-1.5 text-[15px] text-white/60 hover:text-white cursor-pointer transition-colors font-medium">
            Other <ChevronDown className="w-4 h-4" />
          </div>
        </div>

        <button className="bg-[#111111] hover:bg-[#161616] border border-white/10 px-5 py-2 rounded-xl text-[14px] font-semibold transition-all active:scale-95 shadow-xl">
          Contact Sales
        </button>
      </nav>

      {/* Hero Section */}
      <section className="max-w-[1000px] mx-auto px-6 pt-24 pb-20 text-center relative">
        {/* Subtle background grid/texture could go here */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-10 leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60"
        >
          Deliver an enterprise quality <br /> project in minutes.
        </motion.h1>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
        >
          <button className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 px-8 py-3.5 rounded-xl text-[15px] font-bold shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all active:scale-95">
            Get Started
          </button>
          <button className="w-full sm:w-auto bg-[#111111] hover:bg-[#161616] border border-white/10 px-8 py-3.5 rounded-xl text-[15px] font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl">
            Contact Sales <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-white/40 text-[14px] font-medium flex items-center justify-center gap-2"
        >
          No credit card required <span className="text-white/20">❖</span> Free to get started
        </motion.p>
      </section>

      {/* Dashboard Preview Section */}
      <section className="max-w-[1200px] mx-auto px-6 pb-32">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="rounded-[32px] border border-white/10 bg-[#0A0A0A] p-4 shadow-2xl shadow-black/50 overflow-hidden"
        >
          <div className="bg-[#050505] rounded-[24px] border border-white/5 flex min-h-[700px] overflow-hidden">
            {/* Dashboard Sidebar */}
            <aside className="w-64 border-r border-white/5 p-6 flex flex-col">
              <div className="flex items-center gap-2 mb-10 px-2">
                <div className="w-5 h-5 rounded-full border-2 border-orange-500 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-orange-500" />
                </div>
                <span className="text-lg font-bold tracking-tight">Blake</span>
              </div>

              <nav className="flex-1 space-y-1">
                {[
                  { icon: LayoutDashboard, label: 'Dashboard', active: true },
                  { icon: FileText, label: 'Documentation' },
                  { icon: Bell, label: 'Notification' },
                  { icon: MessageSquare, label: 'Messages' },
                  { icon: Calendar, label: 'Calendar' },
                  { icon: Users, label: 'Users' },
                ].map((item) => (
                  <button 
                    key={item.label}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                      item.active ? 'bg-white/5 text-white' : 'text-white/40 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <item.icon className={`w-[18px] h-[18px] ${item.active ? 'text-orange-500' : ''}`} />
                    <span className="text-[14px] font-semibold">{item.label}</span>
                  </button>
                ))}
              </nav>
            </aside>

            {/* Dashboard Main Content */}
            <main className="flex-1 flex flex-col">
              {/* Header */}
              <header className="h-16 border-b border-white/5 px-8 flex items-center justify-between">
                <div className="relative w-96">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input 
                    type="text" 
                    placeholder="Search"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-[13px] text-white focus:outline-none focus:ring-1 focus:ring-orange-500/50 transition-all placeholder:text-white/20"
                  />
                </div>
                <div className="flex items-center gap-5">
                  <HelpCircle className="w-5 h-5 text-white/40 hover:text-white cursor-pointer" />
                  <Bell className="w-5 h-5 text-white/40 hover:text-white cursor-pointer" />
                  <Settings className="w-5 h-5 text-white/40 hover:text-white cursor-pointer" />
                  <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/50 flex items-center justify-center text-[12px] font-bold text-orange-500 cursor-pointer">
                    BK
                  </div>
                </div>
              </header>

              {/* Page Content */}
              <div className="flex-1 p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] mb-3">
                      Projects <span className="text-white/10">/</span> Stellar <span className="text-white/10">/</span> Flow
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                        <Share2 className="w-4 h-4 text-orange-500" />
                      </div>
                      <h2 className="text-2xl font-bold">Exploration</h2>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="bg-orange-500 hover:bg-orange-400 px-5 py-2 rounded-xl text-[13px] font-bold transition-all shadow-lg shadow-orange-500/20">Edit</button>
                    <button className="bg-[#111111] hover:bg-[#161616] border border-white/10 px-5 py-2 rounded-xl text-[13px] font-bold flex items-center gap-2 transition-all">View <ArrowRight className="w-4 h-4" /></button>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-8 border-b border-white/5 mb-10">
                  {[
                    { icon: LayoutGrid, label: 'Overview' },
                    { icon: Share2, label: 'Schematic', active: true },
                    { icon: List, label: 'Logs' },
                  ].map((tab) => (
                    <div 
                      key={tab.label}
                      className={`flex items-center gap-2.5 pb-4 px-1 cursor-pointer relative transition-colors ${
                        tab.active ? 'text-white' : 'text-white/40 hover:text-white'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      <span className="text-[14px] font-semibold">{tab.label}</span>
                      {tab.active && (
                        <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Timeline Card */}
                <div className="bg-[#0F0F0F] border border-white/5 rounded-[24px] p-8 shadow-xl">
                  <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border border-orange-500/50 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                      </div>
                      <h3 className="text-[15px] font-bold">Project Timeline</h3>
                    </div>
                    <MoreHorizontal className="w-5 h-5 text-white/20 cursor-pointer" />
                  </div>

                  {/* Simplified Gantt View */}
                  <div className="space-y-8">
                    <div className="flex text-[11px] font-bold text-white/20 uppercase tracking-widest border-b border-white/5 pb-4">
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'].map(m => (
                        <div key={m} className="flex-1 text-center">{m}</div>
                      ))}
                    </div>
                    
                    <div className="relative h-48">
                      {/* Grid Lines */}
                      <div className="absolute inset-0 flex">
                        {Array.from({ length: 15 }).map((_, i) => (
                          <div key={i} className="flex-1 border-r border-white/5 h-full" />
                        ))}
                      </div>

                      {/* Timeline Bars */}
                      <div className="absolute top-4 left-[10%] right-[40%] h-12 bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center justify-between group cursor-pointer hover:bg-white/[0.08] transition-all">
                        <div className="flex flex-col">
                          <span className="text-[12px] font-bold">Design & Development</span>
                          <span className="text-[10px] text-white/40">Jan 01 to June 01</span>
                        </div>
                        <MoreHorizontal className="w-4 h-4 text-white/20 opacity-0 group-hover:opacity-100 transition-all" />
                      </div>

                      <div className="absolute top-20 left-[30%] right-[20%] h-12 bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center justify-between group cursor-pointer hover:bg-white/[0.08] transition-all">
                        <div className="flex flex-col">
                          <span className="text-[12px] font-bold">Prototyping & Testing</span>
                          <span className="text-[10px] text-white/40">Mar 01 to Aug 01</span>
                        </div>
                        <MoreHorizontal className="w-4 h-4 text-white/20 opacity-0 group-hover:opacity-100 transition-all" />
                      </div>

                      <div className="absolute top-36 left-[65%] right-[5%] h-12 bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center justify-between group cursor-pointer hover:bg-white/[0.08] transition-all">
                        <div className="flex flex-col">
                          <span className="text-[12px] font-bold">Design & Development</span>
                          <span className="text-[10px] text-white/40">Oct 01 to Mar 01</span>
                        </div>
                        <MoreHorizontal className="w-4 h-4 text-white/20 opacity-0 group-hover:opacity-100 transition-all" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default LandingPage;
