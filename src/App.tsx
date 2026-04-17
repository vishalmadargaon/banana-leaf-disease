/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Leaf, 
  LayoutDashboard, 
  History as HistoryIcon, 
  Settings as SettingsIcon, 
  Activity, 
  ShieldCheck, 
  Thermometer, 
  Droplets, 
  CircleAlert, 
  CloudRain,
  ShieldAlert,
  Moon,
  Sun,
  User,
  Bell,
  Search,
  ChevronRight,
  TrendingUp,
  MapPin,
  Upload,
  FileText
} from 'lucide-react';

type View = 'dashboard' | 'analysis' | 'history' | 'settings';
type Theme = 'dark' | 'light';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('analysis');
  const [theme, setTheme] = useState<Theme>('dark');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState<{ label: string; confidence: number } | null>(null);
  const [specimenImage, setSpecimenImage] = useState<string>("https://images.unsplash.com/photo-1528543010705-e7e75169b717?auto=format&fit=crop&q=80&w=800");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSpecimenImage(url);
      setPrediction(null); // Reset prediction when new image uploaded
    }
  };

  const handleDiagnose = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setPrediction(null);
    
    // Simulate Neural Diagnostic
    setTimeout(() => {
      setIsAnalyzing(false);
      const results = [
        { label: 'Sigatoka (Yellow)', confidence: 92 },
        { label: 'Panama Disease', confidence: 95 },
        { label: 'Black Sigatoka', confidence: 89 },
        { label: 'Healthy Tissue', confidence: 98 }
      ];
      setPrediction(results[Math.floor(Math.random() * results.length)]);
    }, 2000);
  };

  const dashboardStats = [
    { label: 'Active Fields', value: '12', change: '+2', icon: <MapPin size={16}/> },
    { label: 'Avg Health', value: '84%', change: '+5%', icon: <Activity size={16}/> },
    { label: 'Yield Est.', value: '2.4t', change: '-0.2t', icon: <TrendingUp size={16}/> },
  ];

  return (
    <div className={`flex h-screen font-sans overflow-hidden transition-colors duration-500 ${
      theme === 'dark' ? 'bg-[#0A140F] text-white selection:bg-[#A7FF83]/30' : 'bg-[#F9FAF9] text-[#0A140F] selection:bg-[#10B981]/20'
    }`}>
      {/* ATMOSPHERE LAYERS */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className={`absolute inset-0 transition-opacity duration-1000 ${
          theme === 'dark' 
            ? 'bg-[radial-gradient(circle_at_20%_20%,rgba(167,255,131,0.08)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(16,185,129,0.08)_0%,transparent_50%)] opacity-100' 
            : 'bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.05)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(167,255,131,0.05)_0%,transparent_50%)] opacity-100'
        }`}></div>
        <div className={`absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/p6.png')] opacity-[0.03] contrast-150`}></div>
      </div>

      {/* PERSISTENT SIDEBAR */}
      <aside className={`relative z-20 w-72 backdrop-blur-3xl border-r flex flex-col pt-10 pb-6 shrink-0 transition-all duration-500 ${
        theme === 'dark' ? 'bg-black/40 border-white/5' : 'bg-white/70 border-black/5 shadow-xl'
      }`}>
        <div className="px-8 mb-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all ${
              theme === 'dark' ? 'bg-[#A7FF83] shadow-[#A7FF83]/20' : 'bg-[#10B981] shadow-[#10B981]/20'
            }`}>
              <Leaf size={22} className={theme === 'dark' ? 'text-[#0A140F]' : 'text-white'} strokeWidth={3} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter leading-none">MUSACARE</h1>
              <p className={`text-[8px] uppercase tracking-[0.3em] font-bold mt-1 ${
                theme === 'dark' ? 'text-[#A7FF83]/60' : 'text-[#10B981]'
              }`}>Agri-Engine v4.0</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {[
            { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
            { id: 'analysis', icon: <Leaf size={20} />, label: 'Plant Analysis' },
            { id: 'history', icon: <HistoryIcon size={20} />, label: 'History' },
            { id: 'settings', icon: <SettingsIcon size={20} />, label: 'Settings' },
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => setCurrentView(item.id as View)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group relative overflow-hidden ${
                currentView === item.id 
                  ? (theme === 'dark' ? 'bg-[#A7FF83]/10 text-[#A7FF83] border border-[#A7FF83]/20 shadow-inner' : 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20')
                  : (theme === 'dark' ? 'text-white/40 hover:text-white hover:bg-white/5' : 'text-[#000]/40 hover:text-[#000] hover:bg-black/5')
              }`}
            >
              <span className={`transition-transform duration-300 ${currentView === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                {item.icon}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest">{item.label}</span>
              {currentView === item.id && (
                <motion.div layoutId="nav-glow" className={`absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-8 rounded-full blur-xl ${
                  theme === 'dark' ? 'bg-[#A7FF83]' : 'bg-[#10B981]'
                }`} />
              )}
            </button>
          ))}
        </nav>

        <div className="px-6 mt-auto">
          <div className={`p-4 rounded-3xl border transition-all duration-500 flex items-center gap-4 ${
            theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-black/5 border-black/5'
          }`}>
             <div className={`w-10 h-10 rounded-full border flex items-center justify-center font-black text-xs transition-colors shrink-0 ${
              theme === 'dark' ? 'bg-[#A7FF83]/20 border-[#A7FF83]/30 text-[#A7FF83]' : 'bg-[#10B981]/20 border-[#10B981]/30 text-[#10B981]'
            }`}>VM</div>
            <div className="min-w-0">
              <p className="text-[10px] font-black tracking-tight truncate">Vishal Madargaon</p>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
                <p className="text-[8px] uppercase tracking-widest opacity-40">Active Node</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <main className="relative z-10 flex-1 flex flex-col min-w-0">
        {/* HEADER */}
        <header className={`sticky top-0 z-30 px-12 py-8 border-b backdrop-blur-md flex justify-between items-center transition-all duration-500 ${
          theme === 'dark' ? 'border-white/5 bg-[#0A140F]/50' : 'border-black/5 bg-white/50 shadow-sm'
        }`}>
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <h2 className="text-xl font-black uppercase tracking-widest mb-1 flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full shadow-[0_0_10px_currentColor] ${
                    theme === 'dark' ? 'text-[#A7FF83]' : 'text-[#10B981]'
                  } bg-current`}></span>
                  {currentView === 'dashboard' ? 'Network Matrix' : 
                   currentView === 'analysis' ? 'Foliage Diagnostic' :
                   currentView === 'history' ? 'Node Archives' : 'System Config'}
                </h2>
                <p className="text-[10px] uppercase tracking-[0.4em] opacity-40 font-medium lowercase">
                  MusaCare . sys . {currentView}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
          
          <div className="flex items-center gap-4">
            {/* THEME TOGGLE */}
            <button 
              onClick={toggleTheme}
              className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all hover:scale-105 active:scale-95 ${
                theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-black/5 border-black/10 hover:bg-black/10'
              }`}
            >
              {theme === 'dark' ? <Sun size={18} className="text-[#A7FF83]" /> : <Moon size={18} className="text-[#10B981]" />}
            </button>
            <div className={`h-10 px-4 rounded-xl border flex items-center gap-3 transition-all ${
              theme === 'dark' ? 'bg-[#A7FF83]/5 border-[#A7FF83]/20 text-[#A7FF83]' : 'bg-[#10B981]/5 border-[#10B981]/20 text-[#10B981]'
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
              <span className="text-[10px] uppercase font-bold tracking-widest">4ms Latency</span>
            </div>
          </div>
        </header>

        {/* CONTENT AREA */}
        <section className={`flex-1 overflow-y-auto custom-scrollbar p-12 transition-colors duration-500`}>
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              {currentView === 'dashboard' && (
                <motion.div 
                  key="dashboard"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-12"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {dashboardStats.map((stat, i) => (
                      <div key={i} className={`p-8 rounded-[2.5rem] border transition-all duration-500 hover:scale-[1.02] ${
                        theme === 'dark' ? 'bg-white/5 border-white/5 hover:border-[#A7FF83]/30' : 'bg-white border-black/5 shadow-xl hover:border-[#10B981]/30'
                      }`}>
                        <div className="flex justify-between items-start mb-6">
                          <div className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-[#A7FF83]/10 text-[#A7FF83]' : 'bg-[#10B981]/10 text-[#10B981]'}`}>
                            {stat.icon}
                          </div>
                          <span className={`${stat.change.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'} text-[10px] font-black font-mono`}>{stat.change}</span>
                        </div>
                        <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold mb-1">{stat.label}</p>
                        <h3 className="text-4xl font-black tracking-tighter">{stat.value}</h3>
                      </div>
                    ))}
                  </div>
                  
                  <div className={`p-10 rounded-[3rem] border ${
                    theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-white shadow-xl border-black/5'
                  }`}>
                    <h3 className="text-xl font-black uppercase tracking-tight mb-8">Yield Distribution Projections</h3>
                    <div className="h-64 flex items-end gap-4 px-4 overflow-hidden">
                      {[65, 84, 45, 92, 77, 88, 55, 98, 72, 81, 63, 89].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                          <div className={`w-full rounded-t-2xl transition-all duration-1000 group-hover:opacity-100 ${
                            theme === 'dark' ? 'bg-[#A7FF83]/20 opacity-40 group-hover:bg-[#A7FF83]' : 'bg-[#10B981]/20 opacity-40 group-hover:bg-[#10B981]'
                          }`} style={{ height: `${h}%` }}></div>
                          <span className="text-[8px] font-bold opacity-30 group-hover:opacity-100 uppercase tracking-tighter">Apr-{i+1}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {currentView === 'analysis' && (
                <motion.div 
                   key="analysis"
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -20 }}
                   className="grid lg:grid-cols-[1fr_1.5fr] gap-12"
                >
                  {/* SPECIMEN DISPLAY */}
                  <div className="space-y-8">
                    <div className={`relative aspect-[4/5] rounded-[2.5rem] overflow-hidden border p-2 transition-all duration-500 ${
                      theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white shadow-2xl border-black/5'
                    }`}>
                      <div className="relative h-full rounded-[2rem] overflow-hidden group">
                        <img 
                          src={specimenImage}
                          alt="Banana Leaf Specimen"
                          className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:rotate-2"
                        />
                         <div className={`absolute inset-0 transition-opacity duration-700 ${
                          theme === 'dark' ? 'bg-gradient-to-t from-[#0A140F] to-transparent opacity-80' : 'bg-gradient-to-t from-[#000]/20 to-transparent'
                        }`}></div>
                        
                        {/* UPLOAD OVERLAY */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px] z-20">
                          <button 
                            onClick={() => fileInputRef.current?.click()}
                            className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 transition-all transform hover:scale-105 active:scale-95 ${
                              theme === 'dark' ? 'bg-[#A7FF83] text-[#0A140F]' : 'bg-[#10B981] text-white'
                            }`}
                          >
                            <Upload size={16} />
                            Replace Specimen
                          </button>
                        </div>
                        
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          onChange={handleImageUpload} 
                          className="hidden" 
                          accept="image/*"
                        />
                        
                        {/* THE SCANNER */}
                        <div className={`absolute left-0 right-0 h-1 z-10 blur-[1px] shadow-[0_0_20px_white] ${isAnalyzing ? 'animate-scan' : 'hidden'} ${
                          theme === 'dark' ? 'bg-white' : 'bg-[#10B981]'
                        }`}></div>

                        <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none">
                          <div className={`w-fit px-3 py-1 rounded-full border border-white/20 backdrop-blur-md text-[8px] font-black tracking-[0.2em] flex items-center gap-2 text-white`}>
                            <span className="w-1 h-1 rounded-full bg-red-500 animate-ping"></span>
                            LIVE SPECTRAL FEED
                          </div>
                          <div className="text-white">
                            <h4 className="text-[10px] uppercase tracking-widest font-black opacity-60 mb-2">Subject Index</h4>
                            <p className="text-2xl font-black uppercase tracking-tighter">MUSA-SPEC-204</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className={`w-full py-4 rounded-2xl border flex items-center justify-center gap-3 text-[10px] uppercase font-black tracking-[0.2em] transition-all hover:bg-white/5 active:scale-[0.98] ${
                        theme === 'dark' ? 'bg-white/5 border-white/10 text-[#A7FF83]' : 'bg-black/5 border-black/10 text-[#10B981]'
                      }`}
                    >
                      <Upload size={14} />
                      Add New Leaf Specimen
                    </button>

                    {prediction && (
                      <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={`p-10 rounded-[2.5rem] border-l-[6px] border ${
                          theme === 'dark' 
                            ? 'bg-white/5 border-white/5 border-l-[#A7FF83] shadow-[x-20px_40px_rgba(0,0,0,0.4)]' 
                            : 'bg-white border-black/5 border-l-[#10B981] shadow-2xl'
                        }`}
                      >
                         <div className="flex justify-between items-center">
                            <div>
                              <p className="text-[10px] uppercase tracking-[0.4em] opacity-40 font-bold mb-2">Neural Analysis Result</p>
                              <h3 className="text-3xl font-black tracking-tight uppercase leading-none">{prediction.label}</h3>
                            </div>
                            <div className="relative w-20 h-20 flex items-center justify-center">
                              <svg className="w-full h-full -rotate-90">
                                <circle cx="40" cy="40" r="34" className={theme === 'dark' ? 'stroke-white/5' : 'stroke-black/5'} strokeWidth="6" fill="transparent" />
                                <circle 
                                  cx="40" cy="40" r="34" 
                                  className={theme === 'dark' ? 'stroke-[#A7FF83]' : 'stroke-[#10B981]'}
                                  strokeWidth="6" fill="transparent"
                                  strokeDasharray="213.6" 
                                  strokeDashoffset={213.6 - (213.6 * prediction.confidence / 100)}
                                  strokeLinecap="round"
                                />
                              </svg>
                              <span className="absolute text-[10px] font-black">{prediction.confidence}%</span>
                            </div>
                         </div>
                      </motion.div>
                    )}
                  </div>

                  {/* ANALYSIS CONTROLS */}
                  <div className="space-y-8">
                    <form onSubmit={handleDiagnose} className="space-y-8">
                       <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[
                          { label: 'Length', icon: <ChevronRight size={14}/>, val: '280cm' },
                          { label: 'Width', icon: <ChevronRight size={14}/>, val: '92cm' },
                          { label: 'Moisture', icon: <Droplets size={14}/>, val: '64%' },
                          { label: 'Temp', icon: <Thermometer size={14}/>, val: '31°' },
                          { label: 'pH Level', icon: <Activity size={14}/>, val: '6.2' },
                          { label: 'Age', icon: <HistoryIcon size={14}/>, val: '14w' },
                        ].map((p, i) => (
                          <div key={i} className={`p-6 rounded-3xl border transition-all duration-300 group hover:translate-y-[-4px] ${
                            theme === 'dark' ? 'bg-white/5 border-white/5 hover:border-[#A7FF83]/40' : 'bg-white border-black/5 shadow-lg hover:border-[#10B981]/40'
                          }`}>
                            <div className="flex items-center gap-3 mb-3 opacity-40 group-hover:opacity-100 transition-opacity">
                              <span className={theme === 'dark' ? 'text-[#A7FF83]' : 'text-[#10B981]'}>{p.icon}</span>
                              <span className="text-[10px] uppercase font-bold tracking-[0.2em]">{p.label}</span>
                            </div>
                            <input readOnly placeholder={p.val} className={`bg-transparent border-none outline-none w-full font-black text-xs ${theme === 'dark' ? 'placeholder:text-white' : 'placeholder:text-black'}`} />
                          </div>
                        ))}
                      </div>

                      <button 
                        disabled={isAnalyzing}
                        className={`w-full py-6 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.4em] transition-all shadow-xl flex items-center justify-center gap-4 ${
                          isAnalyzing ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.01] active:scale-95'
                        } ${theme === 'dark' ? 'bg-[#A7FF83] text-[#0A140F]' : 'bg-[#10B981] text-white'}`}
                      >
                        {isAnalyzing ? (
                          <><span>Executing Model...</span><Activity className="animate-spin" size={16}/></>
                        ) : 'Initiate Neural Analysis'}
                      </button>
                    </form>

                    {prediction && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`p-10 rounded-[3rem] border ${
                          theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-white shadow-xl border-black/5'
                        }`}
                      >
                        <h4 className="text-[10px] uppercase tracking-[0.4em] opacity-40 font-black mb-8 underline underline-offset-8">Clinical Response protocol</h4>
                        <div className="space-y-6">
                           {[
                             { h: 'Immediate Isolation', d: 'Flag current segment (Zone-C) to prevent airborne transmission.' },
                             { h: 'Pathogen Neutralizer', d: 'Apply propiconazole based fungicide at dawn for maximum absorption.' },
                             { h: 'Soil Modification', d: 'Integrate calcium-rich nutrients to bolster structural integrity.' },
                           ].map((step, i) => (
                             <div key={i} className="flex gap-6 group">
                               <span className={`text-xl font-black opacity-10 group-hover:opacity-100 transition-opacity ${theme === 'dark' ? 'text-[#A7FF83]' : 'text-[#10B981]'}`}>0{i+1}</span>
                               <div className="flex-1">
                                 <h5 className="text-[11px] font-black uppercase tracking-tight mb-1">{step.h}</h5>
                                 <p className="text-[11px] opacity-40 leading-relaxed font-medium">{step.d}</p>
                               </div>
                             </div>
                           ))}
                        </div>
                        
                        <div className={`mt-10 pt-10 border-t flex items-center justify-between ${theme === 'dark' ? 'border-white/5' : 'border-black/5'}`}>
                           <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest opacity-40">
                             <FileText size={16} />
                             Full Analysis Report Generated
                           </div>
                           <button className={`text-[10px] font-black uppercase tracking-widest transition-colors ${theme === 'dark' ? 'text-[#A7FF83] hover:text-white' : 'text-[#10B981] hover:text-black'}`}>
                             Download PDF
                           </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}

              {currentView === 'history' && (
                <motion.div 
                   key="history"
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -20 }}
                   className="space-y-6"
                >
                  {[
                    { node: 'SPEC-204', label: 'Sigatoka', date: 'Oct 24, 2025', conf: '92%' },
                    { node: 'SPEC-198', label: 'Healthy', date: 'Oct 22, 2025', conf: '99%' },
                    { node: 'SPEC-185', label: 'Cordana', date: 'Oct 20, 2025', conf: '88%' },
                    { node: 'SPEC-172', label: 'Panama', date: 'Oct 15, 2025', conf: '95%' },
                  ].map((entry, i) => (
                    <div key={i} className={`p-8 rounded-[2rem] border group transition-all duration-300 hover:translate-x-4 flex items-center justify-between ${
                      theme === 'dark' ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-white border-black/5 shadow-lg hover:bg-black/5'
                    }`}>
                      <div className="flex items-center gap-8">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black ${
                          entry.label === 'Healthy' 
                            ? (theme === 'dark' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-emerald-500 text-white')
                            : (theme === 'dark' ? 'bg-amber-500/10 text-amber-500' : 'bg-amber-500 text-white')
                        }`}>
                          {entry.label[0]}
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold">{entry.node}</p>
                          <h3 className="text-xl font-bold">{entry.label}</h3>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-12">
                        <div className="text-right">
                          <p className="text-[10px] uppercase font-bold opacity-40">{entry.date}</p>
                          <p className={`text-xs font-black ${theme === 'dark' ? 'text-[#A7FF83]' : 'text-[#10B981]'}`}>{entry.conf} Conf.</p>
                        </div>
                        <ChevronRight className="opacity-20 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {currentView === 'settings' && (
                <motion.div 
                   key="settings"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   exit={{ opacity: 0 }}
                   className="max-w-2xl space-y-8"
                >
                  <div className={`p-10 rounded-[3rem] border ${
                    theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-white shadow-xl border-black/5'
                  }`}>
                    <h3 className="text-xl font-black uppercase mb-8">System Configuration</h3>
                    <div className="space-y-6">
                       {[
                         { l: 'Neural Sensitivity', v: 'High (0.8)' },
                         { l: 'spectral sampling', v: '4K Multi-Band' },
                         { l: 'auto-Response protocols', v: 'Active' },
                         { l: 'Cloud Link node', v: 'Primary Edge-4' },
                       ].map((s, i) => (
                        <div key={i} className="flex justify-between items-center py-4 border-b border-white/5 border-black/5">
                           <span className="text-[10px] uppercase tracking-widest opacity-40 font-bold">{s.l}</span>
                           <span className="text-xs font-black">{s.v}</span>
                        </div>
                       ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>

      <style>{`
        @keyframes scan {
          0% { top: -10%; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { top: 110%; opacity: 0; }
        }
        .animate-scan {
          animation: scan 4s linear infinite;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: currentColor; opacity: 0.1; border-radius: 10px; }
      `}</style>
    </div>
  );
}
