import React from "react";
import SidebarItems from "./SidebarItems";
import { StickyNote, FileEdit, Trash2, Plus, X, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthActions } from "../context/AuthActionsContext";

function Sidebar() {
  const { user, openLogin, handleLogout, isSidebarOpen, closeSidebar } = useAuthActions();
  const location = useLocation();
  const navigate = useNavigate();

  const handleAddNoteClick = () => {
    closeSidebar();
    if (!user) {
      openLogin();
    } else {
      navigate("/add-notes");
    }
  };

  const handleLogoutClick = async () => {
    await handleLogout();
    closeSidebar();
  };

  const avatarLetter = (
    user?.displayName?.charAt(0) ||
    user?.email?.charAt(0) ||
    "U"
  ).toUpperCase();

  const currentPath = location.pathname;

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 sm:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="default-sidebar"
        className={`fixed left-0 top-14 z-40 flex h-[calc(100vh-3.5rem)] w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-200 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
        }`}
        aria-label="Sidebar"
      >
        {/* Mobile Close Button */}
        <div className="flex items-center justify-between px-4 pt-3 sm:hidden">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Menu
          </span>
          <button
            type="button"
            onClick={closeSidebar}
            className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          >
            <X size={18} />
          </button>
        </div>

        {/* Add Note Button */}
        <div className="px-4 pt-4">
          <button
            type="button"
            onClick={handleAddNoteClick}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white shadow-xs transition-colors hover:bg-emerald-700"
          >
            <Plus size={18} />
            <span>Add Note</span>
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            <Link to="/" onClick={closeSidebar}>
              <SidebarItems
                name="Notes"
                Icon={<StickyNote size={18} />}
                active={currentPath === "/" || currentPath === "/notes"}
              />
            </Link>

            <Link to="/drafts" onClick={closeSidebar}>
              <SidebarItems
                name="Drafts"
                Icon={<FileEdit size={18} />}
                active={currentPath === "/drafts"}
              />
            </Link>

            <Link to="/trash" onClick={closeSidebar}>
              <SidebarItems
                name="Trash"
                Icon={<Trash2 size={18} />}
                active={currentPath === "/trash"}
              />
            </Link>
          </ul>
        </div>

        {/* Bottom: Account & Logout */}
        <div className="border-t border-gray-200 p-3">
          <div className="flex items-center gap-3 rounded-md p-2 hover:bg-gray-50 transition-colors">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-semibold text-white">
              {avatarLetter}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-gray-900">
                {user?.displayName || (user ? "User" : "Not signed in")}
              </p>
              <p className="truncate text-[11px] text-gray-500">
                {user?.email || "Guest"}
              </p>
            </div>

            {user && (
              <button
                type="button"
                onClick={handleLogoutClick}
                title="Log Out"
                className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
