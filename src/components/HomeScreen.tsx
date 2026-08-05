import React from 'react';
import { Settings, Play, Award, MessageSquare } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Header Bar */}
      <header className="p-4 flex justify-between items-center border-b border-slate-800">
        <h1 className="text-xl font-bold font-serif text-blue-400">
          Bible Quiz World
        </h1>

        <div className="flex items-center gap-2">
          {/* Feedback Button Outer Header */}
          <button
            onClick={onOpenFeedback}
            className="px-3 py-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Feedback</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 transition cursor-pointer"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto w-full">
        <div className="mb-6 p-4 bg-blue-600/10 border border-blue-500/20 rounded-full">
          <Award className="w-16 h-16 text-blue-400" />
        </div>

        <h2 className="text-3xl font-extrabold mb-2 font-serif">
          Test Your Bible Knowledge
        </h2>
        <p className="text-slate-400 text-sm mb-8">
          Challenge yourself with scripture trivia, earn streaks, and deepen your understanding.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 w-full mb-8">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
            <div className="text-xs text-slate-400">High Score</div>
            <div className="text-2xl font-bold text-amber-400">{highScore}</div>
          </div>
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
            <div className="text-xs text-slate-400">Current Streak</div>
            <div className="text-2xl font-bold text-emerald-400">{streak} 🔥</div>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={onStartQuiz}
          className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl text-lg shadow-lg transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Play className="w-5 h-5 fill-current" />
          Start Quiz
        </button>
      </main>
    </div>
  );
};