import React from "react";
import CardGrid from "../components/CardGrid";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { auth } from "../firebase/firebase";
import { useAuthActions } from "../context/AuthActionsContext";

function Home() {
  const { openLogin } = useAuthActions();

  const handleAddClick = (e) => {
    if (!auth.currentUser) {
      e.preventDefault();
      openLogin();
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Keep Notes
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Capture and organize your thoughts.
          </p>
        </div>

        <Link
          to="/add-notes"
          onClick={handleAddClick}
          className="inline-flex items-center gap-1.5 self-start rounded-md bg-emerald-600 px-3.5 py-2 text-sm font-medium text-white shadow-xs transition-colors hover:bg-emerald-700 sm:self-auto"
        >
          <Plus size={16} />
          <span>Add Note</span>
        </Link>
      </div>

      {/* Notes Grid */}
      <CardGrid />
    </div>
  );
}

export default Home;