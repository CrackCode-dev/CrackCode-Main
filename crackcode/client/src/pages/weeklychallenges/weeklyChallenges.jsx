// src/pages/weeklychallenges/weeklyChallenges.jsx
import React, { useState, useEffect } from "react";
import ContentCard from "../../components/ui/Card";
import DifficultyBadge from "../../components/ui/Badge";
import { weeklyChallenges } from "./weeklyChallengesData";

export default function WeeklyChallenges() {
  const [pointsEarnedToday, setPointsEarnedToday] = useState(0);
  const [challenges, setChallenges] = useState([]);

  // Load challenges safely
  useEffect(() => {
    try {
      setChallenges(weeklyChallenges); // Load static data first
    } catch (err) {
      console.error("Failed to load weekly challenges:", err);
      setChallenges([]);
    }
  }, []);

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">Weekly Challenges</h1>
      <p className="mb-6">Points earned today: {pointsEarnedToday}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map((challenge) => (
          <ContentCard
            key={challenge.id}
            title={challenge.title}
            subtitle={challenge.subtitle}
            description={challenge.description}
            badge={<DifficultyBadge level={challenge.difficulty} />}
            onClick={() => alert(`Clicked: ${challenge.title}`)}
            hoverEffect="lift"
            clickable
          />
        ))}
      </div>
    </div>
  );
}
