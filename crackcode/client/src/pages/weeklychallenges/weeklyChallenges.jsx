import ContentCard from "../../components/ui/Card";
import DifficultyBadge from "../../components/ui/Badge";
import { weeklyChallenges } from "./weeklyChallengesData";

const WeeklyChallenges = () => {
  const pointsEarnedToday = 0;

  return (
    <div className="min-h-screen bg-black text-white p-10">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold mb-1">Weekly Challenges</h1>
          <p className="text-gray-400">
            Complete today’s mysteries to earn points
          </p>
        </div>

        <div className="text-right">
          <p className="text-4xl font-bold text-green-400">
            {pointsEarnedToday}
          </p>
          <p className="text-gray-400 text-sm">
            Points Earned Today
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="flex gap-6">
        {weeklyChallenges.map((challenge) => (
          <ContentCard
            key={challenge.id}
            variant="flat"
            padding="md"
            shadow="sm"
            hoverEffect="lift"
            clickable
            title={challenge.title}
            subtitle={challenge.subtitle}
            badge={<DifficultyBadge level={challenge.difficulty} />}
            footer={
              <div className="flex justify-end text-green-400 font-semibold">
                ⚡ {challenge.points}
              </div>
            }
            onClick={() => {
              console.log("Open challenge:", challenge.title);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default WeeklyChallenges;
