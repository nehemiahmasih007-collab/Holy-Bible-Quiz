import React, { useState } from 'react';
import {
  ShieldCheck,
  LogOut,
  ArrowLeft,
  HelpCircle,
  FolderTree,
  Sliders,
  Settings,
  Database,
  Layers,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Question, Category, FeatureFlag, AppConfig, AdminLog } from '../types';
import { QuestionManager } from './QuestionManager';
import { CategoryManager } from './CategoryManager';
import { FeatureManager } from './FeatureManager';
import { SettingsManager } from './SettingsManager';
import { DataManager } from './DataManager';
import { FutureModules } from './FutureModules';

interface AdminDashboardProps {
  questions: Question[];
  categories: Category[];
  features: FeatureFlag[];
  appConfig: AppConfig;
  logs: AdminLog[];
  onLogout: () => void;
  onBackToApp: () => void;
  onRefreshData: () => void;
  onPreviewFeature: (title: string, desc: string) => void;
}

export type AdminTab =
  | 'overview'
  | 'questions'
  | 'categories'
  | 'features'
  | 'settings'
  | 'data'
  | 'future';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  questions,
  categories,
  features,
  appConfig,
  logs,
  onLogout,
  onBackToApp,
  onRefreshData,
  onPreviewFeature,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  const activeFeaturesCount = features.filter((f) => f.enabled).length;

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Admin Navigation Bar */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToApp}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
            title="Return to Student Mobile App"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-amber-400 font-serif">
                {appConfig.appName} Admin
              </span>
              <span className="text-[9px] font-mono font-bold bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-400/30">
                PRO
              </span>
            </div>
            <span className="text-[10px] text-slate-400">Master Management Console</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onLogout}
            className="px-3 py-1.5 rounded-xl bg-red-950/60 border border-red-800/80 text-red-300 hover:bg-red-900 text-xs font-bold flex items-center gap-1.5 transition"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </div>

      {/* Tab Navigation Menu */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-3 py-1.5 flex items-center gap-1 overflow-x-auto shrink-0 scrollbar-none">
        {[
          { id: 'overview', label: 'Dashboard', icon: BarChart3 },
          { id: 'questions', label: 'Questions', icon: HelpCircle },
          { id: 'categories', label: 'Categories', icon: FolderTree },
          { id: 'features', label: 'Features', icon: Sliders },
          { id: 'settings', label: 'Settings', icon: Settings },
          { id: 'data', label: 'Data / Backup', icon: Database },
          { id: 'future', label: 'Extensions', icon: Layers },
        ].map((tab) => {
          const IconC = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <IconC className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab View Container */}
      <div className="flex-1 p-4 overflow-y-auto">
        {activeTab === 'overview' && (
          <div className="flex flex-col gap-4">
            {/* Stat Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Total Questions
                </span>
                <div className="text-2xl font-extrabold text-amber-400 font-serif mt-1">
                  {questions.length}
                </div>
                <span className="text-[10px] text-slate-500 mt-1">Scripture Reference items</span>
              </div>

              <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Total Categories
                </span>
                <div className="text-2xl font-extrabold text-blue-400 font-serif mt-1">
                  {categories.length}
                </div>
                <span className="text-[10px] text-slate-500 mt-1">Active Bible topics</span>
              </div>

              <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Active Features
                </span>
                <div className="text-2xl font-extrabold text-emerald-400 font-serif mt-1">
                  {activeFeaturesCount} / {features.length}
                </div>
                <span className="text-[10px] text-slate-500 mt-1">Modules enabled</span>
              </div>

              <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Languages
                </span>
                <div className="text-2xl font-extrabold text-purple-400 font-serif mt-1">
                  4
                </div>
                <span className="text-[10px] text-slate-500 mt-1">EN, ES, PT, FR</span>
              </div>
            </div>

            {/* Quick Actions Shortcuts */}
            <div className="p-4 bg-gradient-to-r from-blue-950/80 to-slate-900 border border-blue-800/60 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-500/20 rounded-2xl text-amber-400 shrink-0">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white font-serif">Quick Management Shortcuts</h4>
                  <p className="text-[11px] text-blue-200/80">Add questions, customize categories, or toggle feature flags</p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setActiveTab('questions')}
                  className="flex-1 sm:flex-none px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition"
                >
                  Manage Questions
                </button>
                <button
                  onClick={() => setActiveTab('categories')}
                  className="flex-1 sm:flex-none px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition border border-slate-700"
                >
                  Edit Categories
                </button>
              </div>
            </div>

            {/* Recent Changes / Admin Audit Log */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white font-serif uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" /> Recent Changes Audit Log ({logs.length})
                </h4>
                <span className="text-[10px] text-slate-400">Real-time action history</span>
              </div>

              <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto pr-1">
                {logs.length === 0 ? (
                  <div className="p-4 text-center text-slate-500 text-xs">
                    No recent admin changes recorded yet.
                  </div>
                ) : (
                  logs.map((log) => (
                    <div
                      key={log.id}
                      className="p-2.5 bg-slate-950/80 border border-slate-800/80 rounded-xl flex items-start justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-amber-400 block text-[11px]">
                          {log.action}
                        </span>
                        <span className="text-slate-300 text-[11px]">{log.details}</span>
                      </div>
                      <span className="text-[9px] font-mono text-slate-500 shrink-0 ml-2 mt-0.5">
                        {log.timestamp}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'questions' && (
          <QuestionManager
            questions={questions}
            categories={categories}
            onRefresh={onRefreshData}
          />
        )}

        {activeTab === 'categories' && (
          <CategoryManager categories={categories} onRefresh={onRefreshData} />
        )}

        {activeTab === 'features' && (
          <FeatureManager features={features} onRefresh={onRefreshData} />
        )}

        {activeTab === 'settings' && (
          <SettingsManager appConfig={appConfig} onRefresh={onRefreshData} />
        )}

        {activeTab === 'data' && <DataManager onRefresh={onRefreshData} />}

        {activeTab === 'future' && (
          <FutureModules
            features={features}
            onGoToFeatures={() => setActiveTab('features')}
            onPreviewFeature={onPreviewFeature}
          />
        )}
      </div>
    </div>
  );
};
