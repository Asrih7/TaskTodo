import React, { useState, useRef, useEffect } from 'react';
import { useAppSelector } from '../../store/hooks';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AIChatbot: React.FC = () => {
  const tasks = useAppSelector((state) => state.tasks.tasks);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI task assistant. Ask me anything about your tasks or productivity! 🤖",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // AI Assistant Response Generator
  const generateAssistantResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    
    // Task overview queries
    if (lowerInput.includes('how many') || lowerInput.includes('count')) {
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter((task:any) => task.completed).length;
      const todayTasks = tasks.filter((task:any) => task.date === new Date().toISOString().split('T')[0]).length;
      
      return `📊 Here's your task overview:
• Total tasks: ${totalTasks}
• Completed tasks: ${completedTasks}
• Tasks for today: ${todayTasks}
• Completion rate: ${totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%`;
    }
    
    // Focus/priority queries
    if (lowerInput.includes('focus') || lowerInput.includes('priority') || lowerInput.includes('important')) {
      const todayTasks = tasks.filter((task:any) => 
        task.date === new Date().toISOString().split('T')[0] && !task.completed
      );
      const importantTasks = todayTasks.filter((task:any) => task.important);
      
      if (importantTasks.length > 0) {
        const taskList = importantTasks.slice(0, 3).map((task:any) => `• ${task.title}`).join('\n');
        return `🎯 Here are your priority tasks for today:
${taskList}

Start with these high-importance items!`;
      } else if (todayTasks.length > 0) {
        const taskList = todayTasks.slice(0, 3).map((task:any) => `• ${task.title}`).join('\n');
        return `⚡ Here are your tasks for today:
${taskList}

Consider marking the most important ones as priority!`;
      } else {
        return "🌟 No tasks scheduled for today! This is a great opportunity to plan ahead or take a well-deserved break.";
      }
    }
    
    // Overdue tasks
    if (lowerInput.includes('overdue') || lowerInput.includes('late') || lowerInput.includes('behind')) {
      const today = new Date().toISOString().split('T')[0];
      const overdueTasks = tasks.filter((task:any) => 
        !task.completed && task.date < today
      );
      
      if (overdueTasks.length > 0) {
        const taskList = overdueTasks.slice(0, 3).map((task:any) => 
          `• ${task.title} (due ${task.date})`
        ).join('\n');
        return `⏰ You have ${overdueTasks.length} overdue task${overdueTasks.length > 1 ? 's' : ''}:
${taskList}

${overdueTasks.length > 3 ? '...and more. ' : ''}Consider prioritizing these or rescheduling if needed!`;
      } else {
        return "✅ Great news! You don't have any overdue tasks. You're staying on top of things!";
      }
    }
    
    // Progress and motivation
    if (lowerInput.includes('progress') || lowerInput.includes('doing') || lowerInput.includes('how am i')) {
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter((task:any) => task.completed).length;
      const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      
      let motivationalMessage = "";
      if (completionRate >= 80) {
        motivationalMessage = "🌟 Outstanding! You're a productivity superstar!";
      } else if (completionRate >= 60) {
        motivationalMessage = "💪 You're doing great! Keep up the excellent work!";
      } else if (completionRate >= 40) {
        motivationalMessage = "📈 Good progress! You're building momentum!";
      } else if (totalTasks > 0) {
        motivationalMessage = "🚀 Every journey starts with a single step. You've got this!";
      } else {
        motivationalMessage = "🌱 Ready to start your productivity journey? Add some tasks to get going!";
      }
      
      return `📊 Your Progress Report:
• Completion rate: ${completionRate}%
• Tasks completed: ${completedTasks}/${totalTasks}

${motivationalMessage}`;
    }
    
    // Productivity tips
    if (lowerInput.includes('tip') || lowerInput.includes('advice') || lowerInput.includes('help')) {
      const tips = [
        "🍅 Try the Pomodoro Technique: 25 minutes focused work, 5-minute break!",
        "📅 Schedule your most important tasks for your peak energy hours.",
        "✂️ Break large tasks into smaller, manageable chunks.",
        "🎯 Focus on 3-5 key tasks per day instead of overwhelming yourself.",
        "🏆 Celebrate small wins - they add up to big achievements!",
        "📱 Minimize distractions by putting your phone in another room.",
        "⏰ Use time-blocking: assign specific time slots to different tasks.",
        "🧘 Take regular breaks to maintain focus and prevent burnout."
      ];
      
      const randomTip = tips[Math.floor(Math.random() * tips.length)];
      return `💡 Here's a productivity tip for you:

${randomTip}

What specific challenge are you facing with your tasks?`;
    }
    
    // Weekly planning
    if (lowerInput.includes('week') || lowerInput.includes('plan')) {
      const thisWeek = getThisWeekTasks();
      const weekProgress = thisWeek.length > 0 ? 
        Math.round((thisWeek.filter((t:any) => t.completed).length / thisWeek.length) * 100) : 0;
      
      return `📅 This Week's Overview:
• Total tasks: ${thisWeek.length}
• Progress: ${weekProgress}%

💡 Planning tip: Schedule your most important tasks earlier in the week when your energy is highest!`;
    }
    
    // Default helpful responses
    const defaultResponses = [
      "I'm here to help you stay productive! You can ask me about your task progress, priorities, or need some productivity tips. What would you like to know?",
      "Let me help you tackle your tasks! I can show you what's overdue, what to focus on today, or give you some motivation. What's on your mind?",
      "Great question! I can analyze your tasks, suggest priorities, share productivity tips, or just give you some encouragement. How can I assist you today?",
      "I'm your productivity companion! Ask me about task counts, what to focus on, overdue items, or any productivity advice you need. What would be helpful right now?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const getThisWeekTasks = () => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    const weekStartStr = weekStart.toISOString().split('T')[0];
    const weekEndStr = weekEnd.toISOString().split('T')[0];
    
    return tasks.filter((task:any) => task.date >= weekStartStr && task.date <= weekEndStr);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate thinking time
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const response = generateAssistantResponse(input);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error with AI assistant:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Sorry, I'm having trouble right now. Please try again! 😅",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    "What should I focus on today?",
    "How am I doing with my tasks?",
    "What tasks are overdue?",
    "Give me productivity tips"
  ];

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 
                   text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 
                   flex items-center justify-center text-xl z-50 hover:scale-110"
      >
        🤖
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md h-96 flex flex-col">
            
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-600">
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                🤖 AI Assistant
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg text-sm whitespace-pre-line ${
                      message.role === 'user'
                        ? 'bg-purple-500 text-white ml-4'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 mr-4'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-lg mr-4 flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm text-slate-600 dark:text-slate-400">Thinking...</span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            <div className="px-4 pb-2">
              <div className="flex gap-2 flex-wrap">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(question)}
                    className="text-xs px-2 py-1 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 
                               rounded-full hover:bg-slate-300 dark:hover:bg-slate-500 transition"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-slate-200 dark:border-slate-600">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 p-2 border border-slate-300 dark:border-slate-600 rounded-lg 
                             bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100
                             focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 
                             disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatbot;