import apiClient from './apiClient';

export const deliveryApi = {
  getDeliveries: async () => {
    const res = await apiClient.get('/deliveries');
    return res.data;
  },
  getDeliveryById: async (id) => {
    const res = await apiClient.get(`/deliveries/${id}`);
    return res.data;
  }
};
