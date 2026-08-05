import { questionRepository } from '../repositories/QuestionRepository';
import { categoryRepository } from '../repositories/CategoryRepository';
import { settingsRepository } from '../repositories/SettingsRepository';
import { featureFlagRepository } from '../repositories/FeatureFlagRepository';
import { backupRepository } from '../repositories/BackupRepository';
import { quizHistoryRepository } from '../repositories/QuizHistoryRepository';
import { bookmarkRepository } from '../repositories/BookmarkRepository';
import { Question, Category, QuizSettings, FeatureFlag } from '../models';
import { initializeDatabase } from '../db/database';

type ChangeListener = () => void;

export class DatabaseService {
  private listeners: Set<ChangeListener> = new Set();
  private isInitialized = false;
  private initPromise: Promise<void> | null = null;

  async init(): Promise<void> {
    if (this.isInitialized) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      try {
        await initializeDatabase();
        this.isInitialized = true;
      } finally {
        this.initPromise = null;
      }
    })();

    return this.initPromise;
  }

  subscribe(listener: ChangeListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  notifyChange(): void {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('Error in database subscriber listener:', err);
      }
    });
  }

  // --- QUESTIONS ---
  async getQuestions(category: string = 'all'): Promise<Question[]> {
    await this.init();
    return questionRepository.getByCategory(category);
  }

  async addQuestion(question: Omit<Question, 'id'>): Promise<Question> {
    await this.init();
    const created = await questionRepository.add(question);
    this.notifyChange();
    return created;
  }

  async updateQuestion(id: string, updates: Partial<Question>): Promise<Question | null> {
    await this.init();
    const updated = await questionRepository.update(id, updates);
    this.notifyChange();
    return updated;
  }

  async deleteQuestion(id: string): Promise<boolean> {
    await this.init();
    const deleted = await questionRepository.delete(id);
    if (deleted) {
      this.notifyChange();
    }
    return deleted;
  }

  // --- CATEGORIES ---
  async getCategories(): Promise<Category[]> {
    await this.init();
    
    // Fetch categories and questions concurrently to prevent blocking waterfalls
    const [cats, questions] = await Promise.all([
      categoryRepository.getAll(),
      questionRepository.getAll(),
    ]);

    return cats.map((cat) => {
      const count =
        cat.id === 'all'
          ? questions.length
          : questions.filter((q) => q.category === cat.id).length;
      return {
        ...cat,
        questionCount: count,
      };
    });
  }

  async addCategory(cat: Omit<Category, 'id'>): Promise<Category> {
    await this.init();
    const created = await categoryRepository.add(cat);
    this.notifyChange();
    return created;
  }

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
    await this.init();
    const updated = await categoryRepository.update(id, updates);
    this.notifyChange();
    return updated;
  }

  async deleteCategory(id: string): Promise<boolean> {
    await this.init();
    const deleted = await categoryRepository.delete(id);
    if (deleted) {
      this.notifyChange();
    }
    return deleted;
  }

  async reorderCategories(categories: Category[]): Promise<void> {
    await this.init();
    await categoryRepository.reorder(categories);
    this.notifyChange();
  }

  // --- SETTINGS ---
  async getSettings(): Promise<QuizSettings> {
    await this.init();
    return settingsRepository.getSettings();
  }

  async updateSettings(updates: Partial<QuizSettings>): Promise<QuizSettings> {
    await this.init();
    const updated = await settingsRepository.updateSettings(updates);
    this.notifyChange();
    return updated;
  }

  // --- FEATURES ---
  async getFeatures(): Promise<FeatureFlag[]> {
    await this.init();
    return featureFlagRepository.getAll();
  }

  async toggleFeature(id: string, enabled: boolean): Promise<FeatureFlag | null> {
    await this.init();
    const updated = await featureFlagRepository.toggle(id, enabled);
    this.notifyChange();
    return updated;
  }

  // --- HISTORY & BOOKMARKS ---
  async addQuizHistory(data: {
    category: string;
    totalQuestions: number;
    correctAnswers: number;
    scorePercentage: number;
    timeSpentSeconds: number;
    timestamp: number;
  }) {
    await this.init();
    const res = await quizHistoryRepository.add({
      categoryId: data.category,
      score: data.correctAnswers,
      totalQuestions: data.totalQuestions,
      percentage: data.scorePercentage,
      xpEarned: data.correctAnswers * 10,
      durationSeconds: data.timeSpentSeconds,
    });
    this.notifyChange();
    return res;
  }

  async isBookmarked(questionId: string): Promise<boolean> {
    await this.init();
    return bookmarkRepository.isBookmarked(questionId);
  }

  async addBookmark(questionId: string) {
    await this.init();
    const res = await bookmarkRepository.add(questionId);
    this.notifyChange();
    return res;
  }

  async removeBookmark(questionId: string) {
    await this.init();
    const res = await bookmarkRepository.delete(questionId);
    this.notifyChange();
    return res;
  }

  // --- BACKUPS ---
  async getBackups() {
    await this.init();
    return backupRepository.getAll();
  }

  async createBackup(name: string, isAuto: boolean = false) {
    await this.init();
    const res = await backupRepository.create(name, isAuto);
    this.notifyChange();
    return res;
  }

  async restoreBackup(backupId: string): Promise<boolean> {
    await this.init();
    const success = await backupRepository.restore(backupId);
    if (success) {
      this.notifyChange();
    }
    return success;
  }

  async deleteBackup(backupId: string): Promise<boolean> {
    await this.init();
    const success = await backupRepository.delete(backupId);
    if (success) {
      this.notifyChange();
    }
    return success;
  }
}

export const databaseService = new DatabaseService();