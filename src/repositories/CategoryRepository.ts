import { db } from '../db/database';
import { Category } from '../models';

export class CategoryRepository {
  async getAll(): Promise<Category[]> {
    const cats = await db.categories.toArray();
    return cats.sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  async getById(id: string): Promise<Category | undefined> {
    return await db.categories.get(id);
  }

  async add(category: Omit<Category, 'id'>): Promise<Category> {
    const id = `cat_${Date.now()}`;
    const all = await this.getAll();
    const newCategory: Category = {
      ...category,
      id,
      order: category.order ?? (all.length + 1),
    };
    await db.categories.put(newCategory);
    return newCategory;
  }

  async update(id: string, updates: Partial<Category>): Promise<Category | null> {
    const existing = await db.categories.get(id);
    if (!existing) return null;

    const updated: Category = {
      ...existing,
      ...updates,
    };
    await db.categories.put(updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const existing = await db.categories.get(id);
    if (!existing) return false;
    await db.categories.delete(id);
    return true;
  }

  async reorder(categories: Category[]): Promise<void> {
    const updatedWithOrder = categories.map((cat, idx) => ({
      ...cat,
      order: idx + 1,
    }));
    await db.categories.bulkPut(updatedWithOrder);
  }

  async count(): Promise<number> {
    return await db.categories.count();
  }
}

export const categoryRepository = new CategoryRepository();
