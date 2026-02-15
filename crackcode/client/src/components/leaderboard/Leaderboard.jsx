import { useEffect, useState } from "react";
import { fetchGlobalLeaderboard } from "../../api/leaderboard";
import TopThree from "./TopThree";
import LeaderboardTable from "./LeaderboardTable";
import "./leaderboardComponents.css";

export default function LeaderboardPage() {

  const [data,setData] = useState([]);

  useEffect(()=>{

    fetchGlobalLeaderboard()
      .then(setData)
      .catch(console.error);

  },[]);

  const topThree = data.slice(0,3);
  const others = data.slice(3);

  return (

    <div className="leaderboard-page">

      <h1>🏆 Detective Hall of Fame</h1>
      <p>Top investigators in the Code Detectives agency</p>

      <TopThree users={topThree} />

      <LeaderboardTable users={others} />

    </div>
  );
}
