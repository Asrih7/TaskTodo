import { configureStore } from "@reduxjs/toolkit";
import tasksReducer, { tasksMiddleware } from "./Tasks.store";
import modalReducer from "./Modal.store";
import menuReducer from "./Menu.store";
import aiReducer from "./AI.store";
import gamificationReducer from "./Gamification.store";
import moodReducer from "./Mood.store";
import themeReducer from "./Theme.store";

const store = configureStore({
  reducer: { 
    tasks: tasksReducer, 
    modal: modalReducer, 
    menu: menuReducer,
    ai: aiReducer,
    gamification: gamificationReducer,
    mood: moodReducer,
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware().concat(tasksMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AddDispatch = typeof store.dispatch;
export default store;
