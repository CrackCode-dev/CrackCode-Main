const RANK_ICONS = { 1: "🏆", 2: "🥈", 3: "🥉" };

const TITLE_COLORS = {
  "Master Detective": { bg: "bg-green-900/20",  text: "text-green-400",  border: "border-green-700/30" },
  "Chief Detective":  { bg: "bg-sky-900/20",    text: "text-sky-400",    border: "border-sky-700/30"   },
  "Senior Detective": { bg: "bg-violet-900/20", text: "text-violet-400", border: "border-violet-700/30"},
  "Detective":        { bg: "bg-orange-900/20", text: "text-orange-400", border: "border-orange-700/30"},
};

const TitleBadge = ({ title }) => {
  const style = TITLE_COLORS[title] ?? TITLE_COLORS["Detective"];
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide border
        ${style.bg} ${style.text} ${style.border}`}
    >
      {title}
    </span>
  );
};

// ── Renders either an <img> or emoji depending on the avatar value ──
const Avatar = ({ avatar, name }) => {
  const isImagePath =
    typeof avatar === "string" &&
    (avatar.startsWith("/") ||
      avatar.startsWith("http") ||
      avatar.match(/\.(png|jpg|jpeg|gif|webp|svg)$/i));

  if (isImagePath) {
    return (
      <img
        src={avatar}
        alt={name}
        style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover",
          border: "2px solid #334155", flexShrink: 0 }}
        onError={(e) => { e.target.replaceWith(Object.assign(document.createElement("span"), { textContent: "🕵️" })); }}
      />
    );
  }
  return <span className="text-xl">{avatar || "🕵️"}</span>;
};

const LeaderboardTable = ({ data = [] }) => {
  return (
    <div className="rounded-2xl overflow-hidden border border-neutral-800 bg-[#111]">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#1a1a1a]">
            {["Rank", "Detective", "Title", "Specialization", "Investigation Points", "Cases Solved", "Streak"].map(
              (h) => (
                <th
                  key={h}
                  className="py-4 px-3.5 text-[11px] font-bold uppercase tracking-widest text-neutral-500 text-left first:pl-6 last:text-center"
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>

        <tbody>
          {data.map((user) => (
            <tr
              key={user.rank}
              className="border-t border-neutral-800/70 transition-colors hover:bg-[#161616]"
            >
              <td className="py-4 px-3.5 pl-6">
                <div className="flex items-center gap-1.5 font-rajdhani text-base font-bold text-green-400 whitespace-nowrap">
                  <span>#{user.rank}</span>
                  {RANK_ICONS[user.rank] && (
                    <span className="text-base">{RANK_ICONS[user.rank]}</span>
                  )}
                </div>
              </td>

              <td className="py-4 px-3.5">
                <div className="flex items-center gap-2.5 font-semibold text-neutral-100">
                  <Avatar avatar={user.avatar} name={user.name} />
                  <span>{user.name}</span>
                </div>
              </td>

              <td className="py-4 px-3.5">
                <TitleBadge title={user.title} />
              </td>

              <td className="py-4 px-3.5 text-sm text-neutral-400">
                {user.specialization}
              </td>

              <td className="py-4 px-3.5 font-rajdhani text-base font-bold text-green-400">
                {user.points.toLocaleString()}
              </td>

              <td className="py-4 px-3.5 text-center text-sm text-neutral-300">
                {user.cases}
              </td>

              <td className="py-4 px-3.5">
                <div className="flex items-center justify-center gap-1 font-bold text-orange-400">
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
