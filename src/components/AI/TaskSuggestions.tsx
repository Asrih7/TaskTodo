import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../store/hooks';
import { Task } from '../../interfaces';

interface TaskSuggestionsProps {
  onTaskCreated: (task: Task) => void;
}

const TaskSuggestions: React.FC<TaskSuggestionsProps> = ({ onTaskCreated }) => {
  const tasks = useAppSelector((state) => state.tasks.tasks);
  const directories = useAppSelector((state) => state.tasks.directories);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Generate smart suggestions based on user patterns
  const generateSuggestions = () => {
    if (tasks.length === 0) {
      // Default suggestions for new users
      setSuggestions([
        "Review daily goals",
        "Check email and respond",
        "Plan tomorrow's priorities",
        "Take a 15-minute break"
      ]);
      return;
    }
    
    setIsLoading(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      const newSuggestions = generateSmartSuggestions(tasks);
      setSuggestions(newSuggestions);
      setIsLoading(false);
    }, 1000);
  };

  const generateSmartSuggestions = (userTasks: Task[]): string[] => {
    const suggestions: string[] = [];
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    // Analyze user patterns
    const completedTasks = userTasks.filter(task => task.completed);
    const incompleteTasks = userTasks.filter(task => !task.completed);
    const todayTasks = userTasks.filter(task => task.date === today);
    
    // Common task patterns from user's data
    const commonWords = extractCommonWords(userTasks.map(t => t.title));
    
    // Generate suggestions based on patterns
    
    // 1. Follow-up suggestions
    if (completedTasks.length > 0) {
      const recentCompleted = completedTasks[completedTasks.length - 1];
      if (recentCompleted.title.toLowerCase().includes('email')) {
        suggestions.push("Follow up on important emails");
      }
      if (recentCompleted.title.toLowerCase().includes('meeting')) {
        suggestions.push("Send meeting recap");
      }
    }
    
    // 2. Time-based suggestions
    const hour = now.getHours();
    if (hour < 10) {
      suggestions.push("Review today's priorities");
      suggestions.push("Check calendar for appointments");
    } else if (hour > 16) {
      suggestions.push("Prepare tomorrow's task list");
      suggestions.push("Review completed tasks");
    }
    
    // 3. Pattern-based suggestions
    if (commonWords.includes('call') || commonWords.includes('phone')) {
      suggestions.push("Make pending phone calls");
    }
    if (commonWords.includes('buy') || commonWords.includes('purchase')) {
      suggestions.push("Check shopping list");
    }
    if (commonWords.includes('exercise') || commonWords.includes('workout')) {
      suggestions.push("Schedule workout session");
    }
    
    // 4. Productivity suggestions
    if (todayTasks.length > 5) {
      suggestions.push("Take a 5-minute break");
    }
    if (incompleteTasks.length > 10) {
      suggestions.push("Prioritize overdue tasks");
    }
    
    // 5. Default productive suggestions
    const defaultSuggestions = [
      "Review weekly goals",
      "Organize workspace",
      "Back up important files",
      "Update project status",
      "Schedule team check-in",
      "Plan weekend activities",
      "Read industry news",
      "Network with colleagues"
    ];
    
    // Add some default suggestions if we don't have enough
    while (suggestions.length < 4 && defaultSuggestions.length > 0) {
      const randomIndex = Math.floor(Math.random() * defaultSuggestions.length);
      const suggestion = defaultSuggestions.splice(randomIndex, 1)[0];
      if (!suggestions.includes(suggestion)) {
        suggestions.push(suggestion);
      }
    }
    
    return suggestions.slice(0, 4); // Return max 4 suggestions
  };

  const extractCommonWords = (titles: string[]): string[] => {
    const words = titles
      .join(' ')
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2);
    
    const wordCount: { [key: string]: number } = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });
    
    return Object.entries(wordCount)
      .filter(([_, count]) => count > 1)
      .sort(([_, a], [__, b]) => b - a)
      .map(([word, _]) => word)
      .slice(0, 10);
  };

  const createTaskFromSuggestion = (suggestion: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: suggestion,
      description: 'AI suggested task based on your patterns',
      date: new Date().toISOString().split('T')[0],
      important: false,
      completed: false,
      dir: directories[0] || 'Main'
    };

    onTaskCreated(newTask);
    setSuggestions(prev => prev.filter(s => s !== suggestion));
  };

  useEffect(() => {
    // Auto-generate suggestions when component mounts or tasks change
    const timer = setTimeout(() => {
      generateSuggestions();
    }, 1000);

    return () => clearTimeout(timer);
  }, [tasks.length]);

  if (suggestions.length === 0 && !isLoading) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 
                    rounded-lg p-4 border border-blue-200 dark:border-slate-600">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
          💡 Smart Suggestions
        </h3>
        <button
          onClick={generateSuggestions}
          disabled={isLoading}
          className="text-sm px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                     disabled:opacity-50 transition"
        >
          {isLoading ? '...' : '🔄'}
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          Analyzing your habits...
        </div>
      ) : (
        <div className="space-y-2">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 
                         rounded-lg border border-slate-200 dark:border-slate-600"
            >
              <span className="text-sm text-slate-700 dark:text-slate-300 flex-1">
                {suggestion}
              </span>
              <div className="flex gap-2 ml-3">
                <button
                  onClick={() => createTaskFromSuggestion(suggestion)}
                  className="text-xs px-3 py-1 bg-green-500 text-white rounded-md 
                             hover:bg-green-600 transition"
                >
                  ✓ Add
                </button>
                <button
                  onClick={() => setSuggestions(prev => prev.filter(s => s !== suggestion))}
                  className="text-xs px-3 py-1 bg-slate-400 text-white rounded-md 
                             hover:bg-slate-500 transition"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskSuggestions;