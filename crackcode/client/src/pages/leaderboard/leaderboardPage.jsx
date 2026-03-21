// React hooks
import { useEffect, useState } from "react";

// API functions to fetch leaderboard data
import { fetchGlobalLeaderboard, fetchMyRank } from "../../api/leaderboard";

// UI Components
import TopThree from "../../components/leaderboard/TopThree";
import LeaderboardTable from "../../components/leaderboard/leaderboardTable";
import Button from "../../components/ui/Button";
import HQBtn from "../../components/common/HQBtn";
// Theme chooser intentionally omitted on this page

// Leaderboard page component
const LeaderboardPage = () => {

  const [leaders, setLeaders] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  const normalize = (player, index) => ({
    rank: player.position ?? index + 1,
    name: player.username ?? "Unknown",
    title: player.rank ?? "Rookie",
    specialization: player.specialization ?? "General",
    points: player.totalXP ?? 0,
    cases: player.casesSolved ?? 0,
    streak: player.streak ?? 0,
    avatar: player.avatar ?? "🕵️",
  });

  useEffect(() => {

    const load = async () => {
      setLoading(true);
      setError(null);

      try {

        const data = await fetchGlobalLeaderboard();

        if (data && data.length > 0) {
          setLeaders(data.map(normalize));
        }

        try {
          const me = await fetchMyRank();

          if (me?.success) {
            setMyRank(me);
          }

        } catch {}

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
    { label: "All Time", value: "all" },
    { label: "Monthly", value: "monthly" },
    { label: "Weekly", value: "weekly" },
  ];

  return (

    <div
      className="min-h-screen flex flex-col relative px-6 sm:px-10 py-6"
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--text)",
      }}
    >

      {/* Navbar removed for leaderboard page */}

      <div className="absolute top-6 left-6">
        <HQBtn />
      </div>

      <main className="flex-1 px-10 pb-16 pt-6">

        {/* Filter buttons */}
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

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-wide">
            🏆 Detective Hall of Fame
          </h1>
          <p className="text-[var(--muted)]">
            Top investigators in the Code Detectives agency
          </p>
        </div>

        {/* My Rank */}
        {myRank && (
          <div
            className="flex items-center justify-between rounded-xl px-6 py-4 mb-10 max-w-5xl mx-auto border"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >

            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {myRank.avatar ?? "🕵️"}
              </span>

              <div>
                <p className="text-xs text-[var(--muted)] uppercase">
                  Your Rank
                </p>

                <p className="font-semibold">
                  {myRank.username}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-8 text-sm">

              <div className="text-center">
                <p className="text-[var(--muted)]">
                  #{myRank.position}
                </p>
                <p className="text-[var(--muted)]">Position</p>
              </div>

              <div className="text-center">
                <p className="text-[var(--muted)] font-bold text-lg">
                  {(myRank.totalXP ?? 0).toLocaleString()}
                </p>
                <p className="text-[var(--muted)] text-xs">Total XP</p>
              </div>

              <div className="text-center">
                <p className="font-bold text-lg" style={{ color: "var(--accent)" }}>
                  🔥 {myRank.streak ?? 0}
                </p>
                <p className="text-[var(--muted)] text-sm">Streak</p>
              </div>

            </div>

          </div>
        )}

        {loading ? (

          <div className="flex flex-col items-center py-24">
            <span className="text-4xl animate-pulse">🔍</span>
            <p className="text-[var(--muted)] mt-2 text-sm">
              Investigating records…
            </p>
          </div>

        ) : error ? (

          <div className="flex flex-col items-center py-24 gap-4">

            <span className="text-4xl">⚠️</span>

            <p style={{ color: "var(--brand)" }}>
              {error}
            </p>

            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "8px 20px",
                borderRadius: "8px",
                border: "1px solid var(--brand)",
                color: "var(--brand)",
                background: "transparent",
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
                onClick={() =>
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  })
                }
              >
                ↑ Back to Top
              </Button>
            </div>

          </div>
        )}

      </main>

      {/* Footer removed for this page */}

    </div>
  );
};

export default LeaderboardPage;