import { useEffect, useState } from "react";
import { fetchGlobalLeaderboard } from "../../api/leaderboard";
import TopThree from "./TopThree";
import LeaderboardTable from "./LeaderboardTable";
import "./leaderboardComponents.css";

const LeaderboardPage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchGlobalLeaderboard()
      .then((raw) => {
        // Normalize API response to a consistent shape
        const normalized = raw.map((u, i) => ({
          rank:           u.rank ?? u.position ?? i + 1,
          name:           u.name ?? u.username ?? "Unknown",
          title:          u.title ?? u.rank ?? "Detective",
          specialization: u.specialization ?? "—",
          points:         u.points ?? u.totalXP ?? u.score ?? 0,
          cases:          u.cases ?? u.casesSolved ?? 0,
          streak:         u.streak ?? 0,
          avatar:         u.avatar ?? "🕵️",
        }));
        setData(normalized);
      })
      .catch(console.error);
  }, []);

  const topThree = data.slice(0, 3);

  return (
    <div className="lb-page">
      {/* Header */}
      <div className="lb-header">
        <h1>🏆 Detective Hall of Fame</h1>
        <p>Top investigators in the Code Detectives agency</p>
      </div>

      {/* Top 3 Podium */}
      <TopThree users={topThree} />

      {/* Full Rankings Table */}
      <LeaderboardTable data={data} />
    </div>
  );
};

export default LeaderboardPage;
