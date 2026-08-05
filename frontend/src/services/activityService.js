import apiClient from './apiClient';

export const activityService = {
  getTemplates: (themeId) => apiClient.get(`/activities${themeId ? `?theme_id=${themeId}` : ''}`),
  getTemplate: (id) => apiClient.get(`/activities/${id}`),
  createTemplate: (payload) => apiClient.post('/activities', payload),
  updateTemplate: (id, payload) => apiClient.patch(`/activities/${id}`, payload),
  deleteTemplate: (id) => apiClient.delete(`/activities/${id}`),
};