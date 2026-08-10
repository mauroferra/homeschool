import apiClient from './apiClient';

export const externalTypeService = {
  getTypes: () => apiClient.get('/external-types'),
  createType: (name) => apiClient.post('/external-types', { name }),
  updateType: (id, name) => apiClient.patch(`/external-types/${id}`, { name }),
  deleteType: (id) => apiClient.delete(`/external-types/${id}`),
};