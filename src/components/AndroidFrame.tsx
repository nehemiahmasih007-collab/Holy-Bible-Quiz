import React from 'react';
import { QuizSettings } from '../models';

interface AndroidFrameProps {
  children: React.ReactNode;
  settings: QuizSettings;
  onUpdateSettings: (newSettings: Partial<QuizSettings>) => void;
  onOpenSettings: () => void;
  screenTitle?: string;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  settings,
}) => {
  return (
    <div
      className={`min-h-screen w-full flex flex-col overflow-hidden transition-colors duration-300 ${
        settings.darkMode ? 'bg-slate-900 text-slate-100 dark' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col relative custom-scrollbar">
        {children}
      </div>
    </div>
  );
};
