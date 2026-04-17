import React from "react";
import { UserRoundSearch, Flame } from "lucide-react";

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
        style={{
          width: 32, height: 32, borderRadius: "50%", objectFit: "cover",
          border: "2px solid var(--border)", flexShrink: 0,
        }}
        onError={(e) => { e.target.style.display = "none"; }}
      />
    );
  }

  const isEmoji = typeof avatar === "string" && /\p{Emoji}/u.test(avatar);
  return (
    <span style={{ fontSize: "1.3rem" }}>
      {isEmoji ? avatar : <UserRoundSearch style={{ width: 24, height: 24 }} />}
    </span>
  );
};

const RANK_MEDAL = { 1: "🥇", 2: "🥈", 3: "🥉" };

const LeaderboardTable = ({ data = [] }) => {
  return (
    <div
      style={{
        width: "100%",
        borderRadius: "1rem",
        border: "1px solid var(--border)",
        background: "var(--surface)",
        overflow: "hidden",
        marginTop: "2rem",
      }}
    >
      <table style={{ width: "100%", tableLayout: "fixed", borderSpacing: 0, borderCollapse: "collapse" }}>

        {/* Header */}
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border)" }}>
            {[
              { label: "Rank",                 width: "7%"  },
              { label: "Detective",            width: "22%" },
              { label: "Title",                width: "13%" },
              { label: "Specialization",       width: "16%" },
              { label: "Investigation Points", width: "17%" },
              { label: "Cases Solved",         width: "13%" },
              { label: "Streak",               width: "12%" },
            ].map(({ label, width }) => (
              <th
                key={label}
                style={{
                  width,
                  padding: "14px 20px",
                  textAlign: "left",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                }}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {data.map((user, i) => {
            const isTop3 = user.rank <= 3;
            return (
              <tr
                key={user.rank}
                style={{
                  borderTop: i === 0 ? "none" : "1px solid var(--border)",
                  background: isTop3 ? "rgba(var(--brand-rgb, 202,138,4), 0.04)" : "transparent",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(128,128,128,0.07)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = isTop3 ? "rgba(202,138,4,0.04)" : "transparent")}
              >
                {/* Rank */}
                <td style={{ padding: "18px 20px", fontWeight: 700, color: "var(--text)" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    #{user.rank}
                    {RANK_MEDAL[user.rank] && (
                      <span style={{ fontSize: "1rem" }}>{RANK_MEDAL[user.rank]}</span>
                    )}
                  </span>
                </td>

                {/* Detective */}
                <td style={{ padding: "18px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar avatar={user.avatar} name={user.name} />
                    <span style={{ fontWeight: 600, color: "var(--text)" }}>{user.name}</span>
                  </div>
                </td>

                {/* Title badge */}
                <td style={{ padding: "18px 20px" }}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "3px 10px",
                      borderRadius: 999,
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      border: "1px solid var(--border)",
                      color: "var(--brand)",
                      background: "rgba(202,138,4,0.08)",
                    }}
                  >
                    {user.title}
                  </span>
                </td>

                {/* Specialization */}
                <td style={{ padding: "18px 20px", color: "var(--muted)" }}>
                  {user.specialization}
                </td>

                {/* Investigation Points */}
                <td style={{ padding: "18px 20px", fontWeight: 700, color: "var(--brand)" }}>
                  {user.points.toLocaleString()}
                </td>

                {/* Cases Solved */}
                <td style={{ padding: "18px 20px", color: "var(--muted)" }}>
                  {user.cases}
                </td>

                {/* Streak */}
                <td style={{ padding: "18px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Flame style={{ width: 16, height: 16, color: "#ea580c" }} />
                    <span style={{ fontWeight: 600, color: "#ea580c" }}>{user.streak}</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardTable;