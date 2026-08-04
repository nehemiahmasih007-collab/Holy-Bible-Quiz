import { Question } from '../models';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class ValidationService {
  /**
   * Checks if a string looks like a full Bible verse text paragraph
   * rather than a Scripture Reference (e.g. "John 3:16" or "Genesis 1:1-5").
   * Enforces security rule: Never store Bible verse text, only store Scripture references.
   */
  isVerseTextDump(text: string): boolean {
    if (!text) return false;
    // Scripture references are usually concise (under 40 chars) with book name, chapter:verse.
    // Full verse text dumps tend to be long (>80 chars) and contain full prose sentences.
    if (text.length > 85) return true;
    
    // Check for obvious multi-sentence verse prose indicators
    const verseProseIndicators = [
      'and god said',
      'verily verily i say',
      'for god so loved',
      'the lord is my shepherd',
      'blessed are the',
      'in the beginning god created',
    ];
    
    const lower = text.toLowerCase();
    return verseProseIndicators.some((indicator) => lower.includes(indicator));
  }

  /**
   * Validates a Question object for required fields, option formatting, and security rules.
   */
  validateQuestion(q: Partial<Question>): ValidationResult {
    const errors: string[] = [];

    // 1. Question Text validation
    if (!q.question || q.question.trim().length === 0) {
      errors.push('Question text cannot be empty.');
    } else if (q.question.trim().length < 5) {
      errors.push('Question text is too short (minimum 5 characters).');
    }

    // 2. Options validation
    if (!q.options || !Array.isArray(q.options) || q.options.length !== 4) {
      errors.push('Question must have exactly 4 answer options.');
    } else {
      q.options.forEach((opt, index) => {
        if (!opt || opt.trim().length === 0) {
          errors.push(`Option ${index + 1} cannot be empty.`);
        } else if (this.isVerseTextDump(opt)) {
          errors.push(
            `Option ${index + 1} ("${opt.substring(0, 20)}...") appears to contain full verse text. Never display full verse text.`
          );
        }
      });
    }

    // 3. Hint Reference validation
    const hintRef = q.hintReference || q.explanationHint || '';
    if (!hintRef || hintRef.trim().length === 0) {
      errors.push('Hint Reference is required.');
    } else if (this.isVerseTextDump(hintRef)) {
      errors.push(
        `Hint Reference ("${hintRef.substring(0, 20)}...") appears to contain full verse text. Only Scripture references (e.g. "1 Kings 16:15–20") are permitted.`
      );
    }

    // 3. Correct Option Index validation
    if (
      typeof q.correctOptionIndex !== 'number' ||
      q.correctOptionIndex < 0 ||
      q.correctOptionIndex > 3 ||
      isNaN(q.correctOptionIndex)
    ) {
      errors.push('Correct option index must be 0, 1, 2, or 3 (representing options A, B, C, or D).');
    }

    // 4. Category validation
    if (!q.category || q.category.trim().length === 0) {
      errors.push('Category is required.');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

export const validationService = new ValidationService();
