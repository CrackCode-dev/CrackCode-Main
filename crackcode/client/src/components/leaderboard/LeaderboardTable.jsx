const RANK_ICONS = { 1: "🏆", 2: "🥈", 3: "🥉" };

const TITLE_COLORS = {
  "Master Detective": { bg: "bg-green-200/30 dark:bg-green-900/20", text: "text-green-600 dark:text-green-400", border: "border-green-700/30" },
  "Chief Detective":  { bg: "bg-sky-200/30 dark:bg-sky-900/20",   text: "text-sky-600 dark:text-sky-400",     border: "border-sky-700/30" },
  "Senior Detective": { bg: "bg-violet-200/30 dark:bg-violet-900/20", text: "text-violet-600 dark:text-violet-400", border: "border-violet-700/30" },
  "Detective":        { bg: "bg-orange-200/30 dark:bg-orange-900/20", text: "text-orange-600 dark:text-orange-400", border: "border-orange-700/30" },
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

const LeaderboardTable = ({ data = [] }) => {
  return (
    <div className="rounded-2xl overflow-hidden border border-neutral-300 bg-white dark:border-neutral-800 dark:bg-[#111]">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 dark:bg-[#1a1a1a]">
            {["Rank", "Detective", "Title", "Specialization", "Investigation Points", "Cases Solved", "Streak"].map(
              (h) => (
                <th
                  key={h}
                  className="py-4 px-3.5 text-[11px] font-bold uppercase tracking-widest text-gray-500 dark:text-neutral-500 text-left first:pl-6 last:text-center"
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
              className="border-t border-neutral-300/70 dark:border-neutral-800/70 transition-colors hover:bg-gray-200/30 dark:hover:bg-[#161616]"
            >
              {/* Rank */}
              <td className="py-4 px-3.5 pl-6">
                <div className="flex items-center gap-1.5 font-rajdhani text-base font-bold text-green-600 dark:text-green-400 whitespace-nowrap">
                  <span>#{user.rank}</span>
                  {RANK_ICONS[user.rank] && <span className="text-base">{RANK_ICONS[user.rank]}</span>}
                </div>
              </td>

              {/* Detective */}
              <td className="py-4 px-3.5">
                <div className="flex items-center gap-2.5 font-semibold text-gray-900 dark:text-neutral-100">
                  <span className="text-xl">{user.avatar}</span>
                  <span>{user.name}</span>
                </div>
              </td>

              {/* Title */}
              <td className="py-4 px-3.5">
                <TitleBadge title={user.title} />
              </td>

              {/* Specialization */}
              <td className="py-4 px-3.5 text-sm text-gray-600 dark:text-neutral-400">
                {user.specialization}
              </td>

              {/* Points */}
              <td className="py-4 px-3.5 font-rajdhani text-base font-bold text-green-600 dark:text-green-400">
                {user.points.toLocaleString()}
              </td>

              {/* Cases */}
              <td className="py-4 px-3.5 text-center text-sm text-gray-500 dark:text-neutral-300">
                {user.cases}
              </td>

              {/* Streak */}
              <td className="py-4 px-3.5">
                <div className="flex items-center justify-center gap-1 font-bold text-orange-600 dark:text-orange-400">
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