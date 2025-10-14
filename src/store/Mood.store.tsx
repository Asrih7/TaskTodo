import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MoodEntry } from "../interfaces";

interface MoodState {
  entries: MoodEntry[];
  todaysMood?: MoodEntry;
}

const getInitialMoodState = (): MoodState => {
  const saved = localStorage.getItem('moodEntries');
  if (saved) {
    const entries = JSON.parse(saved);
    const today = new Date().toDateString();
    const todaysMood = entries.find((e: MoodEntry) => new Date(e.date).toDateString() === today);
    return { entries, todaysMood };
  }
  return { entries: [] };
};

const initialState: MoodState = getInitialMoodState();

const moodSlice = createSlice({
  name: "mood",
  initialState,
  reducers: {
    addMoodEntry(state, action: PayloadAction<Omit<MoodEntry, 'id'>>) {
      const entry: MoodEntry = {
        ...action.payload,
        id: Date.now().toString(),
      };
      
      const today = new Date().toDateString();
      state.entries = state.entries.filter(e => new Date(e.date).toDateString() !== today);
      state.entries.push(entry);
      state.todaysMood = entry;
      
      localStorage.setItem('moodEntries', JSON.stringify(state.entries));
    },
    clearMoodData(state) {
      state.entries = [];
      state.todaysMood = undefined;
      localStorage.removeItem('moodEntries');
    },
  },
});

export const moodActions = moodSlice.actions;
export default moodSlice.reducer;
