import { db } from '../db/database';
import { Bookmark } from '../models';

export class BookmarkRepository {
  async getAll(): Promise<Bookmark[]> {
    return await db.bookmarks.orderBy('createdAt').reverse().toArray();
  }

  async add(questionId: string, note?: string): Promise<Bookmark> {
    const existing = await db.bookmarks.where('questionId').equals(questionId).first();
    if (existing) {
      if (note !== undefined) {
        existing.note = note;
        await db.bookmarks.put(existing);
      }
      return existing;
    }

    const id = `bm_${Date.now()}`;
    const newBookmark: Bookmark = {
      id,
      questionId,
      createdAt: new Date().toISOString(),
      note,
    };
    await db.bookmarks.put(newBookmark);
    return newBookmark;
  }

  async delete(questionId: string): Promise<boolean> {
    const bookmark = await db.bookmarks.where('questionId').equals(questionId).first();
    if (bookmark) {
      await db.bookmarks.delete(bookmark.id);
      return true;
    }
    return false;
  }

  async isBookmarked(questionId: string): Promise<boolean> {
    const count = await db.bookmarks.where('questionId').equals(questionId).count();
    return count > 0;
  }
}

export const bookmarkRepository = new BookmarkRepository();
