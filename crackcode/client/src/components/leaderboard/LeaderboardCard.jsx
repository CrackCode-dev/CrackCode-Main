const LeaderboardCard = ({ user, type }) => {
  const isGold   = type === "gold";
  const isSilver = type === "silver";
  const isBronze = type === "bronze";

  const cardBase =
    "relative flex flex-col items-center text-center rounded-2xl px-6 py-7 w-56 gap-1.5 border transition-transform duration-300";

  const cardVariant = isGold
    ? "border-yellow-700 bg-gradient-to-b from-[#1c1600] to-[#161616] scale-110 z-10 hover:-translate-y-1"
    : isSilver
    ? "border-neutral-600 bg-[#161616] hover:-translate-y-1"
    : "border-orange-900 bg-gradient-to-b from-[#150d06] to-[#161616] hover:-translate-y-1";

  const titleColor = isGold
    ? "text-yellow-400"
    : isSilver
    ? "text-neutral-400"
    : "text-orange-400";

  const xpBoxBg = isGold
    ? "bg-yellow-900/30"
    : isSilver
    ? "bg-neutral-700/30"
    : "bg-orange-900/30";

  const xpColor = isGold
    ? "text-yellow-400"
    : isSilver
    ? "text-neutral-300"
    : "text-orange-400";

  // ── Determine if avatar is an image path or an emoji ──────
  const isImagePath =
    typeof user.avatar === "string" &&
    (user.avatar.startsWith("/") ||
      user.avatar.startsWith("http") ||
      user.avatar.match(/\.(png|jpg|jpeg|gif|webp|svg)$/i));

  return (
    <div className={`${cardBase} ${cardVariant}`}>

      {isGold && (
        <span
          className="text-3xl mt-1"
          style={{ filter: "drop-shadow(0 0 8px rgba(255,200,0,0.6))" }}
        >
          🏆
        </span>
      )}

      {/* ── Avatar: image or emoji fallback ── */}
      {isImagePath ? (
        <img
          src={user.avatar}
          alt={user.name}
          className="mt-2 rounded-full object-cover border-2 border-neutral-700"
          style={{ width: 64, height: 64 }}
          onError={(e) => {
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
      ) : (
        <span className="text-5xl mt-2 leading-none">{user.avatar || "🕵️"}</span>
      )}

      <h3 className="font-rajdhani text-xl font-bold text-white mt-1 tracking-wide">
        {user.name}
      </h3>

      <p className={`text-xs font-semibold tracking-wide ${titleColor}`}>
        {user.title}
      </p>

      <div className={`w-full rounded-lg py-2.5 my-2 ${xpBoxBg}`}>
        <p className={`font-rajdhani text-3xl font-bold ${xpColor}`}>
          {user.points.toLocaleString()}
        </p>
        <p className="text-xs text-neutral-500 mt-0.5">Investigation points</p>
      </div>

      {isGold && (
        <div className="flex gap-2 text-lg my-1">
          <span>🏆</span>
          <span>⭐</span>
          <span>🔥</span>
        </div>
      )}

      {isGold && (
        <p className="flex items-center gap-1 text-sm font-semibold text-orange-400">
          🔥 <span>{user.streak} Days Streak</span>
        </p>
      )}

      <p className="text-xs text-neutral-500">{user.cases} cases solved</p>
    </div>
  );
};

export default LeaderboardCard;
