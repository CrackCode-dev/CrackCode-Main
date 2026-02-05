import ContentCard from "../../components/ui/Card";

const challenges = [
  { id: 1, title: "Two Sum", difficulty: "Easy", points: 50 },
  { id: 2, title: "Binary Search", difficulty: "Medium", points: 75 },
];

export default function WeeklyChallenges() {
  return (
    <div className="min-h-screen bg-black text-white px-30 py-30">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {challenges.map((c) => (
            <ContentCard
              key={c.id}
              variant="flat"
              className="bg-gradient-to-br from-[#111] to-[#0b0b0b]
                        border border-white/10 rounded-xl p-6"
            ></ContentCard>
          ))}
        </div>
    </div>
  );
}
