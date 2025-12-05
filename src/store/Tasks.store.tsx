import {
  Action,
  createSlice,
  Dispatch,
  MiddlewareAPI,
  PayloadAction,
} from "@reduxjs/toolkit";
import { Task } from "../interfaces";
import { notificationService } from "../services/notificationService";

// Initialize app storage and detect fresh installs
const initializeAppStorage = (): void => {
  const isFreshInstall = !localStorage.getItem("app_initialized");
  
  if (isFreshInstall) {
    // Clear ALL existing data - this is a fresh install
    localStorage.clear();
    
    // Set initialization markers
    localStorage.setItem("app_initialized", "true");
    localStorage.setItem("install_timestamp", Date.now().toString());
    
    console.log("Fresh install detected - storage cleared");
  }
};

// Call initialization on import
initializeAppStorage();

const getSavedDirectories = (): string[] => {
  let dirList: string[] = [];
  
  // Check if all data was deleted
  const isAllDataDeleted = localStorage.getItem("all_data_deleted") === "true";
  
  if (isAllDataDeleted) {
    return ["Main"];
  }

  if (localStorage.getItem("directories")) {
    dirList = JSON.parse(localStorage.getItem("directories")!);
    const mainDirExists = dirList.some((dir: string) => dir === "Main");
    if (!mainDirExists) {
      dirList.push("Main");
    }
  } else {
    dirList.push("Main");
  }

  if (localStorage.getItem("tasks")) {
    const savedTasksList = JSON.parse(localStorage.getItem("tasks")!);
    let dirNotSaved: string[] = [];
    savedTasksList.forEach((task: Task) => {
      if (!dirList.includes(task.dir)) {
        if (!dirNotSaved.includes(task.dir)) {
          dirNotSaved.push(task.dir);
        }
      }
    });
    dirList = [...dirList, ...dirNotSaved];
  }
  return dirList;
};

const getInitialTasks = (): Task[] => {
  // Check if all data was deleted
  const isAllDataDeleted = localStorage.getItem("all_data_deleted") === "true";
  
  if (isAllDataDeleted) {
    return [];
  }

  // Retrieve tasks from localStorage, filtering out any deleted tasks
  const savedTasksInStorage = localStorage.getItem("tasks");
  const deletedTaskIds = JSON.parse(localStorage.getItem("deleted_tasks") || "[]");

  if (savedTasksInStorage) {
    const savedTasks = JSON.parse(savedTasksInStorage);
    return savedTasks.filter((task: Task) => !deletedTaskIds.includes(task.id));
  }

  return [];
};

