import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import Button from "../../components/ui/Button";
import ThemeSwitch from "../../components/common/ThemeSwitcher";

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--text)]">
        Loading cases...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">

      <Header />

      <main className="flex-1 px-10 pt-28 pb-16">

        <div className="flex justify-end mb-6">
          <ThemeSwitch />
        </div>

        <div className="mb-10">
          <Button>HQ</Button>
        </div>

        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">
            Solve Detective Cases
          </h1>
          <p className="max-w-2xl mx-auto text-[var(--textSec)]">
            Take on challenging coding mysteries. Each case tells a story.
            Solve them to earn points and climb the leaderboard.
          </p>
        </div>

        {!loading && cases.length === 0 && (
          <p className="text-center text-[var(--textSec)]">
            No cases available right now.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cases.map((item) => (
            <div
              key={item._id}
              onClick={() => navigate(`/caselog/${item._id}`)}
              className="cursor-pointer rounded-xl overflow-hidden
                         border border-[var(--border)]
                         bg-[var(--surface)]
                         hover:border-[var(--brand)]
                         hover:scale-[1.02]
                         transition-all duration-200"
            >
              <div className="p-6 h-full flex flex-col justify-between">

                <div>
                  <h2 className="text-xl font-semibold mb-1">
                    {item.title || "Untitled Case"}
                  </h2>

                  <p className="text-sm text-[var(--textSec)] mb-4">
                    {item.level || "Unknown Level"}
                  </p>

                  <p className="text-sm text-[var(--textSec)]">
                    {item.description || "No description available."}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-[var(--brand)] text-sm">
                    {item.challengeCount ?? 0} Challenges
                  </span>
                  <span className="text-[var(--brand)] text-xl">→</span>
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