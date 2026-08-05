import apiClient from './apiClient';

export const weekService = {
  getWeeks: () => apiClient.get('/weeks'),
  getWeek: (id) => apiClient.get(`/weeks/${id}`),
  createWeek: (start_date) => apiClient.post('/weeks', { start_date }),
  updateWeekReflection: (id, parent_reflection) => apiClient.patch(`/weeks/${id}/reflection`, { parent_reflection }),
  deleteWeek: (id) => apiClient.delete(`/weeks/${id}`),
  getInstances: (weekId, household) => apiClient.get(`/weeks/${weekId}/instances${household && household !== 'All' ? `?household=${encodeURIComponent(household)}` : ''}`),
  createInstance: (weekId, payload) => apiClient.post(`/weeks/${weekId}/instances`, payload),
  createAdHocInstance: (weekId, payload) => apiClient.post(`/weeks/${weekId}/instances/ad-hoc`, payload),
  updateInstance: (id, payload) => apiClient.patch(`/instances/${id}`, payload),
  getInstance: (id) => apiClient.get(`/instances/${id}`),
  deleteInstance: (id) => apiClient.delete(`/instances/${id}`),
};