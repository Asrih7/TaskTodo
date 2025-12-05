import React, { useEffect, useState } from "react";
import { IonApp, IonPage } from "@ionic/react";
import AccountData from "./components/AccountSection/AccountData";
import Footer from "./components/Footer";
import Menu from "./components/Menu/Menu";
import TasksSection from "./components/TasksSection/TasksSection";
import ModalCreateTask from "./components/Utilities/ModalTask";
import CustomSplashScreen from "./components/Utilities/CustomSplashScreen";
import { Task } from "./interfaces";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { modalActions } from "./store/Modal.store";
import { tasksActions } from "./store/Tasks.store";

const initializeApp = () => {
  const isFreshInstall = !localStorage.getItem("app_initialized");
  
  if (isFreshInstall) {
    localStorage.clear();
    localStorage.setItem("app_initialized", "true");
    localStorage.setItem("install_timestamp", Date.now().toString());
  }
};

const App: React.FC = () => {
  const modal = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();
  const [showCustomSplash, setShowCustomSplash] = useState(true);

  useEffect(() => {
    initializeApp();
    
 
    // Show custom splash for 3 seconds
    setTimeout(() => {
      setShowCustomSplash(false);
    }, 1000);
  }, []);

  const closeModalCreateTask = () => {
    dispatch(modalActions.closeModalCreateTask());
  };

  const createNewTaskHandler = (task: Task) => {
    dispatch(tasksActions.addNewTask(task));
  };

  return (
    <IonApp
      placeholder={undefined}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
    >
      <IonPage
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        {/* ONLY your custom splash screen - no plugin splash */}
        {showCustomSplash && <CustomSplashScreen />}
        
        {/* Main app content */}
        {!showCustomSplash && (
          <div className="bg-slate-200 min-h-screen text-slate-600 dark:bg-slate-900 dark:text-slate-400 xl:text-base sm:text-sm text-xs">
            {modal.modalCreateTaskOpen && (
              <ModalCreateTask
                onClose={closeModalCreateTask}
                nameForm="Add a task"
                onConfirm={createNewTaskHandler}
              />
            )}
            <Menu />
            <TasksSection />
            <Footer />
            <AccountData />
          </div>
        )}
      </IonPage>
    </IonApp>
  );
};

export default App;