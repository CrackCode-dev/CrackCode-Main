/**
 * LeaderboardCard.jsx
 * 
 * Displays a single player card on the top-3 podium.
 * Receives a `user` object and a `type` prop ("gold" | "silver" | "bronze")
 * to determine styling and which extra elements to show.
 */

const LeaderboardCard = ({ user, type }) => {
  // ── Position flags ────────────────────────────────────────
  const isGold   = type === "gold";
  const isSilver = type === "silver";
  const isBronze = type === "bronze";

  // ── Base card classes shared by all three cards ───────────
  const cardBase =
    "relative flex flex-col items-center text-center rounded-2xl px-6 py-7 w-56 gap-1.5 border transition-transform duration-300";

  // ── Per-position card styling ─────────────────────────────
  // Gold: larger (scale-110), warm dark gradient, yellow border
  // Silver: flat dark background, neutral border
  // Bronze: warm dark gradient, orange border
  const cardVariant = isGold
    ? "border-yellow-700 bg-gradient-to-b from-[#1c1600] to-[#161616] scale-110 z-10 hover:-translate-y-1"
    : isSilver
    ? "border-neutral-600 bg-[#161616] hover:-translate-y-1"
    : "border-orange-900 bg-gradient-to-b from-[#150d06] to-[#161616] hover:-translate-y-1";

  // ── Title (rank label) text color per position ────────────
  const titleColor = isGold
    ? "text-yellow-400"
    : isSilver
    ? "text-neutral-400"
    : "text-orange-400";

  // ── XP box background tint per position ───────────────────
  const xpBoxBg = isGold
    ? "bg-yellow-900/30"
    : isSilver
    ? "bg-neutral-700/30"
    : "bg-orange-900/30";

  // ── XP number text color per position ────────────────────
  const xpColor = isGold
    ? "text-yellow-400"
    : isSilver
    ? "text-neutral-300"
    : "text-orange-400";

  return (
    <div className={`${cardBase} ${cardVariant}`}>

      {/* ── Trophy icon — only shown on the gold (1st place) card ── */}
      {isGold && (
        <span
          className="text-3xl mt-1"
          style={{ filter: "drop-shadow(0 0 8px rgba(255,200,0,0.6))" }}
        >
          🏆
        </span>
      )}

      {/* ── Player avatar (emoji or image) ── */}
      <span className="text-5xl mt-2 leading-none">{user.avatar}</span>

      {/* ── Player username ── */}
      <h3 className="font-rajdhani text-xl font-bold text-white mt-1 tracking-wide">
        {user.name}
      </h3>

      {/* ── Rank title (e.g. "Rookie", "Legend") ── */}
      <p className={`text-xs font-semibold tracking-wide ${titleColor}`}>
        {user.title}
      </p>

      {/* ── Investigation points box ── */}
      <div className={`w-full rounded-lg py-2.5 my-2 ${xpBoxBg}`}>
        <p className={`font-rajdhani text-3xl font-bold ${xpColor}`}>
          {user.points.toLocaleString()}
        </p>
        <p className="text-xs text-neutral-500 mt-0.5">Investigation points</p>
      </div>

      {/* ── Achievement badges — gold card only ── */}
      {isGold && (
        <div className="flex gap-2 text-lg my-1">
          <span>🏆</span>
          <span>⭐</span>
          <span>🔥</span>
        </div>
      )}

      {/* ── Active streak — gold card only ── */}
      {isGold && (
        <p className="flex items-center gap-1 text-sm font-semibold text-orange-400">
          🔥 <span>{user.streak} Days Streak</span>
        </p>
      )}

      {/* ── Cases solved count (shown on all cards) ── */}
      <p className="text-xs text-neutral-500">{user.cases} cases solved</p>

    </div>
  );
};

export default LeaderboardCard;
