import apiClient from './apiClient';

export const progressService = {
  getWeeklyStats: (weekId) => apiClient.get(`/progress/weekly-stats${weekId ? `?week_id=${weekId}` : ''}`),
  getLastFourWeeks: () => apiClient.get('/progress/last-four-weeks'),
  getReflections: (weekId) => apiClient.get(`/progress/reflections${weekId ? `?week_id=${weekId}` : ''}`),
};