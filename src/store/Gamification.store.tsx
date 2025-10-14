import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserStats, Badge } from "../interfaces";

const BADGES_CONFIG: Badge[] = [
  { id: 'first_task', name: 'Getting Started', description: 'Complete your first task', icon: '🎯' },
  { id: 'streak_7', name: 'Week Warrior', description: '7 day streak', icon: '🔥' },
  { id: 'tasks_10', name: 'Productive', description: 'Complete 10 tasks', icon: '⭐' },
  { id: 'tasks_50', name: 'Super Productive', description: 'Complete 50 tasks', icon: '🏆' },
  { id: 'tasks_100', name: 'Task Master', description: 'Complete 100 tasks', icon: '👑' },
  { id: 'early_bird', name: 'Early Bird', description: 'Complete a task before 8 AM', icon: '🌅' },
  { id: 'night_owl', name: 'Night Owl', description: 'Complete a task after 10 PM', icon: '🦉' },
];

const getInitialStats = (): UserStats => {
  const saved = localStorage.getItem('userStats');
  if (saved) {
    return JSON.parse(saved);
  }
  return {
    totalXP: 0,
    level: 1,
    currentStreak: 0,
    longestStreak: 0,
    tasksCompleted: 0,
    badges: [],
  };
};

const initialState: UserStats = getInitialStats();

const calculateLevel = (xp: number): number => {
  return Math.floor(xp / 100) + 1;
};

const gamificationSlice = createSlice({
  name: "gamification",
  initialState,
  reducers: {
    addXP(state, action: PayloadAction<number>) {
      state.totalXP += action.payload;
      state.level = calculateLevel(state.totalXP);
      localStorage.setItem('userStats', JSON.stringify(state));
    },
    incrementTasksCompleted(state) {
      state.tasksCompleted += 1;
      
      const today = new Date().toDateString();
      if (state.lastCompletionDate === today) {
        // Already completed a task today
      } else if (state.lastCompletionDate) {
        const lastDate = new Date(state.lastCompletionDate);
        const todayDate = new Date();
        const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          state.currentStreak += 1;
          if (state.currentStreak > state.longestStreak) {
            state.longestStreak = state.currentStreak;
          }
        } else if (diffDays > 1) {
          state.currentStreak = 1;
        }
      } else {
        state.currentStreak = 1;
      }
      
      state.lastCompletionDate = today;
      localStorage.setItem('userStats', JSON.stringify(state));
    },
    checkAndAwardBadges(state, action: PayloadAction<{ hour?: number }>) {
      const newBadges: Badge[] = [];
      const existingBadgeIds = state.badges.map(b => b.id);
      
      // Check first task
      if (state.tasksCompleted >= 1 && !existingBadgeIds.includes('first_task')) {
        newBadges.push({ ...BADGES_CONFIG[0], unlockedAt: new Date().toISOString() });
      }
      
      // Check streak badges
      if (state.currentStreak >= 7 && !existingBadgeIds.includes('streak_7')) {
        newBadges.push({ ...BADGES_CONFIG[1], unlockedAt: new Date().toISOString() });
      }
      
      // Check task count badges
      if (state.tasksCompleted >= 10 && !existingBadgeIds.includes('tasks_10')) {
        newBadges.push({ ...BADGES_CONFIG[2], unlockedAt: new Date().toISOString() });
      }
      if (state.tasksCompleted >= 50 && !existingBadgeIds.includes('tasks_50')) {
        newBadges.push({ ...BADGES_CONFIG[3], unlockedAt: new Date().toISOString() });
      }
      if (state.tasksCompleted >= 100 && !existingBadgeIds.includes('tasks_100')) {
        newBadges.push({ ...BADGES_CONFIG[4], unlockedAt: new Date().toISOString() });
      }
      
      // Check time-based badges
      if (action.payload.hour !== undefined) {
        if (action.payload.hour < 8 && !existingBadgeIds.includes('early_bird')) {
          newBadges.push({ ...BADGES_CONFIG[5], unlockedAt: new Date().toISOString() });
        }
        if (action.payload.hour >= 22 && !existingBadgeIds.includes('night_owl')) {
          newBadges.push({ ...BADGES_CONFIG[6], unlockedAt: new Date().toISOString() });
        }
      }
      
      state.badges = [...state.badges, ...newBadges];
      localStorage.setItem('userStats', JSON.stringify(state));
    },
    resetStats(state) {
      state.totalXP = 0;
      state.level = 1;
      state.currentStreak = 0;
      state.longestStreak = 0;
      state.tasksCompleted = 0;
      state.badges = [];
      state.lastCompletionDate = undefined;
      localStorage.setItem('userStats', JSON.stringify(state));
    },
  },
});

export const gamificationActions = gamificationSlice.actions;
export default gamificationSlice.reducer;
