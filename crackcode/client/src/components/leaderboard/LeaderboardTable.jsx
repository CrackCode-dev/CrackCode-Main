import React from "react";
import leaderboardData from "../../data/leaderboardData";
import "../styles/leaderboard.css";

const  LeaderboardTable = () => {
    return (
        <div className="table-container">
            <table>
                <thread>
                    <tr>
                        <th>Rank</th>
                        <th>Detective</th>
                        <th>Title</th>
                        <th>Specialization</th>
                        <th>Investigation Points</th>
                        <th>Cases Sloved</th>
                        <th>Streak</th>
                    </tr>
                </thread>
                <tbody>
                    {leaderboardData.map((user) => (
                        <tr key={user.rank}>
                            <td>#{user.rank}</td>
                            <td>{user.name}</td>
                            <td>{user.title}</td>
                            <td>{user.specialization}</td>
                            <td className="green">{user.points.toLocaleString()}</td>
                            <td>{user.cases}</td>
                            <td className="orange">🔥 {user.streak}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LeaderboardTable;