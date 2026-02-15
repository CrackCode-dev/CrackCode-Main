export const fetchGlobalLeaderboard = async () => {

  const res = await fetch("http://localhost:5050/api/leaderboard/global");

  const data = await res.json();

  return data.leaderboard;   // VERY IMPORTANT LINE
};
