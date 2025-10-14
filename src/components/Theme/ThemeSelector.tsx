import React from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { themeActions, themes } from "../../store/Theme.store";

const ThemeSelector: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentTheme } = useAppSelector(state => state.theme);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-md">
      <h3 className="font-bold text-lg mb-3 text-slate-700 dark:text-slate-300">
        🎨 Theme
      </h3>
      
      <div className="grid grid-cols-2 gap-2">
        {Object.values(themes).map(theme => (
          <button
            key={theme.id}
            onClick={() => dispatch(themeActions.setTheme(theme.id))}
            className={`p-3 rounded-lg border-2 transition-all ${
              currentTheme === theme.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            <div className="flex gap-2 mb-2">
              <div
                className="w-6 h-6 rounded-full border border-slate-300"
                style={{ backgroundColor: theme.primary }}
              />
              <div
                className="w-6 h-6 rounded-full border border-slate-300"
                style={{ backgroundColor: theme.secondary }}
              />
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {theme.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
