import api from '../../api/axios';

// Use central axios instance which already enables credentials
export const fetchBadgeProgress = async () => {
  const { data } = await api.get('/badges/my-progress');
  if (data.success && Array.isArray(data.data)) return data.data;
  throw new Error(data.message || 'Failed to load badge progress');
};

export const fetchBadgeStats = async () => {
  const { data } = await api.get('/badges/stats');
  if (data.success) return data.data;
  throw new Error(data.message || 'Failed to load badge stats');
};

export const triggerBadgeCheck = async () => {
  const { data } = await api.post('/badges/check-all');
  if (data.success) return data.data;
  throw new Error(data.message || 'Failed to check badges');
};

export default { fetchBadgeProgress, fetchBadgeStats, triggerBadgeCheck };
