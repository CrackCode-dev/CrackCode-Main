import "./leaderboardComponents.css";

const LeaderboardCard = ({ user }) => {
  return (
    <div className="leader-card">
      <img src={user.avatar} alt={user.username} className="leader-avatar" />

      <h3>{user.username}</h3>
      <p className="title">{user.rank}</p>

      <div className="points">{user.totalXP.toLocaleString()}</div>
      <p>Investigation points</p>

      <div className="stats">
        <span>🔥 {user.streak} Days</span>
        <span>🧩 {user.casesSolved} cases</span>
      </div>
    </div>
  );
};

export default LeaderboardCard;
