import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, User, ArrowLeft, Key } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToApp: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onBackToApp,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === 'Nehemiah Masih' && password === 'AndroidNK@07') {
      setError('');
      onLoginSuccess();
    } else {
      setError('Invalid admin credentials.');
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-5 bg-gradient-to-b from-slate-900 via-blue-950 to-slate-950 text-white relative overflow-y-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={onBackToApp}
          className="p-2 rounded-2xl bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> App Home
        </button>

        <span className="text-[11px] font-mono text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/30 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" /> Secure Admin Portal
        </span>
      </div>

      {/* Main Login Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="my-auto py-6 flex flex-col gap-5 w-full max-w-sm mx-auto"
      >
        <div className="text-center flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-xl shadow-amber-500/20 flex items-center justify-center my-1">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-amber-400" />
            </div>
          </div>

          <h1 className="text-2xl font-bold font-serif text-white tracking-tight">
            Bible Quiz World Admin
          </h1>
          <p className="text-xs text-blue-200/80 max-w-xs">
            Authenticate to manage questions, categories, features & app configuration.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-2xl text-xs text-red-200 text-center font-medium animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1 text-left">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
              Admin Username
            </label>
            <div className="relative flex items-center">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full pl-10 pr-4 py-3 bg-slate-900/90 border border-slate-700/80 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1 text-left">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
              Admin Password
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-10 pr-4 py-3 bg-slate-900/90 border border-slate-700/80 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Key className="w-4 h-4" /> Sign In to Admin Panel
          </button>
        </form>
      </motion.div>

      {/* Footer */}
      <div className="text-center text-[10px] text-slate-500 font-mono pb-2">
        Bible Quiz World Admin Console v1.0.0
      </div>
    </div>
  );
};