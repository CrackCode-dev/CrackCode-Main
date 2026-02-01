import { useEffect, useState } from "react";
// import { fetchWeeklyChallenges } from "../../api/weeklyChallenges"; // later

const dummyChallenges = [
  { id: 1, title: "Two Sum", difficulty: "Easy" },
  { id: 2, title: "Binary Search", difficulty: "Medium" },
];

export default function WeeklyChallenges() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TEMP: using dummy data (safe fallback)
    setChallenges(dummyChallenges);
    setLoading(false);

    // REAL API (enable later)
    /*
    fetchWeeklyChallenges()
      .then((data) => setChallenges(data || []))
      .catch((err) => {
        console.error("API error:", err);
        setChallenges([]); // critical fallback
      })
      .finally(() => setLoading(false));
    */
  }, []);

  return (
    <div className="text-white p-6">
      <h1 className="text-2xl mb-4">Weekly Challenges</h1>

      {loading && <p>Loading...</p>}

      {!loading && challenges.length === 0 && (
        <p>No challenges available</p>
      )}

      {!loading && challenges.length > 0 && (
        <ul className="space-y-2">
          {challenges.map((c) => (
            <li key={c.id} className="border p-3 rounded">
              {c.title} – {c.difficulty}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
