import { challenges } from "./challenges";
import ChallengeCard from "../../components/caselog/ChallengeCard";

const CaseLogPage = () => {
  return (
    <div className="min-h-screen bg-black text-white px-8 py-10">

      {/* HQ Button */}
      <div className="mb-10">
        <button className="border border-green-500 text-green-400 px-4 py-1 rounded">
          🏢 HQ
        </button>
      </div>

      {/* Title Section */}
      <div className="flex items-center gap-4 mb-12">
        <div className="text-5xl">🕵️‍♂️</div>
        <div>
          <h1 className="text-4xl font-bold">The Array Heist</h1>
          <p className="text-gray-400 mt-2 max-w-3xl">
            A crucial set of data has been stolen and scattered through arrays.
            Track each piece and reconstruct what was taken.
          </p>
        </div>
      </div>

      {/* Challenge List */}
      <div className="space-y-6">
        {challenges.map((challenge) => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
          />
        ))}
      </div>
    </div>
  );
};

export default CaseLogPage;
