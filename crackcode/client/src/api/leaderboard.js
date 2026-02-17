export const fetchGlobalLeaderboard = async () => {

  const res = await fetch("http://localhost:5050/api/leaderboard/global");

  const data = await res.json();

  return data.leaderboard;   // VERY IMPORTANT LINE
};
<<<<<<< HEAD

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
=======
>>>>>>> Shenori
