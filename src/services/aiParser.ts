import { Task } from "../interfaces";

const CATEGORY_KEYWORDS = {
  '🧹 Cleaning': ['clean', 'wash', 'organize', 'tidy', 'laundry', 'vacuum', 'dust'],
  '📚 Study': ['study', 'read', 'learn', 'homework', 'exam', 'review', 'practice'],
  '🏋️‍♂️ Fitness': ['workout', 'exercise', 'gym', 'run', 'yoga', 'fitness', 'training'],
  '💼 Work': ['work', 'meeting', 'email', 'call', 'presentation', 'project', 'deadline'],
  '💭 Personal': ['personal', 'self', 'reflection', 'journal', 'meditation'],
  '🛒 Shopping': ['buy', 'shop', 'purchase', 'grocery', 'get', 'pick up'],
  '👨‍👩‍👧 Family': ['family', 'mom', 'dad', 'parent', 'child', 'kids', 'visit'],
  '🎉 Social': ['party', 'friends', 'hangout', 'dinner', 'lunch', 'coffee', 'meet'],
};

const TIME_PATTERNS = {
  tomorrow: () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  },
  today: () => new Date().toISOString().split('T')[0],
  'next week': () => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  },
  monday: () => getNextDayOfWeek(1),
  tuesday: () => getNextDayOfWeek(2),
  wednesday: () => getNextDayOfWeek(3),
  thursday: () => getNextDayOfWeek(4),
  friday: () => getNextDayOfWeek(5),
  saturday: () => getNextDayOfWeek(6),
  sunday: () => getNextDayOfWeek(0),
};

function getNextDayOfWeek(dayOfWeek: number): string {
  const today = new Date();
  const currentDay = today.getDay();
  let daysUntil = dayOfWeek - currentDay;
  if (daysUntil <= 0) daysUntil += 7;
  
  const targetDate = new Date();
  targetDate.setDate(today.getDate() + daysUntil);
  return targetDate.toISOString().split('T')[0];
}

function extractTime(text: string): string | undefined {
  const timePatterns = [
    /(\d{1,2}):(\d{2})\s*(am|pm)/i,
    /(\d{1,2})\s*(am|pm)/i,
    /at\s+(\d{1,2}):(\d{2})/i,
    /at\s+(\d{1,2})/i,
  ];

  for (const pattern of timePatterns) {
    const match = text.match(pattern);
    if (match) {
      let hours = parseInt(match[1]);
      const minutes = match[2] ? parseInt(match[2]) : 0;
      const meridiem = match[3]?.toLowerCase();

      if (meridiem === 'pm' && hours !== 12) hours += 12;
      if (meridiem === 'am' && hours === 12) hours = 0;

      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
  }

  // Time of day keywords
  if (text.includes('morning')) return '09:00';
  if (text.includes('afternoon')) return '14:00';
  if (text.includes('evening')) return '18:00';
  if (text.includes('night')) return '20:00';

  return undefined;
}

function detectCategory(text: string): string {
  const lowerText = text.toLowerCase();
  
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return category;
    }
  }
  
  return '💭 Personal';
}

export function parseNaturalLanguageTask(input: string): Partial<Task> {
  const lowerInput = input.toLowerCase();
  
  // Extract date
  let date = new Date().toISOString().split('T')[0];
  for (const [keyword, getDate] of Object.entries(TIME_PATTERNS)) {
    if (lowerInput.includes(keyword)) {
      date = getDate();
      break;
    }
  }
  
  // Extract time
  const time = extractTime(input);
  
  // Detect if important
  const important = lowerInput.includes('important') || lowerInput.includes('urgent') || lowerInput.includes('priority');
  
  // Detect category and emoji
  const dir = detectCategory(input);
  const emoji = dir.split(' ')[0];
  
  // Clean title
  let title = input
    .replace(/tomorrow|today|next week|monday|tuesday|wednesday|thursday|friday|saturday|sunday/gi, '')
    .replace(/morning|afternoon|evening|night/gi, '')
    .replace(/at \d{1,2}:?\d{0,2}\s*(am|pm)?/gi, '')
    .replace(/important|urgent|priority/gi, '')
    .trim();
  
  if (!title) title = input;
  
  // Calculate XP reward based on complexity
  const xpReward = important ? 50 : 25;
  
  return {
    title,
    date,
    time,
    dir,
    important,
    emoji,
    xpReward,
    description: '',
    completed: false,
  };
}

export function getTaskRecommendations(mood: string, energy: number): string[] {
  if (mood === 'tired' || energy < 30) {
    return [
      'Light tasks recommended',
      'Consider simple organizing',
      'Quick 5-minute tasks',
      'Postpone complex work',
    ];
  }
  
  if (mood === 'focused' && energy > 70) {
    return [
      'Great time for deep work',
      'Tackle complex projects',
      'Focus on priority tasks',
      'High productivity window',
    ];
  }
  
  if (mood === 'stressed') {
    return [
      'Break tasks into smaller steps',
      'Take short breaks',
      'Focus on one thing at a time',
      'Consider meditation or walk',
    ];
  }
  
  return [
    'Start with medium priority tasks',
    'Mix light and moderate tasks',
    'Take regular breaks',
    'Stay hydrated',
  ];
}
