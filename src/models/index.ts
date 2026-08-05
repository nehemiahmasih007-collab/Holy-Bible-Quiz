export type CategoryId = string;

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  iconName: string;
  imageUrl?: string;
  color: string;
  order?: number;
  questionCount?: number;
}

export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;
  question: string;
  options: [string, string, string, string]; // Exactly 4 Answer Options
  correctOptionIndex: number; // 0, 1, 2, or 3
  category: CategoryId;
  language: 'en' | 'ur' | 'hi';
  hintReference: string; // Scripture Reference (e.g. "1 Kings 16:15–20") to help find the answer
  explanationHint?: string; // Optional backward-compatible fallback
  difficulty?: QuestionDifficulty;
  createdAt?: string;
  updatedAt?: string;
}

export interface QuizSettings {
  id?: string;
  questionCount: number; // 5, 10, 15, 20
  soundEnabled: boolean;
  darkMode: boolean;
  timerEnabled: boolean;
  timePerQuestion: number; // in seconds
  animationsEnabled?: boolean;
  language?: string;
  appName?: string;
  appLogo?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export interface Bookmark {
  id: string;
  questionId: string;
  createdAt: string;
  note?: string;
}

export interface StudyNote {
  id: string;
  title: string;
  scriptureReference: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuizHistoryRecord {
  id: string;
  categoryId: string;
  categoryName?: string;
  score: number; // Number of correct answers
  totalQuestions: number;
  percentage: number;
  xpEarned: number;
  durationSeconds: number;
  completedAt: string;
}

export interface Language {
  id: string;
  code: string;
  name: string;
  flag?: string;
  isDefault: boolean;
}

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  status: 'active' | 'beta' | 'planned';
  category: 'core' | 'learning' | 'gamification' | 'social';
}

export interface BackupRecord {
  id: string;
  name: string;
  timestamp: string;
  sizeBytes: number;
  questionCount: number;
  categoryCount: number;
  dataJson: string;
  isAutoBackup?: boolean;
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

export interface UserStats {
  totalQuizzesTaken: number;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  bestScorePercentage: number;
  streakDays: number;
  lastPlayedDate?: string;
  xpPoints: number;
  bookmarkedQuestionIds: string[];
}

export type AppScreen =
  | 'splash'
  | 'home'
  | 'quiz'
  | 'result'
  | 'settings'
  | 'future_preview'
  | 'admin_login'
  | 'admin_dashboard';
