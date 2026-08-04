import {
  Question,
  Category,
  FeatureFlag,
  AppConfig,
  AdminLog,
} from '../models';
import { databaseService } from './DatabaseService';
import { questionRepository } from '../repositories/QuestionRepository';
import { categoryRepository } from '../repositories/CategoryRepository';
import { settingsRepository } from '../repositories/SettingsRepository';
import { featureFlagRepository } from '../repositories/FeatureFlagRepository';
import { backupRepository } from '../repositories/BackupRepository';
import { importService } from './ImportService';
import { exportService } from './ExportService';
import { INITIAL_QUESTIONS, INITIAL_CATEGORIES } from '../db/seed';

const KEYS = {
  ADMIN_LOGS: 'bible_quiz_admin_logs_v1',
};

export const DEFAULT_APP_CONFIG: AppConfig = {
  appName: 'Bible Quiz World',
  appLogo: 'BookOpen',
  primaryColor: '#2563eb',
  secondaryColor: '#f59e0b',
  defaultDarkMode: true,
  animationsEnabled: true,
  soundEnabled: true,
  defaultLanguage: 'English',
};

class StorageService {
  // --- QUESTIONS ---
  async getQuestionsAsync(category: string = 'all'): Promise<Question[]> {
    return await databaseService.getQuestions(category);
  }

  getQuestions(): Question[] {
    // Legacy sync fallback: returns cached or default questions, but components use async hooks
    return [];
  }

  async addQuestionAsync(question: Omit<Question, 'id'>): Promise<Question> {
    const q = await databaseService.addQuestion(question);
    this.addLog('Add Question', `Created question #${q.id}: "${q.question.substring(0, 30)}..."`);
    return q;
  }

  async updateQuestionAsync(id: string, updatedFields: Partial<Question>): Promise<Question | null> {
    const q = await databaseService.updateQuestion(id, updatedFields);
    if (q) {
      this.addLog('Update Question', `Updated question #${id}`);
    }
    return q;
  }

  async deleteQuestionAsync(id: string): Promise<boolean> {
    const deleted = await databaseService.deleteQuestion(id);
    if (deleted) {
      this.addLog('Delete Question', `Deleted question #${id}`);
    }
    return deleted;
  }

  async duplicateQuestionAsync(id: string): Promise<Question | null> {
    const q = await questionRepository.getById(id);
    if (!q) return null;

    const { id: _oldId, ...rest } = q;
    const duplicated = await this.addQuestionAsync({
      ...rest,
      question: `${rest.question} (Copy)`,
    });
    return duplicated;
  }

  async resetQuestionsToDefaultAsync(): Promise<Question[]> {
    await backupRepository.create('Auto-Backup before Reset Questions', true);
    await questionRepository.deleteAll();
    await questionRepository.bulkAdd(INITIAL_QUESTIONS);
    databaseService.notifyChange();
    this.addLog('Reset Questions', `Reset all questions to default dataset (${INITIAL_QUESTIONS.length} items)`);
    return INITIAL_QUESTIONS;
  }

  // --- CATEGORIES ---
  async getCategoriesAsync(): Promise<Category[]> {
    return await databaseService.getCategories();
  }

  async addCategoryAsync(cat: Omit<Category, 'id'>): Promise<Category> {
    const created = await databaseService.addCategory(cat);
    this.addLog('Add Category', `Created category "${created.name}"`);
    return created;
  }

  async updateCategoryAsync(id: string, updatedFields: Partial<Category>): Promise<Category | null> {
    const updated = await databaseService.updateCategory(id, updatedFields);
    if (updated) {
      this.addLog('Update Category', `Updated category "${updated.name}"`);
    }
    return updated;
  }

  async deleteCategoryAsync(id: string): Promise<boolean> {
    const deleted = await databaseService.deleteCategory(id);
    if (deleted) {
      this.addLog('Delete Category', `Deleted category #${id}`);
    }
    return deleted;
  }

  async reorderCategoriesAsync(categories: Category[]): Promise<void> {
    await databaseService.reorderCategories(categories);
    this.addLog('Reorder Categories', 'Updated category display ordering');
  }

  async resetCategoriesToDefaultAsync(): Promise<Category[]> {
    await categoryRepository.reorder(INITIAL_CATEGORIES);
    databaseService.notifyChange();
    this.addLog('Reset Categories', 'Reset categories to default set');
    return INITIAL_CATEGORIES;
  }

  // --- FEATURE FLAGS ---
  async getFeaturesAsync(): Promise<FeatureFlag[]> {
    return await databaseService.getFeatures();
  }

  async toggleFeatureAsync(id: string, enabled: boolean): Promise<void> {
    await databaseService.toggleFeature(id, enabled);
    this.addLog('Toggle Feature', `${enabled ? 'Enabled' : 'Disabled'} feature #${id}`);
  }

