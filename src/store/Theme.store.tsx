import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const THEMES = {
  default: { id: 'default', name: 'Default', primary: '#3b82f6', secondary: '#8b5cf6', background: '#f1f5f9' },
  dark: { id: 'dark', name: 'Dark', primary: '#60a5fa', secondary: '#a78bfa', background: '#0f172a' },
  pastel: { id: 'pastel', name: 'Pastel', primary: '#fbbf24', secondary: '#f472b6', background: '#fef3c7' },
  neon: { id: 'neon', name: 'Neon', primary: '#22d3ee', secondary: '#a78bfa', background: '#1e293b' },
};

interface ThemeState {
  currentTheme: string;
}

const getInitialTheme = (): ThemeState => {
  const saved = localStorage.getItem('appTheme');
  return { currentTheme: saved || 'default' };
};

const initialState: ThemeState = getInitialTheme();

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<string>) {
      state.currentTheme = action.payload;
      localStorage.setItem('appTheme', action.payload);
    },
  },
});

export const themeActions = themeSlice.actions;
export const themes = THEMES;
export default themeSlice.reducer;
