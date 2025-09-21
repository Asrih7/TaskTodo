import { createSlice } from "@reduxjs/toolkit";

interface AIState {
  smartInputEnabled: boolean;
  suggestionsEnabled: boolean;
  insightsEnabled: boolean;
  chatbotEnabled: boolean;
}

const initialState: AIState = {
  smartInputEnabled: true,
  suggestionsEnabled: true,
  insightsEnabled: true,
  chatbotEnabled: true,
};

const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    toggleSmartInput(state) {
      state.smartInputEnabled = !state.smartInputEnabled;
    },
    toggleSuggestions(state) {
      state.suggestionsEnabled = !state.suggestionsEnabled;
    },
    toggleInsights(state) {
      state.insightsEnabled = !state.insightsEnabled;
    },
    toggleChatbot(state) {
      state.chatbotEnabled = !state.chatbotEnabled;
    },
  },
});

export const aiActions = aiSlice.actions;
export default aiSlice.reducer;