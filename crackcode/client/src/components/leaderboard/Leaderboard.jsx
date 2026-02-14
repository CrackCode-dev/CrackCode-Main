import React from "react";
import TopThree from "../components/leaderboard/TopThree";
import LeaderboardTable from "../components/leaderboard/LeaderboardTable";
import "../styles/leaderboard.css";

const LeaderBoard = () => {
  return (
    <div className="leaderboard-page">
      <h1 className="title">🏆 Detective Hall of Fame</h1>
      <p className="subtitle">
        Top investigators in the Code Detectives agency
      </p>

      <TopThree />
      <LeaderboardTable />
    </div>
  );
};

export default LeaderBoard;

