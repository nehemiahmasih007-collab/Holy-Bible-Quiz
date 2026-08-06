import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  X,
  Languages,
  Moon,
  Volume2,
  Clock,
  RotateCcw,
  Info,
  Sliders,
} from 'lucide-react';
import { QuizSettings } from '../models';
import { soundFx } from '../utils/sound';

interface SettingsModalProps {
  settings: QuizSettings;
  onUpdateSettings: (newSettings: Partial<QuizSettings>) => void;
  onClose: () => void;
  onResetStats: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClose,
  onResetStats,
}) => {
  const { t, i18n } = useTranslation();

  const handleToggleSound = () => {
    const updated = !settings.soundEnabled;
    onUpdateSettings({ soundEnabled: updated });
    if (updated) soundFx.playClick(true);
  };

  const handleLanguageChange = (lang: 'English' | 'Urdu') => {
    const langCode = lang === 'Urdu' ? 'ur' : 'en';

    // 1. i18n کی زبان کو فوری تبدیل کریں
    i18n.changeLanguage(langCode);

    // 2. LocalStorage کو فوراً سنک کریں
    localStorage.setItem('i18nextLng', langCode);
    localStorage.setItem('appLanguage', langCode);

    // 3. Document کا Layout Direction (RTL/LTR) تبدیل کریں
    document.dir = langCode === 'ur' ? 'rtl' : 'ltr';
    document.documentElement.lang = langCode;

    // 4. Parents State / Settings کو اپڈیٹ کریں
    onUpdateSettings({ language: lang });

    // 5. ساؤنڈ پلے کریں
    soundFx.playClick(settings.soundEnabled);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-md md:max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col gap-6 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-2xl">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white font-serif">
                {t('settings.title', 'Quiz Settings')}
              </h2>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
                {t('settings.subtitle', 'Customize your Bible Quiz experience for desktop and mobile')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
            aria-label={t('settings.close', 'Close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm">
          {/* Language Selector */}
          <div className="flex flex-col gap-2 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300">
              <Languages className="w-4 h-4 text-blue-500" />
              {t('common.language', 'Language')}
            </div>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <button
                type="button"
                onClick={() => handleLanguageChange('English')}
                className={`py-2.5 px-3 rounded-xl font-bold transition cursor-pointer ${
                  settings.language === 'English' || i18n.language === 'en'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange('Urdu')}
                className={`py-2.5 px-3 rounded-xl font-bold transition cursor-pointer ${
                  settings.language === 'Urdu' || i18n.language === 'ur'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                }`}
                dir="rtl"
              >
                اردو
              </button>
            </div>
          </div>

          {/* Dark Mode */}
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-amber-500" />
              <div>
                <div className="font-bold text-slate-800 dark:text-slate-200">
                  {t('settings.dark_mode', 'Dark Mode')}
                </div>
                <div className="text-xs text-slate-400">
                  {settings.darkMode 
                    ? t('settings.dark_theme_active', 'Dark Theme Active') 
                    : t('settings.light_theme_active', 'Light Theme Active')}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onUpdateSettings({ darkMode: !settings.darkMode });
                soundFx.playClick(settings.soundEnabled);
              }}
              className={`w-14 h-7 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                settings.darkMode ? 'bg-amber-500 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white shadow-sm" />
            </button>
          </div>

          {/* Number of Questions */}
          <div className="flex flex-col gap-2 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 md:col-span-2">
            <div className="font-bold text-slate-700 dark:text-slate-300">
              {t('settings.question_count', 'Number of Questions Per Quiz')}
            </div>
            <div className="grid grid-cols-4 gap-2 mt-1">
              {[5, 10, 15, 20].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    onUpdateSettings({ questionsPerQuiz: num });
                    soundFx.playClick(settings.soundEnabled);
                  }}
                  className={`py-2.5 rounded-xl font-bold transition cursor-pointer ${
                    settings.questionsPerQuiz === num
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Sound Effects */}
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-emerald-500" />
              <div>
                <div className="font-bold text-slate-800 dark:text-slate-200">
                  {t('settings.sound', 'Sound Effects')}
                </div>
                <div className="text-xs text-slate-400">
                  {settings.soundEnabled 
                    ? t('settings.sound_on', 'Interactive Chimes On') 
                    : t('settings.sound_muted', 'Muted')}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleToggleSound}
              className={`w-14 h-7 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                settings.soundEnabled ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white shadow-sm" />
            </button>
          </div>

          {/* Question Timer */}
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-purple-500" />
              <div>
                <div className="font-bold text-slate-800 dark:text-slate-200">
                  {t('settings.timer', 'Question Timer')}
                </div>
                <div className="text-xs text-slate-400">
                  {settings.timerEnabled 
                    ? t('settings.timer_on', '30 Seconds Limit') 
                    : t('settings.timer_off', 'No Timer Limit')}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onUpdateSettings({ timerEnabled: !settings.timerEnabled });
                soundFx.playClick(settings.soundEnabled);
              }}
              className={`w-14 h-7 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                settings.timerEnabled ? 'bg-purple-500 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white shadow-sm" />
            </button>
          </div>

          {/* Reset Statistics */}
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 md:col-span-2">
            <div className="flex items-center gap-3">
              <RotateCcw className="w-5 h-5 text-red-500" />
              <div>
                <div className="font-bold text-slate-800 dark:text-slate-200">
                  {t('settings.reset_stats', 'Reset Statistics')}
                </div>
                <div className="text-xs text-slate-400">
                  {t('settings.reset_stats_desc', 'Clear score and streak history')}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={onResetStats}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition shadow-md active:scale-95 cursor-pointer flex items-center gap-2 text-xs md:text-sm"
            >
              <RotateCcw className="w-4 h-4" /> {t('settings.reset_button', 'Reset Stats')}
            </button>
          </div>
        </div>

        {/* Principles Note */}
        <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border border-blue-100 dark:border-blue-900/50 text-xs md:text-sm text-blue-900 dark:text-blue-300 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold mb-0.5">{t('settings.principles_title', 'Bible Quiz World Principles:')}</div>
            {t('settings.principles_desc', 'This app encourages Scripture study. All questions provide references—open your personal Bible to read and verify every passage!')}
          </div>
        </div>
      </motion.div>
    </div>
  );
};