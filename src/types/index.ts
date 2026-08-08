export type CategoryId = string;

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  iconName: string;
  color: string;
  order?: number;
  questionCount?: number;
}

export interface Question {
  id: string;
  question: string;
  options: [string, string, string, string]; // Exactly 4 Answer Options
  correctOptionIndex: number; // 0, 1, 2, or 3
  category: CategoryId;
  language: 'en' | 'ur' | 'hi';
  hintReference: string; // Scripture Reference (e.g. "1 Kings 16:15–20")
  explanationHint?: string; // Optional backward-compatible fallback
  difficulty?: 'easy' | 'medium' | 'hard';
  createdAt?: string;
  updatedAt?: string;
}

export interface QuizState {
  currentQuestionIndex: number;
  userAnswers: (number | null)[]; // Array of selected option indices
  isSubmitted: boolean;
  startTime: number;
  endTime?: number;
  timeRemaining?: number;
}

export interface UserStats {
  totalQuizzesTaken: number;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  bestScorePercentage: number;
  streakDays: number;
  lastPlayedDate?: string;
  xpPoints: number; // Prepared for future XP system
  bookmarkedQuestionIds: string[]; // Prepared for future Bookmarks feature
}

export interface QuizSettings {
  questionCount: number; // 5, 10, 15, 20
  soundEnabled: boolean;
  darkMode: boolean;
  timerEnabled: boolean;
  timePerQuestion: number; // in seconds (e.g., 20)
  animationsEnabled?: boolean;
  language?: string;
}

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  status: 'active' | 'beta' | 'planned';
  category: 'core' | 'learning' | 'gamification' | 'social';
}

export interface AppConfig {
  appName: string;
  appLogo: string;
  primaryColor: string;
  secondaryColor: string;
  defaultDarkMode: boolean;
  animationsEnabled: boolean;
  soundEnabled: boolean;
  defaultLanguage: string;
}

export interface AdminLog {
  id: string;
  action: string;
  details: string;
  timestamp: string;
}

export type AppScreen =
  | 'splash'
  | 'home'
  | 'quiz'
  | 'question'
  | 'result'
  | 'settings'
  | 'future_preview'
  | 'admin_login'
  | 'admin_dashboard';

// Prepared interfaces for future feature extensions
export interface Flashcard {
  id: string;
  title: string;
  reference: string;
  keyTakeaway: string;
  category: CategoryId;
}

export interface DailyChallenge {
  id: string;
  date: string;
  title: string;
  questionIds: string[];
  rewardXp: number;
  completed: boolean;
}

