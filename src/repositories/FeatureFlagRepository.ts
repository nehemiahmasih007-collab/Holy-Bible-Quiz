import { db } from '../db/database';
import { FeatureFlag } from '../models';

export class FeatureFlagRepository {
  async getAll(): Promise<FeatureFlag[]> {
    return await db.featureFlags.toArray();
  }

  async toggle(id: string, enabled: boolean): Promise<FeatureFlag | null> {
    const feature = await db.featureFlags.get(id);
    if (!feature) return null;

    feature.enabled = enabled;
    await db.featureFlags.put(feature);
    return feature;
  }

  async add(flag: Omit<FeatureFlag, 'id'>): Promise<FeatureFlag> {
    const id = `feat_${Date.now()}`;
    const newFlag: FeatureFlag = {
      ...flag,
      id,
    };
    await db.featureFlags.put(newFlag);
    return newFlag;
  }

  async delete(id: string): Promise<boolean> {
    const existing = await db.featureFlags.get(id);
    if (!existing) return false;
    await db.featureFlags.delete(id);
    return true;
  }
}

export const featureFlagRepository = new FeatureFlagRepository();
