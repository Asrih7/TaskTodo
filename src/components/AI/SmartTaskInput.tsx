import React, { useState } from 'react';
import { Task } from '../../interfaces';
import { useAppSelector } from '../../store/hooks';

interface SmartTaskInputProps {
  onTaskCreated: (task: Task) => void;
}

const SmartTaskInput: React.FC<SmartTaskInputProps> = ({ onTaskCreated }) => {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const directories = useAppSelector((state) => state.tasks.directories);

  // Simple AI-like parsing function (can be enhanced with actual AI later)
  const parseNaturalLanguageTask = (text: string) => {
    const lowerText = text.toLowerCase();
    
    // Extract date information
    let date = new Date().toISOString().split('T')[0]; // default to today
    
    const datePatterns = [
      { pattern: /tomorrow/i, days: 1 },
      { pattern: /next week/i, days: 7 },
      { pattern: /monday/i, getDayOffset: () => getNextWeekday(1) },
      { pattern: /tuesday/i, getDayOffset: () => getNextWeekday(2) },
      { pattern: /wednesday/i, getDayOffset: () => getNextWeekday(3) },
      { pattern: /thursday/i, getDayOffset: () => getNextWeekday(4) },
      { pattern: /friday/i, getDayOffset: () => getNextWeekday(5) },
      { pattern: /saturday/i, getDayOffset: () => getNextWeekday(6) },
      { pattern: /sunday/i, getDayOffset: () => getNextWeekday(0) },
    ];

    for (const { pattern, days, getDayOffset } of datePatterns) {
      if (pattern.test(lowerText)) {
        const tomorrow = new Date();
        if (days) {
          tomorrow.setDate(tomorrow.getDate() + days);
        } else if (getDayOffset) {
          tomorrow.setDate(tomorrow.getDate() + getDayOffset());
        }
        date = tomorrow.toISOString().split('T')[0];
        break;
      }
    }

    // Check for specific date formats (MM/DD, DD/MM)
    const dateMatch = lowerText.match(/(\d{1,2})[\/\-](\d{1,2})/);
    if (dateMatch) {
      const month = parseInt(dateMatch[1]) - 1;
      const day = parseInt(dateMatch[2]);
      const currentYear = new Date().getFullYear();
      const parsedDate = new Date(currentYear, month, day);
      if (!isNaN(parsedDate.getTime())) {
        date = parsedDate.toISOString().split('T')[0];
      }
    }

    // Determine importance
    const important = /urgent|important|priority|asap|critical/i.test(lowerText);

    // Extract title (remove date/time references and keywords)
    let title = text
      .replace(/tomorrow|next week|monday|tuesday|wednesday|thursday|friday|saturday|sunday/gi, '')
      .replace(/urgent|important|priority|asap|critical/gi, '')
      .replace(/at \d{1,2}:\d{2}|at \d{1,2}(am|pm)/gi, '')
      .replace(/\d{1,2}[\/\-]\d{1,2}/g, '')
      .trim();

    // Clean up extra spaces
    title = title.replace(/\s+/g, ' ').trim();

    return {
      title: title || text,
      description: '',
      date,
      important,
    };
  };

  const getNextWeekday = (targetDay: number) => {
    const today = new Date().getDay();
    let daysUntilTarget = targetDay - today;
    if (daysUntilTarget <= 0) {
      daysUntilTarget += 7; // Next week
    }
    return daysUntilTarget;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsProcessing(true);
    
    // Simulate processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      const parsedTask = parseNaturalLanguageTask(input);
      
      const newTask: Task = {
        id: Date.now().toString(),
        title: parsedTask.title,
        description: parsedTask.description,
        date: parsedTask.date,
        important: parsedTask.important,
        completed: false,
        dir: directories[0] || 'Main',
      };

      onTaskCreated(newTask);
      setInput('');
    } catch (error) {
      console.error('Error creating smart task:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const exampleInputs = [
    "Call dentist tomorrow at 2pm",
    "Urgent: finish project report by Friday",
    "Buy groceries next week",
    "Important meeting on Monday"
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="smart-input" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            🤖 Smart Task Input
          </label>
          <textarea
            id="smart-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Try natural language: 'Call dentist tomorrow' or 'Urgent: finish report by Friday'"
            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg 
                       bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100
                       focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
            rows={2}
            disabled={isProcessing}
          />
        </div>
        
        {/* Example suggestions */}
        <div className="flex gap-2 flex-wrap">
          {exampleInputs.map((example, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setInput(example)}
              className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 
                         rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition"
            >
              {example}
            </button>
          ))}
        </div>
        
        <button
          type="submit"
          disabled={!input.trim() || isProcessing}
          className="w-full px-4 py-2 bg-rose-500 text-white rounded-lg 
                     hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed 
                     transition font-medium flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </>
          ) : (
            '✨ Create Smart Task'
          )}
        </button>
      </form>
    </div>
  );
};

export default SmartTaskInput;