  async addFeatureAsync(flag: Omit<FeatureFlag, 'id'>): Promise<FeatureFlag> {
    const created = await featureFlagRepository.add(flag);
    databaseService.notifyChange();
    this.addLog('Add Feature', `Added feature module "${created.name}"`);
    return created;
  }

  async deleteFeatureAsync(id: string): Promise<void> {
    await featureFlagRepository.delete(id);
    databaseService.notifyChange();
    this.addLog('Delete Feature', `Deleted feature #${id}`);
  }

  // --- APP CONFIG / SETTINGS ---
  async getAppConfigAsync(): Promise<AppConfig> {
    const settings = await settingsRepository.getSettings();
    return {
      appName: settings.appName || DEFAULT_APP_CONFIG.appName,
      appLogo: settings.appLogo || DEFAULT_APP_CONFIG.appLogo,
      primaryColor: settings.primaryColor || DEFAULT_APP_CONFIG.primaryColor,
      secondaryColor: settings.secondaryColor || DEFAULT_APP_CONFIG.secondaryColor,
      defaultDarkMode: settings.darkMode,
      animationsEnabled: settings.animationsEnabled ?? true,
      soundEnabled: settings.soundEnabled,
      defaultLanguage: settings.language || 'English',
    };
  }

  async saveAppConfigAsync(config: AppConfig): Promise<void> {
    await settingsRepository.updateSettings({
      appName: config.appName,
      appLogo: config.appLogo,
      primaryColor: config.primaryColor,
      secondaryColor: config.secondaryColor,
      darkMode: config.defaultDarkMode,
      animationsEnabled: config.animationsEnabled,
      soundEnabled: config.soundEnabled,
      language: config.defaultLanguage,
    });
    databaseService.notifyChange();
    this.addLog('Update App Config', 'Saved global application settings in SQLite/IndexedDB');
  }

  // --- ADMIN LOGS ---
  getAdminLogs(): AdminLog[] {
    try {
      const stored = localStorage.getItem(KEYS.ADMIN_LOGS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load admin logs:', e);
    }
    return [];
  }

  addLog(action: string, details: string): void {
    try {
      const logs = this.getAdminLogs();
      const newLog: AdminLog = {
        id: `log_${Date.now()}`,
        action,
        details,
        timestamp: new Date().toLocaleString(),
      };
      const updated = [newLog, ...logs].slice(0, 50);
      localStorage.setItem(KEYS.ADMIN_LOGS, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to log admin action:', e);
    }
  }

  // --- EXPORT & IMPORT ---
  async exportCSV(): Promise<void> {
    await exportService.exportQuestionsToCSV();
    this.addLog('Export CSV', 'Exported database questions to CSV file');
  }

  async exportJSON(): Promise<void> {
    await exportService.exportQuestionsToJSON();
    this.addLog('Export JSON', 'Exported database questions to JSON file');
  }

  async exportExcel(): Promise<void> {
    await exportService.exportQuestionsToExcel();
    this.addLog('Export Excel', 'Exported database questions to Excel (.xlsx) file');
  }

  async importFileAsync(file: File): Promise<{ success: boolean; count: number; error?: string }> {
    const ext = file.name.split('.').pop()?.toLowerCase();
    let res;

    if (ext === 'csv') {
      res = await importService.importCSV(file);
    } else if (ext === 'json') {
      res = await importService.importJSON(file);
    } else if (ext === 'xlsx' || ext === 'xls') {
      res = await importService.importExcel(file);
    } else {
      return { success: false, count: 0, error: 'Unsupported file format. Please upload .csv, .json, or .xlsx file.' };
    }

    if (res.success) {
      databaseService.notifyChange();
      this.addLog(
        'Import Questions',
        `Successfully imported ${res.importedCount} questions (${res.duplicatesCount} duplicates skipped)`
      );
      return { success: true, count: res.importedCount };
    } else {
      return {
        success: false,
        count: 0,
        error: res.errors.join('\n') || 'Import failed or contained no valid non-duplicate questions.',
      };
    }
  }

  async createBackupAsync(name: string): Promise<void> {
    await backupRepository.create(name, false);
    databaseService.notifyChange();
    this.addLog('Create Backup', `Created manual backup snapshot: "${name}"`);
  }

  async restoreBackupAsync(backupId: string): Promise<boolean> {
    const success = await databaseService.restoreBackup(backupId);
    if (success) {
      this.addLog('Restore Backup', `Restored database from backup ID #${backupId}`);
    }
    return success;
  }

  async deleteBackupAsync(backupId: string): Promise<boolean> {
    const success = await databaseService.deleteBackup(backupId);
    if (success) {
      this.addLog('Delete Backup', `Deleted backup ID #${backupId}`);
    }
    return success;
  }
}

export const storageService = new StorageService();
