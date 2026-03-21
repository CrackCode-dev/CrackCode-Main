// leaderboardService.js - use central axios instance for consistent baseURL and credentials
import api from '../../api/axios';

/**
 * Fetch top players (public)
 */
export const getGlobalLeaderboard = async () => {
  const res = await api.get('/leaderboard/global');
  return res.data;
};

/**
 * Fetch paginated leaderboard (public)
 */
export const getPaginatedLeaderboard = async (page = 1, limit = 20) => {
  const res = await api.get(`/leaderboard/paginated?page=${page}&limit=${limit}`);
  return res.data;
};

/**
 * Fetch authenticated user's rank (requires session cookie)
 */
export const getMyRank = async () => {
  const res = await api.get('/leaderboard/me');
  return res.data;
};