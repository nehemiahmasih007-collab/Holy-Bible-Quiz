import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  BookOpen,
  Scroll,
  Cross,
  Sparkles,
  Flame,
  Mail,
  Sun,
  X,
  Palette,
  Image as ImageIcon,
} from 'lucide-react';
import { Category } from '../models';
import { storageService } from '../services/storageService';

interface CategoryManagerProps {
  categories: Category[];
  onRefresh: () => void;
}

const AVAILABLE_ICONS = [
  { name: 'BookOpen', icon: BookOpen },
  { name: 'Scroll', icon: Scroll },
  { name: 'Cross', icon: Cross },
  { name: 'Sparkles', icon: Sparkles },
  { name: 'Flame', icon: Flame },
  { name: 'Mail', icon: Mail },
  { name: 'Sun', icon: Sun },
];

const COLOR_OPTIONS = [
  { label: 'Blue', value: 'from-blue-600 to-indigo-700' },
  { label: 'Gold', value: 'from-amber-600 to-yellow-700' },
  { label: 'Purple', value: 'from-indigo-600 to-purple-800' },
  { label: 'Emerald', value: 'from-emerald-600 to-teal-800' },
  { label: 'Orange', value: 'from-orange-600 to-red-700' },
  { label: 'Cyan', value: 'from-blue-700 to-cyan-800' },
];

export const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  onRefresh,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('BookOpen');
  const [imageUrl, setImageUrl] = useState('');
  const [color, setColor] = useState('from-blue-600 to-indigo-700');

  const openAddModal = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setIconName('BookOpen');
    setImageUrl('');
    setColor('from-blue-600 to-indigo-700');
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description);
    setIconName(cat.iconName);
    setImageUrl(cat.imageUrl || '');
    setColor(cat.color);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingCategory) {
      await storageService.updateCategoryAsync(editingCategory.id, {
        name: name.trim(),
        description: description.trim(),
        iconName,
        imageUrl: imageUrl.trim() || undefined,
        color,
      });
    } else {
      await storageService.addCategoryAsync({
        name: name.trim(),
        description: description.trim(),
        iconName,
        imageUrl: imageUrl.trim() || undefined,
        color,
      });
    }

    setIsModalOpen(false);
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      await storageService.deleteCategoryAsync(id);
      onRefresh();
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const updated = [...categories];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= updated.length) return;

    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;

    await storageService.reorderCategoriesAsync(updated);
    onRefresh();
  };

  const renderIcon = (cat: Category) => {
    if (cat.imageUrl) {
      return (
        <img
          src={cat.imageUrl}
          alt={cat.name}
          className="w-5 h-5 object-cover rounded-md"
        />
      );
    }
    const found = AVAILABLE_ICONS.find((i) => i.name === cat.iconName);
    const IconComp = found ? found.icon : BookOpen;
    return <IconComp className="w-5 h-5 text-amber-400" />;
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Action Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Category System ({categories.length})
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Create, custom icon/image, reorder or remove Bible Quiz topics
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md flex items-center gap-1.5 transition active:scale-95"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {/* Category List Cards */}
      <div className="flex flex-col gap-2.5 max-h-[500px] overflow-y-auto pr-1">
        {categories.map((cat, idx) => (
          <div
            key={cat.id}
            className="p-3.5 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-between shadow-sm hover:border-blue-400/50 transition"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-2xl bg-gradient-to-tr ${cat.color} text-white shadow-sm shrink-0`}>
                {renderIcon(cat)}
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight font-serif">
                  {cat.name}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                  {cat.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => handleMove(idx, 'up')}
                disabled={idx === 0}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 hover:bg-slate-200"
                title="Move Up"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleMove(idx, 'down')}
                disabled={idx === categories.length - 1}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 hover:bg-slate-200"
                title="Move Down"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => openEditModal(cat)}
                className="p-1.5 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 hover:bg-blue-200"
                title="Edit"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(cat.id)}
                className="p-1.5 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 hover:bg-red-200"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 w-full max-w-sm shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-serif flex items-center gap-2">
                <Palette className="w-4 h-4 text-amber-500" />
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Parables & Miracles"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Questions on the miracles and parables of Jesus"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-blue-400" /> Optional Category Image URL
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/icon.png or data:image/..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-amber-400 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Choose Category Icon
                </label>
                <div className="grid grid-cols-7 gap-1.5 p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  {AVAILABLE_ICONS.map((item) => {
                    const IconC = item.icon;
                    const isSelected = iconName === item.name;
                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => setIconName(item.name)}
                        className={`p-2 rounded-xl flex items-center justify-center transition ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <IconC className="w-4 h-4" />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Choose Badge Color Gradient
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {COLOR_OPTIONS.map((c) => {
                    const isSelected = color === c.value;
                    return (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setColor(c.value)}
                        className={`p-2 rounded-xl text-[10px] font-bold text-white bg-gradient-to-r ${c.value} border-2 ${
                          isSelected ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-transparent'
                        }`}
                      >
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-extrabold shadow-md hover:bg-amber-600"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
