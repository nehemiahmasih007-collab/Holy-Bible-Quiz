import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
  Bookmark,
  BookmarkCheck,
  AlertCircle,
  Lightbulb,
  X,
  Sparkles,
  Trophy,
  Zap,
  Flame,
} from 'lucide-react';
import { Question, QuizSettings } from '../models';
import { soundFx } from '../utils/sound';

interface QuizScreenProps {
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: (number | null)[];
  onSelectOption: (questionIndex: number, optionIndex: number) => void;
  onNextQuestion: () => void;
  onPrevQuestion: () => void;
  onSubmitQuiz: () => void;
  onExitQuiz: () => void;
  settings: QuizSettings;
  bookmarkedIds: string[];
  onToggleBookmark: (id: string) => void;
}

type DifficultyLevel = 'easy' | 'medium' | 'hard';

export const QuizScreen: React.FC<QuizScreenProps> = ({
  questions,
  currentQuestionIndex,
  userAnswers,
  onSelectOption,
  onNextQuestion,
  onPrevQuestion,
  onSubmitQuiz,
  onExitQuiz,
  settings,
  bookmarkedIds,
  onToggleBookmark,
}) => {
  const { t, i18n } = useTranslation();
  const isUrdu = Boolean(i18n.language && i18n.language.startsWith('ur'));

  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);
  const [showHintSheet, setShowHintSheet] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(settings.timePerQuestion || 20);

  // Transition State for Level Switch Modal
  const [levelTransition, setLevelTransition] = useState<{
    show: boolean;
    completedLevel: DifficultyLevel;
    nextLevel: DifficultyLevel;
  } | null>(null);

  // 1. Sort/Group Questions by Level (Easy -> Medium -> Hard)
  const sortedQuestions = useMemo(() => {
    const levelOrder: Record<string, number> = { easy: 1, medium: 2, hard: 3 };
    return [...questions].sort((a, b) => {
      const levelA = levelOrder[a.difficulty?.toLowerCase() || 'easy'] || 1;
      const levelB = levelOrder[b.difficulty?.toLowerCase() || 'easy'] || 1;
      return levelA - levelB;
    });
  }, [questions]);

  const currentQuestion = sortedQuestions[currentQuestionIndex];
  const totalQuestions = sortedQuestions.length;
  const selectedOption = userAnswers[currentQuestionIndex];
  const hasAnswered = selectedOption !== null && selectedOption !== undefined;
  const isBookmarked = currentQuestion ? bookmarkedIds.includes(currentQuestion.id) : false;

  // Cast question safely for multilingual support
  const qAny = currentQuestion as any;

  // Language Fallbacks for Questions
  const questionText = isUrdu
    ? qAny?.questionUr || currentQuestion?.question
    : qAny?.questionEn || currentQuestion?.question;

  const currentOptions: string[] = isUrdu
    ? qAny?.optionsUr && qAny.optionsUr.length > 0
      ? qAny.optionsUr
      : currentQuestion?.options || []
    : qAny?.optionsEn && qAny.optionsEn.length > 0
    ? qAny.optionsEn
    : currentQuestion?.options || [];

  const hintRefText = isUrdu
    ? qAny?.hintReferenceUr || currentQuestion?.hintReference || qAny?.explanationHint || ''
    : qAny?.hintReferenceEn || currentQuestion?.hintReference || qAny?.explanationHint || '';

  const correctIdx = currentQuestion ? Number(currentQuestion.correctOptionIndex) : -1;
  const isSelectedCorrect = selectedOption === correctIdx;

  // Level Detection Logic
  const currentDifficulty: DifficultyLevel = (currentQuestion?.difficulty?.toLowerCase() as DifficultyLevel) || 'easy';

  // Check for Level Completion on Question Index Change
  useEffect(() => {
    setShowHintSheet(false);

    if (currentQuestionIndex > 0) {
      const prevQuestion = sortedQuestions[currentQuestionIndex - 1];
      const prevLevel = (prevQuestion?.difficulty?.toLowerCase() as DifficultyLevel) || 'easy';
      const currLevel = (currentQuestion?.difficulty?.toLowerCase() as DifficultyLevel) || 'easy';

      if (prevLevel !== currLevel) {
        soundFx.playCorrect(settings.soundEnabled);
        setLevelTransition({
          show: true,
          completedLevel: prevLevel,
          nextLevel: currLevel,
        });
      }
    }
  }, [currentQuestionIndex, sortedQuestions, settings.soundEnabled]);

  // Timer Logic
  useEffect(() => {
    if (!settings.timerEnabled || hasAnswered || levelTransition?.show) return;

    setTimerSeconds(settings.timePerQuestion || 20);
    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          soundFx.playWrong(settings.soundEnabled);
          onSelectOption(currentQuestionIndex, -1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [
    currentQuestionIndex,
    settings.timerEnabled,
    settings.timePerQuestion,
    settings.soundEnabled,
    hasAnswered,
    onSelectOption,
    levelTransition?.show,
  ]);

  if (!currentQuestion) return null;

  const handleOptionClick = (index: number) => {
    if (hasAnswered) return;

    if (index === correctIdx) {
      soundFx.playCorrect(settings.soundEnabled);
    } else {
      soundFx.playWrong(settings.soundEnabled);
    }

    onSelectOption(currentQuestionIndex, index);
  };

  const handleNextClick = () => {
    soundFx.playClick(settings.soundEnabled);
    if (currentQuestionIndex < totalQuestions - 1) {
      onNextQuestion();
    } else {
      onSubmitQuiz();
    }
  };

  const handlePrevClick = () => {
    soundFx.playClick(settings.soundEnabled);
    onPrevQuestion();
  };

  const optionLabels = ['A', 'B', 'C', 'D'];
  const progressPercent = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);

  // Badge Colors by Difficulty Level
  const getLevelBadge = (level: DifficultyLevel) => {
    switch (level) {
      case 'easy':
        return {
          label: isUrdu ? 'آسان (Easy)' : 'Easy Level',
          bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
          icon: <Zap className="w-3.5 h-3.5 text-emerald-500" />,
        };
      case 'medium':
        return {
          label: isUrdu ? 'درمیانہ (Medium)' : 'Medium Level',
          bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
          icon: <Flame className="w-3.5 h-3.5 text-amber-500" />,
        };
      case 'hard':
        return {
          label: isUrdu ? 'مشکل (Hard)' : 'Hard Level',
          bg: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30',
          icon: <Trophy className="w-3.5 h-3.5 text-red-500" />,
        };
      default:
        return {
          label: 'Easy',
          bg: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
          icon: <Zap className="w-3.5 h-3.5 text-emerald-500" />,
        };
    }
  };

  const currentLevelBadge = getLevelBadge(currentDifficulty);

  return (
    <div
      className="flex-1 flex flex-col justify-between p-4 sm:p-5 relative overflow-y-auto bg-slate-50 dark:bg-slate-900"
      dir={isUrdu ? 'rtl' : 'ltr'}
    >
      {/* Top Header Navigation & Status Bar */}
      <div className="flex flex-col gap-3 shrink-0 pt-1">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowExitConfirm(true)}
            className="p-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition shadow-xs active:scale-95"
            aria-label="Exit Quiz"
          >
            <ArrowLeft className={`w-5 h-5 ${isUrdu ? 'rotate-180' : ''}`} />
          </button>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {t('quiz.question')} {currentQuestionIndex + 1} / {totalQuestions}
            </span>

            {settings.timerEnabled && (
              <div
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${
                  timerSeconds <= 5
                    ? 'bg-red-100 text-red-600 border-red-300 dark:bg-red-950/60 dark:text-red-400'
                    : 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-950/60 dark:text-amber-400'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{timerSeconds}s</span>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              soundFx.playClick(settings.soundEnabled);
              onToggleBookmark(currentQuestion.id);
            }}
            className={`p-2 rounded-2xl border transition active:scale-95 ${
              isBookmarked
                ? 'bg-amber-400/20 border-amber-400 text-amber-500'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
            }`}
            aria-label="Bookmark Question"
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-5 h-5 fill-amber-500" />
            ) : (
              <Bookmark className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-300/40 dark:border-slate-700/50">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
            className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 rounded-full"
          />
        </div>
      </div>

      {/* Main Question Card Container */}
      <div className="my-auto py-4 flex flex-col gap-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: isUrdu ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isUrdu ? 20 : -20 }}
            transition={{ duration: 0.25 }}
            className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-3xl p-5 shadow-lg relative overflow-hidden flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              {/* Dynamic Level Indicator Badge */}
              <span
                className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border inline-flex items-center gap-1.5 ${currentLevelBadge.bg}`}
              >
                {currentLevelBadge.icon}
                <span>{currentLevelBadge.label}</span>
              </span>

              <button
                onClick={() => {
                  soundFx.playClick(settings.soundEnabled);
                  setShowHintSheet(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-bold transition active:scale-95 shadow-xs"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>{isUrdu ? 'اشارہ (Hint)' : 'Hint'}</span>
              </button>
            </div>

            <h2 className={`text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug ${isUrdu ? 'font-serif text-right' : 'font-sans text-left'}`}>
              {questionText}
            </h2>
          </motion.div>
        </AnimatePresence>

        {/* Answer Options */}
        <div className="flex flex-col gap-2.5">
          {currentOptions.map((optionText, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrectOption = idx === correctIdx;

            let buttonStyle =
              'bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 hover:border-blue-400 cursor-pointer';
            let badgeStyle = 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300';
            let animateProps = {};

            if (hasAnswered) {
              if (isCorrectOption) {
                buttonStyle =
                  'bg-emerald-500/15 border-2 border-emerald-500 text-emerald-950 dark:text-emerald-100 shadow-md ring-2 ring-emerald-500/30 font-bold';
                badgeStyle = 'bg-emerald-500 text-white font-bold';
                animateProps = { scale: [1, 1.02, 1] };
              } else if (isSelected && !isCorrectOption) {
                buttonStyle =
                  'bg-red-500/15 border-2 border-red-500 text-red-950 dark:text-red-100 shadow-md ring-2 ring-red-500/30 font-bold';
                badgeStyle = 'bg-red-500 text-white font-bold';
                animateProps = { x: [-4, 4, -2, 2, 0] };
              } else {
                buttonStyle =
                  'opacity-40 cursor-not-allowed bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400';
              }
            }

            return (
              <motion.button
                key={`${currentQuestionIndex}-${idx}`}
                animate={animateProps}
                transition={{ duration: 0.3 }}
                onClick={() => handleOptionClick(idx)}
                disabled={hasAnswered}
                className={`w-full min-h-[56px] p-3.5 rounded-2xl border flex items-center justify-between transition-all duration-200 ${
                  isUrdu ? 'text-right' : 'text-left'
                } ${buttonStyle}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition ${badgeStyle}`}
                  >
                    {optionLabels[idx] || idx + 1}
                  </div>
                  <span className={`font-semibold text-xs sm:text-sm tracking-wide ${isUrdu ? 'font-serif' : ''}`}>
                    {optionText}
                  </span>
                </div>

                <div className="shrink-0">
                  {hasAnswered ? (
                    isCorrectOption ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    ) : isSelected ? (
                      <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-slate-300/50 dark:border-slate-700" />
                    )
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600" />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Feedback Banner */}
        <AnimatePresence>
          {hasAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className={`p-4 rounded-2xl border-2 shadow-lg flex flex-col gap-2.5 ${
                isSelectedCorrect
                  ? 'bg-emerald-500/15 border-emerald-500/80 text-emerald-950 dark:text-emerald-100'
                  : 'bg-red-500/15 border-red-500/80 text-red-950 dark:text-red-100'
              }`}
            >
              {isSelectedCorrect ? (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-emerald-800 dark:text-emerald-300">
                      {isUrdu ? 'درست جواب! 🎉' : '✅ Correct Answer!'}
                    </h4>
                    {hintRefText && (
                      <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
                        {isUrdu ? 'حوالہ / تفصیل: ' : 'Reference: '}{' '}
                        <span className="font-mono font-bold">{hintRefText}</span>
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-red-700 dark:text-red-300 font-extrabold text-sm">
                    <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                    <span>{isUrdu ? 'غلط جواب!' : '❌ Incorrect Answer.'}</span>
                  </div>

                  <div className="pt-2 border-t border-red-300/50 dark:border-red-800/60 flex flex-col gap-1.5 text-xs">
                    <div>
                      <span className="font-semibold text-slate-600 dark:text-slate-400 block text-[11px]">
                        {isUrdu ? 'صحیح جواب:' : 'Correct Answer:'}
                      </span>
                      <span className="font-extrabold text-emerald-700 dark:text-emerald-300 text-sm block">
                        {currentOptions[correctIdx]}
                      </span>
                    </div>

                    {hintRefText && (
                      <div>
                        <span className="font-semibold text-slate-600 dark:text-slate-400 block text-[11px]">
                          {isUrdu ? '📖 حوالہ جات:' : '📖 Scripture Reference:'}
                        </span>
                        <span className="font-mono font-bold text-amber-700 dark:text-amber-300 text-xs block">
                          {hintRefText}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Controls Bar */}
      <div className="flex items-center justify-between gap-3 shrink-0 pt-2 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={handlePrevClick}
          disabled={currentQuestionIndex === 0}
          className={`flex-1 py-3 px-4 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
            currentQuestionIndex === 0
              ? 'opacity-40 cursor-not-allowed bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400'
              : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
          }`}
        >
          <ArrowLeft className={`w-4 h-4 ${isUrdu ? 'rotate-180' : ''}`} /> {t('quiz.previous')}
        </button>

        <button
          onClick={handleNextClick}
          className={`flex-1 py-3 px-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-md active:scale-95 ${
            hasAnswered
              ? currentQuestionIndex === totalQuestions - 1
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 border border-amber-300/60 shadow-amber-500/20 ring-2 ring-amber-400/40'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border border-blue-400 ring-2 ring-blue-500/40'
              : currentQuestionIndex === totalQuestions - 1
              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 border border-amber-300/60 shadow-amber-500/20'
              : 'bg-blue-600 hover:bg-blue-700 text-white border border-blue-500'
          }`}
        >
          {currentQuestionIndex === totalQuestions - 1 ? (
            <>{t('quiz.submit')}</>
          ) : (
            <>
              {t('quiz.next')} <ArrowRight className={`w-4 h-4 ${isUrdu ? 'rotate-180' : ''}`} />
            </>
          )}
        </button>
      </div>

      {/* 🎉 Level Completion Table / Transition Overlay Screen */}
      <AnimatePresence>
        {levelTransition?.show && (
          <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center flex flex-col items-center gap-4 relative overflow-hidden"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/30">
                <Trophy className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white font-serif">
                  {isUrdu ? 'مبارک ہو! 🎉' : 'Congratulations! 🎉'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {isUrdu
                    ? `آپ نے ${levelTransition.completedLevel.toUpperCase()} مرحلے کے تمام سوالات مکمل کر لیے ہیں۔`
                    : `You have completed all questions for the ${levelTransition.completedLevel.toUpperCase()} level.`}
                </p>
              </div>

              {/* Status Table */}
              <div className="w-full bg-slate-100 dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/60 flex flex-col gap-3 my-1">
                <div className="flex items-center justify-between text-xs border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="text-slate-500 dark:text-slate-400 font-semibold">
                    {isUrdu ? 'مکمل شدہ اسٹیج:' : 'Completed Level:'}
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {levelTransition.completedLevel}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400 font-semibold">
                    {isUrdu ? 'اگلا اسٹیج:' : 'Next Level:'}
                  </span>
                  <span className="font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    {levelTransition.nextLevel}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setLevelTransition(null)}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-extrabold text-sm rounded-2xl shadow-lg shadow-amber-500/20 active:scale-98 transition flex items-center justify-center gap-2"
              >
                <span>{isUrdu ? 'اگلا لیول شروع کریں' : 'Start Next Level'}</span>
                <ArrowRight className={`w-4 h-4 ${isUrdu ? 'rotate-180' : ''}`} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hint Bottom Sheet */}
      <AnimatePresence>
        {showHintSheet && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex flex-col justify-end p-0 sm:p-4 sm:items-center sm:justify-center">
            <div className="absolute inset-0" onClick={() => setShowHintSheet(false)} />

            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full sm:max-w-md bg-white dark:bg-slate-900 border-t sm:border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl z-10 flex flex-col gap-4 text-left"
            >
              <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto -mt-2 mb-1 sm:hidden" />

              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white font-serif">
                      {isUrdu ? 'رہنمائی / اشارہ' : 'Study Hint'}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setShowHintSheet(false)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  aria-label="Close Hint"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/30 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Reference
                </span>
                <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-amber-200 font-mono">
                  📖 {hintRefText || 'Scripture Passage'}
                </div>
              </div>

              <button
                onClick={() => setShowHintSheet(false)}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs rounded-2xl shadow-md active:scale-98 transition"
              >
                {isUrdu ? 'سمجھ گیا!' : 'Got it!'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Exit Modal */}
      {showExitConfirm && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 w-full max-w-xs shadow-2xl text-center flex flex-col items-center gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif">
                {t('quiz.exit')}?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {t('quiz.confirm_exit')}
              </p>
            </div>

            <div className="flex items-center gap-2.5 w-full pt-1">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-xs font-semibold text-slate-700 dark:text-slate-200"
              >
                {t('quiz.continue')}
              </button>
              <button
                onClick={onExitQuiz}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-xs font-semibold shadow-sm hover:bg-red-700"
              >
                {t('quiz.exit')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};