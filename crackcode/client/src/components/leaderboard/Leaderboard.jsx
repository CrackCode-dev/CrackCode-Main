import { useEffect, useState } from "react";
import { fetchGlobalLeaderboard } from "../../api/leaderboard";
import "./leaderboard.css";

const LeaderboardPage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchGlobalLeaderboard()
      .then(setData)
      .catch((err) => console.error(err));
  }, []);

  const topThree = data.slice(0, 3);
  const others = data.slice(3);

  return (
    <div className="leaderboard-page">
      <h1 className="title">🏆 Detective Hall of Fame</h1>
      <p className="subtitle">
        Top investigators in the Code Detectives agency
      </p>

      {/* Top 3 Cards */}
      <div className="top-three">
        {topThree.map((user) => (
          <div key={user.username} className="card">
            <h3>#{user.rank}</h3>
            <h2>{user.username}</h2>
            <p className="xp">{user.totalXP} XP</p>
            <p>Level {user.level}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <table className="leaderboard-table">
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
          {others.map((user) => (
            <tr key={user.username}>
              <td className="rank">#{user.rank}</td>
              <td>{user.username}</td>
              <td className="xp">{user.totalXP}</td>
              <td>{user.level}</td>
              <td>{user.batch}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardPage;
