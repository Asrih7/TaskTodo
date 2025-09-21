import { Task } from '../interfaces';

// AI Service for task management enhancements
export class AIService {
  private apiKey: string | null = null;
  private baseUrl = 'https://gateway.lov.sh';

  constructor() {
    this.apiKey = localStorage.getItem('ai_api_key');
  }

  setApiKey(key: string) {
    this.apiKey = key;
    localStorage.setItem('ai_api_key', key);
  }

  async makeRequest(prompt: string, systemPrompt?: string) {
    if (!this.apiKey) {
      throw new Error('AI API key not configured');
    }

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3.5-sonnet-20241022',
        messages: [
          ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
          { role: 'user', content: prompt }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error('AI request failed');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  // Natural Language Processing for task creation
  async parseNaturalLanguageTask(input: string): Promise<Partial<Task>> {
    const systemPrompt = `You are a task parser. Convert natural language input into structured task data.
    Return ONLY a JSON object with these fields:
    - title: string (main task description)
    - description: string (optional details)
    - date: string (YYYY-MM-DD format, default to today if not specified)
    - important: boolean (true if urgent/important keywords detected)
    - estimatedDuration: number (minutes, estimate based on task complexity)
    
    Examples:
    "Call mom tomorrow" -> {"title": "Call mom", "date": "2024-01-02", "important": false, "estimatedDuration": 15}
    "Urgent: Finish project report by Friday" -> {"title": "Finish project report", "date": "2024-01-05", "important": true, "estimatedDuration": 120}`;

    try {
      const response = await this.makeRequest(input, systemPrompt);
      return JSON.parse(response);
    } catch (error) {
      console.error('Error parsing natural language task:', error);
      return { title: input, estimatedDuration: 30 };
    }
  }

  // Smart task suggestions based on user patterns
  async generateTaskSuggestions(existingTasks: Task[]): Promise<string[]> {
    const taskPatterns = this.analyzeTaskPatterns(existingTasks);
    
    const systemPrompt = `Based on the user's task patterns, suggest 3-5 relevant new tasks they might need.
    Focus on recurring patterns, missed opportunities, and productivity improvements.
    Return ONLY a JSON array of task suggestion strings.`;

    const prompt = `Task patterns analysis:
    - Most common task types: ${taskPatterns.commonTypes.join(', ')}
    - Average completion rate: ${taskPatterns.completionRate}%
    - Most active days: ${taskPatterns.activeDays.join(', ')}
    - Recent tasks: ${existingTasks.slice(0, 10).map(t => t.title).join(', ')}`;

    try {
      const response = await this.makeRequest(prompt, systemPrompt);
      return JSON.parse(response);
    } catch (error) {
      console.error('Error generating task suggestions:', error);
      return [];
    }
  }

  // Prioritize tasks using AI
  async prioritizeTasks(tasks: Task[]): Promise<Task[]> {
    if (tasks.length === 0) return tasks;

    const systemPrompt = `You are a productivity expert. Analyze and prioritize tasks based on:
    - Deadlines (date field)
    - Importance flags
    - Estimated duration
    - Task complexity
    
    Return ONLY a JSON array of task IDs in priority order (most important first).`;

    const tasksInfo = tasks.map(task => ({
      id: task.id,
      title: task.title,
      date: task.date,
      important: task.important,
      completed: task.completed,
      estimatedDuration: (task as any).estimatedDuration || 30
    }));

    try {
      const response = await this.makeRequest(JSON.stringify(tasksInfo), systemPrompt);
      const prioritizedIds = JSON.parse(response);
      
      // Reorder tasks based on AI prioritization
      const taskMap = new Map(tasks.map(task => [task.id, task]));
      const prioritizedTasks = prioritizedIds.map((id: string) => taskMap.get(id)).filter(Boolean);
      const remainingTasks = tasks.filter(task => !prioritizedIds.includes(task.id));
      
      return [...prioritizedTasks, ...remainingTasks];
    } catch (error) {
      console.error('Error prioritizing tasks:', error);
      return tasks;
    }
  }

  // Generate daily/weekly insights
  async generateInsights(tasks: Task[], timeframe: 'daily' | 'weekly'): Promise<string> {
    const completedTasks = tasks.filter(t => t.completed);
    const pendingTasks = tasks.filter(t => !t.completed);
    
    const systemPrompt = `You are a productivity coach. Provide encouraging and actionable insights about the user's task completion.
    Keep it positive and motivational. Include specific suggestions for improvement.
    Limit response to 2-3 sentences.`;

    const prompt = `${timeframe} summary:
    - Completed tasks: ${completedTasks.length}
    - Pending tasks: ${pendingTasks.length}
    - Important tasks completed: ${completedTasks.filter(t => t.important).length}
    - Recent completions: ${completedTasks.slice(0, 5).map(t => t.title).join(', ')}`;

    try {
      return await this.makeRequest(prompt, systemPrompt);
    } catch (error) {
      console.error('Error generating insights:', error);
      return `You've completed ${completedTasks.length} tasks! Keep up the great work! 🎉`;
    }
  }

  // Chatbot functionality
  async askAssistant(question: string, tasks: Task[]): Promise<string> {
    const systemPrompt = `You are a helpful task management assistant. Answer questions about the user's tasks and provide productivity advice.
    Be friendly, concise, and actionable. You have access to the user's current task list.`;

    const context = `Current tasks context:
    - Total tasks: ${tasks.length}
    - Completed: ${tasks.filter(t => t.completed).length}
    - Important: ${tasks.filter(t => t.important).length}
    - Today's tasks: ${tasks.filter(t => t.date === new Date().toISOString().split('T')[0]).length}
    - Recent tasks: ${tasks.slice(0, 10).map(t => `${t.title} (${t.completed ? 'done' : 'pending'})`).join(', ')}`;

    try {
      return await this.makeRequest(`${context}\n\nUser question: ${question}`, systemPrompt);
    } catch (error) {
      console.error('Error with assistant:', error);
      return "I'm having trouble connecting right now. Please try again later!";
    }
  }

  private analyzeTaskPatterns(tasks: Task[]) {
    const commonTypes = this.extractCommonTaskTypes(tasks);
    const completionRate = tasks.length > 0 ? (tasks.filter(t => t.completed).length / tasks.length) * 100 : 0;
    const activeDays = this.getActiveDays(tasks);

    return { commonTypes, completionRate, activeDays };
  }

  private extractCommonTaskTypes(tasks: Task[]): string[] {
    const words = tasks.flatMap(task => 
      task.title.toLowerCase().split(' ').filter(word => word.length > 3)
    );
    
    const wordCount = words.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);
  }

  private getActiveDays(tasks: Task[]): string[] {
    const dayCount = tasks.reduce((acc, task) => {
      const day = new Date(task.date).toLocaleDateString('en', { weekday: 'long' });
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(dayCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([day]) => day);
  }
}

export const aiService = new AIService();