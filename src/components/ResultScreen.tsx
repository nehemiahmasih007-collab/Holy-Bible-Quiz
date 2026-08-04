import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import confetti from 'canvas-confetti';
import {
  Trophy,
  CheckCircle,
  XCircle,
  HelpCircle,
  Clock,
  Percent,
  RotateCcw,
  Home,
  BookOpen,
  Award,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Question, QuizSettings } from '../types';
import { soundFx } from '../utils/sound';

interface ResultScreenProps {
  questions: Question[];
  userAnswers: (number | null)[];
  timeSpentSeconds?: number;
  onRestartQuiz: () => void;
  onGoHome: () => void;
  settings: QuizSettings;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  questions,
  userAnswers,
  timeSpentSeconds = 0,
  onRestartQuiz,
  onGoHome,
  settings,
}) => {
  const { t } = useTranslation();
  const [showDetails, setShowDetails] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const totalQuestions = questions.length;
  let correctCount = 0;
  let wrongCount = 0;
  let skippedCount = 0;

  questions.forEach((q, idx) => {
    const userSelected = userAnswers[idx];
    if (userSelected === null) {
      skippedCount++;
    } else if (userSelected === q.correctOptionIndex) {
      correctCount++;
    } else {
      wrongCount++;
    }
  });

  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  const formatTimeSpent = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  useEffect(() => {
    if (percentage >= 70) {
      soundFx.playFanfare(settings.soundEnabled);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D97706', '#F59E0B', '#2563EB', '#3B82F6', '#10B981'],
        });
      } catch {
        // Fallback if confetti fails
      }
    } else {
      soundFx.playClick(settings.soundEnabled);
    }
  }, [percentage, settings.soundEnabled]);

  const getPerformanceRating = () => {
    if (percentage === 100) return { title: 'Scripture Master! 🏆', sub: 'Outstanding! Perfect score on Scripture references.' };
    if (percentage >= 80) return { title: 'Bible Scholar! 🌟', sub: 'Great job! Excellent knowledge of God’s Word.' };
    if (percentage >= 60) return { title: 'Bible Explorer! 📖', sub: 'Good effort! Keep searching the Scriptures daily.' };
    return { title: 'Keep Reading! ✝️', sub: 'Encouragement: Open your Bible to study these passages.' };
  };

  const rating = getPerformanceRating();

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-5 gap-5 pb-8 overflow-y-auto">
      {/* Result Hero Header Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900 via-blue-950 to-slate-950 text-white p-6 shadow-xl border border-amber-400/40 text-center flex flex-col items-center gap-3"
      >
        <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Trophy / Award Badge */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 p-1 shadow-lg shadow-amber-500/30 flex items-center justify-center my-1">
          <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
            <Trophy className="w-10 h-10 text-amber-400" />
          </div>
        </div>

        <h1 className="text-2xl font-bold font-serif text-white tracking-tight">
          {rating.title}
        </h1>
        <p className="text-xs text-blue-200/90 max-w-xs leading-relaxed">
          {rating.sub}
        </p>

        {/* Circular Percentage Ring Display */}
        <div className="my-2 flex items-center justify-center">
          <div className="relative w-32 h-32 rounded-full border-4 border-amber-400/30 flex items-center justify-center bg-blue-900/40 backdrop-blur shadow-inner">
            <div className="text-center">
              <span className="block text-3xl font-black text-amber-400 font-mono">
                {percentage}%
              </span>
              <span className="block text-[10px] text-blue-200 uppercase tracking-widest font-bold">
                Percentage
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* RESULT SUMMARY Grid (Track: Correct, Wrong, Skipped, Percentage, Time Taken) */}
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
          📊 {t('home.stats')} {t('result.title')}
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {/* Correct Answers */}
          <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-3 text-center shadow-xs flex flex-col items-center justify-center">
            <CheckCircle className="w-5 h-5 text-emerald-500 mb-1" />
            <span className="block text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">
              {correctCount}
            </span>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              {t('result.correct')}
            </span>
          </div>

          {/* Wrong Answers */}
          <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-3 text-center shadow-xs flex flex-col items-center justify-center">
            <XCircle className="w-5 h-5 text-red-500 mb-1" />
            <span className="block text-lg font-black text-red-600 dark:text-red-400 font-mono">
              {wrongCount}
            </span>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              {t('result.wrong')}
            </span>
          </div>

          {/* Skipped Questions */}
          <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-3 text-center shadow-xs flex flex-col items-center justify-center">
            <HelpCircle className="w-5 h-5 text-amber-500 mb-1" />
            <span className="block text-lg font-black text-amber-600 dark:text-amber-400 font-mono">
              {skippedCount}
            </span>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              Skipped Questions
            </span>
          </div>

          {/* Percentage */}
          <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-3 text-center shadow-xs flex flex-col items-center justify-center">
            <Percent className="w-5 h-5 text-blue-500 mb-1" />
            <span className="block text-lg font-black text-blue-600 dark:text-blue-400 font-mono">
              {percentage}%
            </span>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              {t('result.score')}
            </span>
          </div>

          {/* Time Taken */}
          <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-3 text-center shadow-xs flex flex-col items-center justify-center col-span-2 sm:col-span-1">
            <Clock className="w-5 h-5 text-indigo-500 mb-1" />
            <span className="block text-lg font-black text-indigo-600 dark:text-indigo-400 font-mono">
              {formatTimeSpent(timeSpentSeconds)}
            </span>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              Time Taken
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons: Restart & Home */}
      <div className="flex flex-col gap-2.5">
        <button
          onClick={onRestartQuiz}
          className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-slate-950 font-extrabold text-sm shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 border border-amber-300/60 active:scale-98 transition"
        >
          <RotateCcw className="w-4 h-4" /> {t('result.restart')}
        </button>

        <button
          onClick={onGoHome}
          className="w-full py-3.5 px-5 rounded-2xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-sm border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750 flex items-center justify-center gap-2 active:scale-98 transition"
        >
          <Home className="w-4 h-4" /> {t('result.go_home')}
        </button>
      </div>

      {/* Accordion / Expandable Question Review Section */}
      <div className="pt-2 flex flex-col gap-3">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full p-3.5 bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-200/60 transition"
        >
          <span className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-500" />
            Review Question Scripture References ({questions.length})
          </span>
          {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showDetails && (
          <div className="flex flex-col gap-3 pt-1">
            {questions.map((q, idx) => {
              const selectedIdx = userAnswers[idx];
              const isCorrect = selectedIdx === q.correctOptionIndex;
              const isSkipped = selectedIdx === null;
              const isExpanded = expandedIndex === idx;

              return (
                <div
                  key={q.id}
                  className={`p-3.5 rounded-2xl border text-left transition ${
                    isCorrect
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60'
                      : isSkipped
                      ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60'
                      : 'bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900/60'
                  }`}
                >
                  <div
                    onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                    className="flex items-start justify-between cursor-pointer gap-2"
                  >
                    <div className="flex items-start gap-2">
                      {isCorrect ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      ) : isSkipped ? (
                        <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                          Question {idx + 1}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-snug">
                          {q.question}
                        </h4>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/80 flex flex-col gap-1 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-500">Your Answer:</span>
                      <span
                        className={`font-mono font-bold ${
                          isCorrect
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : isSkipped
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        {selectedIdx !== null && selectedIdx >= 0
                          ? q.options[selectedIdx]
                          : selectedIdx === -1
                          ? 'Time Expired ⏱️'
                          : 'Skipped'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-500">Correct Answer:</span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {q.options[q.correctOptionIndex]}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-500">📖 Scripture Reference:</span>
                      <span className="font-mono font-bold text-amber-700 dark:text-amber-300">
                        {q.hintReference || q.explanationHint}
                      </span>
                    </div>

                    {isExpanded && q.explanationHint && (
                      <div className="mt-2 p-2.5 bg-white dark:bg-slate-900/80 rounded-xl border border-amber-400/30 text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
                        <span className="font-bold text-amber-600 dark:text-amber-400 block mb-0.5 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Explanation / Study Hint:
                        </span>
                        {q.explanationHint}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
