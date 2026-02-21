// src/api/leaderboard.js
// This is the file imported by leaderboardPage.jsx

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5050";

/**
 * Fetch top 10 global leaderboard
 * Returns the raw leaderboard array (not the wrapper object)
 */
export const fetchGlobalLeaderboard = async () => {
  const res = await fetch(`${BASE_URL}/api/leaderboard/global`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error(`Server error: ${res.status}`);

  const data = await res.json();

  // Backend returns: { success: true, leaderboard: [...] }
  // leaderboardPage.jsx expects a plain array, so unwrap it:
  if (data.success && Array.isArray(data.leaderboard)) {
    return data.leaderboard;
  }

  throw new Error(data.message || "Failed to load leaderboard");
};

/**
 * Fetch the logged-in user's rank
 * Returns the full response object { success, position, username, totalXP, rank }
 */
export const fetchMyRank = async () => {
  const res = await fetch(`${BASE_URL}/api/leaderboard/me`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error(`Server error: ${res.status}`);

  return res.json();
};

/**
 * Fetch paginated leaderboard
 */
export const fetchPaginatedLeaderboard = async (page = 1, limit = 20) => {
  const res = await fetch(
    `${BASE_URL}/api/leaderboard/paginated?page=${page}&limit=${limit}`,
    { credentials: "include" }
  );

  if (!res.ok) throw new Error(`Server error: ${res.status}`);

  const data = await res.json();

  if (data.success) return data;

  throw new Error(data.message || "Failed to load leaderboard");
};
