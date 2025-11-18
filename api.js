import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Quran API
export const quranAPI = {
  getChapters: () => api.get('/quran/chapters'),
  getChapter: (chapterNumber) => api.get(`/quran/chapters/${chapterNumber}`),
  getVerses: (chapterNumber) => api.get(`/quran/chapters/${chapterNumber}/verses`),
  search: (query, language = 'en') => api.get(`/quran/search?query=${query}&language=${language}`),
  semanticSearch: (query) => api.get(`/quran/semantic-search?query=${query}`),
};

// AI API
export const aiAPI = {
  askQuestion: (question, context) => api.post('/ai/ask', { question, context }),
  generateTafsir: (chapter, verse, type) => api.post('/ai/tafsir', { chapter, verse, type }),
};

// Payment API
export const paymentAPI = {
  createSubscription: (plan, paymentMethodId) => api.post('/payments/create-subscription', { plan, paymentMethodId }),
  cancelSubscription: () => api.post('/payments/cancel-subscription'),
};

export default api;