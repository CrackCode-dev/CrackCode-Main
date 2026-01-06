import { useEffect, useState } from "react";
import { fetchGlobalLeaderboard } from "../api/leaderboard";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGlobalLeaderboard()
      .then(data => {
        setLeaderboard(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading leaderboard...</p>;

  return (
    <div>
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
          {leaderboard.map(user => (
            <tr key={user.username}>
              <td>{user.rank}</td>
              <td>{user.username}</td>
              <td>{user.totalXP}</td>
              <td>{user.level}</td>
              <td className={`batch ${user.batch.toLowerCase()}`}>
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
