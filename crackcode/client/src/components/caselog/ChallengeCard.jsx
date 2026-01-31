import Card from "../ui/Card";
import Badge from "../ui/Badge";

const ChallengeCard = ({ challenge }) => {
  const isEasy = challenge.difficulty === "Easy";
  const isMedium = challenge.difficulty === "Medium";


  return (
    <Card className="bg-zinc-900 border border-zinc-700 p-6">
      <div className="flex justify-between items-start">
        
        <div>
          <h2 className="text-2xl font-semibold text-white">
            {challenge.title}
          </h2>

          <p className="text-gray-400 mt-2 max-w-3xl">
            {challenge.description}
          </p>

          <div className="flex gap-6 mt-4 text-sm text-gray-400">
            <span className="text-green-400">
              +{challenge.points} Points
            </span>
            <span>{challenge.testCases} test cases</span>
          </div>
        </div>

        <Badge
          className={`
            px-3 py-1 text-sm font-semibold rounded-full
            ${isEasy && "bg-green-600 text-white"}
            ${isMedium && "bg-yellow-500 text-black"}
          `}
        >
          {challenge.difficulty}
        </Badge>

      </div>
    </Card>
  );
};

export default ChallengeCard;
