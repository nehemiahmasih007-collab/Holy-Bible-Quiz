import { Category, Question, FeatureFlag, QuizSettings, Language } from '../models';
import { QUESTIONS, CATEGORIES } from '../data/questions';

export const INITIAL_CATEGORIES: Category[] = CATEGORIES.map((c, i) => ({
  ...c,
  order: i + 1,
}));

export const INITIAL_QUESTIONS: Question[] = QUESTIONS.map((q) => ({
  ...q,
  createdAt: '2026-01-01',
  updatedAt: '2026-01-01',
}));

export const INITIAL_SETTINGS: QuizSettings = {
  id: 'default',
  questionCount: 10,
  soundEnabled: true,
  darkMode: true,
  timerEnabled: false,
  timePerQuestion: 20,
  animationsEnabled: true,
  language: 'English',
  appName: 'Bible Quiz World',
  appLogo: 'BookOpen',
  primaryColor: '#2563eb',
  secondaryColor: '#f59e0b',
};

export const INITIAL_LANGUAGES: Language[] = [
  { id: 'en', code: 'en', name: 'English', flag: '🇺🇸', isDefault: true },
  { id: 'hi', code: 'hi', name: 'Hindi (हिंदी)', flag: '🇮🇳', isDefault: false },
  { id: 'ur', code: 'ur', name: 'Urdu (اردو)', flag: '🇵🇰', isDefault: false },
];

export const INITIAL_FEATURES: FeatureFlag[] = [
  {
    id: 'scripture_quiz',
    name: 'Scripture Reference Quiz',
    description: 'Core quiz engine testing knowledge with Scripture References',
    enabled: true,
    status: 'active',
    category: 'core',
  },
  {
    id: 'flashcards',
    name: 'Flashcards & Memory Verses',
    description: 'Flip-card study tool for memorizing Scripture references',
    enabled: true,
    status: 'planned',
    category: 'learning',
  },
  {
    id: 'daily_challenge',
    name: 'Daily Scripture Quest',
    description: 'Daily 3-question Scripture challenge with XP rewards',
    enabled: true,
    status: 'planned',
    category: 'gamification',
  },
  {
    id: 'bookmarks',
    name: 'Scripture Bookmarks',
    description: 'Save difficult questions for later study and review',
    enabled: true,
    status: 'active',
    category: 'learning',
  },
  {
    id: 'study_notes',
    name: 'Personal Study Notes',
    description: 'Notebook for writing reflections on Bible passages',
    enabled: true,
    status: 'active',
    category: 'learning',
  },
  {
    id: 'xp_system',
    name: 'XP & Level Progression',
    description: 'Earn points for correct answers and track level rank',
    enabled: true,
    status: 'active',
    category: 'gamification',
  },
  {
    id: 'achievements',
    name: 'Badges & Achievements',
    description: 'Unlock milestone badges for quiz streaks and master scores',
    enabled: false,
    status: 'planned',
    category: 'gamification',
  },
  {
    id: 'languages',
    name: 'Multi-Language Support',
    description: 'Support Spanish, Portuguese, French & biblical languages',
    enabled: true,
    status: 'active',
    category: 'core',
  },
];
