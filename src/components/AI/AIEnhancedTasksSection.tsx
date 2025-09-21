import React from 'react';
import { useAppDispatch } from '../../store/hooks';
import { tasksActions } from '../../store/Tasks.store';
import { Task } from '../../interfaces';

import SmartTaskInput from './SmartTaskInput';
import TaskSuggestions from './TaskSuggestions';
import AIInsights from './AIInsights';
import AIChatbot from './AIChatbot';

const AIEnhancedTasksSection: React.FC = () => {
  const dispatch = useAppDispatch();

  const handleTaskCreated = (task: Task) => {
    dispatch(tasksActions.addNewTask(task));
  };

  return (
    <div className="space-y-4 mb-6">

      {/* AI Insights */}
      <AIInsights />

      {/* Chatbot */}
      <AIChatbot />
    </div>
  );
};

export default AIEnhancedTasksSection;