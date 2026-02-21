import { useState, useEffect, useCallback } from "react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5050";

// ── Inject @keyframes spin — can't do this with inline styles ─
if (typeof document !== "undefined") {
  const existing = document.getElementById("lb-spin-style");
  if (!existing) {
    const tag = document.createElement("style");
    tag.id = "lb-spin-style";
    tag.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
    document.head.appendChild(tag);
  }
}

// ── Fetch with 8 s timeout so loading never hangs forever ────
const fetchTimeout = (url, options = {}) => {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  return fetch(url, { ...options, signal: ctrl.signal }).finally(() =>
    clearTimeout(timer)
  );
};

// ── API helpers ───────────────────────────────────────────────
const api = {
  getGlobal: () =>
    fetchTimeout(`${BASE_URL}/api/leaderboard/global`, {
      credentials: "include",
    }).then((r) => {
      if (!r.ok) throw new Error(`Server returned ${r.status}`);
      return r.json();
    }),

  getPaginated: (page, limit) =>
    fetchTimeout(
      `${BASE_URL}/api/leaderboard/paginated?page=${page}&limit=${limit}`,
      { credentials: "include" }
    ).then((r) => {
      if (!r.ok) throw new Error(`Server returned ${r.status}`);
      return r.json();
    }),

  getMyRank: () =>
    fetchTimeout(`${BASE_URL}/api/leaderboard/me`, {
      credentials: "include",
    }).then((r) => {
      if (!r.ok) throw new Error(`Server returned ${r.status}`);
      return r.json();
    }),
};

// ── Rank badge ────────────────────────────────────────────────
const RANK_STYLES = {
  Legend:       { bg: "#FFD700", text: "#000", label: "👑 Legend" },
  Master:       { bg: "#9B59B6", text: "#fff", label: "⚔️ Master" },
  Expert:       { bg: "#E74C3C", text: "#fff", label: "🔥 Expert" },
  Advanced:     { bg: "#3498DB", text: "#fff", label: "💎 Advanced" },
  Intermediate: { bg: "#27AE60", text: "#fff", label: "🌿 Intermediate" },
  Beginner:     { bg: "#95A5A6", text: "#fff", label: "🌱 Beginner" },
  Rookie:       { bg: "#BDC3C7", text: "#333", label: "🔰 Rookie" },
};

const RankBadge = ({ rank }) => {
  const s = RANK_STYLES[rank] || RANK_STYLES.Rookie;
  return (
    <span style={{ background: s.bg, color: s.text, padding: "2px 10px",
      borderRadius: 999, fontSize: "0.72rem", fontWeight: 700, whiteSpace: "nowrap" }}>
      {s.label}
    </span>
  );
};

const PositionIcon = ({ position }) => {
  if (position === 1) return <span style={{ fontSize: "1.4rem" }}>🥇</span>;
  if (position === 2) return <span style={{ fontSize: "1.4rem" }}>🥈</span>;
  if (position === 3) return <span style={{ fontSize: "1.4rem" }}>🥉</span>;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: 28, height: 28, borderRadius: "50%", background: "#1e293b",
      color: "#94a3b8", fontSize: "0.8rem", fontWeight: 700 }}>
      {position}
    </span>
  );
};

