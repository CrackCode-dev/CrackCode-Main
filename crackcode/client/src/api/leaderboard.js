export const fetchGlobalLeaderboard = async () => {
  const response = await fetch("http://localhost:5050/api/leaderboard/global");

  if (!response.ok) {
    throw new Error("Failed to fetch leaderboard");
  }

  return response.json();
};

const [loading, setLoading] = useState(true);

// useEffect(() => {
//   fetchGlobalLeaderboard()
//     .then((data) => {
//       setLeaderboard(data);
//       setLoading(false);
//     })
//     .catch((err) => {
//       console.error("API error:", err);
//       setLeaderboard([]); // fallback
//       setLoading(false);
//     });
// }, []);

// if (loading) return <p>Loading leaderboard...</p>;