const initialState: {
  tasks: Task[];
  directories: string[];
} = {
  tasks: getInitialTasks(),
  directories: getSavedDirectories(),
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState: initialState,
  reducers: {
    addNewTask(state, action: PayloadAction<Task>) {
      // Remove all_data_deleted flag when adding a new task
      localStorage.removeItem("all_data_deleted");
      state.tasks = [action.payload, ...state.tasks];
      
      // Schedule notification for the new task
      notificationService.scheduleTaskReminder(action.payload);
    },
    removeTask(state, action: PayloadAction<string>) {
      const taskIdToRemove = action.payload;
      
      // Cancel notification for the removed task
      notificationService.cancelTaskReminder(taskIdToRemove);
      
      // Get current list of deleted task IDs
      const deletedTaskIds = JSON.parse(localStorage.getItem("deleted_tasks") || "[]");
      
      // Add the new task ID to deleted tasks
      const updatedDeletedTaskIds = [...deletedTaskIds, taskIdToRemove];
      localStorage.setItem("deleted_tasks", JSON.stringify(updatedDeletedTaskIds));

      // Remove the task from the current state
      state.tasks = state.tasks.filter((task) => task.id !== taskIdToRemove);
    },
    markAsImportant(state, action: PayloadAction<string>) {
      const newTaskFavorited = state.tasks.find(
        (task) => task.id === action.payload
      );
      if (newTaskFavorited) {
        newTaskFavorited.important = !newTaskFavorited.important;
      }
    },
    editTask(state, action: PayloadAction<Task>) {
      const taskId = action.payload.id;

      const taskIndex = state.tasks.findIndex((task) => task.id === taskId);
      if (taskIndex !== -1) {
        state.tasks[taskIndex] = action.payload;
        
        // Update notification for the edited task
        notificationService.updateTaskReminder(action.payload);
      }
    },
    toggleTaskCompleted(state, action: PayloadAction<string>) {
      const taskId = action.payload;

      const currTask = state.tasks.find((task) => task.id === taskId);
      if (currTask) {
        currTask.completed = !currTask.completed;
        
        if (currTask.completed) {
          currTask.completedAt = new Date().toISOString();
          notificationService.cancelTaskReminder(taskId);
        } else {
          currTask.completedAt = undefined;
          notificationService.scheduleTaskReminder(currTask);
        }
      }
    },
    deleteAllData(state) {
      state.tasks = [];
      state.directories = ["Main"];
      
      // Set flag for all data deletion
      localStorage.setItem("all_data_deleted", "true");
      
      // Clear other localStorage items
      localStorage.removeItem("tasks");
      localStorage.removeItem("directories");
      localStorage.removeItem("deleted_tasks");
      localStorage.removeItem("darkmode");
    },
    createDirectory(state, action: PayloadAction<string>) {
      const newDirectory: string = action.payload;
      const directoryAlreadyExists = state.directories.includes(newDirectory);
      if (directoryAlreadyExists) return;
      state.directories = [newDirectory, ...state.directories];
    },
    deleteDirectory(state, action: PayloadAction<string>) {
      const dirName = action.payload;

      state.directories = state.directories.filter((dir) => dir !== dirName);
      state.tasks = state.tasks.filter((task) => task.dir !== dirName);
    },
    editDirectoryName(
      state,
      action: PayloadAction<{ newDirName: string; previousDirName: string }>
    ) {
      const newDirName: string = action.payload.newDirName;
      const previousDirName: string = action.payload.previousDirName;
      const directoryAlreadyExists = state.directories.includes(newDirName);
      if (directoryAlreadyExists) return;

      const dirIndex = state.directories.indexOf(previousDirName);

      state.directories[dirIndex] = newDirName;
      state.tasks.forEach((task) => {
        if (task.dir === previousDirName) {
          task.dir = newDirName;
        }
      });
    },
  },
});

export const tasksActions = tasksSlice.actions;
export default tasksSlice.reducer;

export const tasksMiddleware =
  (store: MiddlewareAPI) => (next: Dispatch) => (action: Action) => {
    const nextAction = next(action);
    
    // Skip middleware if all data was deleted
    const isAllDataDeleted = localStorage.getItem("all_data_deleted") === "true";
    if (isAllDataDeleted) return nextAction;

    // Award XP on task completion
    if (tasksActions.toggleTaskCompleted.match(action)) {
      const state = store.getState() as any;
      const task = state.tasks.tasks.find((t: Task) => t.id === action.payload);
      
      if (task?.completed) {
        const xp = task.xpReward || 25;
        store.dispatch({ type: 'gamification/addXP', payload: xp });
        store.dispatch({ type: 'gamification/incrementTasksCompleted' });
        
        const hour = new Date().getHours();
        store.dispatch({ type: 'gamification/checkAndAwardBadges', payload: { hour } });
      }
    }

    const actionChangeOnlyDirectories =
      tasksActions.createDirectory.match(action);

    const isADirectoryAction: boolean = action.type
      .toLowerCase()
      .includes("directory");

    if (action.type.startsWith("tasks/") && !actionChangeOnlyDirectories) {
      const tasksList = store.getState().tasks.tasks;
      localStorage.setItem("tasks", JSON.stringify(tasksList));
    }
    if (action.type.startsWith("tasks/") && isADirectoryAction) {
      const dirList = store.getState().tasks.directories;
      localStorage.setItem("directories", JSON.stringify(dirList));
    }

    return nextAction;
  };