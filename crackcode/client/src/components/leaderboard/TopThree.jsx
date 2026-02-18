import LeaderboardCard from "./LeaderboardCard";
import "./leaderboardComponents.css";

const TopThree = ({ users = [] }) => {
  if (users.length < 3) return null;

  // Podium order: silver (2nd) | gold (1st) | bronze (3rd)
  const podiumOrder = [
    { user: users[1], type: "silver" },
    { user: users[0], type: "gold" },
    { user: users[2], type: "bronze" },
  ];

  return (
    <div className="podium">
      {podiumOrder.map(({ user, type }) => (
        <LeaderboardCard key={user.rank} user={user} type={type} />
      ))}
    </div>
  );
};

export default TopThree;
