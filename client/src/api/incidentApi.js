import apiClient from './apiClient';

export const incidentApi = {
  createIncident: async (incidentData) => {
    const res = await apiClient.post('/incidents', incidentData);
    return res.data;
  },
  getIncidents: async () => {
    const res = await apiClient.get('/incidents');
    return res.data;
  },
  updateStatus: async (id, status) => {
    const res = await apiClient.patch(`/incidents/${id}/status`, { status });
    return res.data;
  }
};
