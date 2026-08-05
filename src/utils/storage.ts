const LANGUAGE_KEY = 'bible_quiz_selected_language';

export const getSavedLanguage = (): 'en' | 'ur' => {
  const saved = localStorage.getItem(LANGUAGE_KEY);
  return saved === 'ur' || saved === 'en' ? saved : 'en';
};

export const setSavedLanguage = (lang: 'en' | 'ur') => {
  localStorage.setItem(LANGUAGE_KEY, lang);
};