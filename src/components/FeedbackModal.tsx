import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import {
  X,
  MessageSquare,
  Star,
  ChevronDown,
  Send,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { QuizSettings } from '../models';
import { soundFx } from '../utils/sound';

interface FeedbackModalProps {
  settings: QuizSettings;
  onClose: () => void;
}

type FeedbackCategory = 'bug' | 'feature' | 'general' | 'other';

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  settings,
  onClose,
}) => {
  const { t } = useTranslation();
  const [rating, setRating] = useState<number>(5);
  const [category, setCategory] = useState<FeedbackCategory>('general');
  const [comments, setComments] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const categories: FeedbackCategory[] = ['bug', 'feature', 'general', 'other'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comments.trim()) {
      setError(t('feedback.validation_error'));
      return;
    }

    // Logic to process feedback (e.g., API call, mailto, etc.)
    console.log('Feedback Submitted:', {
      rating,
      category,
      comments,
      timestamp: new Date().toISOString(),
    });

    // Example of mailto integration
    // const mailtoUrl = `mailto:support@biblequizworld.app?subject=${category} Feedback&body=Rating: ${rating}/5%0D%0A%0D%0AComments: ${comments}`;
    // window.open(mailtoUrl);

    soundFx.playCorrect(settings.soundEnabled);
    setIsSubmitted(true);
    setError('');

    setTimeout(() => {
      onClose();
    }, 2500);
  };

  return (
    <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-5 relative overflow-hidden"
      >
        {/* Success Overlay */}
        <AnimatePresence>
          {isSubmitted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-white dark:bg-slate-900 z-10 flex flex-col items-center justify-center text-center p-6"
            >
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                {t('feedback.success')}
              </h2>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white font-serif">
              {t('feedback.title')}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Rating */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              {t('feedback.rating')}
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => {
                    setRating(star);
                    soundFx.playClick(settings.soundEnabled);
                  }}
                  className="transition-transform active:scale-90"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300 dark:text-slate-700'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              {t('feedback.category')}
            </label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => {
                    setCategory(e.target.value as FeedbackCategory);
                    soundFx.playClick(settings.soundEnabled);
                }}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm text-slate-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {t(`feedback.categories.${cat}`)}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Comments */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              {t('feedback.comments')}
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder={t('feedback.placeholder')}
              rows={4}
              className={`w-full p-3.5 bg-slate-50 dark:bg-slate-800 border ${
                error ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
              } rounded-2xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none`}
            />
            {error && (
              <div className="flex items-center gap-1.5 text-red-500 text-[11px] font-bold">
                <AlertCircle className="w-3.5 h-3.5" />
                {error}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-2 py-4 bg-gradient-to-r from-indigo-600 to-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 hover:brightness-110 active:scale-98 transition"
          >
            <Send className="w-4 h-4" />
            {t('feedback.submit')}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
