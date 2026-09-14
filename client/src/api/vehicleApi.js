import apiClient from './apiClient';

export const vehicleApi = {
  getVehicles: async () => {
    const res = await apiClient.get('/vehicles');
    return res.data;
  },
  getVehicleById: async (id) => {
    const res = await apiClient.get(`/vehicles/${id}`);
    return res.data;
  }
};
