import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import NoteCard from "./NoteCard";
import { useNotes } from "../context/NotesContext";
import NoNotes from "./NoNotes";

const CardGrid = () => {
  const { activeNotes, loading, reorderNotes } = useNotes();
  const [activeId, setActiveId] = useState(null);

  // ============================================
  // DND SENSORS SETUP
  // ============================================
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // ============================================
  // HANDLE DRAG END - SAVE NEW ORDER TO FIRESTORE
  // ============================================
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    console.log("[DnD] handleDragEnd fired", { activeId: active.id, overId: over?.id });

    if (over && active.id !== over.id) {
      const oldIndex = activeNotes.findIndex((note) => note.id === active.id);
      const newIndex = activeNotes.findIndex((note) => note.id === over.id);
      console.log("[DnD] Reordering:", { oldIndex, newIndex, activeNotesCount: activeNotes.length });

      // Create new ordered array
      const newNotes = [...activeNotes];
      const [removed] = newNotes.splice(oldIndex, 1);
      newNotes.splice(newIndex, 0, removed);

      // Extract note IDs in new order
      const newOrderIds = newNotes.map((note) => note.id);
      console.log("[DnD] New order IDs:", newOrderIds);

      try {
        await reorderNotes(newOrderIds);
        console.log("[DnD] Reorder saved to Firestore successfully");
      } catch (error) {
        console.error("[DnD] Failed to reorder notes:", error);
      }
    } else {
      console.log("[DnD] No reorder needed (same position or no target)");
    }

    setActiveId(null);
  };

  // ============================================
  // HANDLE DRAG START
  // ============================================
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-center text-sm text-gray-500">
        <p>Loading notes...</p>
      </div>
    );
  }

  if (activeNotes.length === 0) {
    return <NoNotes />;
  }

  return (
    // ============================================
    // DND CONTEXT PROVIDER
    // ============================================
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {/* ============================================
          SORTABLE CONTEXT FOR GRID LAYOUT
      ============================================ */}
      <SortableContext
        items={activeNotes.map((note) => note.id)}
        strategy={rectSortingStrategy}
      >
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {activeNotes.map((note) => (
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
              isDragging={activeId === note.id}
            />
          ))}
        </div>
      </SortableContext>

      {/* ============================================
          DRAG OVERLAY - Shows card while dragging
      ============================================ */}
      <DragOverlay>
        {activeId ? (
          <div style={{ opacity: 0.8 }}>
            {activeNotes
              .filter((note) => note.id === activeId)
              .map((note) => (
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
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default CardGrid;
