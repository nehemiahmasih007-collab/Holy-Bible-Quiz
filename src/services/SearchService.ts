import { questionRepository } from '../repositories/QuestionRepository';
import { Question, QuestionDifficulty } from '../models';

export interface SearchFilters {
  query?: string;
  category?: string;
  difficulty?: QuestionDifficulty | 'all';
}

export class SearchService {
  /**
   * High performance search across questions database supporting 10,000+ items.
   * Matches question text, scripture references in options, category, and difficulty.
   */
  async searchQuestions(filters: SearchFilters): Promise<Question[]> {
    const { query = '', category = 'all', difficulty = 'all' } = filters;
    return await questionRepository.search(query, category, difficulty);
  }
}

export const searchService = new SearchService();
