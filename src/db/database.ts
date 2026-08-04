import Dexie, { Table } from 'dexie';
import {
  Question,
  Category,
  QuizSettings,
  Bookmark,
  StudyNote,
  QuizHistoryRecord,
  Language,
  FeatureFlag,
  BackupRecord,
} from '../models';
import {
  INITIAL_CATEGORIES,
  INITIAL_QUESTIONS,
  INITIAL_SETTINGS,
  INITIAL_LANGUAGES,
  INITIAL_FEATURES,
} from './seed';

export class BibleQuizDatabase extends Dexie {
  questions!: Table<Question, string>;
  categories!: Table<Category, string>;
  settings!: Table<QuizSettings, string>;
  bookmarks!: Table<Bookmark, string>;
  studyNotes!: Table<StudyNote, string>;
  quizHistory!: Table<QuizHistoryRecord, string>;
  languages!: Table<Language, string>;
  featureFlags!: Table<FeatureFlag, string>;
  backups!: Table<BackupRecord, string>;

  constructor() {
    super('BibleQuizWorldDB');

    // Define table schemas with indexes for high-performance querying
    this.version(1).stores({
      questions: 'id, category, difficulty, question, createdAt',
      categories: 'id, name, order',
      settings: 'id',
      bookmarks: 'id, questionId, createdAt',
      studyNotes: 'id, scriptureReference, createdAt',
      quizHistory: 'id, categoryId, completedAt',
      languages: 'id, code',
      featureFlags: 'id, category, enabled',
      backups: 'id, timestamp',
    });
  }
}

export const db = new BibleQuizDatabase();

/**
 * Ensures database is seeded on first app run or if empty.
 */
export async function initializeDatabase(): Promise<void> {
  try {
    const questionsCount = await db.questions.count();
    if (questionsCount === 0) {
      console.log('Seeding Bible Quiz World database...');
      await db.transaction('rw', [
        db.questions,
        db.categories,
        db.settings,
        db.languages,
        db.featureFlags,
      ], async () => {
        await db.categories.bulkPut(INITIAL_CATEGORIES);
        await db.questions.bulkPut(INITIAL_QUESTIONS);
        await db.settings.put(INITIAL_SETTINGS);
        await db.languages.bulkPut(INITIAL_LANGUAGES);
        await db.featureFlags.bulkPut(INITIAL_FEATURES);
      });
      console.log('Database seeding complete!');
    }
  } catch (error) {
    console.error('Error initializing SQLite/IndexedDB database:', error);
  }
}
