import React, { useState } from 'react';
import { Category, Question } from '../models';

interface Props {
  categories: Category[];
  onSelectBookQuestion: (bookName: string) => void;
}

export const QuestionCategoryScreen: React.FC<Props> = ({ onSelectBookQuestion }) => {
  const [activeTab, setActiveTab] = useState<'old Testament' | 'new Testament'>('old Testament');

  const oldTestamentBooks = [
    'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
    'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
    'Psalms', 'Proverbs', 'Isaiah', 'Jeremiah', 'Daniel'
  ];

  const newTestamentBooks = [
    'Matthew', 'Mark', 'Luke', 'John', 'Acts',
    'Romans', '1 Corinthians', '2 Corinthians', 'Galatians',
    'Ephesians', 'Philippians', 'Revelation'
  ];

  const currentBooks = activeTab === 'old Testament' ? oldTestamentBooks : newTestamentBooks;

  return (
    <div className="flex-1 p-4 overflow-y-auto bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white">
      <h2 className="text-xl font-bold mb-4 text-center">Select Testament & Book</h2>

      {/* Testament Switch Tabs */}
      <div className="flex bg-slate-200 dark:bg-slate-800 rounded-lg p-1 mb-6">
        <button
          onClick={() => setActiveTab('old Testament')}
          className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
            activeTab === 'old Testament'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Old Testament
        </button>
        <button
          onClick={() => setActiveTab('new Testament')}
          className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
            activeTab === 'new Testament'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          New Testament
        </button>
      </div>

      {/* Books List Grid */}
      <div className="grid grid-cols-2 gap-3">
        {currentBooks.map((book) => (
          <button
            key={book}
            onClick={() => onSelectBookQuestion(book)}
            className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-blue-500 hover:shadow-md text-left font-medium text-sm transition-all flex items-center justify-between"
          >
            <span>{book}</span>
            <span className="text-xs text-blue-500 font-bold">Start &rarr;</span>
          </button>
        ))}
      </div>
    </div>
  );
};