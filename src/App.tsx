import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  AppScreen,
  CategoryId,
  Question,
  Category,
  FeatureFlag,
  AppConfig,
  AdminLog,
  QuizSettings,
  UserStats,
} from './models';
import { storageService } from './services/storageService';
import { databaseService } from './services/DatabaseService';
import { AndroidFrame } from './components/AndroidFrame';
import { SplashScreen } from './components/SplashScreen';
import { HomeScreen } from './components/HomeScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultScreen } from './components/ResultScreen';
import { SettingsModal } from './components/SettingsModal';
import { FeedbackModal } from './components/FeedbackModal';
import { FuturePreviewModal } from './components/FuturePreviewModal';
import { LanguageSelectModal } from './components/LanguageSelectModal';
import { AdminLogin } from './admin/AdminLogin';
import { AdminDashboard } from './admin/AdminDashboard';

const DEFAULT_SETTINGS: QuizSettings = {
  questionCount: 10,
  soundEnabled: true,
  darkMode: true,
  timerEnabled: false,
  timePerQuestion: 20,
};

const DEFAULT_STATS: UserStats = {
  totalQuizzesTaken: 0,
  totalQuestionsAnswered: 0,
  totalCorrectAnswers: 0,
  bestScorePercentage: 0,
  streakDays: 1,
  xpPoints: 0,
  bookmarkedQuestionIds: [],
};

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('splash');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(false);
  const [futureFeatureModal, setFutureFeatureModal] = useState<string | null>(null);
  const [showLangModal, setShowLangModal] = useState<boolean>(
    !localStorage.getItem('bible_quiz_selected_language')
  );

  // Dynamic DB Reactive State
  const [questionsList, setQuestionsList] = useState<Question[]>([]);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [featuresList, setFeaturesList] = useState<FeatureFlag[]>([]);
  const [appConfig, setAppConfig] = useState<AppConfig>({
    appName: 'Bible Quiz',
    appLogo: 'BookOpen',
    primaryColor: '#1e3a8a',
    secondaryColor: '#f59e0b',
    defaultDarkMode: true,
    animationsEnabled: true,
    soundEnabled: true,
    defaultLanguage: 'English',
  });
  const [adminLogs, setAdminLogs] = useState<AdminLog[]>([]);

  // Load Database Data
  const loadDataFromDatabase = useCallback(async () => {
    try {
      const q = await storageService.getQuestionsAsync();
      const c = await storageService.getCategoriesAsync();
      const f = await storageService.getFeaturesAsync();
      const cfg = await storageService.getAppConfigAsync();
      const logs = storageService.getAdminLogs();

      setQuestionsList(q || []);
      setCategoriesList(c || []);
      setFeaturesList(f || []);
      if (cfg) setAppConfig(cfg);
      if (logs) setAdminLogs(logs);
    } catch (error) {
      console.error('Error loading data from database:', error);
    }
  }, []);

  useEffect(() => {
    loadDataFromDatabase();
    // Subscribe to DB change events
    const unsubscribe = databaseService.subscribe(() => {
      loadDataFromDatabase();
    });
    return () => unsubscribe();
  }, [loadDataFromDatabase]);

  // Load Settings from localStorage
  const [settings, setSettings] = useState<QuizSettings>(() => {
    try {
      const saved = localStorage.getItem('bible_quiz_settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Load Stats from localStorage
  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem('bible_quiz_stats');
      return saved ? { ...DEFAULT_STATS, ...JSON.parse(saved) } : DEFAULT_STATS;
    } catch {
      return DEFAULT_STATS;
    }
  });

  const { i18n } = useTranslation();

  // Sync i18n with settings
  useEffect(() => {
    if (settings.language && i18n.language !== settings.language) {
      i18n.changeLanguage(settings.language);
    }
  }, [settings.language, i18n]);

  // Quiz Session State
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [quizStartTime, setQuizStartTime] = useState<number>(Date.now());
  const [quizTimeSpent, setQuizTimeSpent] = useState<number>(0);

  // Sync settings & stats to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bible_quiz_settings', JSON.stringify(settings));
    } catch (err) {
      console.warn('LocalStorage save failed:', err);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem('bible_quiz_stats', JSON.stringify(stats));
    } catch (err) {
      console.warn('LocalStorage save failed:', err);
    }
  }, [stats]);

  // Handle Dark Mode Class on HTML document element
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  const handleUpdateSettings = (newSettings: Partial<QuizSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handleResetStats = () => {
    setStats(DEFAULT_STATS);
    localStorage.removeItem('bible_quiz_stats');
  };

  // Start a new Quiz Session using live questionsList from database
  const handleStartQuiz = async () => {
    let pool = questionsList;
    if (pool.length === 0) {
      pool = await storageService.getQuestionsAsync();
    }

    // Filter by current UI language
    const currentLang = i18n.language || 'en';
    const langFiltered = pool.filter((q) => q.language === currentLang);

    // Fallback to English if no matching questions exist for the language
    pool = langFiltered.length > 0 ? langFiltered : pool.filter((q) => q.language === 'en' || !q.language);

    if (selectedCategory && selectedCategory !== 'all') {
      const filtered = pool.filter((q) => q.category === selectedCategory);
      if (filtered.length > 0) pool = filtered;
    }

    // Fisher-Yates Shuffle algorithm
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selectedQuestions = shuffled.slice(0, Math.min(settings.questionCount, shuffled.length));

    setQuizQuestions(selectedQuestions);
    setCurrentQuestionIndex(0);
    setUserAnswers(new Array(selectedQuestions.length).fill(null));
    setQuizStartTime(Date.now());
    setScreen('quiz');
  };

  // Select Answer Option
  const handleSelectOption = (questionIndex: number, optionIndex: number) => {
    setUserAnswers((prev) => {
      const updated = [...prev];
      updated[questionIndex] = optionIndex;
      return updated;
    });
  };

  // Navigation inside Quiz
  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  // Submit Quiz Session & Calculate Results
  const handleSubmitQuiz = async () => {
    let correct = 0;
    quizQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctOptionIndex) {
        correct++;
      }
    });

    const total = quizQuestions.length;
    const scorePct = total > 0 ? Math.round((correct / total) * 100) : 0;
    const earnedXp = correct * 10 + (scorePct >= 80 ? 50 : 0);
    const elapsedSeconds = Math.max(1, Math.round((Date.now() - quizStartTime) / 1000));
    setQuizTimeSpent(elapsedSeconds);

    setStats((prev) => ({
      ...prev,
      totalQuizzesTaken: prev.totalQuizzesTaken + 1,
      totalQuestionsAnswered: prev.totalQuestionsAnswered + total,
      totalCorrectAnswers: prev.totalCorrectAnswers + correct,
      bestScorePercentage: Math.max(prev.bestScorePercentage, scorePct),
      xpPoints: prev.xpPoints + earnedXp,
      streakDays: Math.max(1, prev.streakDays),
    }));

    // Record history entry in IndexedDB / Storage
    await databaseService.addQuizHistory({
      category: selectedCategory,
      totalQuestions: total,
      correctAnswers: correct,
      scorePercentage: scorePct,
      timeSpentSeconds: elapsedSeconds,
      timestamp: Date.now(),
    });

    setScreen('result');
  };

  // Bookmarking question references
  const handleToggleBookmark = async (id: string) => {
    setStats((prev) => {
      const exists = prev.bookmarkedQuestionIds.includes(id);
      const updated = exists
        ? prev.bookmarkedQuestionIds.filter((item) => item !== id)
        : [...prev.bookmarkedQuestionIds, id];
      return { ...prev, bookmarkedQuestionIds: updated };
    });

    const isBookmarked = await databaseService.isBookmarked(id);
    if (isBookmarked) {
      await databaseService.removeBookmark(id);
    } else {
      await databaseService.addBookmark(id);
    }
  };

  return (
    <AndroidFrame
      settings={settings}
      onUpdateSettings={handleUpdateSettings}
      onOpenSettings={() => setIsSettingsOpen(true)}
    >
      <AnimatePresence mode="wait">
        {screen === 'splash' && (
          <SplashScreen key="splash" onComplete={() => setScreen('home')} />
        )}

        {screen === 'home' && (
          <HomeScreen
            key="home"
            stats={stats}
            categories={categoriesList}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onStartQuiz={handleStartQuiz}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenAdmin={() => setScreen('admin_login')}
            onOpenFutureFeature={(featureName) => setFutureFeatureModal(featureName)}
          />
        )}

        {screen === 'quiz' && (
          <QuizScreen
            key="quiz"
            questions={quizQuestions}
            currentQuestionIndex={currentQuestionIndex}
            userAnswers={userAnswers}
            onSelectOption={handleSelectOption}
            onNextQuestion={handleNextQuestion}
            onPrevQuestion={handlePrevQuestion}
            onSubmitQuiz={handleSubmitQuiz}
            onExitQuiz={() => setScreen('home')}
            settings={settings}
            bookmarkedIds={stats.bookmarkedQuestionIds}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {screen === 'result' && (
          <ResultScreen
            key="result"
            questions={quizQuestions}
            userAnswers={userAnswers}
            timeSpentSeconds={quizTimeSpent}
            onRestartQuiz={handleStartQuiz}
            onGoHome={() => setScreen('home')}
            settings={settings}
          />
        )}

        {screen === 'admin_login' && (
          <AdminLogin
            key="admin_login"
            onLoginSuccess={() => setScreen('admin_dashboard')}
            onBackToApp={() => setScreen('home')}
          />
        )}

        {screen === 'admin_dashboard' && (
          <AdminDashboard
            key="admin_dashboard"
            questions={questionsList}
            categories={categoriesList}
            features={featuresList}
            appConfig={appConfig}
            logs={adminLogs}
            onLogout={() => setScreen('admin_login')}
            onBackToApp={() => setScreen('home')}
            onRefreshData={loadDataFromDatabase}
            onPreviewFeature={(title, _desc) => setFutureFeatureModal(title)}
          />
        )}
      </AnimatePresence>

      {/* Language Selection Modal */}
      <AnimatePresence>
        {showLangModal && (
          <LanguageSelectModal
            onSelectLanguage={(lang) => {
              i18n.changeLanguage(lang);
              handleUpdateSettings({ language: lang });
              localStorage.setItem('bible_quiz_selected_language', lang);
              setShowLangModal(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <SettingsModal
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onClose={() => setIsSettingsOpen(false)}
            onResetStats={handleResetStats}
            onOpenFeedback={() => {
              setIsSettingsOpen(false);
              setIsFeedbackOpen(true);
            }}
          />
        )}
      </AnimatePresence>

      {/* Feedback Modal */}
      <AnimatePresence>
        {isFeedbackOpen && (
          <FeedbackModal
            settings={settings}
            onClose={() => setIsFeedbackOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Future Preview Modal */}
      <AnimatePresence>
        {futureFeatureModal && (
          <FuturePreviewModal
            featureTitle={futureFeatureModal}
            onClose={() => setFutureFeatureModal(null)}
          />
        )}
      </AnimatePresence>
    </AndroidFrame>
  );
}