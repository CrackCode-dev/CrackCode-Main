import React from "react";
import LeaderboardCard from "./LeaderboardCard";
import leaderboardData from "../../data/leaderboardData";
import "../styles/leaderboard.css";

const TopThree = () => {
  const topThree = leaderboardData.slice(0, 3);

  return (
    <div className="top-three">
      <LeaderboardCard user={topThree[1]} type="silver" />
      <LeaderboardCard user={topThree[0]} type="gold" />
      <LeaderboardCard user={topThree[2]} type="bronze" />
    </div>
  );
};

export default TopThree;
