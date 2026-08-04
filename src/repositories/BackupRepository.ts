import { db } from '../db/database';
import { BackupRecord } from '../models';

export class BackupRepository {
  async getAll(): Promise<BackupRecord[]> {
    return await db.backups.orderBy('timestamp').reverse().toArray();
  }

  async create(name: string, isAutoBackup: boolean = false): Promise<BackupRecord> {
    const questions = await db.questions.toArray();
    const categories = await db.categories.toArray();
    const settings = await db.settings.toArray();
    const bookmarks = await db.bookmarks.toArray();
    const studyNotes = await db.studyNotes.toArray();
    const quizHistory = await db.quizHistory.toArray();
    const languages = await db.languages.toArray();
    const featureFlags = await db.featureFlags.toArray();

    const snapshot = {
      version: '2.0.0',
      timestamp: new Date().toISOString(),
      questions,
      categories,
      settings,
      bookmarks,
      studyNotes,
      quizHistory,
      languages,
      featureFlags,
    };

    const dataJson = JSON.stringify(snapshot, null, 2);
    const sizeBytes = new Blob([dataJson]).size;
    const id = `backup_${Date.now()}`;

    const record: BackupRecord = {
      id,
      name,
      timestamp: new Date().toISOString(),
      sizeBytes,
      questionCount: questions.length,
      categoryCount: categories.length,
      dataJson,
      isAutoBackup,
    };

    await db.backups.put(record);
    return record;
  }

  async restore(backupId: string): Promise<boolean> {
    const backup = await db.backups.get(backupId);
    if (!backup) return false;

    try {
      const data = JSON.parse(backup.dataJson);
      await db.transaction('rw', [
        db.questions,
        db.categories,
        db.settings,
        db.bookmarks,
        db.studyNotes,
        db.quizHistory,
        db.languages,
        db.featureFlags,
      ], async () => {
        if (Array.isArray(data.questions)) {
          await db.questions.clear();
          await db.questions.bulkPut(data.questions);
        }
        if (Array.isArray(data.categories)) {
          await db.categories.clear();
          await db.categories.bulkPut(data.categories);
        }
        if (Array.isArray(data.settings) && data.settings.length > 0) {
          await db.settings.clear();
          await db.settings.bulkPut(data.settings);
        }
        if (Array.isArray(data.bookmarks)) {
          await db.bookmarks.clear();
          await db.bookmarks.bulkPut(data.bookmarks);
        }
        if (Array.isArray(data.studyNotes)) {
          await db.studyNotes.clear();
          await db.studyNotes.bulkPut(data.studyNotes);
        }
        if (Array.isArray(data.quizHistory)) {
          await db.quizHistory.clear();
          await db.quizHistory.bulkPut(data.quizHistory);
        }
        if (Array.isArray(data.languages)) {
          await db.languages.clear();
          await db.languages.bulkPut(data.languages);
        }
        if (Array.isArray(data.featureFlags)) {
          await db.featureFlags.clear();
          await db.featureFlags.bulkPut(data.featureFlags);
        }
      });
      return true;
    } catch (err) {
      console.error('Failed to restore backup:', err);
      return false;
    }
  }

  async delete(backupId: string): Promise<boolean> {
    const existing = await db.backups.get(backupId);
    if (!existing) return false;
    await db.backups.delete(backupId);
    return true;
  }
}

export const backupRepository = new BackupRepository();
