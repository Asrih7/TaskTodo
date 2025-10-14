import React, { useState } from "react";
import { parseNaturalLanguageTask } from "../../services/aiParser";
import { Task } from "../../interfaces";
import { useAppDispatch } from "../../store/hooks";
import { tasksActions } from "../../store/Tasks.store";

const EXAMPLES = [
  "Buy groceries tomorrow morning",
  "Team meeting Friday at 2pm",
  "Important: Submit project by next week",
  "Call mom this evening",
];

const SmartTaskInput: React.FC = () => {
  const dispatch = useAppDispatch();
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsProcessing(true);

    // Parse the natural language
    const parsedTask = parseNaturalLanguageTask(input);
    
    // Create task
    const newTask: Task = {
      id: Date.now().toString(),
      title: parsedTask.title || input,
      dir: parsedTask.dir || '💭 Personal',
      description: '',
      date: parsedTask.date || new Date().toISOString().split('T')[0],
      time: parsedTask.time,
      completed: false,
      important: parsedTask.important || false,
      emoji: parsedTask.emoji,
      xpReward: parsedTask.xpReward || 25,
    };

    dispatch(tasksActions.addNewTask(newTask));
    
    setInput('');
    setTimeout(() => setIsProcessing(false), 500);
  };

  const handleExampleClick = (example: string) => {
    setInput(example);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-md">
      <h3 className="font-bold text-lg mb-3 text-slate-700 dark:text-slate-300">
        ✨ Smart Task Input
      </h3>
      
      <form onSubmit={handleSubmit}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your task naturally... (e.g., 'Buy milk tomorrow morning')"
          className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 mb-3 min-h-[80px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <button
          type="submit"
          disabled={!input.trim() || isProcessing}
          className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed font-medium transition-all"
        >
          {isProcessing ? 'Creating...' : '+ Add Task'}
        </button>
      </form>

      <div className="mt-4">
        <p className="text-xs text-slate-500 dark:text-slate-500 mb-2">Try these examples:</p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((example, idx) => (
            <button
              key={idx}
              onClick={() => handleExampleClick(example)}
              className="text-xs py-1 px-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SmartTaskInput;
