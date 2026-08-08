import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BookOpen,
  Trophy,
  Award,
  Settings as SettingsIcon,
  ShieldCheck,
  MessageSquare,
  Play,
  Bookmark,
  Sparkles,
} from 'lucide-react';
import { Category, CategoryId, UserStats } from '../models';

interface HomeScreenProps {
  stats: UserStats;
  categories: Category[];
  selectedCategory: CategoryId;
  onSelectCategory: (catId: CategoryId) => void;
  onStartQuiz: () => void;
  onOpenSettings: () => void;
  onOpenFeedback: () => void;
  onOpenAdmin: () => void;
  onOpenFutureFeature: (featureName: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  stats,
  onStartQuiz,
  onOpenSettings,
  onOpenFeedback,
  onOpenAdmin,
  onOpenFutureFeature,
}) => {
  const { t } = useTranslation();
  
  const [showAdminButton, setShowAdminButton] = useState(false);
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogoTap = () => {
    tapCountRef.current += 1;
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);

    if (tapCountRef.current >= 7) {
      setShowAdminButton((prev) => !prev);
      tapCountRef.current = 0;
    } else {
      tapTimerRef.current = setTimeout(() => {
        tapCountRef.current = 0;
      }, 1500);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-5 gap-5 pb-20 overflow-y-auto relative bg-slate-900 text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1">
        <div 
          className="flex items-center gap-3 cursor-pointer select-none" 
          onClick={handleLogoTap}
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 p-0.5 shadow-lg shadow-blue-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              Bible Quiz World
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              {t('common.welcome', 'خوش آمدید!')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {showAdminButton && (
            <button
              onClick={onOpenAdmin}
              className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition border border-amber-400/30 flex items-center gap-1 text-xs font-bold animate-pulse"
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden sm:inline">{t('common.admin', 'ایڈمن')}</span>
            </button>
          )}

          <button
            onClick={onOpenFeedback}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-400 transition border border-slate-700/60 shadow-sm cursor-pointer"
            title={t('common.feedback', 'فیڈ بیک')}
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition border border-slate-700/60 shadow-sm cursor-pointer"
            title={t('common.settings', 'سیٹنگز')}
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Play Action Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-5 shadow-xl shadow-indigo-500/10 border border-indigo-500/20">
        <div className="relative z-10 flex flex-col justify-between space-y-4">
          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full w-fit">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-xs font-medium text-blue-100">
              {t('home.ready_challenge', 'کیا آپ آج کے چیلنج کے لیے تیار ہیں؟')}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white leading-tight">
              {t('home.banner_title', 'اپنی بائبل کی معلومات کا امتحان لیں')}
            </h2>
            <p className="text-xs text-blue-100/80 mt-1">
              {t('home.banner_subtitle', 'عہد عتیق اور عہد جدید سے سوالات کے جوابات دیں')}
            </p>
          </div>
          <button
            onClick={onStartQuiz}
            className="w-full py-3 px-5 rounded-2xl bg-white text-blue-600 font-bold flex items-center justify-center space-x-2 shadow-md hover:bg-blue-50 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{t('home.start_quiz', 'کوئز شروع کریں')}</span>
          </button>
        </div>
      </div>

      {/* Progress Dashboard */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
          {t('home.your_progress', 'آپ کی پیشرفت')}
        </h3>
        <div className="grid grid-cols-3 gap-2.5">
          <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-3 text-center shadow-sm">
            <Trophy className="w-5 h-5 text-amber-400 mx-auto mb-1" />
            <span className="block text-lg font-black text-white">
              {stats.bestScorePercentage}%
            </span>
            <span className="text-[10px] font-medium text-slate-400">
              {t('home.best_score', 'بہترین اسکور')}
            </span>
          </div>

          <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-3 text-center shadow-sm">
            <BookOpen className="w-5 h-5 text-blue-400 mx-auto mb-1" />
            <span className="block text-lg font-black text-white">
              {stats.totalQuizzesTaken}
            </span>
            <span className="text-[10px] font-medium text-slate-400">
              {t('home.total_quizzes', 'کل کوئز')}
            </span>
          </div>

          <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-3 text-center shadow-sm">
            <Award className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
            <span className="block text-lg font-black text-white">
              {stats.xpPoints}
            </span>
            <span className="text-[10px] font-medium text-slate-400">
              {t('home.xp_points', 'ایکس پی پوائنٹس')}
            </span>
          </div>
        </div>
      </div>

      {/* Study Tools */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
          {t('home.study_tools', 'مطالعہ کے ٹولز')}
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => onOpenFutureFeature('Bookmarks')}
            className="p-3.5 bg-slate-800/70 border border-slate-700/60 rounded-2xl flex items-center gap-3 text-left hover:border-blue-500/50 transition group cursor-pointer"
          >
            <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl group-hover:scale-105 transition">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-xs font-bold text-white">
                {t('home.bookmarks', 'بک مارکس')}
              </span>
              <span className="text-[10px] text-slate-400">
                {stats.bookmarkedQuestionIds?.length || 0} {t('home.saved', 'محفوظ کردہ')}
              </span>
            </div>
          </button>

          <button
            onClick={onStartQuiz}
            className="p-3.5 bg-slate-800/70 border border-slate-700/60 rounded-2xl flex items-center gap-3 text-left hover:border-blue-500/50 transition group cursor-pointer"
          >
            <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-xl group-hover:scale-105 transition">
              <Play className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-xs font-bold text-white">
                {t('home.all_quizzes', 'تمام کوئز')}
              </span>
              <span className="text-[10px] text-slate-400">{t('home.categories', 'اقسام')}</span>
            </div>
          </button>
        </div>
      </div>

      {/* Verse Card */}
      <div className="p-4 bg-slate-800/40 border border-slate-700/40 rounded-2xl">
        <span className="text-[10px] font-bold tracking-wider text-blue-400 uppercase">
          {t('home.verse_of_day', 'آج کی آیت')}
        </span>
        <p className="text-xs italic text-slate-300 mt-1">
          {t('home.verse_text', '"تیرا کلام میرے قدموں کے لیے چراغ اور میری راہ کے لیے روشنی ہے۔"')}
        </p>
        <span className="text-[10px] text-slate-500 font-semibold mt-1 block">
          — {t('home.verse_ref', 'زبور 119:105')}
        </span>
      </div>
    </div>
  );
};