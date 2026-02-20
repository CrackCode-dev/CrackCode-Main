import LeaderboardCard from "./LeaderboardCard";

const TopThree = ({ users = [] }) => {
  if (users.length < 3) return null;

  // Podium order: silver (2nd) | gold (1st) | bronze (3rd)
  const podiumOrder = [
    { user: users[1], type: "silver" },
    { user: users[0], type: "gold"   },
    { user: users[2], type: "bronze" },
  ];

  return (
    <div className="flex justify-center items-end gap-4 mb-12">
      {podiumOrder.map(({ user, type }) => (
        <LeaderboardCard key={user.rank} user={user} type={type} />
      ))}
    </div>
  );
};

export default TopThree;
