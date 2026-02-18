// src/api/leaderboard.js

export const fetchGlobalLeaderboard = async () => {
  try {
    const res = await fetch("http://localhost:5050/api/leaderboard/global");

    if (!res.ok) {
      throw new Error(`Leaderboard fetch failed: ${res.status}`);
    }

    const data = await res.json();
    return data.leaderboard || [];
  } catch (error) {
    console.error("Leaderboard API error:", error);
    return [];
  }
};
