import React from "react";
import { useAppSelector } from "../../store/hooks";

const StreakCounter: React.FC = () => {
  const { currentStreak, longestStreak } = useAppSelector(state => state.gamification);

  return (
    <div className="bg-gradient-to-br from-orange-400 to-red-500 text-white rounded-lg p-4 shadow-lg">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-3xl">🔥</span>
        <div>
          <h3 className="text-lg font-bold">Current Streak</h3>
          <p className="text-2xl font-extrabold">{currentStreak} days</p>
        </div>
      </div>
      <div className="text-sm opacity-90">
        <span>Longest streak: {longestStreak} days</span>
      </div>
    </div>
  );
};

export default StreakCounter;
