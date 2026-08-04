import React, { useState, useEffect } from 'react';
import {
  Download,
  Upload,
  Database,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Plus,
  Trash2,
  RefreshCw,
  Archive,
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { databaseService } from '../services/DatabaseService';
import { BackupRecord } from '../models';

interface DataManagerProps {
  onRefresh: () => void;
}

export const DataManager: React.FC<DataManagerProps> = ({ onRefresh }) => {
  const [backups, setBackups] = useState<BackupRecord[]>([]);
  const [manualBackupName, setManualBackupName] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadBackups = async () => {
    const list = await databaseService.getBackups();
    setBackups(list);
  };

  useEffect(() => {
    loadBackups();
  }, []);

  const handleCreateManualBackup = async () => {
    const name = manualBackupName.trim() || `Manual Backup (${new Date().toLocaleDateString()})`;
    await storageService.createBackupAsync(name);
    setManualBackupName('');
    setMessage({ type: 'success', text: `Created local database snapshot "${name}"` });
    await loadBackups();
  };

  const handleRestoreBackup = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to restore database snapshot "${name}"? Current state will be overwritten.`)) {
      const success = await storageService.restoreBackupAsync(id);
      if (success) {
        setMessage({ type: 'success', text: `Restored database to snapshot "${name}"` });
        onRefresh();
        await loadBackups();
      } else {
        setMessage({ type: 'error', text: 'Failed to restore backup snapshot.' });
      }
    }
  };

  const handleDeleteBackup = async (id: string) => {
    if (confirm('Delete this backup snapshot?')) {
      await storageService.deleteBackupAsync(id);
      setMessage({ type: 'success', text: 'Backup snapshot deleted.' });
      await loadBackups();
    }
  };

  const handleExportJSON = async () => {
    await storageService.exportJSON();
    setMessage({ type: 'success', text: 'Downloaded complete database JSON export!' });
  };

  const handleReset = async () => {
    if (
      confirm(
        'CRITICAL WARNING: This will reset all questions, categories, features, and settings back to factory defaults. Continue?'
      )
    ) {
      await storageService.resetQuestionsToDefaultAsync();
      await storageService.resetCategoriesToDefaultAsync();
      setMessage({ type: 'success', text: 'Factory settings restored.' });
      onRefresh();
      await loadBackups();
    }
  };

  return (
    <div className="flex flex-col gap-4 text-xs">
      <div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Database & Auto Backups
        </h3>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Local SQLite/IndexedDB persistence, automated snapshot backups, restore & export
        </p>
      </div>

      {message && (
        <div
          className={`p-3 rounded-2xl border text-xs font-semibold flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
              : 'bg-red-500/20 border-red-500/40 text-red-300'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          )}
          {message.text}
        </div>
      )}

      {/* Manual Backup Creation & Export Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Create Manual Backup Card */}
        <div className="p-4 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 shrink-0">
              <Archive className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white font-serif text-sm">
                Create Database Backup
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Save an instant local snapshot of all questions, categories, and settings.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Backup title e.g. Pre-Import v2"
              value={manualBackupName}
              onChange={(e) => setManualBackupName(e.target.value)}
              className="flex-1 p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs"
            />
            <button
              onClick={handleCreateManualBackup}
              className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow flex items-center gap-1 transition shrink-0"
            >
              <Plus className="w-4 h-4" /> Save
            </button>
          </div>
        </div>

        {/* Export & Reset Card */}
        <div className="p-4 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white font-serif text-sm">
                Export & Factory Reset
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Download JSON file or restore initial factory default questions dataset.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJSON}
              className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow flex items-center justify-center gap-1 transition"
            >
              <Download className="w-3.5 h-3.5" /> Export JSON
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-2 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/40 font-bold rounded-xl flex items-center justify-center gap-1 transition shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        </div>
      </div>

      {/* Local Auto Backups List */}
      <div className="p-4 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-amber-500" />
            <h4 className="font-bold text-slate-900 dark:text-white font-serif">
              Local Backup Snapshots ({backups.length})
            </h4>
          </div>
          <button
            onClick={loadBackups}
            className="p-1 text-slate-400 hover:text-amber-500 transition"
            title="Refresh Backups List"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
          {backups.length === 0 ? (
            <div className="p-4 text-center text-slate-400 text-xs bg-slate-50 dark:bg-slate-900/50 rounded-xl">
              No backups saved yet. Auto backups are created automatically prior to batch imports and resets.
            </div>
          ) : (
            backups.map((b) => (
              <div
                key={b.id}
                className="p-3 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 rounded-xl flex items-center justify-between gap-2"
              >
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    {b.name}
                    {b.isAutoBackup && (
                      <span className="text-[9px] font-mono bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-md">
                        AUTO
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {new Date(b.timestamp).toLocaleString()} • {b.questionCount} Questions •{' '}
                    {(b.sizeBytes / 1024).toFixed(1)} KB
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleRestoreBackup(b.id, b.name)}
                    className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-[11px] shadow transition"
                  >
                    Restore
                  </button>
                  <button
                    onClick={() => handleDeleteBackup(b.id)}
                    className="p-1.5 bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 transition"
                    title="Delete Backup"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
