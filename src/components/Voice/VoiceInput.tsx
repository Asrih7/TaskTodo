import React, { useState } from "react";
import { voiceService } from "../../services/voiceService";
import { parseNaturalLanguageTask } from "../../services/aiParser";
import { Task } from "../../interfaces";
import { useAppDispatch } from "../../store/hooks";
import { tasksActions } from "../../store/Tasks.store";

const VoiceInput: React.FC = () => {
  const dispatch = useAppDispatch();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');

  const handleVoiceInput = () => {
    if (!voiceService.isSupported()) {
      setError('Voice recognition not supported in your browser');
      return;
    }

    if (isListening) {
      voiceService.stopListening();
      setIsListening(false);
      return;
    }

    setIsListening(true);
    setError('');
    setTranscript('');

    voiceService.startListening(
      (text) => {
        setTranscript(text);
        setIsListening(false);
        
        // Parse and create task
        const parsedTask = parseNaturalLanguageTask(text);
        const newTask: Task = {
          id: Date.now().toString(),
          title: parsedTask.title || text,
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
        
        setTimeout(() => {
          setTranscript('');
        }, 3000);
      },
      (err) => {
        setError(err);
        setIsListening(false);
      }
    );
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-md">
      <h3 className="font-bold text-lg mb-3 text-slate-700 dark:text-slate-300">
        🎤 Voice Command
      </h3>
      
      <button
        onClick={handleVoiceInput}
        className={`w-full py-3 rounded-lg font-medium transition-all ${
          isListening
            ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
            : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
        }`}
      >
        {isListening ? '🎙️ Listening... (Click to stop)' : '🎤 Start Voice Input'}
      </button>

      {transcript && (
        <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-md">
          <p className="text-sm text-green-700 dark:text-green-300">
            ✓ Task created: "{transcript}"
          </p>
        </div>
      )}

      {error && (
        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-md">
          <p className="text-sm text-red-700 dark:text-red-300">
            {error}
          </p>
        </div>
      )}

      <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
        Try saying: "Remind me to buy groceries tomorrow morning" or "Meeting with team on Friday at 2pm"
      </p>
    </div>
  );
};

export default VoiceInput;
