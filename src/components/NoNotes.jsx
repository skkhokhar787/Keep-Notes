import React from "react";
import { StickyNote, Plus } from "lucide-react";
import { Link } from "react-router-dom";

function NoNotes() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
        <StickyNote size={30} />
      </div>
      <h3 className="text-base font-semibold text-gray-900">
        You have no Notes yet.
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        Create a note to get started.
      </p>
      <Link
        to="/add-notes"
        className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3.5 py-1.5 text-sm font-medium text-white shadow-xs transition-colors hover:bg-emerald-700"
      >
        <Plus size={16} />
        Add Note
      </Link>
    </div>
  );
}

export default NoNotes;