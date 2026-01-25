import { useEffect, useState } from "react";
import "./leaderboard.css";

//const dummyData = [
//  { rank: 1, username: "Alice", totalXP: 5420, level: 52, batch: "Gold" },
//  { rank: 2, username: "Bob", totalXP: 4900, level: 48, batch: "Silver" },
//  { rank: 3, username: "Charlie", totalXP: 4300, level: 45, batch: "Bronze" },
//];

useEffect(() => {
  fetchGlobalLeaderboard()
    .then((data) => setLeaderboard(data))
    .catch((err) => {
      console.error("API error:", err);
      setLeaderboard([]); // fallback so table still renders
    });
}, []);


const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    setLeaderboard(dummyData); // ✅ simulate API response
  }, []);

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
              <td className={`batch ${user.batch.toLowerCase()}`}>{user.batch}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
