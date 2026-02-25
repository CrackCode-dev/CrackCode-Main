/**
 * LeaderboardCard.jsx
 * Fully Tailwind dark-mode aware.
 * Light mode default, dark mode switches automatically.
 */

const LeaderboardCard = ({ user, type }) => {
  const isGold = type === "gold";
  const isSilver = type === "silver";
  const isBronze = type === "bronze";

  const cardBase =
    "relative flex flex-col items-center text-center rounded-2xl px-6 py-7 w-56 gap-1.5 border transition-transform duration-300";

  // ── Podium card variants ──
  const cardVariant = isGold
    ? "border-yellow-700 scale-110 z-10 hover:-translate-y-1 bg-yellow-50 dark:bg-yellow-900"
    : isSilver
    ? "border-neutral-600 hover:-translate-y-1 bg-gray-100 dark:bg-neutral-800"
    : "border-orange-900 hover:-translate-y-1 bg-orange-50 dark:bg-orange-900";

  const titleColor = isGold
    ? "text-yellow-600 dark:text-yellow-400"
    : isSilver
    ? "text-gray-600 dark:text-neutral-400"
    : "text-orange-600 dark:text-orange-400";

  const xpBoxBg = isGold
    ? "bg-yellow-200/30 dark:bg-yellow-900/30"
    : isSilver
    ? "bg-gray-200/30 dark:bg-neutral-700/30"
    : "bg-orange-200/30 dark:bg-orange-900/30";

  const xpColor = isGold
    ? "text-yellow-600 dark:text-yellow-400"
    : isSilver
    ? "text-gray-700 dark:text-neutral-300"
    : "text-orange-600 dark:text-orange-400";

  const neutralText = "text-gray-500 dark:text-neutral-400";

  return (
    <div className={`${cardBase} ${cardVariant} text-gray-900 dark:text-white`}>
      {/* Trophy for gold */}
      {isGold && (
        <span
          className="text-3xl mt-1"
          style={{ filter: "drop-shadow(0 0 8px rgba(255,200,0,0.6))" }}
        >
          🏆
        </span>
      )}

      {/* Avatar */}
      <span className="text-5xl mt-2 leading-none">{user.avatar}</span>

      {/* Username */}
      <h3 className="font-rajdhani text-xl font-bold mt-1 tracking-wide">
        {user.name}
      </h3>

      {/* Rank title */}
      <p className={`text-xs font-semibold tracking-wide ${titleColor}`}>
        {user.title}
      </p>

      {/* XP Box */}
      <div className={`w-full rounded-lg py-2.5 my-2 ${xpBoxBg}`}>
        <p className={`font-rajdhani text-3xl font-bold ${xpColor}`}>
          {user.points.toLocaleString()}
        </p>
        <p className={`${neutralText} text-xs mt-0.5`}>Investigation points</p>
      </div>

      {/* Achievement badges for gold */}
      {isGold && (
        <div className="flex gap-2 text-lg my-1">
          <span>🏆</span>
          <span>⭐</span>
          <span>🔥</span>
        </div>
      )}

      {/* Streak for gold */}
      {isGold && (
        <p className="flex items-center gap-1 text-sm font-semibold text-orange-600 dark:text-orange-400">
          🔥 <span>{user.streak} Days Streak</span>
        </p>
      )}

      {/* Cases solved */}
      <p className={`${neutralText} text-xs`}>{user.cases} cases solved</p>
    </div>
  );
};

export default LeaderboardCard;