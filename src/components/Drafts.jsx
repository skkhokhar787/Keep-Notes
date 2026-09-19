import React from "react";
import NoteCard from "./NoteCard";
import { useNotes } from "../context/NotesContext";
import { FileEdit } from "lucide-react";

const Drafts = () => {
  const { draftNotes, loading } = useNotes();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-center text-sm text-gray-500">
        <p>Loading drafts...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Drafts
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Notes saved as drafts.
        </p>
      </div>

      {draftNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
            <FileEdit size={26} />
          </div>
          <h3 className="text-base font-semibold text-gray-900">
            You have no Drafts yet.
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Notes moved to draft will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {draftNotes.map((note) => (
            <NoteCard
              key={note.id}
              id={note.id}
              title={note.title}
              des={note.description}
              status={note.status}
              time={
                note.date?.toDate
                  ? note.date.toDate().toLocaleDateString()
                  : "Just now"
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Drafts;
