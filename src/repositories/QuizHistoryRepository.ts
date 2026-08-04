import { db } from '../db/database';
import { QuizHistoryRecord } from '../models';

export class QuizHistoryRepository {
  async getAll(): Promise<QuizHistoryRecord[]> {
    return await db.quizHistory.orderBy('completedAt').reverse().toArray();
  }

  async add(record: Omit<QuizHistoryRecord, 'id' | 'completedAt'>): Promise<QuizHistoryRecord> {
    const id = `hist_${Date.now()}`;
    const completedAt = new Date().toISOString();
    const newRecord: QuizHistoryRecord = {
      ...record,
      id,
      completedAt,
    };
    await db.quizHistory.put(newRecord);
    return newRecord;
  }

  async clear(): Promise<void> {
    await db.quizHistory.clear();
  }
}

export const quizHistoryRepository = new QuizHistoryRepository();
