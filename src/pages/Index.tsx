import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Zap, 
  Target, 
  BarChart3, 
  Users, 
  Sparkles,
  Search,
  Globe,
  Brain,
  Activity
} from 'lucide-react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleEmailSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && email.trim()) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white overflow-hidden">
      {/* Animated Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-800/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-700/10 rounded-full blur-3xl"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl px-8 py-4 shadow-2xl">
            <div className="flex items-center justify-between">
              {/* Logo and Contact Us */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-lg shadow-blue-500/50">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                    Ai Social Project
                  </span>
                </div>
                
                {/* Contact Us Button */}
                <button className="hidden md:block px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-sm font-semibold transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105">
                  Contact Us
                </button>
              </div>

              {/* Nav Links */}
              <div className="hidden md:flex items-center gap-4">
                <a href="#home" className="backdrop-blur-md bg-white/5 border border-white/10 px-5 py-2.5 rounded-xl text-base font-medium text-white/90 hover:text-blue-400 hover:bg-white/10 transition-all duration-300">
                  Home
                </a>
                <a href="#about" className="backdrop-blur-md bg-white/5 border border-white/10 px-5 py-2.5 rounded-xl text-base font-medium text-white/70 hover:text-blue-400 hover:bg-white/10 transition-all duration-300">
                  What is Ai Social Project?
                </a>
                <a href="#who" className="backdrop-blur-md bg-white/5 border border-white/10 px-5 py-2.5 rounded-xl text-base font-medium text-white/70 hover:text-blue-400 hover:bg-white/10 transition-all duration-300">
                  About Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 pt-20 pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-5xl mx-auto">
            {/* Main Heading */}
            <h1 className="font-['Poppins'] text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="block bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent drop-shadow-2xl">
                Accelerate Your Business
              </span>
              <span className="block bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent drop-shadow-2xl">
                Intelligence
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-gray-400 text-sm md:text-base font-light max-w-2xl mx-auto mb-12 leading-relaxed">
              immerse yourself in an elegant blend of professionalism and innovation<br />
              let's make your business stronger
            </p>

            {/* Floating Icons Grid - Moved Here */}
            <div className="relative mb-16">
              <div className="flex items-center justify-center gap-6 md:gap-12">
                {/* Icon 1 */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5 shadow-2xl hover:scale-110 hover:shadow-blue-500/30 transition-all duration-300">
                  <TrendingUp className="w-7 h-7 text-blue-400" />
                </div>

                {/* Icon 2 */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5 shadow-2xl hover:scale-110 hover:shadow-blue-500/30 transition-all duration-300">
                  <Target className="w-7 h-7 text-blue-400" />
                </div>

                {/* Central Glowing Icon - BIGGER */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full blur-3xl opacity-60 animate-pulse"></div>
                  <div className="relative backdrop-blur-xl bg-gradient-to-br from-blue-600/40 to-blue-800/40 border border-blue-400/50 rounded-full p-14 shadow-2xl shadow-blue-500/50">
                    <Brain className="w-16 h-16 text-white drop-shadow-2xl" />
                  </div>
                </div>

                {/* Icon 3 */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5 shadow-2xl hover:scale-110 hover:shadow-blue-500/30 transition-all duration-300">
                  <Zap className="w-7 h-7 text-blue-400" />
                </div>

                {/* Icon 4 */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5 shadow-2xl hover:scale-110 hover:shadow-blue-500/30 transition-all duration-300">
                  <Globe className="w-7 h-7 text-blue-400" />
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="flex flex-col items-center gap-6 max-w-lg mx-auto">
              {/* Get Started Label */}
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600/20 to-blue-800/20 backdrop-blur-sm border border-blue-500/30 shadow-lg shadow-blue-500/20">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <span className="text-white font-semibold text-lg">Get Started</span>
              </div>

              {/* Email Input Bar - WHITE SOLID with SEARCH ICON */}
              <div className="w-full relative flex items-center gap-3">
                <div className="flex-1 relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={handleEmailSubmit}
                    placeholder="Enter your email address..."
                    className="w-full px-6 py-4 bg-white text-gray-800 placeholder-gray-400 outline-none rounded-full font-medium shadow-2xl focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  />
                </div>
                
                {/* Search Icon - Outside on the right */}
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-full p-4 shadow-xl hover:bg-white/20 cursor-pointer transition-all duration-300 group">
                  <Search className="w-6 h-6 text-gray-400 group-hover:text-blue-400 transition-colors duration-300" />
                </div>
              </div>

              <div className="text-center mt-2">
                <p className="text-xs text-gray-500">
                  Press Enter to go to Dashboard
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-['Poppins'] text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Ai Social Project Ecosystem
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Integrated smart tools for analyzing and managing social media with high efficiency
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Growth Card */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl hover:border-blue-500/50 transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600/30 to-blue-800/30 border border-blue-500/30">
                  <BarChart3 className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  Growth
                </h3>
              </div>
              
              {/* Bar Chart Visualization */}
              <div className="flex items-end justify-between gap-2 h-32 mb-4">
                {[40, 60, 35, 80, 55, 90, 70, 45, 85, 100, 65, 75].map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-300 group-hover:from-blue-500 group-hover:to-blue-300"
                    style={{ height: `${height}%` }}
                  ></div>
                ))}
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500 mb-6">
                <span>Nov. 10</span>
                <span>Nov. 11</span>
                <span>Today</span>
              </div>

              <div className="border-t border-white/10 pt-6">
                <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  4,598,807
                </div>
                <p className="text-sm text-gray-400">
                  Active engagements across social media platforms
                </p>
              </div>
            </div>

            {/* Analytics Card */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl hover:border-blue-500/50 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600/30 to-blue-800/30 border border-blue-500/30">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                    AI Agents
                  </h3>
                </div>
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-slate-900 bg-gradient-to-br from-blue-600 to-blue-800"
                    ></div>
                  ))}
                </div>
              </div>

              <p className="text-sm text-gray-400 mb-6">
                Over 60 types of specialized AI agents for content and audience analysis
              </p>

              {/* Analytics Wave */}
              <div className="relative h-40 mb-6 bg-gradient-to-b from-transparent via-blue-950/20 to-transparent rounded-xl overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 400 160">
                  <path
                    d="M0,80 Q50,40 100,60 T200,100 T300,60 T400,80"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="3"
                    className="drop-shadow-lg"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="50%" stopColor="#60a5fa" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className="flex items-end justify-between border-t border-white/10 pt-6">
                <div>
                  <div className="text-4xl font-bold mb-1 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                    4,762
                  </div>
                  <p className="text-xs text-gray-500">Active analyses</p>
                </div>
                <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-500/30">
                  +1.08%
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-5xl mx-auto">
            {[
              { icon: Target, title: 'High Accuracy', desc: 'Advanced analysis with up to 98% precision' },
              { icon: Zap, title: 'Lightning Fast', desc: 'Real-time data processing and insights' },
              { icon: Users, title: 'Seamless Collaboration', desc: 'Share results with your team effortlessly' }
            ].map((feature, i) => (
              <div
                key={i}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl hover:border-blue-500/50 hover:scale-105 transition-all duration-300 text-center group"
              >
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-blue-600/30 to-blue-800/30 border border-blue-500/30 mb-4 group-hover:shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300">
                  <feature.icon className="w-8 h-8 text-blue-400" />
                </div>
                <h4 className="text-lg font-bold mb-2 text-white">{feature.title}</h4>
                <p className="text-sm text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Glow Effect */}
      <div className="relative z-10 h-1 bg-gradient-to-r from-transparent via-blue-600 to-transparent opacity-50"></div>
    </div>
  );
};

export default HomePage;