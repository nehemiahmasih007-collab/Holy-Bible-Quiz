import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 transition-opacity">
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: '0%', opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 border-t sm:border border-slate-200 dark:border-slate-800 rounded-t-[2.5rem] sm:rounded-3xl p-6 shadow-2xl flex flex-col gap-5 max-h-[85vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-2xl border border-blue-100 dark:border-blue-800/50">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white font-serif tracking-wide">
                {t('settings.title')}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Customize your Bible Quiz experience
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition active:scale-90"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Form */}
        <div className="flex flex-col gap-3.5 text-xs">
          {/* Language Selector */}
          <div className="p-4 bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl border border-slate-200/60 dark:border-slate-800 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Languages className="w-4 h-4 text-indigo-500" />
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {t('common.language')}
              </span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none">
              {[
                { code: 'en', name: 'English' },
                { code: 'hi', name: 'हिंदी' },
                { code: 'ur', name: 'اردو' },
              ].map((lang) => {
                const isSelected = i18n.language === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`flex-1 min-w-[75px] py-2 px-3 rounded-xl font-bold transition text-center border ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {lang.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dark Mode */}
          <div className="flex items-center justify-between p-4 bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl border border-slate-200/60 dark:border-slate-800">
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
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  {settings.darkMode ? 'Dark Theme Active' : 'Light Theme Active'}
                </span>
              </div>
            </div>

            <button
              onClick={handleToggleDarkMode}
              className={`w-12 h-6.5 rounded-full p-1 transition-colors duration-200 flex items-center ${
                settings.darkMode ? 'bg-amber-500 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
              }`}
            >
              <motion.div layout className="w-4 h-4 rounded-full bg-white shadow-md" />
            </button>
          </div>

          {/* Question Count */}
          <div className="p-4 bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl border border-slate-200/60 dark:border-slate-800 flex flex-col gap-3">
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
                    className={`py-2 px-2.5 rounded-xl font-bold font-mono transition text-center flex items-center justify-center gap-1 border ${
                      isSelected
                        ? 'bg-blue-600 border-blue-500 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {count} {isSelected && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sound FX */}
          <div className="flex items-center justify-between p-4 bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl border border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center gap-3">
              {settings.soundEnabled ? (
                <Volume2 className="w-5 h-5 text-emerald-500" />
              ) : (
                <VolumeX className="w-5 h-5 text-slate-400" />
              )}
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  {t('settings.sound')}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  {settings.soundEnabled ? 'Interactive Chimes On' : 'Muted'}
                </span>
              </div>
            </div>

            <button
              onClick={handleToggleSound}
              className={`w-12 h-6.5 rounded-full p-1 transition-colors duration-200 flex items-center ${
                settings.soundEnabled ? 'bg-emerald-500 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
              }`}
            >
              <motion.div layout className="w-4 h-4 rounded-full bg-white shadow-md" />
            </button>
          </div>

          {/* Question Timer */}
          <div className="flex items-center justify-between p-4 bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl border border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-500" />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  Question Timer
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  {settings.timerEnabled ? '20 Seconds Per Question' : 'No Timer Limit'}
                </span>
              </div>
            </div>

            <button
              onClick={handleToggleTimer}
              className={`w-12 h-6.5 rounded-full p-1 transition-colors duration-200 flex items-center ${
                settings.timerEnabled ? 'bg-blue-600 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
              }`}
            >
              <motion.div layout className="w-4 h-4 rounded-full bg-white shadow-md" />
            </button>
          </div>

          {/* Feedback */}
          <div className="p-4 bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-indigo-500" />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  {t('settings.feedback')}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  Share your thoughts with us
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                soundFx.playClick(settings.soundEnabled);
                onOpenFeedback();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold text-xs border border-indigo-200 dark:border-indigo-800/60 flex items-center gap-1.5 hover:bg-indigo-100 transition active:scale-95"
            >
              <Send className="w-3.5 h-3.5" /> Send
            </button>
          </div>

          {/* Reset Stats */}
          <div className="p-4 bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">
                {t('settings.reset_stats')}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                Clear score and streak history
              </span>
            </div>

            <button
              onClick={() => {
                if (confirm('Are you sure you want to reset your quiz statistics?')) {
                  onResetStats();
                }
              }}
              className="px-3.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-bold text-xs border border-rose-200 dark:border-rose-800/60 flex items-center gap-1.5 hover:bg-rose-100 transition active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          {/* App Info Note */}
          <div className="p-4 bg-blue-50/70 dark:bg-blue-950/40 rounded-2xl border border-blue-200/60 dark:border-blue-900/40 flex items-start gap-3 text-xs text-blue-900 dark:text-blue-300 leading-relaxed">
            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-blue-950 dark:text-blue-200 mb-0.5">
                Bible Quiz World Principles:
              </span>
              This app encourages Scripture study. All questions provide references—open your personal Bible to read and verify every passage!
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};