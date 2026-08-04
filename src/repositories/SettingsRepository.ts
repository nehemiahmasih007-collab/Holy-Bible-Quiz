import { db } from '../db/database';
import { QuizSettings } from '../models';
import { INITIAL_SETTINGS } from '../db/seed';

export class SettingsRepository {
  async getSettings(): Promise<QuizSettings> {
    const settings = await db.settings.get('global_settings');
    if (!settings) {
      await db.settings.put(INITIAL_SETTINGS);
      return INITIAL_SETTINGS;
    }
    return settings;
  }

  async updateSettings(updates: Partial<QuizSettings>): Promise<QuizSettings> {
    const current = await this.getSettings();
    const updated: QuizSettings = {
      ...current,
      ...updates,
      id: 'global_settings',
    };
    await db.settings.put(updated);
    return updated;
  }
}

export const settingsRepository = new SettingsRepository();
