import { Task } from "../interfaces";

export interface TaskAnalytics {
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  averageTasksPerDay: number;
  mostProductiveDay: string;
  mostProductiveHour: number;
  categoryBreakdown: { [key: string]: number };
  weeklyTrend: number[];
  productivityScore: number;
}

export function calculateAnalytics(tasks: Task[]): TaskAnalytics {
  const completedTasks = tasks.filter((t:any) => t.completed);
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0;

  // Calculate tasks per day
  const tasksByDate: { [key: string]: number } = {};
  tasks.forEach(task => {
    const date = task.date;
    tasksByDate[date] = (tasksByDate[date] || 0) + 1;
  });

  const averageTasksPerDay = Object.values(tasksByDate).length > 0
    ? Object.values(tasksByDate).reduce((a, b) => a + b, 0) / Object.values(tasksByDate).length
    : 0;

  // Find most productive day of week
  const dayOfWeekCounts: { [key: string]: number } = {};
  completedTasks.forEach(task => {
    if (task.completedAt) {
      const dayOfWeek = new Date(task.completedAt).toLocaleDateString('en-US', { weekday: 'long' });
      dayOfWeekCounts[dayOfWeek] = (dayOfWeekCounts[dayOfWeek] || 0) + 1;
    }
  });

  const mostProductiveDay = Object.entries(dayOfWeekCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  // Find most productive hour
  const hourCounts: { [key: number]: number } = {};
  completedTasks.forEach(task => {
    if (task.completedAt) {
      const hour = new Date(task.completedAt).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    }
  });

  const mostProductiveHour = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0]?.[0] 
    ? parseInt(Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0][0])
    : 12;

  // Category breakdown
  const categoryBreakdown: { [key: string]: number } = {};
  tasks.forEach(task => {
    categoryBreakdown[task.dir] = (categoryBreakdown[task.dir] || 0) + 1;
  });

  // Weekly trend (last 7 days)
  const weeklyTrend: number[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const count = completedTasks.filter(t => 
      t.completedAt && t.completedAt.startsWith(dateStr)
    ).length;
    weeklyTrend.push(count);
  }

  // Calculate productivity score (0-100)
  const productivityScore = Math.min(100, Math.round(
    (completionRate * 0.4) +
    (Math.min(averageTasksPerDay * 10, 40)) +
    (Math.min(completedTasks.length, 20))
  ));

  return {
    totalTasks,
    completedTasks: completedTasks.length,
    completionRate,
    averageTasksPerDay,
    mostProductiveDay,
    mostProductiveHour,
    categoryBreakdown,
    weeklyTrend,
    productivityScore,
  };
}

export function generateInsights(analytics: TaskAnalytics): string[] {
  const insights: string[] = [];

  if (analytics.completionRate > 80) {
    insights.push("🎉 Excellent! You're completing most of your tasks.");
  } else if (analytics.completionRate > 50) {
    insights.push("👍 Good progress! Keep pushing to complete more tasks.");
  } else {
    insights.push("💪 Try breaking tasks into smaller, manageable pieces.");
  }

  if (analytics.mostProductiveDay !== 'N/A') {
    insights.push(`📊 You're most productive on ${analytics.mostProductiveDay}s.`);
  }

  if (analytics.mostProductiveHour >= 6 && analytics.mostProductiveHour < 12) {
    insights.push("🌅 You're a morning person! Schedule important tasks early.");
  } else if (analytics.mostProductiveHour >= 18) {
    insights.push("🌙 You're a night owl! Your peak hours are in the evening.");
  }

  const topCategory = Object.entries(analytics.categoryBreakdown).sort((a, b) => b[1] - a[1])[0];
  if (topCategory) {
    insights.push(`🎯 Most of your focus is on ${topCategory[0]} tasks.`);
  }

  if (analytics.weeklyTrend.length > 0) {
    const recentAvg = analytics.weeklyTrend.slice(-3).reduce((a, b) => a + b, 0) / 3;
    const olderAvg = analytics.weeklyTrend.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
    
    if (recentAvg > olderAvg * 1.2) {
      insights.push("📈 Your productivity is trending upward!");
    } else if (recentAvg < olderAvg * 0.8) {
      insights.push("📉 Consider reviewing your task management strategy.");
    }
  }

  return insights;
}
