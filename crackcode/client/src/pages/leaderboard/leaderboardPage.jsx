import { useEffect, useState } from "react";
import { fetchGlobalLeaderboard } from "../../api/leaderboard";
import TopThree from "../../components/leaderboard/TopThree";
import LeaderboardTable from "../../components/leaderboard/LeaderboardTable";
import "./leaderboard.css";

// ── Fallback data (shown when API is unavailable) ──────────────
const FALLBACK_DATA = [
  {
    rank: 1,
    name: "Sherlock Holmes",
    title: "Master Detective",
    specialization: "Algorithm Expert",
    points: 4850,
    cases: 42,
    streak: 28,
    avatar: "🕵️",
  },
  {
    rank: 2,
    name: "T-800",
    title: "Chief Detective",
    specialization: "Data Structures",
    points: 4620,
    cases: 38,
    streak: 22,
    avatar: "🤖",
  },
  {
    rank: 3,
    name: "Merlin",
    title: "Chief Detective",
    specialization: "Logic Puzzles",
    points: 4390,
    cases: 35,
    streak: 18,
    avatar: "🧙",
  },
  {
    rank: 4,
    name: "Code Ninja",
    title: "Senior Detective",
    specialization: "String Manipulation",
    points: 4120,
    cases: 32,
    streak: 15,
    avatar: "🥷",
  },
  {
    rank: 5,
    name: "Debug Hunter",
    title: "Senior Detective",
    specialization: "Pattern Recognition",
    points: 3890,
    cases: 29,
    streak: 12,
    avatar: "🔍",
  },
  {
    rank: 6,
    name: "Pattern Master",
    title: "Detective",
    specialization: "Dynamic Programming",
    points: 3650,
    cases: 26,
    streak: 10,
    avatar: "🎯",
  },
];

const LeaderboardPage = () => {
  const [leaders, setLeaders] = useState(FALLBACK_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchGlobalLeaderboard();

        if (data && data.length > 0) {
          const normalized = data.map((u, i) => ({
            rank:           u.rank ?? u.position ?? i + 1,
            name:           u.name ?? u.username ?? "Unknown",
            title:          u.title ?? "Detective",
            specialization: u.specialization ?? "—",
            points:         u.points ?? u.totalXP ?? u.score ?? 0,
            cases:          u.cases ?? u.casesSolved ?? 0,
            streak:         u.streak ?? 0,
            avatar:         u.avatar ?? "🕵️",
          }));
          setLeaders(normalized);
        }
        // If API returns empty, fallback data stays
      } catch (err) {
        console.error("Leaderboard load error:", err);
        // Fallback data already set as default state
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const topThree = leaders.slice(0, 3);

  return (
    <div className="lb-page">
      {/* Header */}
      <div className="lb-header">
        <h1>🏆 Detective Hall of Fame</h1>
        <p>Top investigators in the Code Detectives agency</p>
      </div>

      {loading ? (
        <div className="lb-loading">Loading detectives…</div>
      ) : (
        <>
          {/* Podium – silver | gold | bronze */}
          <TopThree users={topThree} />

          {/* Full rankings table */}
          <LeaderboardTable data={leaders} />
        </>
      )}
    </div>
  );
};

export default LeaderboardPage;
