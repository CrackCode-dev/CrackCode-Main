import { useEffect, useState } from "react";
import { fetchGlobalLeaderboard } from "../../api/leaderboard";
import LeaderboardCard from "../../components/leaderboard/LeaderboardCard";
import LeaderboardTable from "../../components/leaderboard/LeaderboardTable";
import "./leaderboard.css";

const LeaderboardPage = () => {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchGlobalLeaderboard();
      setLeaders(data);
    };
    load();
  }, []);

  const top3 = leaders.slice(0, 3);
  const rest = leaders.slice(3);

  return (
    <div className="leaderboard-page">
      <h1 className="leaderboard-title">🏆 Detective Hall of Fame</h1>
      <p className="leaderboard-sub">Top investigators in the Code Detectives agency</p>

      <div className="top3-container">
        {top3.map((user) => (
          <LeaderboardCard key={user.position} user={user} />
        ))}
      </div>

      <LeaderboardTable data={leaders} />
    </div>
  );
};

export default LeaderboardPage;
