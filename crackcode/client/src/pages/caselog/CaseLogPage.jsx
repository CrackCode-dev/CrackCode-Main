import { challenges } from "./challenges";
import ChallengeCard from "../../components/caselog/ChallengeCard";
import Button from "../../components/ui/Button";
import Header from "../../components/common/Header";

const CaseLogPage = () => {
  return (
    <div className="min-h-screen bg-black text-white">

      {/* Nav Bar (full width) */}
      <Header />

      {/* Page Content */}
      <div className="px-8 py-10">

        {/* HQ Button */}
        <div className="mb-10">
          <Button>
            HQ
          </Button>
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
    </div>
  );
};

export default CaseLogPage;
