import React, { useState } from 'react';
import { Save, CheckCircle2, Image as ImageIcon, BookOpen, Cross, Scroll, Sparkles } from 'lucide-react';
import { AppConfig } from '../models';
import { storageService } from '../services/storageService';

interface SettingsManagerProps {
  appConfig: AppConfig;
  onRefresh: () => void;
}

export const SettingsManager: React.FC<SettingsManagerProps> = ({
  appConfig,
  onRefresh,
}) => {
  const [appName, setAppName] = useState(appConfig.appName);
  const [appLogo, setAppLogo] = useState(appConfig.appLogo);
  const [primaryColor, setPrimaryColor] = useState(appConfig.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(appConfig.secondaryColor);
  const [defaultDarkMode, setDefaultDarkMode] = useState(appConfig.defaultDarkMode);
  const [animationsEnabled, setAnimationsEnabled] = useState(appConfig.animationsEnabled);
  const [soundEnabled, setSoundEnabled] = useState(appConfig.soundEnabled);
  const [defaultLanguage, setDefaultLanguage] = useState(appConfig.defaultLanguage);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated: AppConfig = {
      appName: appName.trim() || 'Bible Quiz World',
      appLogo: appLogo.trim() || 'BookOpen',
      primaryColor,
      secondaryColor,
      defaultDarkMode,
      animationsEnabled,
      soundEnabled,
      defaultLanguage,
    };
    await storageService.saveAppConfigAsync(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
    onRefresh();
  };

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-4 text-xs">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Application Settings & Branding
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Customize app title, app logo, primary colors, language and sound
          </p>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-md flex items-center gap-1.5 transition active:scale-95"
        >
          <Save className="w-4 h-4" /> Save Settings
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-xs text-emerald-300 font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> App configuration updated successfully!
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* App Title */}
        <div className="p-3 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col gap-1.5">
          <label className="font-bold text-slate-900 dark:text-white">Application Title</label>
          <input
            type="text"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-serif font-bold focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* App Logo / Image URL */}
        <div className="p-3 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col gap-1.5">
          <label className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
            <ImageIcon className="w-3.5 h-3.5 text-amber-500" /> App Logo (Icon or Image URL)
          </label>
          <input
            type="text"
            value={appLogo}
            onChange={(e) => setAppLogo(e.target.value)}
            placeholder="BookOpen, Cross, Scroll or https://image-url..."
            className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono text-[11px] focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Default Language */}
        <div className="p-3 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col gap-1.5">
          <label className="font-bold text-slate-900 dark:text-white">Default Interface Language</label>
          <select
            value={defaultLanguage}
            onChange={(e) => setDefaultLanguage(e.target.value)}
            className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-amber-400"
          >
            <option value="English">English</option>
            <option value="Spanish">Español (Spanish)</option>
            <option value="Portuguese">Português (Portuguese)</option>
            <option value="French">Français (French)</option>
          </select>
        </div>

        {/* Primary Color Picker */}
        <div className="p-3 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col gap-1.5">
          <label className="font-bold text-slate-900 dark:text-white">Primary Theme Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="w-10 h-10 rounded-xl border-0 bg-transparent cursor-pointer"
            />
            <input
              type="text"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="flex-1 p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Switches Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-between">
          <span className="font-bold text-slate-900 dark:text-white">Dark Mode Default</span>
          <button
            type="button"
            onClick={() => setDefaultDarkMode(!defaultDarkMode)}
            className={`w-11 h-6 rounded-full p-0.5 transition ${defaultDarkMode ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'}`}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition ${defaultDarkMode ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>

        <div className="p-3 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-between">
          <span className="font-bold text-slate-900 dark:text-white">Animations</span>
          <button
            type="button"
            onClick={() => setAnimationsEnabled(!animationsEnabled)}
            className={`w-11 h-6 rounded-full p-0.5 transition ${animationsEnabled ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'}`}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition ${animationsEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>

        <div className="p-3 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-between">
          <span className="font-bold text-slate-900 dark:text-white">Sound Effects</span>
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`w-11 h-6 rounded-full p-0.5 transition ${soundEnabled ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'}`}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition ${soundEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>
    </form>
  );
};
