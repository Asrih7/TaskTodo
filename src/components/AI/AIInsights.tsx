import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../store/hooks';
import { Task } from '../../interfaces';

const AIInsights: React.FC = () => {
  const tasks = useAppSelector((state) => state.tasks.tasks);
  const [dailyInsight, setDailyInsight] = useState<string>('');
  const [weeklyInsight, setWeeklyInsight] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const generateInsights = () => {
    if (tasks.length === 0) {
      setDailyInsight("Start adding tasks to get personalized insights about your productivity patterns!");
      setWeeklyInsight("Complete a few tasks this week to unlock detailed productivity analysis.");
      return;
    }
    
    setIsLoading(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const insights = analyzeProductivityPatterns(tasks);
      setDailyInsight(insights.daily);
      setWeeklyInsight(insights.weekly);
      setIsLoading(false);
    }, 1500);
  };

  const analyzeProductivityPatterns = (userTasks: Task[]) => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const thisWeek = getThisWeek();
    
    // Daily analysis
    const todayTasks = userTasks.filter(task => task.date === today);
    const todayCompleted = todayTasks.filter(task => task.completed);
    const todayImportant = todayTasks.filter(task => task.important);
    
    // Weekly analysis
    const weekTasks = userTasks.filter(task => 
      thisWeek.some(date => date === task.date)
    );
    const weekCompleted = weekTasks.filter(task => task.completed);
    const weekImportant = weekTasks.filter(task => task.important);
    
    // Overall patterns
    const totalCompleted = userTasks.filter(task => task.completed);
    const completionRate = userTasks.length > 0 ? 
      Math.round((totalCompleted.length / userTasks.length) * 100) : 0;
    
    // Generate insights
    let dailyInsight = "";
    let weeklyInsight = "";
    
    // Daily insights
    if (todayTasks.length === 0) {
      dailyInsight = "🌅 New day, fresh start! Consider adding some tasks to make today productive.";
    } else if (todayCompleted.length === 0) {
      dailyInsight = `⚡ You have ${todayTasks.length} task${todayTasks.length > 1 ? 's' : ''} scheduled today. Time to dive in and make progress!`;
    } else if (todayCompleted.length === todayTasks.length) {
      dailyInsight = "🎉 Fantastic! You've completed all your tasks for today. You're on fire!";
    } else {
      const remaining = todayTasks.length - todayCompleted.length;
      dailyInsight = `💪 Great progress! You've completed ${todayCompleted.length}/${todayTasks.length} tasks today. ${remaining} more to go!`;
    }
    
    // Add priority insights
    if (todayImportant.length > 0) {
      const completedImportant = todayImportant.filter(task => task.completed);
      if (completedImportant.length === 0) {
        dailyInsight += ` Focus on your ${todayImportant.length} priority task${todayImportant.length > 1 ? 's' : ''} first.`;
      }
    }
    
    // Weekly insights
    if (weekTasks.length === 0) {
      weeklyInsight = "📅 Plan your week ahead! Adding tasks with specific dates helps you stay organized.";
    } else {
      const weekProgress = weekTasks.length > 0 ? 
        Math.round((weekCompleted.length / weekTasks.length) * 100) : 0;
      
      if (weekProgress >= 80) {
        weeklyInsight = `🌟 Excellent weekly performance! You're ${weekProgress}% complete with this week's tasks.`;
      } else if (weekProgress >= 50) {
        weeklyInsight = `📈 Solid progress this week at ${weekProgress}% completion. Keep the momentum going!`;
      } else if (weekProgress >= 20) {
        weeklyInsight = `⚡ You're ${weekProgress}% through this week's tasks. Consider prioritizing the most important ones.`;
      } else {
        weeklyInsight = `🚀 Time to accelerate! You have ${weekTasks.length - weekCompleted.length} tasks remaining this week.`;
      }
    }
    
    // Add productivity patterns
    if (completionRate >= 80) {
      weeklyInsight += " Your overall completion rate is excellent - you're a productivity superstar! 🌟";
    } else if (completionRate >= 60) {
      weeklyInsight += " You maintain a good completion rate. Consider breaking down larger tasks into smaller ones.";
    } else if (completionRate >= 40) {
      weeklyInsight += " Focus on completing more tasks. Try the Pomodoro technique or time-blocking.";
    } else if (userTasks.length > 5) {
      weeklyInsight += " You might be setting too many tasks. Try focusing on 3-5 key tasks per day.";
    }
    
    return { daily: dailyInsight, weekly: weeklyInsight };
  };

  const getThisWeek = (): string[] => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay()); // Sunday
    
    const week = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      week.push(date.toISOString().split('T')[0]);
    }
    return week;
  };

  useEffect(() => {
    generateInsights();
  }, [tasks.length]);

  const today = new Date().toISOString().split('T')[0];
  const completedToday = tasks.filter((task: Task) => {
    return task.completed && task.date === today;
  }).length;

  const totalToday = tasks.filter((task: Task) => {
    return task.date === today;
  }).length;

  const completionRate = tasks.length > 0 ? 
    Math.round((tasks.filter((t: Task) => t.completed).length / tasks.length) * 100) : 0;

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-800 dark:to-slate-700 
                    rounded-lg p-6 border border-green-200 dark:border-slate-600">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          📊 AI Insights
        </h3>
        <button
          onClick={generateInsights}
          disabled={isLoading}
          className="text-sm px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 
                     disabled:opacity-50 transition"
        >
          {isLoading ? '...' : '🔄'}
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center p-3 bg-white dark:bg-slate-800 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{completedToday}</div>
          <div className="text-xs text-slate-600 dark:text-slate-400">Today</div>
        </div>
        <div className="text-center p-3 bg-white dark:bg-slate-800 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{totalToday}</div>
          <div className="text-xs text-slate-600 dark:text-slate-400">Scheduled</div>
        </div>
        <div className="text-center p-3 bg-white dark:bg-slate-800 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{completionRate}%</div>
          <div className="text-xs text-slate-600 dark:text-slate-400">Overall</div>
        </div>
      </div>

      {/* AI Insights */}
      {isLoading ? (
        <div className="flex items-center gap-2 p-4 bg-white dark:bg-slate-800 rounded-lg">
          <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-slate-600 dark:text-slate-400">Analyzing your productivity patterns...</span>
        </div>
      ) : (
        <div className="space-y-3">
          {dailyInsight && (
            <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border-l-4 border-green-500">
              <div className="font-medium text-sm text-green-700 dark:text-green-400 mb-1">Daily Insight</div>
              <p className="text-sm text-slate-700 dark:text-slate-300">{dailyInsight}</p>
            </div>
          )}
          
          {weeklyInsight && (
            <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border-l-4 border-blue-500">
              <div className="font-medium text-sm text-blue-700 dark:text-blue-400 mb-1">Weekly Insight</div>
              <p className="text-sm text-slate-700 dark:text-slate-300">{weeklyInsight}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIInsights;