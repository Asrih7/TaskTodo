export interface Task {
  title: string;
  dir: string;
  description: string;
  date: string;
  completed: boolean;
  important: boolean;
  id: string;
  image?: string; // optional image (Base64 or URL)
  estimatedDuration?: number; // AI estimated duration in minutes
}
