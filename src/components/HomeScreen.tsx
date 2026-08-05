import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Play,
  BookOpen,
  Scroll,
  Cross,
  Sparkles,
  Flame,
  Mail,
  Sun,
  Trophy,
  ChevronRight,
  Bookmark,
  Layers,
  Award,
  BookMarked,
  Settings as SettingsIcon,
  ShieldCheck,
} from 'lucide-react';
import { Category, CategoryId, UserStats } from '../models';

interface HomeScreenProps {
  stats: UserStats;
  categories: Category[];
  selectedCategory: CategoryId;
  onSelectCategory: (catId: CategoryId) => void;
  onStartQuiz: () => void;
  onOpenSettings: () => void;
  onOpenAdmin: () => void;
  onOpenFutureFeature: (featureName: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  stats,
  categories,
  selectedCategory,
  onSelectCategory,
  onStartQuiz,
  onOpenSettings,
  onOpenAdmin,
  onOpenFutureFeature,
}) => {
  const { t } = useTranslation();
  const [tapCount, setTapCount] = React.useState(0);
  const [showAdminButton, setShowAdminButton] = React.useState(false);

  const handleLogoTap = () => {
    setTapCount((prev) => {
      const next = prev + 1;
      if (next >= 7) {
        setShowAdminButton(true);
        return 0;
      }
      return next;
    });
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-amber-500" />;
      case 'Scroll':
        return <Scroll className="w-5 h-5 text-amber-500" />;
      case 'Cross':
        return <Cross className="w-5 h-5 text-blue-500" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-amber-400" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-orange-500" />;
      case 'Mail':
        return <Mail className="w-5 h-5 text-indigo-500" />;
      case 'Sun':
        return <Sun className="w-5 h-5 text-emerald-500" />;
      default:
        return <BookOpen className="w-5 h-5 text-blue-500" />;
    }
  };

  const activeCategories = categories && categories.length > 0 ? categories : [];
  const selectedCategoryObj = activeCategories.find((c) => c.id === selectedCategory);
  const selectedCategoryName = selectedCategoryObj
    ? t(`categories.${selectedCategoryObj.id}`, { defaultValue: selectedCategoryObj.name })
    : '';

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-5 gap-5 pb-28 overflow-y-auto relative">
      {/* Top Header Card */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-3 cursor-pointer select-none" onClick={handleLogoTap}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-800 p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-blue-900 rounded-[14px] flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight font-serif text-slate-900 dark:text-white flex items-center gap-1.5">
              Bible Quiz <span className="text-amber-500 dark:text-amber-400">World</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {t('common.welcome')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Admin Panel Button */}
          {showAdminButton && (
            <button
              onClick={onOpenAdmin}
              className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition shadow-sm border border-amber-400/30 flex items-center gap-1.5 text-xs font-bold active:scale-95"
              title="Admin Console Portal"
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden sm:inline">{t('common.admin')}</span>
            </button>
          )}

          <button
            onClick={onOpenSettings}
            className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition shadow-sm border border-slate-200/60 dark:border-slate-700/50 active:scale-95"
            aria-label="Settings"
          >
            <SettingsIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Category Selection Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {t('home.select_category')}
          </h2>
          <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-200/50 dark:border-blue-900/50">
            {activeCategories.length} Topics
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {activeCategories.map((cat: Category) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`p-4 rounded-2xl text-left border transition-all duration-200 flex flex-col justify-between relative overflow-hidden active:scale-[0.98] ${
                  isSelected
                    ? 'bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white border-amber-400/80 shadow-md ring-2 ring-amber-400/20'
                    : 'bg-white dark:bg-slate-800/70 border-slate-200/80 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 hover:border-blue-400 dark:hover:border-blue-500 shadow-xs'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                )}
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className={`p-2 rounded-xl transition-colors ${
                      isSelected
                        ? 'bg-amber-400/20 text-amber-300'
                        : 'bg-slate-100 dark:bg-slate-700/60'
                    }`}
                  >
                    {getCategoryIcon(cat.iconName)}
                  </div>
                </div>

                <div>
                  <h3
                    className={`text-xs font-bold leading-snug line-clamp-1 ${
                      isSelected ? 'text-white' : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {t(`categories.${cat.id}`, { defaultValue: cat.name })}
                  </h3>
                  <p
                    className={`text-[10px] line-clamp-1 mt-0.5 ${
                      isSelected ? 'text-blue-200/80' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {t(`category_desc.${cat.id}`, { defaultValue: cat.description })}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-white dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/60 rounded-2xl p-3 text-center shadow-xs">
          <Trophy className="w-5 h-5 text-amber-500 mx-auto mb-1" />
          <span className="block text-base font-black text-slate-900 dark:text-white">
            {stats.bestScorePercentage}%
          </span>
          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
            {t('home.best_score')}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/60 rounded-2xl p-3 text-center shadow-xs">
          <BookOpen className="w-5 h-5 text-blue-500 mx-auto mb-1" />
          <span className="block text-base font-black text-slate-900 dark:text-white">
            {stats.totalQuizzesTaken}
          </span>
          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
            {t('home.total_quizzes')}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/60 rounded-2xl p-3 text-center shadow-xs">
          <Award className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
          <span className="block text-base font-black text-slate-900 dark:text-white">
            {stats.xpPoints}
          </span>
          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
            XP Points
          </span>
        </div>
      </div>

      {/* Future Tools */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            More Study Tools
          </h2>
          <span className="text-[10px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full border border-amber-300/40 dark:border-amber-800/40">
            Future Ready
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => onOpenFutureFeature('Flashcards & Memory Verses')}
            className="p-3 bg-slate-50/80 dark:bg-slate-800/40 border border-dashed border-slate-300 dark:border-slate-700/80 rounded-2xl flex items-center gap-2.5 text-left hover:border-amber-400 transition group active:scale-95"
          >
            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl group-hover:scale-105 transition">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Flashcards
              </span>
              <span className="block text-[10px] text-slate-500 dark:text-slate-400">
                Memory Verses
              </span>
            </div>
          </button>

          <button
            onClick={() => onOpenFutureFeature('Daily Scripture Challenge')}
            className="p-3 bg-slate-50/80 dark:bg-slate-800/40 border border-dashed border-slate-300 dark:border-slate-700/80 rounded-2xl flex items-center gap-2.5 text-left hover:border-amber-400 transition group active:scale-95"
          >
            <div className="p-2 bg-orange-500/10 text-orange-500 rounded-xl group-hover:scale-105 transition">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Daily Quest
              </span>
              <span className="block text-[10px] text-slate-500 dark:text-slate-400">
                Earn XP
              </span>
            </div>
          </button>

          <button
            onClick={() => onOpenFutureFeature('Bookmarked Scripture References')}
            className="p-3 bg-slate-50/80 dark:bg-slate-800/40 border border-dashed border-slate-300 dark:border-slate-700/80 rounded-2xl flex items-center gap-2.5 text-left hover:border-amber-400 transition group active:scale-95"
          >
            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl group-hover:scale-105 transition">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Bookmarks
              </span>
              <span className="block text-[10px] text-slate-500 dark:text-slate-400">
                Saved Verses
              </span>
            </div>
          </button>

          <button
            onClick={() => onOpenFutureFeature('Scripture Study Notes')}
            className="p-3 bg-slate-50/80 dark:bg-slate-800/40 border border-dashed border-slate-300 dark:border-slate-700/80 rounded-2xl flex items-center gap-2.5 text-left hover:border-amber-400 transition group active:scale-95"
          >
            <div className="p-2 bg-purple-500/10 text-purple-500 rounded-xl group-hover:scale-105 transition">
              <BookMarked className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Study Notes
              </span>
              <span className="block text-[10px] text-slate-500 dark:text-slate-400">
                Personal Journal
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Floating Action Button */}
      <AnimatePresence>
        {selectedCategoryObj && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800/80 z-40 flex items-center justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={onStartQuiz}
              className="w-full max-w-md py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-bold text-base shadow-lg shadow-amber-500/20 flex items-center justify-between border border-amber-300/60 group overflow-hidden"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-950/10 flex items-center justify-center">
                  <Play className="w-4 h-4 text-slate-950 fill-slate-950 ml-0.5" />
                </div>
                <div className="text-left">
                  <span className="block text-xs font-black tracking-wider uppercase text-slate-950">
                    {t('common.start_quiz')}
                  </span>
                  <span className="block text-xs font-bold text-slate-900/80">
                    {selectedCategoryName}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-950 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};