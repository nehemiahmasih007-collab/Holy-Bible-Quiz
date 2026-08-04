import { db } from '../db/database';
import { StudyNote } from '../models';

export class StudyNoteRepository {
  async getAll(): Promise<StudyNote[]> {
    return await db.studyNotes.orderBy('createdAt').reverse().toArray();
  }

  async add(note: Omit<StudyNote, 'id' | 'createdAt' | 'updatedAt'>): Promise<StudyNote> {
    const id = `note_${Date.now()}`;
    const now = new Date().toISOString();
    const newNote: StudyNote = {
      ...note,
      id,
      createdAt: now,
      updatedAt: now,
    };
    await db.studyNotes.put(newNote);
    return newNote;
  }

  async update(id: string, content: string): Promise<StudyNote | null> {
    const existing = await db.studyNotes.get(id);
    if (!existing) return null;
    const updated: StudyNote = {
      ...existing,
      content,
      updatedAt: new Date().toISOString(),
    };
    await db.studyNotes.put(updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const existing = await db.studyNotes.get(id);
    if (!existing) return false;
    await db.studyNotes.delete(id);
    return true;
  }
}

export const studyNoteRepository = new StudyNoteRepository();
