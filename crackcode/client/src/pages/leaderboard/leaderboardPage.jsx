import { useEffect, useState } from "react";
import { fetchGlobalLeaderboard, fetchMyRank } from "../../api/leaderboard";
import TopThree from "../../components/leaderboard/TopThree";
import LeaderboardTable from "../../components/leaderboard/leaderboardTable";
import Button from "../../components/ui/Button";
import Header from "../../components/common/Header";
import { Trophy, Search, AlertTriangle, Flame, RefreshCw, ArrowUp, HatGlasses } from "lucide-react";

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

        } catch { /* empty */ }

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

    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <Header variant="empty" showBackBtn={false}/>

      <main className="flex-1 px-6 sm:px-10 py-10 mt-20">

         {/* Title + Filter buttons */}
        <div className="flex items-center justify-between max-w-5xl mx-auto mt-20 mb-12">
          <div className="text-center flex-1">
            <div className="flex flex-col gap-5">
              <h1 
                className="text-4xl md:text-5xl font-bold tracking-wide inline-flex items-center justify-center gap-5 mb-4" 
                style={{color: 'var(--text)'}}
              >
                <Trophy className="w-9 h-9 shrink-0" style={{color: 'var(--brand)'}}/>
                <span>Detective Hall of Fame</span>
              </h1>
            </div>
            <p className="text-(--muted) text-lg">
              Top investigators in the Code Detectives agency
            </p>
          </div>
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

        {/* My Rank */}
        {myRank && (
          <div
            className="relative flex items-center justify-between rounded-xl px-6 py-4 mb-10 max-w-5xl mx-auto border"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >

            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {myRank.avatar ?? <HatGlasses className="w-6 h-6" />}
              </span>

              <div>
                <p className="text-xs text-(--muted) uppercase">
                  Your Rank
                </p>

                <p className="font-semibold">
                  {myRank.username}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm mr-16">

              <div className="text-center text-lg">
                <p className="text-(--muted)">
                  #{myRank.position}
                </p>
                <p className="text-(--muted)">Position</p>
              </div>

              <div className="text-center text-lg">
                <p className="text-(--muted) font-bold text-lg">
                  {(myRank.totalXP ?? 0).toLocaleString()}
                </p>
                <p className="text-(--muted) ">Total XP</p>
              </div>

              <div className="absolute flex items-center gap-1" style={{top: '12px', right: '16px'}}>
                <Flame className="w-5 h-5" style={{ color: "var(--brand)" }} />
                <span className="font-bold text-lg" style={{ color: "var(--accent)" }}>
                  {myRank.streak ?? 0}
                </span>
              </div>

            </div>

          </div>
        )}

        {loading ? (

          <div className="flex flex-col items-center py-24">
            <span className="text-4xl animate-pulse">
              <Search className="w-10 h-10" style={{ color: "var(--brand)" }} />  
            </span>
            <p className="text-(--muted) mt-2 text-sm">
              Investigating records…
            </p>
          </div>

        ) : error ? (

          <div className="flex flex-col items-center py-24 gap-4">

            <span className="text-4xl">
              <AlertTriangle className="w-10 h-10" style={{ color: "var(--brand)" }} />
            </span>

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
                variant="primary"
                icon={ArrowUp}
                iconPosition="left"
                onClick={() =>
                window.scrollTo({top: 0,behavior: "smooth",})}
              >
                Back to Top
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