import ContentCard from "../../components/ui/Card";

const challenges = [
  { id: 1, title: "Monday Morning Puzzle", difficulty: "Easy", points: 50, type: "Multiple Choice" },
  { id: 2, title: "Code Debug Sprint", difficulty: "Intermediate", points: 75, type: "Debug Choice" },
  { id: 3, title: "Detective’s Terminology", difficulty: "Easy", points: 40, type: "Text Answer" },
];

export default function WeeklyChallenges() {
  return (
    <div className="min-h-screen bg-black text-white px-30 py-30">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-4xl">📅</span>
              <h1 className="text-5xl font-bold">Weekly Challenges</h1>
            </div>
            <p className="text-gray-400 mt-1">
              Complete this week’s challenges to earn points
            </p>
          </div>

          <div className="text-right">
            <p className="text-gray-400 text-1xl">Points Earned</p>
            <p className="text-green-500 text-5xl font-bold">0</p>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {challenges.map((c) => (
            <ContentCard
              key={c.id}
              variant="flat"
              className="bg-gradient-to-br from-[#111] to-[#0b0b0b]
                        border border-white/10 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold transition-colors duration-200 hover:text-orange-400 cursor-pointer">
                {c.title}
              </h3>
              
              <span className="inline-block mt-2 text-xs px-3 py-1 rounded-full bg-white/10 text-gray-300">
                {c.type}
              </span>

              <span
                className={`inline-block mt-3 text-xs px-3 py-1 rounded-full font-semibold
                  ${
                    c.difficulty === "Easy"
                      ? "bg-green-600/20 text-green-400"
                      : "bg-yellow-600/20 text-yellow-400"
                  }
                `}
              >
                {c.difficulty.toUpperCase()}
              </span>

              <p className="mt-4 text-green-400 font-bold flex items-center gap-1">
                ⚡ {c.points} XP
              </p>

            </ContentCard>
          ))}
        </div>
    </div>
  );
}
