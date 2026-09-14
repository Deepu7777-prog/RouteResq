import apiClient from './apiClient';

export const authApi = {
  login: async (email, password) => {
    const res = await apiClient.post('/auth/login', { email, password });
    return res.data;
  },
  register: async (userData) => {
    const res = await apiClient.post('/auth/register', userData);
    return res.data;
  },
  getCurrentUser: async () => {
    const res = await apiClient.get('/auth/me');
    return res.data;
  }
};
