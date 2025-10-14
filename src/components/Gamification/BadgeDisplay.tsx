import React from "react";
import { useAppSelector } from "../../store/hooks";

const BadgeDisplay: React.FC = () => {
  const { badges } = useAppSelector(state => state.gamification);

  if (badges.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-md">
        <h3 className="font-bold text-lg mb-2 text-slate-700 dark:text-slate-300">
          🏆 Badges
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          Complete tasks to earn badges!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-md">
      <h3 className="font-bold text-lg mb-3 text-slate-700 dark:text-slate-300">
        🏆 Your Badges
      </h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {badges.map((badge:any) => (
          <div
            key={badge.id}
            className="flex flex-col items-center p-2 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900 dark:to-yellow-800 rounded-lg shadow-sm hover:scale-105 transition-transform"
            title={badge.description}
          >
            <span className="text-3xl">{badge.icon}</span>
            <span className="text-xs text-center mt-1 font-medium text-slate-700 dark:text-slate-200">
              {badge.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BadgeDisplay;
