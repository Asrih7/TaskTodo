import React from "react";
import { ReactComponent as IconView1 } from "../../assets/view-1.svg";

const sortValues = [
  { value: "order-added", title: "Order added" },
  { value: "min-date", title: "Earlier first" },
  { value: "max-date", title: "Later first" },
  { value: "completed-first", title: "Completed first" },
  { value: "uncompleted-first", title: "Uncompleted first" },
];

const ButtonsSort: React.FC<{
  sortedBy: string;
  setSortedBy: (option: string) => void;
}> = ({ sortedBy, setSortedBy }) => {
  return (
    <div className="flex children-styles">
      <button title="view in list">
        <IconView1 className="text-blue-600" />
      </button>
      <select
        className="ml-auto inputStyles"
        value={sortedBy}
        onChange={({ target }) => setSortedBy(target.value)}
      >
        <option value="" disabled>
          Sort by
        </option>
        {sortValues.map((val) => (
          <option
            key={val.value}
            value={val.value}
            className="bg-slate-100 dark:bg-slate-800"
          >
            {val.title}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ButtonsSort;