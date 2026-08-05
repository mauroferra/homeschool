import apiClient from './apiClient';

export const authService = {
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  logout: () => apiClient.post('/auth/logout'),
  resetPassword: (email) => apiClient.post('/auth/reset', { email }),
  confirmReset: (token, password) => apiClient.post('/auth/reset/confirm', { token, password }),
  me: () => apiClient.get('/auth/me'),
  changePassword: (currentPassword, newPassword) => apiClient.patch('/auth/me/password', { currentPassword, newPassword }),
  updateProfile: (profile) => apiClient.patch('/auth/me/profile', { profile }),
};