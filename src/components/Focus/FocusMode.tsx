import React, { useState, useEffect } from "react";
import { useAppSelector } from "../../store/hooks";

const FocusMode: React.FC = () => {
  const tasks = useAppSelector(state => state.tasks.tasks);
  const [isActive, setIsActive] = useState(false);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // 25 minutes
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const incompleteTasks = tasks.filter((t:any) => !t.completed);
  const currentTask = incompleteTasks[currentTaskIndex];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setIsTimerRunning(false);
      // Play a sound or show notification
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    if (currentTaskIndex < incompleteTasks.length - 1) {
      setCurrentTaskIndex(prev => prev + 1);
      setTimeRemaining(25 * 60);
      setIsTimerRunning(false);
    }
  };

  const handlePrevious = () => {
    if (currentTaskIndex > 0) {
      setCurrentTaskIndex(prev => prev - 1);
      setTimeRemaining(25 * 60);
      setIsTimerRunning(false);
    }
  };

  if (!isActive) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-md">
        <h3 className="font-bold text-lg mb-2 text-slate-700 dark:text-slate-300">
          🎯 Focus Mode
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
          Work on one task at a time with a Pomodoro timer
        </p>
        <button
          onClick={() => setIsActive(true)}
          disabled={incompleteTasks.length === 0}
          className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed font-medium transition-all"
        >
          {incompleteTasks.length === 0 ? 'No tasks to focus on' : 'Start Focus Mode'}
        </button>
      </div>
    );
  }

  if (!currentTask) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md text-center">
        <span className="text-6xl mb-4 block">🎉</span>
        <h3 className="font-bold text-xl mb-2 text-slate-700 dark:text-slate-300">
          All tasks completed!
        </h3>
        <button
          onClick={() => setIsActive(false)}
          className="mt-3 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Exit Focus Mode
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900/95 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg text-slate-700 dark:text-slate-300">
            Focus Mode
          </h3>
          <button
            onClick={() => setIsActive(false)}
            className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          >
            ✕
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="text-6xl font-bold text-purple-600 dark:text-purple-400 mb-2">
            {formatTime(timeRemaining)}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-500">
            Task {currentTaskIndex + 1} of {incompleteTasks.length}
          </p>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-2 mb-2">
            <span className="text-2xl">{currentTask.emoji || '📝'}</span>
            <div className="flex-1">
              <h4 className="font-bold text-lg text-slate-700 dark:text-slate-300">
                {currentTask.title}
              </h4>
              {currentTask.description && (
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {currentTask.description}
                </p>
              )}
              {currentTask.xpReward && (
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">
                  +{currentTask.xpReward} XP when completed
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 font-medium"
          >
            {isTimerRunning ? '⏸ Pause' : '▶ Start'}
          </button>
          <button
            onClick={() => {
              setTimeRemaining(25 * 60);
              setIsTimerRunning(false);
            }}
            className="px-4 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600"
          >
            Reset
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handlePrevious}
            disabled={currentTaskIndex === 0}
            className="flex-1 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
          <button
            onClick={handleNext}
            disabled={currentTaskIndex === incompleteTasks.length - 1}
            className="flex-1 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};

export default FocusMode;
