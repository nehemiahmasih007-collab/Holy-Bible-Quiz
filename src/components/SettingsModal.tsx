import React from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import {
  X,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Clock,
  BookOpen,
  RotateCcw,
  Info,
  Check,
  Languages,
  MessageSquare,
  Send,
} from 'lucide-react';
import { QuizSettings } from '../models';
import { soundFx } from '../utils/sound';

interface SettingsModalProps {
  settings: QuizSettings;
  onUpdateSettings: (newSettings: Partial<QuizSettings>) => void;
  onClose: () => void;
  onResetStats: () => void;
  onOpenFeedback: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClose,
  onResetStats,
  onOpenFeedback,
}) => {
  const { t, i18n } = useTranslation();
  const questionCountOptions = [5, 10, 15, 20];

  const handleToggleSound = () => {
    const nextVal = !settings.soundEnabled;
    onUpdateSettings({ soundEnabled: nextVal });
    soundFx.playClick(nextVal);
  };

  const handleToggleDarkMode = () => {
    soundFx.playClick(settings.soundEnabled);
    onUpdateSettings({ darkMode: !settings.darkMode });
  };

  const handleToggleTimer = () => {
    soundFx.playClick(settings.soundEnabled);
    onUpdateSettings({ timerEnabled: !settings.timerEnabled });
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    onUpdateSettings({ language: lng });
    soundFx.playClick(settings.soundEnabled);
  };

  return (
    <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-end justify-center p-0 sm:p-4">
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: '0%' }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 border-t sm:border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl flex flex-col gap-5 max-h-[85vh] overflow-y-auto"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 rounded-xl">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white font-serif">
                {t('settings.title')}
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Customize your Bible Quiz experience
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Setting Items */}
        <div className="flex flex-col gap-4 text-xs">
          {/* Language Selector */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <Languages className="w-5 h-5 text-indigo-500" />
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {t('common.language')}
              </span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {[
                { code: 'en', name: 'English' },
                { code: 'hi', name: 'हिंदी' },
                { code: 'ur', name: 'اردو' },
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`flex-1 min-w-[80px] py-2 px-3 rounded-xl font-bold transition text-center ${
                    i18n.language === lang.code
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-700/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Mode */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60">
            <div className="flex items-center gap-3">
              {settings.darkMode ? (
                <Moon className="w-5 h-5 text-amber-400" />
              ) : (
                <Sun className="w-5 h-5 text-blue-600" />
              )}
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  {t('settings.dark_mode')}
                </span>
                <span className="text-[10px] text-slate-500">
                  {settings.darkMode ? 'Dark Theme Active' : 'Light Theme Active'}
                </span>
              </div>
            </div>

            <button
              onClick={handleToggleDarkMode}
              className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 flex items-center ${
                settings.darkMode ? 'bg-amber-500 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
            </button>
          </div>

          {/* Questions Per Session */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 flex flex-col gap-2.5">
            <span className="font-bold text-slate-800 dark:text-slate-200 block">
              {t('settings.question_count')}
            </span>
            <div className="grid grid-cols-4 gap-2">
              {questionCountOptions.map((count) => {
                const isSelected = settings.questionCount === count;
                return (
                  <button
                    key={count}
                    onClick={() => {
                      soundFx.playClick(settings.soundEnabled);
                      onUpdateSettings({ questionCount: count });
                    }}
                    className={`py-2 px-3 rounded-xl font-bold font-mono transition text-center flex items-center justify-center gap-1 ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-700/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                    }`}
                  >
                    {count} {isSelected && <Check className="w-3 h-3" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sound Effects */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60">
            <div className="flex items-center gap-3">
              {settings.soundEnabled ? (
                <Volume2 className="w-5 h-5 text-amber-500" />
              ) : (
                <VolumeX className="w-5 h-5 text-slate-400" />
              )}
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  {t('settings.sound')}
                </span>
                <span className="text-[10px] text-slate-500">
                  {settings.soundEnabled ? 'Interactive Chimes On' : 'Muted'}
                </span>
              </div>
            </div>

            <button
              onClick={handleToggleSound}
              className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 flex items-center ${
                settings.soundEnabled ? 'bg-emerald-500 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
            </button>
          </div>

          {/* Question Timer */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-500" />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  Question Countdown Timer
                </span>
                <span className="text-[10px] text-slate-500">
                  {settings.timerEnabled ? '20 Seconds Per Question' : 'No Timer Limit'}
                </span>
              </div>
            </div>

            <button
              onClick={handleToggleTimer}
              className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 flex items-center ${
                settings.timerEnabled ? 'bg-blue-600 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
            </button>
          </div>

          {/* Send Feedback */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-indigo-500" />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  {t('settings.feedback')}
                </span>
                <span className="text-[10px] text-slate-500">
                  Share your thoughts with us
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                soundFx.playClick(settings.soundEnabled);
                onOpenFeedback();
              }}
              className="px-3 py-1.5 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold text-[11px] border border-indigo-200 dark:border-indigo-900 flex items-center gap-1"
            >
              <Send className="w-3.5 h-3.5" /> Send
            </button>
          </div>

          {/* Reset Statistics */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">
                {t('settings.reset_stats')}
              </span>
              <span className="text-[10px] text-slate-500">
                Clear best score and streak history
              </span>
            </div>

            <button
              onClick={() => {
                if (confirm('Are you sure you want to reset your quiz statistics?')) {
                  onResetStats();
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 font-bold text-[11px] border border-red-200 dark:border-red-900 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          {/* App Info Note */}
          <div className="p-3.5 bg-blue-50/80 dark:bg-blue-950/40 rounded-2xl border border-blue-200/80 dark:border-blue-900/60 flex items-start gap-2.5 text-[11px] text-blue-900 dark:text-blue-300 leading-relaxed">
            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-blue-950 dark:text-blue-200 mb-0.5">
                Bible Quiz World Principles:
              </span>
              This app is designed to encourage personal Bible study. All questions present Scripture References as options. Open your personal physical or digital Bible to read the passage for every question!
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
