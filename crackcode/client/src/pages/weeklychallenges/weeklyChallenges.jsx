import ContentCard from "../../components/ui/Card";

const challenges = [
  { id: 1, title: "Two Sum", difficulty: "Easy", points: 50 },
  { id: 2, title: "Binary Search", difficulty: "Medium", points: 75 },
];

export default function WeeklyChallenges() {
  return (
    <div className="min-h-screen bg-black text-white px-10 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {challenges.map((c) => (
          <ContentCard key={c.id} variant="flat">
            <h3 className="text-xl font-bold">{c.title}</h3>
            <p className="text-gray-400 mt-1">{c.difficulty}</p>
            <p className="mt-3 text-green-400 font-semibold">+{c.points} XP</p>
          </ContentCard>
        ))}
      </div>
    </div>
  );
}
