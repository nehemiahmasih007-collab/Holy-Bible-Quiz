import React from 'react';
import { Home, HelpCircle, BookOpen, Award } from 'lucide-react';

interface BottomNavProps {
  currentScreen: string;
  onNavigate: (screen: 'home' | 'quiz' | 'question' | 'result') => void;
}

export const BottomNavigation: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'quiz', label: 'Quiz', icon: HelpCircle },
    { id: 'question', label: 'Questions', icon: BookOpen },
    { id: 'result', label: 'Results', icon: Award },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-2 px-4 flex justify-around items-center z-50 shadow-lg">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentScreen === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id as any)}
            className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${
              isActive
                ? 'text-blue-600 dark:text-blue-400 font-bold scale-105'
                : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-700'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            <span className="text-[11px]">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};