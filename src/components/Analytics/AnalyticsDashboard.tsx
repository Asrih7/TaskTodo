import React, { useMemo } from "react";
import { useAppSelector } from "../../store/hooks";
import { calculateAnalytics, generateInsights } from "../../services/analyticsService";

const AnalyticsDashboard: React.FC = () => {
  const tasks = useAppSelector(state => state.tasks.tasks);
  
  const analytics = useMemo(() => calculateAnalytics(tasks), [tasks]);
  const insights = useMemo(() => generateInsights(analytics), [analytics]);

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-md">
        <h3 className="font-bold text-lg mb-4 text-slate-700 dark:text-slate-300">
          📊 Analytics Dashboard
        </h3>
        
        {/* Productivity Score */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Productivity Score
            </span>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {analytics.productivityScore}/100
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-400 to-blue-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${analytics.productivityScore}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Completion Rate</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {analytics.completionRate.toFixed(0)}%
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Completed</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {analytics.completedTasks}/{analytics.totalTasks}
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Avg/Day</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {analytics.averageTasksPerDay.toFixed(1)}
            </p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Best Day</p>
            <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
              {analytics.mostProductiveDay}
            </p>
          </div>
        </div>

        {/* Weekly Trend */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
            Last 7 Days Activity
          </h4>
          <div className="flex items-end gap-1 h-20">
            {analytics.weeklyTrend.map((count, idx) => {
              const maxCount = Math.max(...analytics.weeklyTrend, 1);
              const height = (count / maxCount) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t transition-all duration-300"
                    style={{ height: `${height}%` }}
                    title={`${count} tasks`}
                  />
                  <span className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'][idx]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Breakdown */}
        {Object.keys(analytics.categoryBreakdown).length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
              Tasks by Category
            </h4>
            <div className="space-y-2">
              {Object.entries(analytics.categoryBreakdown)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([category, count]) => (
                  <div key={category} className="flex items-center gap-2">
                    <span className="text-sm min-w-[120px] text-slate-600 dark:text-slate-400">
                      {category}
                    </span>
                    <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-400 to-purple-400 h-full rounded-full"
                        style={{
                          width: `${(count / analytics.totalTasks) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {count}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4 shadow-md">
          <h4 className="font-semibold text-lg mb-3 text-slate-700 dark:text-slate-300">
            💡 Your Insights
          </h4>
          <ul className="space-y-2">
            {insights.map((insight, idx) => (
              <li key={idx} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
