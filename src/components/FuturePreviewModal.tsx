import React from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles, Layers, BookMarked, Bookmark, Award, Clock } from 'lucide-react';

interface FuturePreviewModalProps {
  featureTitle: string;
  onClose: () => void;
}

const getFeatureDetails = (title: string) => {
  switch (title) {
    case 'Flashcards & Memory Verses':
      return {
        icon: <Layers className="w-8 h-8 text-amber-500" />,
        desc: 'Interactive digital flashcards for memorizing key Bible references, chapters, and books across the Old and New Testaments.',
        bullets: [
          'Flip card to reveal scripture reference',
          'Filter cards by topic or Testament',
          'Spaced repetition study mode',
        ],
      };
    case 'Daily Scripture Challenge':
      return {
        icon: <Sparkles className="w-8 h-8 text-orange-500" />,
        desc: 'A daily 3-question scripture challenge delivered every morning to maintain your daily Bible reading habit and streak.',
        bullets: [
          'Daily XP bonus rewards',
          'Global streak counter',
          'Unique daily scripture topic',
        ],
      };
    case 'Bookmarked Scripture References':
      return {
        icon: <Bookmark className="w-8 h-8 text-blue-500" />,
        desc: 'Quick access to all questions and scripture references you have bookmarked during quiz sessions for deeper study.',
        bullets: [
          'Saved scripture reference list',
          'Personal study notes attachment',
          'Direct search across saved items',
        ],
      };
    case 'Scripture Study Notes':
      return {
        icon: <BookMarked className="w-8 h-8 text-purple-500" />,
        desc: 'Your personal digital notebook for jotting down reflections, key insights, and cross-references as you read your Bible.',
        bullets: [
          'Rich text notebook',
          'Organized by Bible book and chapter',
          'Export or print study notes',
        ],
      };
    default:
      return {
        icon: <Award className="w-8 h-8 text-emerald-500" />,
        desc: 'Experience points system, achievements, and level progression as you advance through Bible Quiz World.',
        bullets: [
          'Unlock Bible Scholar badges',
          'Track cumulative XP points',
          'Level up from Novice to Master',
        ],
      };
  }
};

export const FuturePreviewModal: React.FC<FuturePreviewModalProps> = ({
  featureTitle,
  onClose,
}) => {
  const details = getFeatureDetails(featureTitle);

  return (
    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-5">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 shadow-2xl flex flex-col items-center text-center gap-4 relative"
      >
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-3 bg-slate-100 dark:bg-slate-700/60 rounded-2xl my-1 border border-slate-200 dark:border-slate-600">
          {details.icon}
        </div>

        <div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-600 dark:text-amber-400 border border-amber-400/30 mb-1.5">
            <Clock className="w-3 h-3" /> Future Expansion Module
          </span>
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif">
            {featureTitle}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
            {details.desc}
          </p>
        </div>

        <div className="w-full bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-left text-[11px] flex flex-col gap-1.5">
          <span className="font-bold text-slate-800 dark:text-slate-200">
            Planned Capabilities:
          </span>
          {details.bullets.map((bullet, idx) => (
            <div key={idx} className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
              <span>{bullet}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          type="button"
          className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
        >
          Got It
        </button>
      </motion.div>
    </div>
  );
};