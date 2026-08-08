import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, ArrowRight, ArrowLeft, CheckCircle2, Bookmark, Lightbulb } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Question, QuizSettings } from '../models';

interface QuestionScreenProps {
  questions: Question[];
  currentQuestionIndex: number;
  onNextQuestion: () => void;
  onPrevQuestion: () => void;
  onSubmitQuiz: () => void;
  onExitQuiz: () => void;
  settings: QuizSettings;
  bookmarkedIds: string[];
  onToggleBookmark: (id: string) => void;
}

export const QuestionScreen: React.FC<QuestionScreenProps> = ({
  questions,
  currentQuestionIndex,
  onNextQuestion,
  onPrevQuestion,
  onSubmitQuiz,
  onExitQuiz,
  bookmarkedIds,
  onToggleBookmark,
}) => {
  const { t } = useTranslation();
  const [typedAnswer, setTypedAnswer] = useState<string>('');
  const [showHint, setShowHint] = useState<boolean>(false);

  const currentQ = questions[currentQuestionIndex] as any;
  if (!currentQ) return null;

  // Safe Property Fallbacks
  const qText = currentQ.questionText || currentQ.question || '';
  const qRef = currentQ.scriptureReference || currentQ.hintReference || currentQ.explanationHint || '';

  const isBookmarked = bookmarkedIds.includes(currentQ.id);
  const isLast = currentQuestionIndex === questions.length - 1;

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white p-4 max-w-md mx-auto justify-between">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <button
          onClick={onExitQuiz}
          className="text-xs px-3 py-1.5 bg-slate-800 rounded-xl text-slate-300 font-bold"
        >
          {t('common.exit', 'Exit')}
        </button>

        <span className="text-sm font-bold text-amber-400">
          Question {currentQuestionIndex + 1} / {questions.length}
        </span>

        <button
          onClick={() => onToggleBookmark(currentQ.id)}
          className={`p-2 rounded-xl border ${
            isBookmarked
              ? 'bg-amber-500/20 border-amber-500 text-amber-400'
              : 'bg-slate-800 border-slate-700 text-slate-400'
          }`}
        >
          <Bookmark className="w-4 h-4" />
        </button>
      </div>

      {/* Main Question Card */}
      <motion.div
        key={currentQ.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="my-auto space-y-4"
      >
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400 mb-2">
            <HelpCircle className="w-4 h-4" />
            <span>Type Your Answer</span>
          </div>

          <h3 className="text-lg md:text-xl font-bold leading-relaxed text-slate-100">
            {qText}
          </h3>

          {/* Scripture Reference / Hint */}
          {qRef && (
            <div className="mt-4 pt-3 border-t border-slate-700/50">
              {showHint ? (
                <div className="text-xs text-amber-300 bg-amber-950/40 p-2.5 rounded-xl border border-amber-800/40">
                  📖 Ref: {qRef}
                </div>
              ) : (
                <button
                  onClick={() => setShowHint(true)}
                  className="flex items-center gap-1.5 text-xs text-amber-400 hover:underline"
                >
                  <Lightbulb className="w-3.5 h-3.5" /> Show Hint / Reference
                </button>
              )}
            </div>
          )}
        </div>

        {/* Text Area Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400">Write Answer:</label>
          <textarea
            value={typedAnswer}
            onChange={(e) => setTypedAnswer(e.target.value)}
            placeholder="Type your response here..."
            className="w-full h-28 bg-slate-800 border border-slate-700 rounded-2xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
          />
        </div>
      </motion.div>

      {/* Bottom Controls */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800">
        <button
          onClick={onPrevQuestion}
          disabled={currentQuestionIndex === 0}
          className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold text-xs disabled:opacity-40 flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Prev
        </button>

        {isLast ? (
          <button
            onClick={onSubmitQuiz}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-900/30"
          >
            <CheckCircle2 className="w-4 h-4" /> Submit
          </button>
        ) : (
          <button
            onClick={() => {
              setTypedAnswer('');
              setShowHint(false);
              onNextQuestion();
            }}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-blue-900/30"
          >
            Next <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};