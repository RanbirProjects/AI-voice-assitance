
import React from 'react';
import { DashboardTab } from '../types';
import { LayoutDashboard, Mic, Search, Settings, LogOut, Terminal } from 'lucide-react';

interface SidebarProps {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { id: DashboardTab.OVERVIEW, icon: <LayoutDashboard size={20} />, label: 'Overview' },
    { id: DashboardTab.VOICE_INTERFACE, icon: <Mic size={20} />, label: 'Neural Link' },
    { id: DashboardTab.DATA_EXPLORER, icon: <Search size={20} />, label: 'Explorer' },
    { id: DashboardTab.SETTINGS, icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0 transition-all duration-300">
      <div className="p-8 border-b border-slate-800">
        <div className="flex items-center space-x-3 mb-1">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            <Terminal size={18} className="text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent tracking-tight">
            AETHER CORE
          </h1>
        </div>
        <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">Neural Interface</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-1.5 mt-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              activeTab === item.id
                ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <span className={`transition-transform duration-300 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
              {item.icon}
            </span>
            <span className="font-semibold text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 space-y-4">
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all group"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold text-sm">Terminate Link</span>
        </button>

        <div className="bg-slate-950/50 rounded-2xl p-4 border border-slate-800/50 backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" 
                className="w-10 h-10 rounded-full border border-slate-700 p-0.5 bg-slate-900"
                alt="Avatar"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950 animate-pulse"></div>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-200 truncate">Alex Dev</p>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
