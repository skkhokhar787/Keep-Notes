import React from "react";
import { Link } from "react-router-dom";
import { Menu, StickyNote } from "lucide-react";
import { useAuthActions } from "../context/AuthActionsContext";

function Header() {
  const { user, openLogin, openSignup, handleLogout, toggleSidebar } = useAuthActions();

  return (
    <header className="fixed top-0 left-0 right-0 z-30 h-14 border-b border-gray-200 bg-white">
      <div className="flex h-full items-center justify-between px-4 sm:px-6">
        {/* Left: Mobile Menu Toggle + Logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleSidebar}
            className="rounded-md p-1.5 text-gray-600 hover:bg-gray-100 hover:text-gray-900 sm:hidden focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            <Menu size={20} />
          </button>

          <Link
            to="/"
            className="flex items-center gap-2 text-gray-900 transition-opacity hover:opacity-90"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-50 text-emerald-600 border border-emerald-200">
              <StickyNote size={18} />
            </div>
            <span className="text-base font-semibold tracking-tight text-gray-900 sm:text-lg">
              Keep Notes
            </span>
          </Link>
        </div>

        {/* Right: Auth State Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-block text-xs font-medium text-gray-600">
                {user.displayName || user.email}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={openLogin}
                className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={openSignup}
                className="rounded-md bg-emerald-600 px-3.5 py-1.5 text-sm font-medium text-white shadow-xs hover:bg-emerald-700 transition-colors"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;