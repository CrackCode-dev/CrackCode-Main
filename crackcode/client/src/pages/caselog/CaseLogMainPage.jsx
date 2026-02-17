import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import Button from "../../components/ui/Button";

const CaseLogMainPage = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await axios.get("/cases");
        setCases(res.data);
      } catch (err) {
        console.error("Failed to load cases", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading cases...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Navbar */}
      <Header />

      <main className="flex-1 px-10 pt-28 pb-16">

        {/* HQ Button */}
        <div className="mb-10">
          <Button>HQ</Button>
        </div>

        {/* Page Title */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">
            Solve Detective Cases
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Take on challenging coding mysteries. Each case tells a story.
            Solve them to earn points and climb the leaderboard.
          </p>
        </div>

        {/* ❗ Empty State */}
        {cases.length === 0 && (
          <p className="text-center text-gray-500">
            No cases available right now.
          </p>
        )}

        {/* Case Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cases.map((item) => (
            <div
              key={item._id}
              onClick={() => navigate(`/caselog/${item._id}`)}
              className="cursor-pointer rounded-xl overflow-hidden
                         border border-gray-800
                         bg-gradient-to-br from-gray-800 to-gray-900
                         hover:border-green-500 hover:scale-[1.02]
                         transition-all duration-200"
            >
              <div className="p-6 bg-black/70 h-full flex flex-col justify-between">

                {/* Case Info */}
                <div>
                  <h2 className="text-xl font-semibold mb-1">
                    {item.title || "Untitled Case"}
                  </h2>

                  <p className="text-sm text-gray-400 mb-4">
                    {item.level || "Unknown Level"}
                  </p>

                  <p className="text-gray-300 text-sm">
                    {item.description || "No description available."}
                  </p>
                </div>

                {/* Footer */}
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-green-400 text-sm">
                    {item.challengeCount ?? 0} Challenges
                  </span>
                  <span className="text-green-400 text-xl">→</span>
                </div>

              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CaseLogMainPage;
