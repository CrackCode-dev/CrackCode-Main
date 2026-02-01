export default function WeeklyChallenges() {
  return (
    <div className="text-white p-6">
      <h1 className="text-2xl mb-4">Weekly Challenges</h1>

      {/* put real content BELOW */}
    </div>
  );
}

const dummyChallenges = [
  { id: 1, title: "Two Sum", difficulty: "Easy" },
  { id: 2, title: "Binary Search", difficulty: "Medium" },
];

<ul>
  {dummyChallenges.map((c) => (
    <li key={c.id}>
      {c.title} – {c.difficulty}
    </li>
  ))}
</ul>
