import { db } from '../db/database';
import { Question, QuestionDifficulty } from '../models';

export class QuestionRepository {
  async getAll(): Promise<Question[]> {
    return await db.questions.toArray();
  }

  async getById(id: string): Promise<Question | undefined> {
    return await db.questions.get(id);
  }

  async getByCategory(categoryId: string): Promise<Question[]> {
    if (categoryId === 'all') {
      return await db.questions.toArray();
    }
    return await db.questions.where('category').equals(categoryId).toArray();
  }

  async search(
    query: string,
    category?: string,
    difficulty?: QuestionDifficulty | 'all'
  ): Promise<Question[]> {
    let collection = db.questions.toCollection();

    let results = await collection.toArray();

    // Filter by Category if provided and not 'all'
    if (category && category !== 'all') {
      results = results.filter((q) => q.category === category);
    }

    // Filter by Difficulty if provided and not 'all'
    if (difficulty && difficulty !== 'all') {
      results = results.filter((q) => q.difficulty === difficulty);
    }

    // Fast search by Question Text, Options (Scripture References), or Hint
    if (query && query.trim() !== '') {
      const qLower = query.toLowerCase().trim();
      results = results.filter((q) => {
        const inText = q.question.toLowerCase().includes(qLower);
        const inHint =
          (q.hintReference && q.hintReference.toLowerCase().includes(qLower)) ||
          (q.explanationHint && q.explanationHint.toLowerCase().includes(qLower)) ||
          false;
        const inCategory = q.category.toLowerCase().includes(qLower);
        const inOptions = q.options.some((opt) => opt.toLowerCase().includes(qLower));
        return inText || inHint || inCategory || inOptions;
      });
    }

    return results;
  }

  async existsByTextOrReference(
    questionText: string,
    options: string[]
  ): Promise<boolean> {
    const qTrim = questionText.trim().toLowerCase();
    const count = await db.questions
      .filter((q) => {
        if (q.question.trim().toLowerCase() === qTrim) return true;
        // Check if options match exactly
        if (q.options.join('|').toLowerCase() === options.join('|').toLowerCase()) {
          return true;
        }
        return false;
      })
      .count();
    return count > 0;
  }

  async add(question: Omit<Question, 'id'>): Promise<Question> {
    const id = `q_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    const now = new Date().toISOString().split('T')[0];
    const newQuestion: Question = {
      ...question,
      id,
      createdAt: question.createdAt || now,
      updatedAt: now,
    };
    await db.questions.put(newQuestion);
    return newQuestion;
  }

  async bulkAdd(questions: Question[]): Promise<number> {
    await db.questions.bulkPut(questions);
    return questions.length;
  }

  async update(id: string, updates: Partial<Question>): Promise<Question | null> {
    const existing = await db.questions.get(id);
    if (!existing) return null;

    const now = new Date().toISOString().split('T')[0];
    const updated: Question = {
      ...existing,
      ...updates,
      updatedAt: now,
    };
    await db.questions.put(updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const existing = await db.questions.get(id);
    if (!existing) return false;
    await db.questions.delete(id);
    return true;
  }

  async deleteAll(): Promise<void> {
    await db.questions.clear();
  }

  async count(): Promise<number> {
    return await db.questions.count();
  }
}

export const questionRepository = new QuestionRepository();
