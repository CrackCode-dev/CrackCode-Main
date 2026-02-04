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

    </div>
  );
}
