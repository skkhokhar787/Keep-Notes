import React, { useState } from "react";
import { RotateCcw, Trash2, X } from "lucide-react";
import { useNotes } from "../context/NotesContext";

const Trash = () => {
  const { deletedNotes, restoreNote, loading } = useNotes();
  const [selectedNote, setSelectedNote] = useState(null);

  // ============================================
  // RESTORE
  // ============================================
  const handleRestore = async (id) => {
    try {
      await restoreNote(id);
      setSelectedNote(null);
    } catch (error) {
      console.error("Error restoring note:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-center text-sm text-gray-500">
        <p>Loading trash...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Trash
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Notes moved to trash.
        </p>
      </div>

      {deletedNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
            <Trash2 size={26} />
          </div>
          <h3 className="text-base font-semibold text-gray-900">
            Your Trash is empty.
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Notes you delete will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {deletedNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => setSelectedNote(note)}
              className="group relative flex flex-col justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-xs transition-all hover:border-gray-300 hover:shadow-sm cursor-pointer min-w-0 overflow-hidden"
            >
              <div className="min-w-0 overflow-hidden">
                <div className="mb-2 flex w-fit items-center gap-1 rounded border border-red-200 bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-700">
                  <Trash2 size={12} />
                  <span>In Trash</span>
                </div>

                <h3 className="text-base font-semibold text-gray-900 break-words min-w-0 line-clamp-2">
                  {note.title || "Untitled Note"}
                </h3>

                <p className="mt-1.5 text-sm text-gray-600 break-words whitespace-pre-wrap min-w-0 line-clamp-4 leading-relaxed">
                  {note.description || "No description"}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {note.date?.toDate
                    ? note.date.toDate().toLocaleDateString()
                    : "Unknown date"}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRestore(note.id);
                  }}
                  className="inline-flex items-center gap-1 rounded-md bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100 transition-colors"
                >
                  <RotateCcw size={13} />
                  Restore
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================
          TRASH POPUP MODAL
      ======================================== */}
      {selectedNote && (
        <div
          onClick={() => setSelectedNote(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-lg border border-gray-200 bg-white p-5 shadow-lg min-w-0 overflow-hidden"
          >
            <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-base font-semibold text-gray-900">
                Deleted Note
              </h2>

              <button
                type="button"
                onClick={() => setSelectedNote(null)}
                className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-1 flex-col overflow-y-auto min-w-0">
              <div className="mb-3 flex w-fit items-center gap-1.5 rounded border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
                <Trash2 size={13} />
                In Trash
              </div>

              <h3 className="text-lg font-semibold text-gray-900 break-words min-w-0">
                {selectedNote.title || "Untitled Note"}
              </h3>

              <div className="mt-3 text-sm text-gray-700 break-words whitespace-pre-wrap min-w-0 overflow-hidden leading-relaxed">
                {selectedNote.description || "No description"}
              </div>

              <p className="mt-4 text-xs text-gray-400">
                {selectedNote.date?.toDate
                  ? selectedNote.date.toDate().toLocaleDateString()
                  : "Unknown date"}
              </p>

              <div className="mt-5 flex items-center justify-end gap-2 border-t border-gray-100 pt-3">
                <button
                  type="button"
                  onClick={() => setSelectedNote(null)}
                  className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={() => handleRestore(selectedNote.id)}
                  className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
                >
                  <RotateCcw size={15} />
                  Restore
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trash;