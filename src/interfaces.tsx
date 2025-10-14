export interface Task {
  title: string;
  dir: string;
  description: string;
  date: string;
  time?: string;
  completed: boolean;
  important: boolean;
  id: string;
  image?: string;
  estimatedDuration?: number;
  xpReward?: number;
  completedAt?: string;
  location?: string;
  emoji?: string;
}

export interface UserStats {
  totalXP: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  tasksCompleted: number;
  badges: Badge[];
  lastCompletionDate?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface MoodEntry {
  id: string;
  date: string;
  mood: 'happy' | 'focused' | 'tired' | 'stressed' | 'neutral';
  energy: number;
  note?: string;
}

export interface Theme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  background: string;
}
