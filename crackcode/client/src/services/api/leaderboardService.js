// leaderboardService.js
// Place this in: src/services/leaderboardService.js (or src/api/leaderboard.js)

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5050";

/**
 * Fetch top 10 players (public - no auth needed)
 * @returns {Promise<{ success: boolean, leaderboard: Array, source: string }>}
 */
export const getGlobalLeaderboard = async () => {
  const res = await fetch(`${BASE_URL}/api/leaderboard/global`, {
    credentials: "include", // sends cookies
  });
  if (!res.ok) throw new Error(`Failed to fetch leaderboard: ${res.status}`);
  return res.json();
};

/**
 * Fetch paginated leaderboard (public - no auth needed)
 * @param {number} page - page number (default 1)
 * @param {number} limit - results per page (default 20)
 */
export const getPaginatedLeaderboard = async (page = 1, limit = 20) => {
  const res = await fetch(
    `${BASE_URL}/api/leaderboard/paginated?page=${page}&limit=${limit}`,
    { credentials: "include" }
  );
  if (!res.ok) throw new Error(`Failed to fetch leaderboard: ${res.status}`);
  return res.json();
};

/**
 * Fetch current user's rank (requires login)
 * @returns {Promise<{ success: boolean, position: number, username: string, totalXP: number, rank: string }>}
 */
export const getMyRank = async () => {
  const res = await fetch(`${BASE_URL}/api/leaderboard/me`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error(`Failed to fetch rank: ${res.status}`);
  return res.json();
};
