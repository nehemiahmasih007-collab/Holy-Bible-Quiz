import React from 'react';
import { Settings, Play, Award, MessageSquare, BookOpen, Flame, Trophy, Sparkles } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface HomeScreenProps {
  onStartQuiz: (categoryId?: string) => void;
  onOpenSettings: () => void;
  onOpenFeedback: () => void;
  highScore?: number;
  streak?: number;
  categories?: Category[];
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartQuiz,
  onOpenSettings,
  onOpenFeedback,
  highScore = 0,
  streak = 0,
  categories = [
    { id: 'all', name: 'All Topics / تمام موضوعات', description: 'Mixed questions from Old & New Testaments', icon: '📖' },
    { id: 'old-testament', name: 'Old Testament / عہد عتیق', description: 'Genesis to Malachi trivia & stories', icon: '📜' },
    { id: 'new-testament', name: 'New Testament / عہد جدید', description: 'Gospels, Acts, and Apostles letters', icon: '✝️' },
    { id: 'parables', name: 'Parables & Miracles / تمثیلیں اور معجزات', description: 'Teachings and wonders of Jesus', icon: '✨' },
  ],
}) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between selection:bg-blue-500 selection:text-white">
      {/* Dynamic Header Bar */}
      <header className="sticky top-0 z-40 p-4 md:px-8 flex justify-between items-center border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-600/20 border border-blue-500/30 rounded-xl">
            <BookOpen className="w-5 h-5 text-blue-400" />
          </div>
          <h1 className="text-lg md:text-xl font-bold font-serif text-white tracking-wide">
            Bible Quiz World
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Externalized Feedback Button */}
          <button
            onClick={onOpenFeedback}
            className="px-3.5 py-2 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-sm"
          >
            <MessageSquare className="w-4 h-4 text-indigo-400" />
            <span>Feedback</span>
          </button>

          {/* Settings Trigger */}
          <button
            onClick={onOpenSettings}
            className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 hover:text-white transition active:scale-95 cursor-pointer"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-8 flex flex-col gap-8">
        {/* Banner Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900/40 via-slate-900 to-slate-950 border border-blue-500/20 p-6 md:p-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-3 text-center md:text-left z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold w-fit mx-auto md:mx-0">
              <Sparkles className="w-3.5 h-3.5" /> Interactive Bible Trivia
            </div>
            <h2 className="text-2xl md:text-4xl font-extrabold font-serif text-white leading-tight">
              Test & Grow Your <br className="hidden md:inline" /> Scripture Knowledge
            </h2>
            <p className="text-slate-400 text-xs md:text-sm max-w-md">
              Select a category below to start your quiz, track your streaks, and explore verses with references.
            </p>
          </div>

          {/* Quick Play Main Action */}
          <button
            onClick={() => onStartQuiz('all')}
            className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl text-base shadow-xl shadow-blue-950/50 transition active:scale-95 flex items-center justify-center gap-3 shrink-0 cursor-pointer border border-blue-400/30"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Quick Start All</span>
          </button>
        </div>

        {/* Dynamic User Stats Bar */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 md:p-5 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <Trophy className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">High Score</div>
                <div className="text-xl md:text-2xl font-bold text-amber-400">{highScore}</div>
              </div>
            </div>
          </div>

          <div className="p-4 md:p-5 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <Flame className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Current Streak</div>
                <div className="text-xl md:text-2xl font-bold text-emerald-400 flex items-center gap-1">
                  <span>{streak}</span>
                  <span className="text-base">🔥</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-200 font-serif">
              Select Category / زمرہ منتخب کریں
            </h3>
            <span className="text-xs text-slate-400">Choose a topic to begin</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => onStartQuiz(cat.id)}
                className="group p-5 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-blue-500/40 rounded-2xl transition duration-200 cursor-pointer flex items-center justify-between shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl p-3 bg-slate-950 border border-slate-800 rounded-xl group-hover:scale-110 transition">
                    {cat.icon}
                  </div>
                  <div className="flex flex-col">
                    <h4 className="font-bold text-slate-100 group-hover:text-blue-400 transition text-sm md:text-base">
                      {cat.name}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                      {cat.description}
                    </p>
                  </div>
                </div>

                <div className="p-2 bg-slate-800 group-hover:bg-blue-600 rounded-xl text-slate-400 group-hover:text-white transition">
                  <Play className="w-4 h-4 fill-current" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-xs text-slate-500 border-t border-slate-900">
        Bible Quiz World • Encouraging Scripture Learning
      </footer>
    </div>
  );
};