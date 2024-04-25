import React from "react";
import { NavLink, useLocation } from "react-router-dom";

interface NavLinksProps {
  classActive: string;
  onClick: () => void; // Define onClick prop
}

const links = [
  {
    name: "Today's tasks",
    path: "/today",
  },
  {
    name: "All tasks",
    path: "/",
  },
  {
    name: "Important tasks",
    path: "/important",
  },
  {
    name: "Completed tasks",
    path: "/completed",
  },
  {
    name: "Uncompleted tasks",
    path: "/uncompleted",
  },
];

const NavLinks: React.FC<NavLinksProps> = ({ classActive, onClick }) => {
  const route = useLocation();
  const currentPath = route.pathname;

  const handleClick = () => {
    // Call the onClick handler passed from the parent component
    onClick();
  };

  return (
    <nav>
      <ul className="grid gap-2">
        {links.map((link) => (
          <li key={link.path}>
            <NavLink
              to={link.path}
              className={`px-4 py-2 w-full block transition hover:text-rose-600 dark:hover:text-slate-200 ${
                currentPath === link.path ? classActive : ""
              }`}
              onClick={handleClick}
            >
              {link.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavLinks;
