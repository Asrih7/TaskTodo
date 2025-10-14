import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { moodActions } from "../../store/Mood.store";
import { getTaskRecommendations } from "../../services/aiParser";

const MOODS = [
  { emoji: '😊', label: 'Happy', value: 'happy' },
  { emoji: '🎯', label: 'Focused', value: 'focused' },
  { emoji: '😴', label: 'Tired', value: 'tired' },
  { emoji: '😰', label: 'Stressed', value: 'stressed' },
  { emoji: '😐', label: 'Neutral', value: 'neutral' },
];

const MoodTracker: React.FC = () => {
  const dispatch = useAppDispatch();
  const { todaysMood } = useAppSelector(state => state.mood);
  const [selectedMood, setSelectedMood] = useState<string>(todaysMood?.mood || '');
  const [energy, setEnergy] = useState<number>(todaysMood?.energy || 50);
  const [note, setNote] = useState<string>('');
  const [showRecommendations, setShowRecommendations] = useState(false);

  const handleSubmit = () => {
    if (selectedMood) {
      dispatch(moodActions.addMoodEntry({
        date: new Date().toISOString(),
        mood: selectedMood as any,
        energy,
        note: note || undefined,
      }));
      setShowRecommendations(true);
    }
  };

  const recommendations = selectedMood ? getTaskRecommendations(selectedMood, energy) : [];

  if (todaysMood && !showRecommendations) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-md">
        <h3 className="font-bold text-lg mb-2 text-slate-700 dark:text-slate-300">
          Today's Mood
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-4xl">
            {MOODS.find(m => m.value === todaysMood.mood)?.emoji}
          </span>
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Feeling {todaysMood.mood}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500">
              Energy: {todaysMood.energy}%
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowRecommendations(true)}
          className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          See recommendations
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-md">
      <h3 className="font-bold text-lg mb-3 text-slate-700 dark:text-slate-300">
        😊 How are you feeling today?
      </h3>
      
      <div className="flex gap-2 mb-4 flex-wrap">
        {MOODS.map(mood => (
          <button
            key={mood.value}
            onClick={() => setSelectedMood(mood.value)}
            className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all ${
              selectedMood === mood.value
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 scale-105'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            <span className="text-2xl">{mood.emoji}</span>
            <span className="text-xs mt-1 text-slate-600 dark:text-slate-400">
              {mood.label}
            </span>
          </button>
        ))}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
          Energy Level: {energy}%
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={energy}
          onChange={(e) => setEnergy(parseInt(e.target.value))}
          className="w-full"
        />
      </div>

      <textarea
        placeholder="Any notes? (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm mb-3"
        rows={2}
      />

      <button
        onClick={handleSubmit}
        disabled={!selectedMood}
        className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors font-medium"
      >
        Save Mood
      </button>

      {showRecommendations && recommendations.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
          <h4 className="font-semibold text-sm mb-2 text-slate-700 dark:text-slate-300">
            💡 Recommendations for you:
          </h4>
          <ul className="text-sm space-y-1">
            {recommendations.map((rec, idx) => (
              <li key={idx} className="text-slate-600 dark:text-slate-400">
                • {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MoodTracker;
