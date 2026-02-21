import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchGlobalLeaderboard, fetchMyRank } from "../../api/leaderboard";
import TopThree from "../../components/leaderboard/TopThree";
import LeaderboardTable from "../../components/leaderboard/LeaderboardTable";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import Button from "../../components/ui/Button";

const LeaderboardPage = () => {
  const navigate = useNavigate();

  const [leaders, setLeaders] = useState([]);
  const [myRank,  setMyRank]  = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [filter,  setFilter]  = useState("all");

  const normalize = (player, index) => ({
    rank:           player.position        ?? index + 1,
    name:           player.username        ?? "Unknown",
    title:          player.rank            ?? "Rookie",
    specialization: player.specialization  ?? "General",
    points:         player.totalXP         ?? 0,
    cases:          player.casesSolved     ?? 0,
    streak:         player.streak          ?? 0,
    avatar:         player.avatar          ?? "🕵️",
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchGlobalLeaderboard();
        if (data && data.length > 0) setLeaders(data.map(normalize));
        try {
          const me = await fetchMyRank();
          if (me?.success) setMyRank(me);
        } catch { /* not logged in */ }
      } catch (err) {
        console.error("Leaderboard load error:", err);
        setError("Could not reach server. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [filter]);

  const topThree = leaders.slice(0, 3);
  const filterButtons = [
    { label: "All Time", value: "all"     },
    { label: "Monthly",  value: "monthly" },
    { label: "Weekly",   value: "weekly"  },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <link
        href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Exo+2:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <Header />

      {/* HQ Button fixed to top-left below navbar */}
      <button
        onClick={() => navigate("/hq")}
        style={{
          position: "fixed",
          top: "80px",
          left: "20px",
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "8px 14px",
          borderRadius: "10px",
          border: "1.5px solid #22c55e",
          background: "transparent",
          color: "#22c55e",
          fontSize: "13px",
          fontWeight: "700",
          cursor: "pointer",
          letterSpacing: "0.5px",
        }}
        onMouseEnter={e => { e.currentTarget.style.background = "rgba(34,197,94,0.1)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
      >
        🏠 HQ
      </button>

      {/* Spacer below fixed navbar */}
      <div style={{ height: "950px" }} />

      <main className="flex-1 px-10 pb-16">

        {/* Filter buttons top-right */}
        <div className="flex justify-end max-w-5xl mx-auto mb-8">
          <div className="flex gap-3">
            {filterButtons.map(({ label, value }) => (
              <Button
                key={value}
                variant={filter === value ? "primary" : "ghost"}
                onClick={() => setFilter(value)}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Page Title */}
        <div className="text-center mb-12">
          <h1
            className="flex items-center justify-center gap-3 text-4xl font-bold text-white tracking-wide"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            🏆 Detective Hall of Fame
          </h1>
          <p className="text-neutral-500 mt-2 text-sm">
            Top investigators in the Code Detectives agency
          </p>
        </div>

        {/* Your Rank Banner */}
        {myRank && (
          <div className="flex items-center justify-between bg-[#161616] border border-green-900/40 rounded-xl px-6 py-4 mb-10 max-w-5xl mx-auto">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{myRank.avatar ?? "🕵️"}</span>
              <div>
                <p className="text-xs text-neutral-500 uppercase tracking-widest mb-0.5">Your Rank</p>
                <p className="font-semibold text-white" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                  {myRank.username}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-8 text-sm">
              <div className="text-center">
                <p className="text-green-400 font-bold text-lg" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                  #{myRank.position}
                </p>
                <p className="text-neutral-600 text-xs">Position</p>
              </div>
              <div className="text-center">
                <p className="text-green-400 font-bold text-lg" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                  {(myRank.totalXP ?? 0).toLocaleString()}
                </p>
                <p className="text-neutral-600 text-xs">Total XP</p>
              </div>
              <div className="text-center">
                <p className="text-orange-400 font-bold text-lg" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                  🔥 {myRank.streak ?? 0}
                </p>
                <p className="text-neutral-600 text-xs">Streak</p>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <span className="text-4xl animate-pulse">🔍</span>
            <p className="text-neutral-600 tracking-widest text-sm">Investigating records…</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <span className="text-4xl">⚠️</span>
            <p className="text-red-400 text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "8px 20px",
                borderRadius: "8px",
                border: "1px solid #ef4444",
                color: "#f87171",
                background: "transparent",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto">
            <TopThree users={topThree} />
            <LeaderboardTable data={leaders} />
            <div className="flex justify-center mt-10">
              <Button
                variant="outline"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                ↑ Back to Top
              </Button>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
};

export default LeaderboardPage;
