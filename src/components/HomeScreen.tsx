import React from 'react';
import { Settings, Play, Award, MessageSquare } from 'lucide-react';

interface HomeScreenProps {
  onStartQuiz: () => void;
  onOpenSettings: () => void;
  onOpenFeedback: () => void;
  highScore?: number;
  streak?: number;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartQuiz,
  onOpenSettings,
  onOpenFeedback,
  highScore = 0,
  streak = 0,
}) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between">
      {/* Top Header Bar */}
      <header className="p-4 md:px-8 flex justify-between items-center border-b border-slate-800/80 bg-slate-950/50 backdrop-blur-md">
        <h1 className="text-xl font-bold font-serif text-blue-400">
          Bible Quiz World
        </h1>

        <div className="flex items-center gap-3">
          {/* Feedback Button Outer */}
          <button
            onClick={onOpenFeedback}
            className="px-3.5 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer active:scale-95"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Feedback</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 transition cursor-pointer active:scale-95"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-xl mx-auto w-full my-auto">
        <div className="mb-6 p-4 bg-blue-600/10 border border-blue-500/20 rounded-full">
          <Award className="w-14 h-14 text-blue-400" />
        </div>

        <h2 className="text-2xl md:text-3xl font-extrabold mb-3 font-serif">
          Test Your Bible Knowledge
        </h2>
        <p className="text-slate-400 text-xs md:text-sm mb-8 max-w-md">
          Challenge yourself with scripture trivia, earn streaks, and deepen your understanding.
        </p>

        {/* Stats Section with proper values */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-8">
          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col items-center justify-center">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-1 font-semibold">
              High Score
            </div>
            <div className="text-2xl font-bold text-amber-400">
              {highScore}
            </div>
          </div>

          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col items-center justify-center">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-1 font-semibold">
              Current Streak
            </div>
            <div className="text-2xl font-bold text-emerald-400 flex items-center gap-1">
              <span>{streak}</span>
              <span className="text-lg">🔥</span>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={onStartQuiz}
          className="w-full max-w-md py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl text-base shadow-lg transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Play className="w-5 h-5 fill-current" />
          Start Quiz
        </button>
      </main>

      {/* Footer Padding */}
      <footer className="p-4 text-center text-xs text-slate-600">
        Bible Quiz World
      </footer>
    </div>
  );
};