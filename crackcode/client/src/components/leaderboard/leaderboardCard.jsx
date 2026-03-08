/**
 * LeaderboardCard.jsx
 * Uses CSS variables from ThemeContext — works with all themes (light/dark/cream/etc.)
 */

// ADDED: renders image path as <img>, emoji as <span>
const Avatar = ({ src }) => {
  const isPath = src && (src.startsWith("/") || src.startsWith("http") || src.includes(".png") || src.includes(".jpg") || src.includes(".webp") || src.includes(".svg"));
  if (isPath) {
    return (
      <img
        src={src}
        alt="avatar"
        style={{ width: "72px", height: "72px", borderRadius: "50%", objectFit: "cover", display: "block", margin: "8px auto 0" }}
        onError={(e) => { e.target.style.display = "none"; }}
      />
    );
  }
  return <span style={{ fontSize: "3rem", marginTop: 8, lineHeight: 1 }}>{src || "🕵️"}</span>;
};

const LeaderboardCard = ({ user, type }) => {
  const isGold   = type === "gold";
  const isSilver = type === "silver";
  const isBronze = type === "bronze";

  // ── Per-type accent colours (these are rank-specific, not theme bg) ──
  const accent = isGold
    ? { border: "#ca8a04", xpText: "#ca8a04", titleText: "#ca8a04", xpBg: "rgba(202,138,4,0.12)" }
    : isSilver
    ? { border: "var(--border)", xpText: "var(--textSec)", titleText: "var(--textSec)", xpBg: "rgba(148,163,184,0.12)" }
    : { border: "#c2410c", xpText: "#ea580c", titleText: "#ea580c", xpBg: "rgba(234,88,12,0.12)" };

  const cardStyle = {
    display:         "flex",
    flexDirection:   "column",
    alignItems:      "center",
    textAlign:       "center",
    borderRadius:    "1rem",
    padding:         "1.75rem 1.5rem",
    width:           "224px",
    gap:             "6px",
    border:          `1px solid ${accent.border}`,
    background:      "var(--surface)",
    color:           "var(--text)",
    transition:      "transform 0.3s",
    transform:       isGold ? "scale(1.08)" : "scale(1)",
    position:        "relative",
    zIndex:          isGold ? 10 : 1,
    boxShadow:       isGold
      ? "0 8px 32px rgba(202,138,4,0.18)"
      : "0 2px 8px rgba(0,0,0,0.08)",
  };

  const xpBoxStyle = {
    width:        "100%",
    borderRadius: "0.5rem",
    padding:      "10px 0",
    margin:       "8px 0",
    background:   accent.xpBg,
  };

  return (
    <div style={cardStyle}>
      {/* Trophy icon for gold */}
      {isGold && (
        <span style={{ fontSize: "1.8rem", marginTop: 4, filter: "drop-shadow(0 0 8px rgba(255,200,0,0.6))" }}>
          🏆
        </span>
      )}

      {/* FIXED: was <span>{user.avatar}</span> which printed path as text */}
      <Avatar src={user.avatar} />

      {/* Username */}
      <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "1.2rem", fontWeight: 700,
        marginTop: 4, letterSpacing: "0.05em", color: "var(--text)" }}>
        {user.name}
      </h3>

      {/* Rank title */}
      <p style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.05em",
        color: accent.titleText }}>
        {user.title}
      </p>

      {/* XP Box */}
      <div style={xpBoxStyle}>
        <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "1.9rem",
          fontWeight: 700, color: accent.xpText }}>
          {user.points.toLocaleString()}
        </p>
        <p style={{ color: "var(--textSec)", fontSize: "0.75rem", marginTop: 2 }}>
          Investigation points
        </p>
      </div>

      {/* Achievement badges — gold only */}
      {isGold && (
        <div style={{ display: "flex", gap: 8, fontSize: "1.1rem", margin: "4px 0" }}>
          <span>🏆</span><span>⭐</span><span>🔥</span>
        </div>
      )}

      {/* Streak — gold only */}
      {isGold && (
        <p style={{ display: "flex", alignItems: "center", gap: 4,
          fontSize: "0.875rem", fontWeight: 600, color: "#ea580c" }}>
          🔥 <span>{user.streak} Days Streak</span>
        </p>
      )}

      {/* Cases solved */}
      <p style={{ color: "var(--textSec)", fontSize: "0.75rem" }}>
        {user.cases} cases solved
      </p>
    </div>
  );
};

export default LeaderboardCard;
