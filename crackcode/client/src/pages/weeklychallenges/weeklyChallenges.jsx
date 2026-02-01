import ContentCard from "../../components/ui/Card";

export default function WeeklyChallenges() {
  return (
    <div className="min-h-screen bg-black p-10 text-white">
      <h1 className="text-3xl font-bold mb-6">Weekly Challenges</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ContentCard variant="flat">
          <h3 className="text-xl font-bold">Two Sum</h3>
          <p className="text-gray-400 mt-2">Easy</p>
        </ContentCard>
      </div>
    </div>
  );
}
