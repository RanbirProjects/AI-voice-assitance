
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import RealTimeDashboard from './components/RealTimeDashboard';
import LiveAssistant from './components/LiveAssistant';
import Login from './components/Login';
import { DashboardTab, User } from './types';
import { Bell, Search, Zap } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>(DashboardTab.OVERVIEW);
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('aether_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setTimeout(() => setIsInitializing(false), 800);
  }, []);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('aether_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('aether_user');
  };

  if (isInitializing) {
    return (
      <div className="h-screen w-full bg-[#020617] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-xs">Syncing Neural Link</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case DashboardTab.OVERVIEW:
        return <RealTimeDashboard />;
      case DashboardTab.VOICE_INTERFACE:
        return <LiveAssistant />;
      case DashboardTab.DATA_EXPLORER:
        return (
          <div className="flex flex-col items-center justify-center h-[600px] text-slate-500 space-y-6">
             <div className="w-24 h-24 bg-slate-900 rounded-3xl flex items-center justify-center border border-slate-800 shadow-2xl animate-float">
                <Search size={40} className="text-blue-500" />
             </div>
             <div className="text-center">
               <h3 className="text-2xl font-bold text-slate-100">Neural Data Explorer</h3>
               <p className="max-w-md text-slate-500 mt-2">Deep packet inspection and vector database search capabilities are currently optimizing. Use the Neural Link to query the raw stream.</p>
             </div>
             <button className="px-8 py-3 bg-blue-600/10 text-blue-400 font-bold rounded-xl border border-blue-500/20 hover:bg-blue-600/20 transition-all active:scale-95">
               Initialize Cluster Map
             </button>
          </div>
        );
      case DashboardTab.SETTINGS:
        return (
          <div className="max-w-3xl mx-auto space-y-6">
             <div className="p-8 glass rounded-3xl border border-slate-800/50">
               <h2 className="text-xl font-bold mb-8 flex items-center">
                 <Zap className="mr-2 text-amber-400" size={20} />
                 System Configuration
               </h2>
               <div className="space-y-4">
                  {[
                    { name: 'Neural Context', desc: 'v2.5 Flash Native Interface', status: 'Optimal', color: 'text-emerald-400' },
                    { name: 'Real-time Telemetry', desc: 'Distributed WebSocket Mesh', status: 'Connected', color: 'text-blue-400' },
                    { name: 'Architecture Sink', desc: 'Serverless Aggregation Pipeline', status: 'Standby', color: 'text-slate-500' },
                  ].map((config, i) => (
                    <div key={i} className="flex items-center justify-between p-5 bg-slate-950/80 rounded-2xl border border-slate-800/50 hover:border-blue-500/30 transition-all cursor-pointer group">
                      <div>
                        <p className="font-bold text-slate-200 group-hover:text-blue-400 transition-colors">{config.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{config.desc}</p>
                      </div>
                      <div className={`px-3 py-1 bg-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest ${config.color}`}>
                        {config.status}
                      </div>
                    </div>
                  ))}
               </div>
             </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      
      <main className="flex-1 overflow-y-auto px-10 py-8 relative">
        <header className="flex justify-between items-center mb-12">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-white capitalize tracking-tight flex items-center">
              {activeTab.replace('_', ' ')}
            </h2>
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest">Link Active • Region: US-EAST-1</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
             <div className="flex items-center bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2 text-slate-400">
                <Search size={16} className="mr-3" />
                <input type="text" placeholder="Quick search..." className="bg-transparent text-sm focus:outline-none w-48" />
             </div>
             
             <div className="flex items-center space-x-3">
                <button className="relative p-2.5 text-slate-400 hover:text-white bg-slate-900 rounded-xl border border-slate-800 transition-all hover:scale-105 active:scale-95">
                  <Bell size={18} />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-900"></span>
                </button>
             </div>
          </div>
        </header>

        <div className="animate-in fade-in duration-700">
          {renderContent()}
        </div>

        {/* Status Indicator */}
        <div className="fixed bottom-8 right-8 pointer-events-none">
          <div className="glass px-6 py-3 rounded-2xl shadow-2xl flex items-center space-x-4 border border-blue-500/20 animate-in slide-in-from-bottom duration-1000">
             <div className="flex items-center space-x-2">
               <div className="relative">
                 <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                 <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping"></div>
               </div>
               <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Neural Link Stable</span>
             </div>
             <div className="h-4 w-[1px] bg-slate-800"></div>
             <span className="text-[10px] text-slate-500 font-bold">L: 0.12ms</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
