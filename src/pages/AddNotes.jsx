import React, { useState, useEffect } from "react";
import { Check, LogIn, UserPlus } from "lucide-react";
import { useNotes } from "../context/NotesContext";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useAuthActions } from "../context/AuthActionsContext";

function AddNotes() {
  const { openLogin, openSignup, user: ctxUser } = useAuthActions();
  const [localUser, setLocalUser] = useState(auth.currentUser);
  const [title, setTitle] = useState("");
  const [des, setDes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createNote } = useNotes();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = () => {
      setLocalUser(auth.currentUser ? { ...auth.currentUser } : null);
    };

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setLocalUser(u ? { ...u } : null);
    });

    window.addEventListener("auth-changed", handleAuth);

    return () => {
      unsubscribe();
      window.removeEventListener("auth-changed", handleAuth);
    };
  }, []);

  const currentUser = ctxUser !== undefined ? ctxUser : localUser;

  const handleCreateNote = async (e) => {
    if (e) e.preventDefault();
    if (!currentUser) {
      openLogin();
      return;
    }
    if (!title.trim() && !des.trim()) return;

    try {
      setIsSubmitting(true);
      await createNote(title, des);
      setTitle("");
      setDes("");
      navigate("/");
    } catch (error) {
      console.error("Error creating note:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Add Note
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Create and save a new note.
        </p>
      </div>

      {!currentUser ? (
        /* Prompt when user is not logged in */
        <div className="mt-8 rounded-lg border border-gray-200 bg-white p-8 text-center shadow-xs">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
            <LogIn size={22} />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">
            Sign in to add notes
          </h2>
          <p className="mx-auto mt-1.5 max-w-sm text-sm text-gray-500">
            You must be logged in to create and save notes to your account.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={openLogin}
              className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-xs transition-colors hover:bg-emerald-700"
            >
              <LogIn size={16} />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={openSignup}
              className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-xs transition-colors hover:bg-gray-50"
            >
              <UserPlus size={16} />
              <span>Create Account</span>
            </button>
          </div>
        </div>
      ) : (
        /* Form when user is logged in */
        <form
          onSubmit={handleCreateNote}
          className="mt-6 rounded-lg border border-gray-200 bg-white p-5 shadow-xs sm:p-6"
        >
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label
                htmlFor="note-title"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500"
              >
                Title
              </label>
              <input
                id="note-title"
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-base font-medium text-gray-900 outline-none transition focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 min-w-0 break-words"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="note-desc"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500"
              >
                Description
              </label>
              <textarea
                id="note-desc"
                rows={8}
                placeholder="Write your note description..."
                value={des}
                onChange={(e) => setDes(e.target.value)}
                className="w-full resize-y rounded-md border border-gray-300 p-3 text-sm text-gray-800 outline-none transition focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 min-w-0 break-words whitespace-pre-wrap leading-relaxed"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="rounded-md border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || (!title.trim() && !des.trim())}
              className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-xs transition-colors hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check size={16} />
              <span>{isSubmitting ? "Saving..." : "Save Note"}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default AddNotes;
