import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { setSavedLanguage } from '../utils/storage';

interface Props {
  onSelectLanguage: (lang: 'en' | 'ur') => void;
}

export const LanguageSelectModal: React.FC<Props> = ({ onSelectLanguage }) => {
  const { i18n } = useTranslation(); // 👈 i18n کا ہک استعمال کیا

  const handleSelect = (lang: 'en' | 'ur') => {
    i18n.changeLanguage(lang); // 👈 فوراً ایپ کی زبان بدل دی
    setSavedLanguage(lang);
    onSelectLanguage(lang);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl"
      >
        <h2 className="text-2xl font-bold text-white mb-2">
          Select Language / زبان select کریں
        </h2>
        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
          Choose your preferred language for the quiz
        </p>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => handleSelect('en')}
            className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/25 active:scale-98 cursor-pointer"
          >
            English
          </button>

          <button
            type="button"
            onClick={() => handleSelect('ur')}
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-600/25 active:scale-98 text-lg cursor-pointer"
            dir="rtl"
          >
            اردو (Urdu)
          </button>
        </div>
      </motion.div>
    </div>
  );
};