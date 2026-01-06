export const fetchGlobalLeaderboard = async () => {
  const response = await fetch("http://localhost:5050/api/leaderboard/global");

  if (!response.ok) {
    throw new Error("Failed to fetch leaderboard");
  }

  return response.json();
};

