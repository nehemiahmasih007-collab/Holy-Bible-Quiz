import React, { useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Copy,
  Eye,
  CheckCircle2,
  BookOpen,
  X,
  AlertTriangle,
  Sparkles,
  Upload,
  Download,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  FileCode,
  FileText,
} from 'lucide-react';
import { Question, Category } from '../models';
import { storageService } from '../services/storageService';
import { exportService } from '../services/ExportService';

interface QuestionManagerProps {
  questions: Question[];
  categories: Category[];
  onRefresh: () => void;
}

export const QuestionManager: React.FC<QuestionManagerProps> = ({
  questions,
  categories,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [previewQuestion, setPreviewQuestion] = useState<Question | null>(null);

  // Import state
  const [importing, setImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  // Form inputs
  const [formQuestion, setFormQuestion] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctIdx, setCorrectIdx] = useState<number>(0);
  const [category, setCategory] = useState<string>(categories[0]?.id || 'gospels');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [hintRef, setHintRef] = useState('');
  const [explanation, setExplanation] = useState('');
  const [formError, setFormError] = useState('');

  const openAddModal = () => {
    setEditingQuestion(null);
    setFormQuestion('');
    setOptionA('');
    setOptionB('');
    setOptionC('');
    setOptionD('');
    setCorrectIdx(0);
    setCategory(categories[0]?.id || 'gospels');
    setDifficulty('easy');
    setHintRef('');
    setExplanation('');
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (q: Question) => {
    setEditingQuestion(q);
    setFormQuestion(q.question);
    setOptionA(q.options[0]);
    setOptionB(q.options[1]);
    setOptionC(q.options[2]);
    setOptionD(q.options[3]);
    setCorrectIdx(q.correctOptionIndex);
    setCategory(q.category);
    setDifficulty(q.difficulty || 'easy');
    setHintRef(q.hintReference || q.explanationHint || '');
    setExplanation(q.explanationHint || '');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formQuestion.trim() || !optionA.trim() || !optionB.trim() || !optionC.trim() || !optionD.trim()) {
      setFormError('Please fill in the question and all four answer options.');
      return;
    }

    if (!hintRef.trim()) {
      setFormError('Please enter a valid Hint Reference (e.g. 1 Kings 16:15–20).');
      return;
    }

    const optionsTuple: [string, string, string, string] = [
      optionA.trim(),
      optionB.trim(),
      optionC.trim(),
      optionD.trim(),
    ];

    const expText = explanation.trim() || hintRef.trim();

    if (editingQuestion) {
      await storageService.updateQuestionAsync(editingQuestion.id, {
        question: formQuestion.trim(),
        options: optionsTuple,
        correctOptionIndex: correctIdx,
        category,
        difficulty,
        hintReference: hintRef.trim(),
        explanationHint: expText,
      });
    } else {
      await storageService.addQuestionAsync({
        question: formQuestion.trim(),
        options: optionsTuple,
        correctOptionIndex: correctIdx,
        category,
        difficulty,
        hintReference: hintRef.trim(),
        explanationHint: expText,
      });
    }

    setIsModalOpen(false);
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this question?')) {
      await storageService.deleteQuestionAsync(id);
      onRefresh();
    }
  };

  const handleDuplicate = async (id: string) => {
    await storageService.duplicateQuestionAsync(id);
    onRefresh();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportStatus({ type: 'info', message: `Parsing and validating ${file.name}...` });

    try {
      const res = await storageService.importFileAsync(file);
      if (res.success) {
        setImportStatus({
          type: 'success',
          message: `Successfully imported ${res.count} new questions into the database!`,
        });
        onRefresh();
      } else {
        setImportStatus({
          type: 'error',
          message: res.error || 'Import failed. Check file formatting and retry.',
        });
      }
    } catch (err: any) {
      setImportStatus({
        type: 'error',
        message: err.message || 'An error occurred during import processing.',
      });
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  };

  // Filtered Questions
  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.options.some((opt) => opt.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat = categoryFilter === 'all' || q.category === categoryFilter;
    const matchesDiff = difficultyFilter === 'all' || q.difficulty === difficultyFilter;
    return matchesSearch && matchesCat && matchesDiff;
  });

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredQuestions.length / pageSize));
  const pageQuestions = filteredQuestions.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="flex flex-col gap-4">
      {/* Top Action & Search Bar */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Questions Database ({filteredQuestions.length} / {questions.length})
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Database powered Scripture questions & options
            </p>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center gap-1 hover:bg-blue-200 transition"
            >
              <Upload className="w-3.5 h-3.5" /> Import (CSV/Excel/JSON)
            </button>

            {/* Export Dropdown / Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => exportService.exportQuestionsToCSV()}
                title="Export CSV"
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-amber-500 font-bold text-xs flex items-center gap-1 border border-slate-200 dark:border-slate-700"
              >
                <FileText className="w-3.5 h-3.5 text-blue-500" /> CSV
              </button>
              <button
                onClick={() => exportService.exportQuestionsToExcel()}
                title="Export Excel"
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-emerald-500 font-bold text-xs flex items-center gap-1 border border-slate-200 dark:border-slate-700"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" /> Excel
              </button>
              <button
                onClick={() => exportService.exportQuestionsToJSON()}
                title="Export JSON"
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-purple-500 font-bold text-xs flex items-center gap-1 border border-slate-200 dark:border-slate-700"
              >
                <FileCode className="w-3.5 h-3.5 text-purple-500" /> JSON
              </button>
            </div>

            <button
              onClick={openAddModal}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md flex items-center gap-1.5 transition active:scale-95"
            >
              <Plus className="w-4 h-4" /> Add Question
            </button>
          </div>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="relative flex items-center col-span-1 sm:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search question, reference, category..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-amber-400"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-amber-400"
          >
            <option value="all">All Categories ({categories.length})</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            value={difficultyFilter}
            onChange={(e) => {
              setDifficultyFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-amber-400"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      {/* Scripture Reference Policy Warning */}
      <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-900/60 rounded-2xl flex items-start gap-2.5 text-[11px] text-amber-900 dark:text-amber-300">
        <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block text-amber-950 dark:text-amber-200 mb-0.5">
            Scripture Reference Security Rule:
          </span>
          Never enter full verse text. Options must only contain Scripture references (e.g. <em>Genesis 1:1–2:3</em>, <em>John 3:16</em>).
        </div>
      </div>

      {/* Question List Cards */}
      <div className="flex flex-col gap-2.5 max-h-[460px] overflow-y-auto pr-1">
        {pageQuestions.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
            No questions found matching current criteria.
          </div>
        ) : (
          pageQuestions.map((q, idx) => {
            const globalIndex = (currentPage - 1) * pageSize + idx + 1;
            const catObj = categories.find((c) => c.id === q.category);
            return (
              <div
                key={q.id}
                className="p-3.5 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col gap-2 shadow-sm hover:border-blue-400/50 transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 font-mono">
                      {globalIndex}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug font-serif">
                        {q.question}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-[10px] font-semibold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">
                          {catObj?.name || q.category}
                        </span>
                        <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                          {q.difficulty || 'easy'}
                        </span>
                        {q.createdAt && (
                          <span className="text-[10px] text-slate-400 font-mono">
                            ID: {q.id}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => setPreviewQuestion(q)}
                      className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-blue-600 transition"
                      title="Preview"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDuplicate(q.id)}
                      className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-amber-600 transition"
                      title="Duplicate"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => openEditModal(q)}
                      className="p-1.5 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 hover:bg-blue-200 transition"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(q.id)}
                      className="p-1.5 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 hover:bg-red-200 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 4 Options Grid Preview */}
                <div className="grid grid-cols-2 gap-1.5 mt-1 text-[11px]">
                  {q.options.map((opt, oIdx) => {
                    const isCorrect = oIdx === q.correctOptionIndex;
                    return (
                      <div
                        key={oIdx}
                        className={`p-1.5 rounded-xl border flex items-center justify-between ${
                          isCorrect
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold'
                            : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <span className="truncate">
                          {['A', 'B', 'C', 'D'][oIdx]}: {opt}
                        </span>
                        {isCorrect && <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 ml-1" />}
                      </div>
                    );
                  })}
                </div>

                {/* Hint Reference Badge */}
                <div className="mt-2 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-700 dark:text-amber-300">
                  <span className="font-bold">📖 Hint Reference:</span>
                  <span className="font-mono">{q.hintReference || q.explanationHint || 'N/A'}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Footer Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-mono">
            Page {currentPage} of {totalPages} ({filteredQuestions.length} questions)
          </span>

          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 text-slate-700 dark:text-slate-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 text-slate-700 dark:text-slate-300"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 w-full max-w-md shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-serif flex items-center gap-2">
                <Upload className="w-4 h-4 text-blue-500" />
                Import Questions Database
              </h3>
              <button
                onClick={() => {
                  setIsImportModalOpen(false);
                  setImportStatus(null);
                }}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Upload a <strong>CSV</strong>, <strong>JSON</strong>, or <strong>Excel (.xlsx)</strong> file containing quiz questions. Columns are mapped automatically with duplicate rejection.
            </p>

            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-amber-400 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-2 bg-slate-50 dark:bg-slate-800/50 transition relative">
              <Upload className="w-8 h-8 text-amber-500" />
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Click or Drop file to import
              </div>
              <div className="text-[10px] text-slate-400">
                Supports .csv, .json, .xlsx files
              </div>
              <input
                type="file"
                accept=".csv, .json, .xlsx, .xls"
                onChange={handleFileUpload}
                disabled={importing}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>

            {importStatus && (
              <div
                className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                  importStatus.type === 'success'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : importStatus.type === 'error'
                    ? 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                }`}
              >
                <div className="whitespace-pre-wrap font-mono text-[11px]">
                  {importStatus.message}
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setIsImportModalOpen(false);
                setImportStatus(null);
              }}
              className="w-full py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl font-bold text-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Add / Edit Question Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 w-full max-w-lg shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-serif flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-500" />
                {editingQuestion ? 'Edit Question' : 'Add New Question'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-2.5 bg-red-100 text-red-700 text-xs font-semibold rounded-xl">
                {formError}
              </div>
            )}

            <form onSubmit={handleSave} className="flex flex-col gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Question Text *
                </label>
                <textarea
                  value={formQuestion}
                  onChange={(e) => setFormQuestion(e.target.value)}
                  placeholder="Example: Where in Scripture is the account of David defeating Goliath recorded?"
                  rows={2}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              {/* 4 Answer Options */}
              <div className="flex flex-col gap-2">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">
                  Answer Options (Select radio for Correct Answer) *
                </label>

                {[
                  { label: 'Option A', state: optionA, setter: setOptionA, idx: 0 },
                  { label: 'Option B', state: optionB, setter: setOptionB, idx: 1 },
                  { label: 'Option C', state: optionC, setter: setOptionC, idx: 2 },
                  { label: 'Option D', state: optionD, setter: setOptionD, idx: 3 },
                ].map((item) => (
                  <div key={item.idx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={correctIdx === item.idx}
                      onChange={() => setCorrectIdx(item.idx)}
                      className="w-4 h-4 text-amber-500 accent-amber-500 cursor-pointer"
                    />
                    <span className="font-bold text-slate-500 w-16">{item.label}:</span>
                    <input
                      type="text"
                      value={item.state}
                      onChange={(e) => item.setter(e.target.value)}
                      placeholder="e.g. Zimri"
                      className="flex-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-amber-400"
                      required
                    />
                  </div>
                ))}
              </div>

              {/* Hint Reference Input Field */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Hint Reference (Scripture passage to help user) *
                </label>
                <input
                  type="text"
                  value={hintRef}
                  onChange={(e) => setHintRef(e.target.value)}
                  placeholder="e.g. 1 Kings 16:15–20"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono focus:outline-none focus:border-amber-400"
                  required
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  📖 Enter only the Bible passage reference (e.g., 1 Kings 16:15–20). Never enter full verse text.
                </p>
              </div>

              {/* Explanation / Study Hint Input Field */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Explanation / Study Hint (Optional)
                </label>
                <input
                  type="text"
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder='e.g. "Read 1 Kings 16:15–20 to learn why Zimri ruled only seven days."'
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-amber-400 text-xs"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  💡 Optional study tip or passage direction for the user. Do NOT display Bible verse text.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-amber-400"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
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
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Live Question Preview Modal */}
      {previewQuestion && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 w-full max-w-sm shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20 inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Student Quiz Preview
              </span>
              <button onClick={() => setPreviewQuestion(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col gap-3 text-left">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white font-serif leading-snug">
                {previewQuestion.question}
              </h4>

              <div className="flex flex-col gap-2 pt-1 text-xs">
                {previewQuestion.options.map((opt, i) => (
                  <div
                    key={i}
                    className={`p-2.5 rounded-xl border flex items-center justify-between ${
                      i === previewQuestion.correctOptionIndex
                        ? 'bg-amber-400/20 border-amber-400 text-amber-600 dark:text-amber-400 font-bold'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>
                      {['A', 'B', 'C', 'D'][i]}: {opt}
                    </span>
                    {i === previewQuestion.correctOptionIndex && (
                      <CheckCircle2 className="w-4 h-4 text-amber-500" />
                    )}
                  </div>
                ))}
              </div>

              {(previewQuestion.hintReference || previewQuestion.explanationHint) && (
                <div className="mt-1 p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
                  <span className="font-bold">📖 Hint:</span>
                  <span className="font-mono">{previewQuestion.hintReference || previewQuestion.explanationHint}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setPreviewQuestion(null)}
              className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