// ── Main component ────────────────────────────────────────────
export default function Leaderboard() {
  const [tab, setTab]             = useState("top10");
  const [players, setPlayers]     = useState([]);
  const [myRank, setMyRank]       = useState(null);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  const loadTop10 = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getGlobal();
      if (data.success) setPlayers(data.leaderboard ?? []);
      else throw new Error(data.message || "Failed to load leaderboard");
    } catch (e) {
      setError(
        e.name === "AbortError"
          ? "Request timed out — is the backend running on port 5050?"
          : e.message
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const loadPaginated = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getPaginated(page, 20);
      if (data.success) {
        setPlayers(data.leaderboard ?? []);
        setPagination(data.pagination);
      } else throw new Error(data.message || "Failed to load leaderboard");
    } catch (e) {
      setError(
        e.name === "AbortError"
          ? "Request timed out — is the backend running on port 5050?"
          : e.message
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMyRank = useCallback(async () => {
    try {
      const data = await api.getMyRank();
      if (data.success) setMyRank(data);
    } catch {
      // Not logged in or request failed — silently skip
    }
  }, []);

  useEffect(() => { loadMyRank(); }, [loadMyRank]);

  useEffect(() => {
    if (tab === "top10") loadTop10();
    else loadPaginated(1);
  }, [tab, loadTop10, loadPaginated]);

  // ── Render ─────────────────────────────────────────────────
  return (
    <div style={S.page}>

      {/* Header */}
      <div style={S.header}>
        <h1 style={S.title}>🏆 Leaderboard</h1>
        <p style={S.subtitle}>See where you stack up against other coders</p>
      </div>

      {/* My Rank Card — only when logged in */}
      {myRank && (
        <div style={S.myRankCard}>
          <span style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Your Rank</span>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 6 }}>
            <span style={S.myPosition}>#{myRank.position}</span>
            <div>
              <div style={{ color: "#f1f5f9", fontWeight: 700 }}>{myRank.username}</div>
              <div style={{ color: "#60a5fa", fontSize: "0.85rem" }}>
                {myRank.totalXP?.toLocaleString()} XP
              </div>
            </div>
            <div style={{ marginLeft: "auto" }}>
              <RankBadge rank={myRank.rank} />
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={S.tabs}>
        {["top10", "all"].map((t) => (
          <button key={t} style={{ ...S.tab, ...(tab === t ? S.tabActive : {}) }}
            onClick={() => setTab(t)}>
            {t === "top10" ? "Top 10" : "All Players"}
          </button>
        ))}
      </div>

      {/* Card */}
      <div style={S.card}>
        {loading ? (
          <div style={S.center}>
            <div style={S.spinner} />
            <p style={{ color: "#94a3b8", marginTop: 14, fontSize: "0.9rem" }}>
              Loading leaderboard…
            </p>
          </div>
        ) : error ? (
          <div style={S.center}>
            <p style={{ color: "#f87171", textAlign: "center", maxWidth: 360 }}>
              ⚠️ {error}
            </p>
            <button style={S.retryBtn}
              onClick={() => tab === "top10" ? loadTop10() : loadPaginated(pagination.page)}>
              Retry
            </button>
          </div>
        ) : players.length === 0 ? (
          <div style={S.center}>
            <p style={{ color: "#64748b" }}>No players yet — be the first!</p>
          </div>
        ) : (
          <>
            {/* Column headers */}
            <div style={S.tableHeader}>
              <span style={{ width: 40 }}>#</span>
              <span style={{ flex: 1 }}>Player</span>
              <span style={{ width: 120, textAlign: "right" }}>XP</span>
              <span style={{ width: 130, textAlign: "right" }}>Rank</span>
            </div>

            {/* Rows */}
            {players.map((player) => (
              <div key={player.username}
                style={{ ...S.row, ...(player.position <= 3 ? S.topRow : {}) }}>

                <span style={{ width: 40, flexShrink: 0 }}>
                  <PositionIcon position={player.position} />
                </span>

                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10 }}>
                  {player.avatar ? (
                    <img
                      src={player.avatar.startsWith("http")
                        ? player.avatar
                        : `${BASE_URL}${player.avatar}`}
                      alt={player.username}
                      style={S.avatar}
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  ) : (
                    <div style={S.avatarFallback}>
                      {player.username?.[0]?.toUpperCase() || "?"}
                    </div>
                  )}
                  <span style={{ color: "#e2e8f0", fontWeight: 600 }}>
                    {player.username}
                  </span>
                </div>

                <span style={{ width: 120, textAlign: "right", color: "#60a5fa", fontWeight: 700 }}>
                  {player.totalXP?.toLocaleString()}
                </span>

                <span style={{ width: 130, textAlign: "right" }}>
                  {player.rank && <RankBadge rank={player.rank} />}
                </span>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Pagination — only on "all" tab */}
      {tab === "all" && !loading && !error && pagination.pages > 1 && (
        <div style={S.pagination}>
          <button style={S.pageBtn}
            disabled={pagination.page <= 1}
            onClick={() => loadPaginated(pagination.page - 1)}>
            ← Prev
          </button>
          <span style={{ color: "#94a3b8", fontSize: "0.85rem" }}>
            Page {pagination.page} of {pagination.pages} ({pagination.total} players)
          </span>
          <button style={S.pageBtn}
            disabled={pagination.page >= pagination.pages}
            onClick={() => loadPaginated(pagination.page + 1)}>
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────
const S = {
  page: {
    maxWidth: 720,
    margin: "0 auto",
    padding: "32px 16px",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    minHeight: "100vh",
    background: "#0f172a",
    color: "#f1f5f9",
    boxSizing: "border-box",
  },
  header: { textAlign: "center", marginBottom: 28 },
  title: {
    fontSize: "2rem", fontWeight: 800, margin: 0,
    background: "linear-gradient(135deg, #60a5fa, #a78bfa)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
  },
  subtitle: { color: "#64748b", marginTop: 8, fontSize: "0.95rem" },
  myRankCard: {
    background: "linear-gradient(135deg, #1e3a5f, #1e293b)",
    border: "1px solid #3b82f6", borderRadius: 12,
    padding: "14px 20px", marginBottom: 20,
  },
  myPosition: { fontSize: "1.5rem", fontWeight: 800, color: "#f59e0b", minWidth: 48 },
  tabs: { display: "flex", gap: 8, marginBottom: 16 },
  tab: {
    padding: "8px 20px", borderRadius: 8, border: "1px solid #334155",
    background: "transparent", color: "#94a3b8", cursor: "pointer",
    fontWeight: 600, fontSize: "0.9rem",
  },
  tabActive: { background: "#3b82f6", color: "#fff", border: "1px solid #3b82f6" },
  card: {
    background: "#1e293b", borderRadius: 16,
    border: "1px solid #334155", overflow: "hidden", minHeight: 200,
  },
  tableHeader: {
    display: "flex", alignItems: "center", padding: "12px 20px",
    borderBottom: "1px solid #334155", color: "#64748b",
    fontSize: "0.8rem", fontWeight: 700,
    textTransform: "uppercase", letterSpacing: "0.05em", gap: 12,
  },
  row: {
    display: "flex", alignItems: "center", padding: "14px 20px",
    borderBottom: "1px solid #0f172a", gap: 12, background: "#1e293b",
  },
  topRow: { background: "#1a2744" },
  avatar: { width: 32, height: 32, borderRadius: "50%", objectFit: "cover", border: "2px solid #334155" },
  avatarFallback: {
    width: 32, height: 32, borderRadius: "50%", background: "#334155",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#94a3b8", fontWeight: 700, fontSize: "0.85rem", flexShrink: 0,
  },
  center: {
    display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", padding: 48, gap: 8,
  },
  // NOTE: @keyframes spin is injected via the style tag at the top of this file
  spinner: {
    width: 36, height: 36,
    border: "3px solid #334155", borderTopColor: "#3b82f6",
    borderRadius: "50%", animation: "spin 0.7s linear infinite",
  },
  retryBtn: {
    marginTop: 8, padding: "8px 20px", background: "#3b82f6",
    color: "#fff", border: "none", borderRadius: 8,
    cursor: "pointer", fontWeight: 600,
  },
  pagination: { display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginTop: 16 },
  pageBtn: {
    padding: "8px 16px", background: "#1e293b", color: "#94a3b8",
    border: "1px solid #334155", borderRadius: 8,
    cursor: "pointer", fontWeight: 600, fontSize: "0.85rem",
  },
};
