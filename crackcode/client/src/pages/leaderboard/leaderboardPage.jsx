import { useEffect, useState } from "react";
import { fetchGlobalLeaderboard } from "../../api/leaderboard";
import "./leaderboard.css";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import Button from "../../components/ui/Button";


const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const data = await fetchGlobalLeaderboard();
        setLeaderboard(data);
      } catch (err) {
        console.error("API error:", err);
        setLeaderboard([]);
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
  }, []);

  if (loading) {
    return <p>Loading leaderboard...</p>;
  }

  return (
    <div className="leaderboard-container">
      <h2>🌍 Global Leaderboard</h2>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>User</th>
            <th>XP</th>
            <th>Level</th>
            <th>Batch</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((user) => (
            <tr key={user.username}>
              <td>{user.rank}</td>
              <td>{user.username}</td>
              <td>{user.totalXP}</td>
              <td>{user.level}</td>
              <td className={`batch ${user.batch?.toLowerCase()}`}>
                {user.batch}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
