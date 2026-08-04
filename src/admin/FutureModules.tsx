import React from 'react';
import {
  BookMarked,
  Calendar,
  Bookmark,
  FileText,
  Zap,
  Award,
  User,
  Bell,
  Trophy,
  BarChart3,
  Globe,
  Sparkles,
  ArrowRight,
  Sliders,
} from 'lucide-react';
import { FeatureFlag } from '../types';

interface FutureModulesProps {
  features: FeatureFlag[];
  onGoToFeatures: () => void;
  onPreviewFeature: (title: string, desc: string) => void;
}

const FUTURE_MODULES_LIST = [
  {
    title: 'Flashcards & Memory Verses',
    icon: BookMarked,
    color: 'from-amber-500 to-yellow-600',
    description: 'Flip-card study deck for memorizing Scripture references and passage themes.',
    id: 'flashcards',
  },
  {
    title: 'Daily Scripture Challenge',
    icon: Calendar,
    color: 'from-blue-500 to-indigo-600',
    description: '3 daily Scripture questions with bonus XP multipliers and streak counters.',
    id: 'daily_challenge',
  },
  {
    title: 'Scripture Bookmarks',
    icon: Bookmark,
    color: 'from-emerald-500 to-teal-600',
    description: 'Save challenging Scripture reference questions to revisit during personal quiet time.',
    id: 'bookmarks',
  },
  {
    title: 'Personal Study Notes',
    icon: FileText,
    color: 'from-purple-500 to-indigo-600',
    description: 'In-app notebook for recording reflections and insights gained from Scripture references.',
    id: 'study_notes',
  },
  {
    title: 'XP System & Ranks',
    icon: Zap,
    color: 'from-yellow-500 to-amber-600',
    description: 'Gain XP for speed and accuracy; rise from Bible Student to Master Theologian.',
    id: 'xp_system',
  },
  {
    title: 'Badges & Achievements',
    icon: Award,
    color: 'from-orange-500 to-red-600',
    description: 'Unlock special badges such as "Gospels Scholar", "Prophets Master", and "100 Streak".',
    id: 'achievements',
  },
  {
    title: 'User Profiles & Avatars',
    icon: User,
    color: 'from-blue-600 to-cyan-600',
    description: 'Custom student avatars, study titles, and public profile cards.',
    id: 'user_profiles',
  },
  {
    title: 'Push & Study Reminders',
    icon: Bell,
    color: 'from-pink-500 to-rose-600',
    description: 'Automated daily reminders encouraging consistent Bible reading and testing.',
    id: 'notifications',
  },
  {
    title: 'Global Leaderboards',
    icon: Trophy,
    color: 'from-amber-400 to-yellow-500',
    description: 'Rankings for top accuracy, weekly streak champions, and category masters.',
    id: 'leaderboard',
  },
  {
    title: 'Knowledge Analytics',
    icon: BarChart3,
    color: 'from-cyan-500 to-blue-600',
    description: 'Visual breakdown showing strong Bible categories and books needing extra review.',
    id: 'analytics',
  },
  {
    title: 'Multi-Language Support',
    icon: Globe,
    color: 'from-indigo-500 to-purple-600',
    description: 'Complete UI translation in Spanish, Portuguese, French, and biblical languages.',
    id: 'languages',
  },
];

export const FutureModules: React.FC<FutureModulesProps> = ({
  features,
  onGoToFeatures,
  onPreviewFeature,
}) => {
  return (
    <div className="flex flex-col gap-4 text-xs">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Future Ready Feature Modules
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Modular app extensions ready to activate or preview in students' app
          </p>
        </div>

        <button
          onClick={onGoToFeatures}
          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 hover:text-amber-500 transition"
        >
          <Sliders className="w-3.5 h-3.5" /> Feature Toggles
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {FUTURE_MODULES_LIST.map((mod) => {
          const IconComp = mod.icon;
          const featFlag = features.find((f) => f.id === mod.id);
          const isEnabled = featFlag?.enabled ?? false;

          return (
            <div
              key={mod.id}
              className="p-3.5 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col justify-between gap-3 shadow-sm hover:border-amber-400/40 transition"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2.5 rounded-2xl bg-gradient-to-tr ${mod.color} text-slate-950 shadow-sm shrink-0`}
                >
                  <IconComp className="w-5 h-5 text-slate-950" />
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="font-bold text-slate-900 dark:text-white font-serif">
                      {mod.title}
                    </h4>

                    <span
                      className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        isEnabled
                          ? 'bg-emerald-400/10 text-emerald-500 border border-emerald-400/30'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {isEnabled ? 'Active' : 'Modular'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                    {mod.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-400 font-mono">
                  Module ID: #{mod.id}
                </span>

                <button
                  onClick={() => onPreviewFeature(mod.title, mod.description)}
                  className="text-[11px] font-bold text-amber-500 hover:text-amber-400 flex items-center gap-1"
                >
                  Preview Module <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
