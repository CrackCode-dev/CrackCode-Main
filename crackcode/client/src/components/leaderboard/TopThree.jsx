import React from "react";
import LeaderboardCard from "./LeaderboardCard";

const TopThree = ({ users = [] }) => {

  if (users.length < 3) return null;

  return (
    <div className="top-three">
      <LeaderboardCard user={users[1]} type="silver" />
      <LeaderboardCard user={users[0]} type="gold" />
      <LeaderboardCard user={users[2]} type="bronze" />
    </div>
  );
};

export default TopThree;
