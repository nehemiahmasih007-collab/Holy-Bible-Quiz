import { db } from '../db/database';
import { Language } from '../models';

export class LanguageRepository {
  async getAll(): Promise<Language[]> {
    return await db.languages.toArray();
  }

  async add(lang: Omit<Language, 'id'>): Promise<Language> {
    const id = lang.code.toLowerCase();
    const newLang: Language = {
      ...lang,
      id,
    };
    await db.languages.put(newLang);
    return newLang;
  }
}

export const languageRepository = new LanguageRepository();
