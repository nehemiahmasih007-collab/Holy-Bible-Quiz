import React from 'react';
import { Settings, MessageSquare, Play } from 'lucide-react';

interface HomeScreenProps {
  onStartQuiz: () => void;
  onOpenSettings: () => void;
  onOpenFeedback: () => void;
  highScore: number;
  streak: number;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartQuiz,
  onOpenSettings,
  onOpenFeedback,
  highScore,
  streak,
}) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-between p-6">
      {/* Top Header Section */}
      <div className="w-full max-w-md flex justify-between items-center pt-2">
        <h1 className="text-xl font-bold font-serif text-blue-400">
          Bible Quiz World
        </h1>

        <div className="flex items-center gap-2">
          {/* Feedback Button - Front Outer Position */}
          <button
            onClick={onOpenFeedback}
            className="px-3 py-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer active:scale-95"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Feedback</span>
          </button>

          {/* Settings Trigger */}
          <button
            onClick={onOpenSettings}
            className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 transition cursor-pointer active:scale-95"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Hero Center Content */}
      <div className="w-full max-w-md flex flex-col items-center text-center my-auto py-8">
        {/* Main Logo Icon Container */}
        <div className="w-24 h-24 mb-6 rounded-3xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shadow-xl shadow-blue-950/40">
          <span className="text-4xl">📖</span>
        </div>

        <h2 className="text-3xl font-extrabold mb-3 font-serif tracking-tight">
          Test Your Bible Knowledge
        </h2>
        <p className="text-slate-400 text-sm mb-8 leading-relaxed max-w-xs">
          Challenge yourself with scripture trivia, earn streaks, and deepen your understanding.
        </p>

        {/* Dynamic Stats Cards */}
        <div className="grid grid-cols-2 gap-4 w-full mb-8">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider mb-1 font-semibold">
              High Score
            </span>
            <span className="text-2xl font-bold text-amber-400">
              {highScore}
            </span>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider mb-1 font-semibold">
              Current Streak
            </span>
            <span className="text-2xl font-bold text-emerald-400 flex items-center gap-1">
              {streak} <span className="text-lg">🔥</span>
            </span>
          </div>
        </div>

        {/* Start Quiz Main Button */}
        <button
          onClick={onStartQuiz}
          className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl text-lg shadow-lg shadow-blue-900/40 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Play className="w-5 h-5 fill-current" />
          Start Quiz
        </button>
      </div>

      {/* Minimal Footer */}
      <div className="text-xs text-slate-600 pb-2">
        Bible Quiz 
      </div>
    </div>
  );
};