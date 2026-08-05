import apiClient from './apiClient';

export const themeService = {
  getThemes: () => apiClient.get('/themes'),
  createTheme: (payload) => apiClient.post('/themes', payload),
  updateTheme: (id, payload) => apiClient.patch(`/themes/${id}`, payload),
  deleteTheme: (id) => apiClient.delete(`/themes/${id}`),
};