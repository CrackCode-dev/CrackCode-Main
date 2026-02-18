import "./leaderboardComponents.css";

const LeaderboardCard = ({ user, type }) => {
  const isGold = type === "gold";

  return (
    <div className={`podium-card ${type}`}>
      {isGold && <div className="trophy-crown">🏆</div>}

      <div className="card-avatar">{user.avatar}</div>
      <div className="card-name">{user.name}</div>
      <div className={`card-title-${type}`}>{user.title}</div>

      <div className={`card-xp-box ${type}-xp`}>
        <div className={`xp-value ${type}-text`}>
          {user.points.toLocaleString()}
        </div>
        <div className="xp-label">Investigation points</div>
      </div>

      {isGold && (
        <div className="card-badges">
          <span>🏆</span>
          <span>⭐</span>
          <span>🔥</span>
        </div>
      )}

      {isGold && (
        <div className="card-streak-row gold-streak">
          🔥 <span className="streak-num">{user.streak} Days Streak</span>
        </div>
      )}

      <div className="card-cases">{user.cases} cases solved</div>
    </div>
  );
};

export default LeaderboardCard;
