import "./leaderboardComponents.css";

const RANK_ICONS = { 1: "🏆", 2: "🥈", 3: "🥉" };

const TITLE_COLORS = {
  "Master Detective": "#00ff88",
  "Chief Detective":  "#00c8ff",
  "Senior Detective": "#a78bfa",
  "Detective":        "#fb923c",
};

function getBadgeStyle(title) {
  const color = TITLE_COLORS[title] || "#00ff88";
  return {
    background: `${color}22`,
    color,
    border: `1px solid ${color}44`,
  };
}

const LeaderboardTable = ({ data = [] }) => {
  return (
    <div className="lb-table-wrap">
      <table className="lb-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Detective</th>
            <th>Title</th>
            <th>Specialization</th>
            <th>Investigation Points</th>
            <th>Cases Solved</th>
            <th>Streak</th>
          </tr>
        </thead>

        <tbody>
          {data.map((user) => (
            <tr key={user.rank}>
              <td>
                <div className="rank-cell">
                  <span>#{user.rank}</span>
                  {RANK_ICONS[user.rank] && (
                    <span className="rank-icon">{RANK_ICONS[user.rank]}</span>
                  )}
                </div>
              </td>

              <td>
                <div className="detective-cell">
                  <span className="det-avatar">{user.avatar}</span>
                  <span>{user.name}</span>
                </div>
              </td>

              <td>
                <span className="title-badge" style={getBadgeStyle(user.title)}>
                  {user.title}
                </span>
              </td>

              <td>{user.specialization}</td>

              <td className="xp-cell">{user.points.toLocaleString()}</td>

              <td style={{ textAlign: "center" }}>{user.cases}</td>

              <td>
                <div className="streak-cell">
                  🔥 <span>{user.streak}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardTable;
