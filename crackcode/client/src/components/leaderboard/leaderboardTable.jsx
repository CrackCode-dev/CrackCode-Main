import React from "react";
import { UserRoundSearch, Flame } from "lucide-react";

// ── Renders either an <img> or emoji depending on the avatar value ──
const Avatar = ({ avatar, name }) => {
  const isImagePath =
    typeof avatar === "string" &&
    (avatar.startsWith("/") ||
      avatar.startsWith("http") ||
      avatar.match(/\.(png|jpg|jpeg|gif|webp|svg)$/i));
  if (isImagePath) {
    return (
      <img
        src={avatar}
        alt={name}
        style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover",
          border: "2px solid #334155", flexShrink: 0 }}
        onError={(e) => { e.target.replaceWith(Object.assign(document.createElement("span"), { textContent: "🕵️" })); }}
      />
    );
  }
  const isEmoji = typeof avatar === "string" && /\p{Emoji}/u.test(avatar);
  return <span className="text-xl">{isEmoji ? avatar : <UserRoundSearch className="w-6 h-6" />}</span>;
};

const LeaderboardTable = ({ data = [] }) => {
  return (
    <div className="table-container" style={{ width: "100%" }}>
      <table style={{ width: "100%", tableLayout: "fixed", borderSpacing: 0, borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ width: "6%",  padding: "18px 20px", textAlign: "left" }}>Rank</th>
            <th style={{ width: "20%", padding: "18px 20px", textAlign: "left" }}>Detective</th>
            <th style={{ width: "14%", padding: "18px 20px", textAlign: "left" }}>Title</th>
            <th style={{ width: "18%", padding: "18px 20px", textAlign: "left" }}>Specialization</th>
            <th style={{ width: "16%", padding: "18px 20px", textAlign: "left" }}>Investigation Points</th>
            <th style={{ width: "13%", padding: "18px 20px", textAlign: "left" }}>Cases Solved</th>
            <th style={{ width: "13%", padding: "18px 20px", textAlign: "left" }}>Streak</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user) => (
            <tr key={user.rank} style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <td style={{ padding: "20px 20px" }}>#{user.rank}</td>
              <td style={{ padding: "20px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <Avatar avatar={user.avatar} name={user.name} />
                  <span>{user.name}</span>
                </div>
              </td>
              <td style={{ padding: "20px 20px" }}>{user.title}</td>
              <td style={{ padding: "20px 20px" }}>{user.specialization}</td>
              <td style={{ padding: "20px 20px" }} className="green">{user.points.toLocaleString()}</td>
              <td style={{ padding: "20px 20px" }}>{user.cases}</td>
              <td style={{ padding: "20px 20px" }} className="orange">
                <div className="flex items-center gap-1">
                  {user.streak} <Flame className="w-4 h-4" /> 
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
