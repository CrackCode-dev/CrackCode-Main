import { challenges } from "./challenges";
import ChallengeCard from "../../components/caselog/ChallengeCard";
import Button from "../../components/ui/Button";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";

const CaseLogPage = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">

      {/* Nav Bar */}
      <Header />

      <div className="h-45"></div>

      {/* Page Content */}
      <main className="flex-1 px-8 pt-24 pb-10">

        {/* HQ Button */}
        <div className="px-6">
          <Button>HQ</Button>
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

      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default CaseLogPage;
