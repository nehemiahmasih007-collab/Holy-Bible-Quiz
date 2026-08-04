import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { questionRepository } from '../repositories/QuestionRepository';
import { categoryRepository } from '../repositories/CategoryRepository';

export class ExportService {
  private async prepareExportRows(): Promise<any[]> {
    const questions = await questionRepository.getAll();
    const categories = await categoryRepository.getAll();
    const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

    return questions.map((q) => ({
      ID: q.id,
      Question: q.question,
      'Option A': q.options[0] || '',
      'Option B': q.options[1] || '',
      'Option C': q.options[2] || '',
      'Option D': q.options[3] || '',
      'Correct Answer Index': q.correctOptionIndex,
      'Correct Answer Text': q.options[q.correctOptionIndex] || '',
      'Hint Reference': q.hintReference || q.explanationHint || '',
      'Category ID': q.category,
      'Category Name': categoryMap.get(q.category) || q.category,
      Difficulty: q.difficulty || 'easy',
      'Created Date': q.createdAt || '',
    }));
  }

  private triggerDownload(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  async exportQuestionsToCSV(filename: string = 'bible_quiz_questions.csv') {
    const rows = await this.prepareExportRows();
    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    this.triggerDownload(blob, filename);
  }

  async exportQuestionsToJSON(filename: string = 'bible_quiz_questions.json') {
    const questions = await questionRepository.getAll();
    const categories = await categoryRepository.getAll();
    const data = {
      app: 'Bible Quiz World',
      exportDate: new Date().toISOString(),
      questionCount: questions.length,
      categories,
      questions,
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    this.triggerDownload(blob, filename);
  }

  async exportQuestionsToExcel(filename: string = 'bible_quiz_questions.xlsx') {
    const rows = await this.prepareExportRows();
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Questions');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    this.triggerDownload(blob, filename);
  }
}

export const exportService = new ExportService();
