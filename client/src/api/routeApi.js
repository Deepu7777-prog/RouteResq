import apiClient from './apiClient';

export const routeApi = {
  calculateRoute: async (data) => {
    const res = await apiClient.post('/routes/calculate', data);
    return res.data;
  },
  getDeliveryRoutes: async (deliveryId) => {
    const res = await apiClient.get(`/routes/delivery/${deliveryId}`);
    return res.data;
  },
  acceptAlternative: async (data) => {
    const res = await apiClient.post('/routes/accept', data);
    return res.data;
  }
};
