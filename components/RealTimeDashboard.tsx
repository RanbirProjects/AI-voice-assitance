
import React, { useState, useEffect, useCallback } from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { DataPoint, SystemInsight } from '../types';
import { analyzeDataStream, getStructuredInsights } from '../services/neuralService';
import { Cpu, Database, Activity, Globe, RefreshCcw, Sparkles } from 'lucide-react';

const RealTimeDashboard: React.FC = () => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [insights, setInsights] = useState<SystemInsight[]>([]);
  const [aiSummary, setAiSummary] = useState<string>("Analyzing real-time event horizon...");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const generateData = () => {
      const now = new Date();
      const newPoint: DataPoint = {
        timestamp: `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`,
        value: Math.floor(Math.random() * 100),
        cpu: 30 + Math.random() * 40,
        memory: 50 + Math.random() * 30,
        latency: 5 + Math.random() * 50
      };
      setData(prev => [...prev.slice(-14), newPoint]);
    };

    const interval = setInterval(generateData, 2000);
    return () => clearInterval(interval);
  }, []);

  const runAnalysis = useCallback(async () => {
    if (data.length === 0) return;
    setIsAnalyzing(true);
    try {
      const summary = await analyzeDataStream(data);
      const newInsights = await getStructuredInsights(data);
      setAiSummary(summary);
      setInsights(newInsights.map((ins: any, idx: number) => ({
        ...ins,
        id: `${Date.now()}-${idx}`,
        timestamp: new Date()
      })));
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  }, [data]);

  useEffect(() => {
    const analysisInterval = setInterval(runAnalysis, 20000);
    return () => clearInterval(analysisInterval);
  }, [runAnalysis]);

  return (
    <div className="space-y-8 pb-12">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Compute Unit', value: `${data[data.length-1]?.cpu.toFixed(1) || 0}%`, icon: <Cpu className="text-blue-400" size={20} />, color: 'bg-blue-500' },
          { label: 'Neural Memory', value: `${data[data.length-1]?.memory.toFixed(1) || 0}%`, icon: <Database className="text-emerald-400" size={20} />, color: 'bg-emerald-500' },
          { label: 'Signal Latency', value: `${data[data.length-1]?.latency.toFixed(0) || 0}ms`, icon: <Activity className="text-amber-400" size={20} />, color: 'bg-amber-500' },
          { label: 'Global Traffic', value: `${data[data.length-1]?.value || 0}`, icon: <Globe className="text-rose-400" size={20} />, color: 'bg-rose-500' },
        ].map((stat, i) => (
          <div key={i} className="glass p-6 rounded-3xl group hover:border-slate-700 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Real-time</span>
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-3xl font-black text-white mt-1 tabular-nums tracking-tighter">{stat.value}</h3>
            <div className="mt-4 h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
               <div className={`h-full ${stat.color} transition-all duration-1000 ease-out`} style={{ width: `${parseFloat(stat.value) || 0}%` }}></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Visual Stream */}
        <div className="lg:col-span-8 glass rounded-[32px] p-8">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center">
                Performance Telemetry
              </h2>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">Neural Load Analysis Stream</p>
            </div>
            <div className="flex p-1 bg-slate-900 rounded-xl border border-slate-800">
              <button className="px-4 py-1.5 text-xs font-bold text-blue-400 bg-blue-500/10 rounded-lg">Live</button>
              <button className="px-4 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-300 transition-colors">History</button>
            </div>
          </div>
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorMain" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.3} />
                <XAxis dataKey="timestamp" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', color: '#f8fafc', padding: '12px' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="cpu" stroke="#3b82f6" fillOpacity={1} fill="url(#colorMain)" strokeWidth={3} animationDuration={1000} />
                <Area type="monotone" dataKey="memory" stroke="#10b981" fillOpacity={0} strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Insight Engine */}
        <div className="lg:col-span-4 flex flex-col space-y-6">
          <div className="glass rounded-[32px] p-8 flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-8">
               <h2 className="text-xl font-bold text-white flex items-center">
                 <Sparkles className="mr-2 text-blue-400" size={20} />
                 Neural Insights
               </h2>
               <button 
                 onClick={runAnalysis}
                 disabled={isAnalyzing}
                 className={`p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-all ${isAnalyzing ? 'animate-spin' : 'hover:scale-110'}`}
               >
                 <RefreshCcw size={16} className="text-slate-400" />
               </button>
            </div>
            
            <div className="space-y-4 overflow-y-auto pr-2 custom-scroll">
              <div className="bg-blue-600/10 border border-blue-500/20 rounded-2xl p-5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Activity size={40} className="text-blue-500" />
                </div>
                <p className="text-[10px] font-black text-blue-400 mb-2 uppercase tracking-[0.2em]">SRE Summary</p>
                <p className="text-sm text-slate-300 italic leading-relaxed font-medium">
                  "{aiSummary}"
                </p>
              </div>

              {insights.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-600 border border-dashed border-slate-800 rounded-3xl">
                   <p className="text-xs font-bold uppercase tracking-widest animate-pulse">Scanning Data Streams...</p>
                </div>
              ) : insights.map((insight) => (
                <div key={insight.id} className="p-5 bg-slate-950/40 border border-slate-800/50 rounded-2xl hover:border-slate-700 transition-all group">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                      insight.severity === 'high' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      {insight.type}
                    </span>
                    <span className="text-[10px] font-bold text-slate-600 uppercase">Just Now</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-100 mb-2 group-hover:text-blue-400 transition-colors">{insight.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">{insight.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeDashboard;
