
import React, { useState } from 'react';
import { User } from '../types';
import { LogIn, Github, ShieldCheck } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      onLogin({
        id: '1',
        name: 'Alex Dev',
        email: email || 'admin@aether.core',
        role: 'admin',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#020617] relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 rounded-full blur-[120px] animate-pulse"></div>

      <div className="w-full max-w-md px-8 py-10 glass rounded-3xl neon-glow relative z-10 mx-4">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-float">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            AETHER CORE
          </h1>
          <p className="text-slate-500 mt-2">Initialize your secure neural link</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1">Secure Email</label>
            <input
              type="email"
              placeholder="operator@aether.core"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-slate-200 transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1">Access Key</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-slate-200 transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-bold flex items-center justify-center space-x-2 transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>Initialize Login</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col space-y-4">
          <button className="w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 text-sm flex items-center justify-center space-x-2 transition-colors">
            <Github className="w-4 h-4" />
            <span>Link with GitHub</span>
          </button>
          <p className="text-center text-[10px] text-slate-600 uppercase tracking-tighter">
            Authorized Personnel Only • End-to-End Encrypted
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
