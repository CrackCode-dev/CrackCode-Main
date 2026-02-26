/**
 * LeaderboardTable.jsx
 * Uses CSS variables from ThemeContext — works with all themes (light/dark/cream/etc.)
 */

const RANK_ICONS = { 1: "🏆", 2: "🥈", 3: "🥉" };

// Title badge accent colours (rank-semantic, not theme bg)
const TITLE_ACCENTS = {
  "Master Detective": { bg: "rgba( 34,197, 94,0.12)", text: "#16a34a", border: "rgba(34,197,94,0.3)" },
  "Chief Detective":  { bg: "rgba( 56,189,248,0.12)", text: "#0284c7", border: "rgba(56,189,248,0.3)" },
  "Senior Detective": { bg: "rgba(139,92, 246,0.12)", text: "#7c3aed", border: "rgba(139,92,246,0.3)" },
  "Detective":        { bg: "rgba(234, 88, 12,0.12)", text: "#ea580c", border: "rgba(234,88,12,0.3)" },
  "Rookie":           { bg: "rgba(148,163,184,0.12)", text: "var(--textSec)", border: "rgba(148,163,184,0.25)" },
};

const TitleBadge = ({ title }) => {
  const s = TITLE_ACCENTS[title] ?? TITLE_ACCENTS["Rookie"];
  return (
    <span style={{
      display:       "inline-block",
      padding:       "2px 10px",
      borderRadius:  "4px",
      fontSize:      "0.68rem",
      fontWeight:    700,
      textTransform: "uppercase",
      letterSpacing: "0.06em",
      background:    s.bg,
      color:         s.text,
      border:        `1px solid ${s.border}`,
    }}>
      {title}
    </span>
  );
};

const HEADERS = ["Rank", "Detective", "Title", "Specialization", "Investigation Points", "Cases Solved", "Streak"];

const LeaderboardTable = ({ data = [] }) => {
  return (
    <div style={{
      borderRadius: "1rem",
      overflow:     "hidden",
      // ✅ Theme-aware wrapper
      border:       "1px solid var(--border)",
      background:   "var(--surface)",
    }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>

        {/* ── Head ─────────────────────────────────────────── */}
        <thead>
          <tr style={{
            // ✅ Slightly offset from surface so it reads as a header band
            background: "rgba(0,0,0,0.04)",
            borderBottom: "1px solid var(--border)",
          }}>
            {HEADERS.map((h, i) => (
              <th key={h} style={{
                padding:       "14px 14px",
                paddingLeft:   i === 0 ? "24px" : "14px",
                textAlign:     h === "Cases Solved" || h === "Streak" ? "center" : "left",
                fontSize:      "0.68rem",
                fontWeight:    700,
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                // ✅ Theme-aware muted text
                color:         "var(--textSec)",
                whiteSpace:    "nowrap",
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>

        {/* ── Body ─────────────────────────────────────────── */}
        <tbody>
          {data.map((user, idx) => (
            <tr
              key={user.rank}
              style={{
                // ✅ Theme-aware row separators
                borderTop:  "1px solid var(--border)",
                background: "var(--surface)",
                transition: "background 0.15s",
                cursor:     "default",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,165,0,0.04)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "var(--surface)"; }}
            >
              {/* Rank */}
              <td style={{ padding: "16px 14px", paddingLeft: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6,
                  fontFamily: "'Rajdhani', sans-serif", fontSize: "0.95rem",
                  fontWeight: 700, color: "var(--brand)", whiteSpace: "nowrap" }}>
                  <span>#{user.rank}</span>
                  {RANK_ICONS[user.rank] && (
                    <span style={{ fontSize: "1rem" }}>{RANK_ICONS[user.rank]}</span>
                  )}
                </div>
              </td>

              {/* Detective */}
              <td style={{ padding: "16px 14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10,
                  fontWeight: 600, color: "var(--text)" }}>
                  <span style={{ fontSize: "1.25rem" }}>{user.avatar}</span>
                  <span>{user.name}</span>
                </div>
              </td>

              {/* Title badge */}
              <td style={{ padding: "16px 14px" }}>
                <TitleBadge title={user.title} />
              </td>

              {/* Specialization */}
              <td style={{ padding: "16px 14px", fontSize: "0.875rem",
                color: "var(--textSec)" }}>
                {user.specialization}
              </td>

              {/* Points */}
              <td style={{ padding: "16px 14px",
                fontFamily: "'Rajdhani', sans-serif", fontSize: "0.95rem",
                fontWeight: 700, color: "var(--brand)" }}>
                {user.points.toLocaleString()}
              </td>

              {/* Cases Solved */}
              <td style={{ padding: "16px 14px", textAlign: "center",
                fontSize: "0.875rem", color: "var(--textSec)" }}>
                {user.cases}
              </td>

              {/* Streak */}
              <td style={{ padding: "16px 14px" }}>
                <div style={{ display: "flex", alignItems: "center",
                  justifyContent: "center", gap: 4,
                  fontWeight: 700, color: "#ea580c" }}>
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
