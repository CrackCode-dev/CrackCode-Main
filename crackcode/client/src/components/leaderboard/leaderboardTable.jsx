import React from "react";

// ADDED: renders image path as <img>, emoji as <span>
const Avatar = ({ src }) => {
  const isPath = src && (src.startsWith("/") || src.startsWith("http") || src.includes(".png") || src.includes(".jpg") || src.includes(".webp") || src.includes(".svg"));
  if (isPath) {
    return (
      <img
        src={src}
        alt="avatar"
        style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }}
        onError={(e) => { e.target.style.display = "none"; }}
      />
    );
  }
  return <span style={{ fontSize: "1.3rem" }}>{src || "🕵️"}</span>;
};

const LeaderboardTable = ({ data = [] }) => {  // FIXED: accepts data prop from backend, not static import
  return (
    <div className="table-container" style={{ width: "100%" }}>
      <table style={{ width: "100%", tableLayout: "fixed" }}>
        <thead>
          <tr>
            <th style={{ width: "6%" }}>Rank</th>
            <th style={{ width: "20%" }}>Detective</th>
            <th style={{ width: "16%" }}>Title</th>
            <th style={{ width: "18%" }}>Specialization</th>
            <th style={{ width: "16%" }}>Investigation Points</th>
            <th style={{ width: "12%" }}>Cases Solved</th>
            <th style={{ width: "12%" }}>Streak</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user) => (
            <tr key={user.rank}>
              <td>#{user.rank}</td>
              <td style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Avatar src={user.avatar} /> {/* ADDED: avatar rendering */}
                {user.name}
              </td>
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
