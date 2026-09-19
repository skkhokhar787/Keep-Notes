import React, { useState } from "react";
import { Pencil, Check, X, Trash2, FileText } from "lucide-react";
import { useNotes } from "../context/NotesContext";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const NoteCard = ({ id, title, des, time, status, isDragging }) => {
  const { updateNote, draftNote, removeDraft, deleteNote } = useNotes();

  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title || "");
  const [editDescription, setEditDescription] = useState(des || "");
  const hasDraggedRef = React.useRef(false);

  // ============================================
  // DND SORTABLE HOOK
  // ============================================
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  // ============================================
  // HANDLE CLICK - Only open if not dragged
  // ============================================
  const handleClick = () => {
    if (!hasDraggedRef.current) {
      handleOpen();
    }
    hasDraggedRef.current = false;
  };

  // ============================================
  // DND EVENT HANDLERS
  // ============================================
  const handleDragStart = () => {
    hasDraggedRef.current = true;
  };

  // ============================================
  // OPEN NOTE
  // ============================================
  const handleOpen = () => {
    setEditTitle(title || "");
    setEditDescription(des || "");
    setIsOpen(true);
  };

  // ============================================
  // CLOSE NOTE
  // ============================================
  const handleClose = () => {
    setIsOpen(false);
    setIsEditing(false);
  };

  // ============================================
  // UPDATE NOTE
  // ============================================
  const handleUpdate = async () => {
    if (!editTitle.trim() && !editDescription.trim()) {
      return;
    }

    try {
      await updateNote(id, editTitle, editDescription);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  // ============================================
  // CANCEL EDIT
  // ============================================
  const handleCancel = () => {
    setEditTitle(title || "");
    setEditDescription(des || "");
    setIsEditing(false);
  };

  // ============================================
  // MOVE TO DRAFT
  // ============================================
  const handleDraft = async () => {
    try {
      await draftNote(id);
      setIsOpen(false);
    } catch (error) {
      console.error("Error moving note to draft:", error);
    }
  };

  // ============================================
  // REMOVE DRAFT
  // ============================================
  const handleRemoveDraft = async () => {
    try {
      await removeDraft(id);
      setIsOpen(false);
    } catch (error) {
      console.error("Error removing draft:", error);
    }
  };

  // ============================================
  // DELETE NOTE
  // ============================================
  const handleDelete = async () => {
    const confirmed = window.confirm("Move this note to Trash?");
    if (!confirmed) return;

    try {
      await deleteNote(id);
      setIsOpen(false);
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  return (
    <>
      {/* ========================================
          NOTE CARD
      ======================================== */}
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={handleClick}
        onDragStart={handleDragStart}
        className="group relative flex flex-col justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-xs transition-all hover:border-gray-300 hover:shadow-sm  active:cursor-grabbing min-w-0 overflow-hidden"
      >
        <div className="min-w-0 overflow-hidden">
          {status === "draft" && (
            <div className="mb-2 flex w-fit items-center gap-1 rounded border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
              <FileText size={12} />
              <span>Draft</span>
            </div>
          )}

          <h3 className="text-base font-semibold text-gray-900 break-words min-w-0 line-clamp-2">
            {title || "Untitled Note"}
          </h3>

          <p className="mt-1.5 text-sm text-gray-600 break-words whitespace-pre-wrap min-w-0 line-clamp-4 leading-relaxed">
            {des || "No description"}
          </p>
        </div>

        <div className="mt-4 pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
          <span>{time || "Just now"}</span>
        </div>
      </div>

      {/* ========================================
          POPUP MODAL
      ======================================== */}
      {isOpen && (
        <div
          onClick={handleClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-lg border border-gray-200 bg-white p-5 shadow-lg min-w-0 overflow-hidden"
          >
            {/* Header */}
            <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-base font-semibold text-gray-900">
                {isEditing ? "Edit Note" : "Note"}
              </h2>

              <button
                type="button"
                onClick={handleClose}
                className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Area */}
            {isEditing ? (
              /* ==================================
                  EDIT MODE
              ================================== */
              <div className="flex flex-1 flex-col overflow-y-auto min-w-0">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Note title"
                  className="mb-3 w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-900 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />

                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Write your note..."
                  rows={8}
                  className="w-full resize-y rounded-md border border-gray-300 p-3 text-sm text-gray-800 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 break-words whitespace-pre-wrap min-w-0"
                />

                <div className="mt-4 flex justify-end gap-2 border-t border-gray-100 pt-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <X size={15} />
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleUpdate}
                    className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
                  >
                    <Check size={15} />
                    Save
                  </button>
                </div>
              </div>
            ) : (
              /* ==================================
                  VIEW MODE
              ================================== */
              <div className="flex flex-1 flex-col overflow-y-auto min-w-0">
                {status === "draft" && (
                  <div className="mb-3 flex w-fit items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                    <FileText size={13} />
                    Draft
                  </div>
                )}

                <h3 className="text-lg font-semibold text-gray-900 break-words min-w-0">
                  {title || "Untitled Note"}
                </h3>

                <div className="mt-3 text-sm text-gray-700 break-words whitespace-pre-wrap min-w-0 overflow-hidden leading-relaxed">
                  {des || "No description"}
                </div>

                <p className="mt-4 text-xs text-gray-400">
                  {time || "Just now"}
                </p>

                {/* Actions */}
                <div className="mt-5 flex flex-wrap items-center justify-end gap-2 border-t border-gray-100 pt-3">
                  {/* Edit */}
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
                  >
                    <Pencil size={15} />
                    Edit
                  </button>

                  {/* Draft / Remove Draft */}
                  {status === "draft" ? (
                    <button
                      type="button"
                      onClick={handleRemoveDraft}
                      className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
                    >
                      <Check size={15} />
                      Remove Draft
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleDraft}
                      className="inline-flex items-center gap-1.5 rounded-md bg-amber-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-600 transition-colors"
                    >
                      <FileText size={15} />
                      Draft
                    </button>
                  )}

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="inline-flex items-center gap-1.5 rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 transition-colors"
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default NoteCard;
