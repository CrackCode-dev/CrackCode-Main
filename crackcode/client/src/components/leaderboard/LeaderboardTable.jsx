import "./leaderboardComponents.css";

const LeaderboardTable = ({ data }) => {
  return (
    <table className="leader-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Detective</th>
          <th>Title</th>
          <th>Specialization</th>
          <th>Points</th>
          <th>Cases</th>
          <th>Streak</th>
        </tr>
      </thead>

      <tbody>
        {data.map((u) => (
          <tr key={u.position}>
            <td>#{u.position}</td>
            <td>{u.username}</td>
            <td>{u.rank}</td>
            <td>{u.specialization}</td>
            <td>{u.totalXP}</td>
            <td>{u.casesSolved}</td>
            <td>🔥 {u.streak}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default LeaderboardTable;
