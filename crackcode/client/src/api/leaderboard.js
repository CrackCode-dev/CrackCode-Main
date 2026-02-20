// src/api/leaderboard.js

const BASE = "http://localhost:5050/api/leaderboard";

/**
 * GET /api/leaderboard/global
 * Returns top 10 players (Redis → MongoDB fallback)
 */
export const fetchGlobalLeaderboard = async () => {
  const res = await fetch(`${BASE}/global`);
  if (!res.ok) throw new Error(`Failed: ${res.status}`);
  const data = await res.json();
  return data.leaderboard || [];
};

/**
 * GET /api/leaderboard/me  (requires auth cookie)
 */
export const fetchMyRank = async () => {
  const res = await fetch(`${BASE}/me`, { credentials: "include" });
  if (!res.ok) throw new Error(`Failed: ${res.status}`);
  return res.json();
};

/**
 * GET /api/leaderboard/paginated?page=1&limit=20
 */
export const fetchPaginatedLeaderboard = async (page = 1, limit = 20) => {
  const res = await fetch(`${BASE}/paginated?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error(`Failed: ${res.status}`);
  const data = await res.json();
  return { leaderboard: data.leaderboard || [], pagination: data.pagination || {} };
};
