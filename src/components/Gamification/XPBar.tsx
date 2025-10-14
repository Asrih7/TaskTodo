import React from "react";
import { useAppSelector } from "../../store/hooks";

const XPBar: React.FC = () => {
  const { totalXP, level } = useAppSelector(state => state.gamification);
  
  const xpForCurrentLevel = (level - 1) * 100;
  const xpForNextLevel = level * 100;
  const xpProgress = totalXP - xpForCurrentLevel;
  const xpNeeded = xpForNextLevel - xpForCurrentLevel;
  const percentage = (xpProgress / xpNeeded) * 100;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-md">
      <div className="flex justify-between items-center mb-2">
        <div>
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            Level {level}
          </span>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {xpProgress} / {xpNeeded} XP
          </p>
        </div>
        <div className="text-right">
          <span className="text-lg font-semibold text-slate-700 dark:text-slate-300">
            {totalXP} Total XP
          </span>
        </div>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-500 ease-out"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
};

export default XPBar;
