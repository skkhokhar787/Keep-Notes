import React from "react";

function SidebarItems({ name, Icon, active = false }) {
  return (
    <li>
      <div
        className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
          active
            ? "bg-emerald-50 font-semibold text-emerald-700"
            : "font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        }`}
      >
        <span className={active ? "text-emerald-600" : "text-gray-500"}>
          {Icon}
        </span>
        <span>{name}</span>
      </div>
    </li>
  );
}

export default SidebarItems;
