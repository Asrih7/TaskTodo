import React from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { menusActions } from "../../store/Menu.store";
import BtnAddTask from "../Utilities/BtnAddTask";
import Directories from "./Directories/Directories";
import NavLinks from "./NavLinks";
import LayoutMenus from "../Utilities/LayoutMenus";

const classLinkActive =
  "text-rose-600 bg-violet-100 border-r-4 border-rose-500 dark:bg-slate-700/[.2] dark:text-slate-200 dark:border-slate-200";

const Menu: React.FC = () => {
  const menuOpen = useAppSelector((state) => state.menu.menuHeaderOpened);
  const dispatch = useAppDispatch();

  const closeMenuHandler = () => {
    dispatch(menusActions.closeMenuHeader());
  };

  const handleNavLinkClick = () => {
    // Close menu logic
    closeMenuHandler();
  };

  return (
    <LayoutMenus
      menuOpen={menuOpen}
      closeMenuHandler={closeMenuHandler}
      className="left-0"
    >
      <header className="h-full flex flex-col">
        <h1 className="font-bold  text-center mt-8 text-lg tracking-wide hidden xl:block">
          Tasks Todo
        </h1>
        <BtnAddTask className="my-8 mx-4" />
        {/* Pass click event handlers to child components */}
        <NavLinks classActive={classLinkActive} onClick={handleNavLinkClick} />
        <Directories
          classActive={classLinkActive}
        />
      </header>
    </LayoutMenus>
  );
};

export default Menu;
