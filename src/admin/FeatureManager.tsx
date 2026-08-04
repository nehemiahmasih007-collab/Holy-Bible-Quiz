import React, { useState } from 'react';
import {
  Sliders,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import { FeatureFlag } from '../models';
import { storageService } from '../services/storageService';

interface FeatureManagerProps {
  features: FeatureFlag[];
  onRefresh: () => void;
}

export const FeatureManager: React.FC<FeatureManagerProps> = ({
  features,
  onRefresh,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'core' | 'learning' | 'gamification' | 'social'>('learning');
  const [status, setStatus] = useState<'active' | 'beta' | 'planned'>('active');

  const handleToggle = async (id: string, currentEnabled: boolean) => {
    await storageService.toggleFeatureAsync(id, !currentEnabled);
    onRefresh();
  };

  const handleAddFeature = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await storageService.addFeatureAsync({
      name: name.trim(),
      description: description.trim(),
      enabled: true,
      category,
      status,
    });

    setName('');
    setDescription('');
    setIsModalOpen(false);
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this feature flag?')) {
      await storageService.deleteFeatureAsync(id);
      onRefresh();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Feature Flags & System Modules ({features.length})
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Dynamically enable, disable, and configure system modules in real-time
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md flex items-center gap-1.5 transition active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Feature
        </button>
      </div>

      {/* Feature List Grid */}
      <div className="flex flex-col gap-2.5 max-h-[500px] overflow-y-auto pr-1">
        {features.map((feat) => (
          <div
            key={feat.id}
            className={`p-3.5 bg-white dark:bg-slate-800/90 border rounded-2xl flex items-center justify-between shadow-sm transition ${
              feat.enabled
                ? 'border-blue-300 dark:border-blue-700/80'
                : 'border-slate-200 dark:border-slate-800 opacity-75'
            }`}
          >
            <div className="flex flex-col gap-1 pr-2">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white font-serif">
                  {feat.name}
                </h4>

                <span
                  className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                    feat.status === 'active'
                      ? 'bg-emerald-400/10 text-emerald-600 dark:text-emerald-400 border-emerald-400/30'
                      : feat.status === 'beta'
                      ? 'bg-amber-400/10 text-amber-600 dark:text-amber-400 border-amber-400/30'
                      : 'bg-purple-400/10 text-purple-600 dark:text-purple-400 border-purple-400/30'
                  }`}
                >
                  {feat.status}
                </span>

                <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/60 px-2 py-0.5 rounded-full">
                  {feat.category}
                </span>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {feat.description}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Toggle Switch */}
              <button
                onClick={() => handleToggle(feat.id, feat.enabled)}
                className={`w-11 h-6 rounded-full transition-colors p-0.5 relative flex items-center ${
                  feat.enabled ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                    feat.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>

              <button
                onClick={() => handleDelete(feat.id)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-red-500 transition"
                title="Delete Flag"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Feature Flag Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 w-full max-w-sm shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-serif flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-500" /> Add Feature Flag
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddFeature} className="flex flex-col gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Feature Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Daily Verse Audio Recitation"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Plays high-quality audio recitation of scripture passages"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value as 'core' | 'learning' | 'gamification' | 'social')
                    }
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="core">Core</option>
                    <option value="learning">Learning</option>
                    <option value="gamification">Gamification</option>
                    <option value="social">Social</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) =>
                      setStatus(e.target.value as 'active' | 'beta' | 'planned')
                    }
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="active">Active</option>
                    <option value="beta">Beta</option>
                    <option value="planned">Planned</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-extrabold shadow-md hover:bg-amber-600"
                >
                  Create Feature
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
