import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Question, QuestionDifficulty } from '../models';
import { questionRepository } from '../repositories/QuestionRepository';
import { validationService } from './ValidationService';
import { backupRepository } from '../repositories/BackupRepository';

export interface ImportResult {
  success: boolean;
  importedCount: number;
  rejectedCount: number;
  duplicatesCount: number;
  errors: string[];
}

export class ImportService {
  /**
   * Helper to normalize header keys to lowercase trimmed strings
   */
  private normalizeKey(key: string): string {
    return key.toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  /**
   * Maps a raw key-value row from CSV/Excel into a Question draft object
   */
  private mapRowToQuestionDraft(row: Record<string, any>): Partial<Question> | null {
    if (!row || typeof row !== 'object') return null;

    const normalizedRow: Record<string, any> = {};
    Object.keys(row).forEach((k) => {
      normalizedRow[this.normalizeKey(k)] = row[k];
    });

    // Match Question text
    const questionText =
      normalizedRow['question'] ||
      normalizedRow['questiontext'] ||
      normalizedRow['q'] ||
      normalizedRow['title'] ||
      normalizedRow['prompt'] ||
      '';

    // Match Options
    const opt1 =
      normalizedRow['option1'] ||
      normalizedRow['optiona'] ||
      normalizedRow['opt1'] ||
      normalizedRow['opta'] ||
      normalizedRow['a'] ||
      '';

    const opt2 =
      normalizedRow['option2'] ||
      normalizedRow['optionb'] ||
      normalizedRow['opt2'] ||
      normalizedRow['optb'] ||
      normalizedRow['b'] ||
      '';

    const opt3 =
      normalizedRow['option3'] ||
      normalizedRow['optionc'] ||
      normalizedRow['opt3'] ||
      normalizedRow['optc'] ||
      normalizedRow['c'] ||
      '';

    const opt4 =
      normalizedRow['option4'] ||
      normalizedRow['optiond'] ||
      normalizedRow['opt4'] ||
      normalizedRow['optd'] ||
      normalizedRow['d'] ||
      '';

    // Match Correct Answer Index
    let correctRaw =
      normalizedRow['correctoptionindex'] ||
      normalizedRow['correctindex'] ||
      normalizedRow['correctanswer'] ||
      normalizedRow['answer'] ||
      normalizedRow['correct'] ||
      0;

    let correctOptionIndex = 0;
    if (typeof correctRaw === 'string') {
      correctRaw = correctRaw.trim().toUpperCase();
      if (correctRaw === 'A' || correctRaw === '1' || correctRaw === 'OPT1' || correctRaw === 'OPTION 1') {
        correctOptionIndex = 0;
      } else if (correctRaw === 'B' || correctRaw === '2' || correctRaw === 'OPT2' || correctRaw === 'OPTION 2') {
        correctOptionIndex = 1;
      } else if (correctRaw === 'C' || correctRaw === '3' || correctRaw === 'OPT3' || correctRaw === 'OPTION 3') {
        correctOptionIndex = 2;
      } else if (correctRaw === 'D' || correctRaw === '4' || correctRaw === 'OPT4' || correctRaw === 'OPTION 4') {
        correctOptionIndex = 3;
      } else {
        const parsed = parseInt(correctRaw, 10);
        if (!isNaN(parsed)) {
          correctOptionIndex = parsed > 0 && parsed <= 4 ? parsed - 1 : parsed;
        }
      }
    } else if (typeof correctRaw === 'number') {
      correctOptionIndex = correctRaw >= 1 && correctRaw <= 4 ? correctRaw - 1 : correctRaw;
    }

    // Match Category
    const category =
      normalizedRow['category'] ||
      normalizedRow['categoryid'] ||
      normalizedRow['topic'] ||
      'all';

    // Match Hint Reference
    const hintReference =
      normalizedRow['hintreference'] ||
      normalizedRow['hint'] ||
      normalizedRow['scripturereference'] ||
      normalizedRow['reference'] ||
      normalizedRow['explanationhint'] ||
      normalizedRow['explanation'] ||
      '';

    // Match Language
    const language = (normalizedRow['language'] || normalizedRow['lang'] || 'en').toLowerCase();
    const validLang = (language === 'ur' || language === 'hi') ? language : 'en';

    // Match Difficulty
    let difficulty: QuestionDifficulty = 'easy';
    const diffRaw = (normalizedRow['difficulty'] || normalizedRow['level'] || '').toString().toLowerCase();
    if (diffRaw.includes('hard')) difficulty = 'hard';
    else if (diffRaw.includes('med')) difficulty = 'medium';

    return {
      question: String(questionText).trim(),
      options: [String(opt1).trim(), String(opt2).trim(), String(opt3).trim(), String(opt4).trim()],
      correctOptionIndex,
      category: String(category).trim().toLowerCase().replace(/\s+/g, '_'),
      language: validLang as 'en' | 'ur' | 'hi',
      hintReference: String(hintReference).trim(),
      explanationHint: String(hintReference).trim(),
      difficulty,
    };
  }

  /**
   * Processes an array of raw row objects, validates, checks duplicates, and saves to IndexedDB.
   */
  async processAndImportRows(rawRows: any[]): Promise<ImportResult> {
    const errors: string[] = [];
    let importedCount = 0;
    let rejectedCount = 0;
    let duplicatesCount = 0;

    if (!rawRows || rawRows.length === 0) {
      return {
        success: false,
        importedCount: 0,
        rejectedCount: 0,
        duplicatesCount: 0,
        errors: ['No rows or data found in file.'],
      };
    }

    // Auto-backup current DB state before performing batch import
    try {
      await backupRepository.create(`Auto-Backup before Import (${new Date().toLocaleTimeString()})`, true);
    } catch (e) {
      console.warn('Auto backup before import skipped:', e);
    }

    const validQuestionsToInsert: Question[] = [];
    const seenInBatch = new Set<string>();

    for (let i = 0; i < rawRows.length; i++) {
      const row = rawRows[i];
      const draft = this.mapRowToQuestionDraft(row);

      if (!draft) {
        rejectedCount++;
        continue;
      }

      // Validate
      const validation = validationService.validateQuestion(draft);
      if (!validation.isValid) {
        rejectedCount++;
        if (errors.length < 10) {
          errors.push(`Row ${i + 1}: ${validation.errors.join('; ')}`);
        }
        continue;
      }

      // Check batch duplicate
      const qTextKey = draft.question!.trim().toLowerCase();
      if (seenInBatch.has(qTextKey)) {
        duplicatesCount++;
        continue;
      }

      // Check DB duplicate
      const isDbDuplicate = await questionRepository.existsByTextOrReference(
        draft.question!,
        draft.options as string[]
      );

      if (isDbDuplicate) {
        duplicatesCount++;
        continue;
      }

      seenInBatch.add(qTextKey);

      const id = `q_imp_${Date.now()}_${i}_${Math.floor(Math.random() * 1000)}`;
      const now = new Date().toISOString().split('T')[0];

      validQuestionsToInsert.push({
        id,
        question: draft.question!,
        options: draft.options as [string, string, string, string],
        correctOptionIndex: draft.correctOptionIndex!,
        category: draft.category || 'all',
        language: draft.language || 'en',
        hintReference: draft.hintReference || draft.explanationHint || '',
        explanationHint: draft.hintReference || draft.explanationHint || '',
        difficulty: draft.difficulty || 'easy',
        createdAt: now,
        updatedAt: now,
      });
    }

    if (validQuestionsToInsert.length > 0) {
      await questionRepository.bulkAdd(validQuestionsToInsert);
      importedCount = validQuestionsToInsert.length;
    }

    return {
      success: importedCount > 0,
      importedCount,
      rejectedCount,
      duplicatesCount,
      errors,
    };
  }

  /**
   * Import questions from a CSV file
   */
  async importCSV(file: File): Promise<ImportResult> {
    return new Promise((resolve) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const res = await this.processAndImportRows(results.data);
          resolve(res);
        },
        error: (error) => {
          resolve({
            success: false,
            importedCount: 0,
            rejectedCount: 0,
            duplicatesCount: 0,
            errors: [`CSV Parsing Error: ${error.message}`],
          });
        },
      });
    });
  }

  /**
   * Import questions from a JSON file
   */
  async importJSON(file: File): Promise<ImportResult> {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      let rawRows: any[] = [];

      if (Array.isArray(parsed)) {
        rawRows = parsed;
      } else if (parsed && Array.isArray(parsed.questions)) {
        rawRows = parsed.questions;
      } else {
        return {
          success: false,
          importedCount: 0,
          rejectedCount: 0,
          duplicatesCount: 0,
          errors: ['Invalid JSON format: Expected array of questions or object with questions property.'],
        };
      }

      return await this.processAndImportRows(rawRows);
    } catch (err: any) {
      return {
        success: false,
        importedCount: 0,
        rejectedCount: 0,
        duplicatesCount: 0,
        errors: [`JSON Parse Error: ${err.message}`],
      };
    }
  }

  /**
   * Import questions from an Excel (.xlsx, .xls) file
   */
  async importExcel(file: File): Promise<ImportResult> {
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const rawRows = XLSX.utils.sheet_to_json(worksheet);

      return await this.processAndImportRows(rawRows);
    } catch (err: any) {
      return {
        success: false,
        importedCount: 0,
        rejectedCount: 0,
        duplicatesCount: 0,
        errors: [`Excel Import Error: ${err.message}`],
      };
    }
  }
}

export const importService = new ImportService();
