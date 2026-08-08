import React from 'react';
import { useTranslation } from 'react-i18next';
import { Category, CategoryId } from '../models';
import { BookOpen, Scroll, Cross, Sparkles, Flame, Mail, Sun, Play } from 'lucide-react';

interface CategorySelectScreenProps {
  categories: Category[];
  onSelectCategoryAndStart: (catId: CategoryId) => void;
}

export const CategorySelectScreen: React.FC<CategorySelectScreenProps> = ({
  categories,
  onSelectCategoryAndStart,
}) => {
  const { t } = useTranslation();

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen': return <BookOpen className="w-6 h-6 text-amber-500" />;
      case 'Scroll': return <Scroll className="w-6 h-6 text-amber-500" />;
      case 'Cross': return <Cross className="w-6 h-6 text-blue-500" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6 text-amber-400" />;
      case 'Flame': return <Flame className="w-6 h-6 text-orange-500" />;
      case 'Mail': return <Mail className="w-6 h-6 text-indigo-500" />;
      case 'Sun': return <Sun className="w-6 h-6 text-emerald-500" />;
      default: return <BookOpen className="w-6 h-6 text-blue-500" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-5 gap-4 overflow-y-auto">
      <div className="text-center my-2">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          {t('home.select_category', 'Select Quiz Category')}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Choose a category to start your level quiz
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategoryAndStart(cat.id)}
            className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 hover:border-amber-400 transition-all flex items-center justify-between shadow-sm active:scale-98 text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-700/60">
                {getCategoryIcon(cat.iconName)}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {t(`categories.${cat.id}`, { defaultValue: cat.name })}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {t(`category_desc.${cat.id}`, { defaultValue: cat.description })}
                </p>
              </div>
            </div>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Play className="w-4 h-4 fill-amber-500" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};