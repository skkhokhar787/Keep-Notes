import { createContext, useContext, useEffect, useState } from "react";

import {
  collection,
  getDocs,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
} from "firebase/firestore";

import { onAuthStateChanged } from "firebase/auth";

import { db, auth } from "../firebase/firebase";

const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // ============================================
  // GET USER NOTES
  // ============================================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setNotes([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const notesRef = collection(db, "users", user.uid, "notes");

        const notesQuery = query(
          notesRef,
          orderBy("date", "desc"),
        );

        const snapshot = await getDocs(notesQuery);

        const notesData = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        setNotes(notesData);
      } catch (error) {
        console.error("Error getting notes:", error);
        setNotes([]);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // ============================================
  // FILTERED NOTES
  // ============================================

  // Active notes
  const activeNotes = notes
    .filter(
      (note) =>
        note.status === "active" &&
        note.deleted !== true,
    )
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  // Draft notes
  const draftNotes = notes
    .filter(
      (note) =>
        note.status === "draft" &&
        note.deleted !== true,
    )
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  // Deleted notes
  const deletedNotes = notes
    .filter((note) => note.deleted === true)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  // ============================================
  // CREATE NOTE
  // ============================================
  const createNote = async (title, description) => {
    try {
      const user = auth.currentUser;

      if (!user) {
        throw new Error("User is not logged in.");
      }

      const noteData = {
        title,
        description,
        date: serverTimestamp(),
        status: "active",
        deleted: false,
        order: Date.now(),
      };

      const notesRef = collection(
        db,
        "users",
        user.uid,
        "notes",
      );

      const docRef = await addDoc(notesRef, noteData);

      const newNote = {
        id: docRef.id,
        title,
        description,
        date: null,
        status: "active",
        deleted: false,
        order: Date.now(),
      };

      setNotes((prevNotes) => [
        newNote,
        ...prevNotes,
      ]);

      console.log("Note created:", docRef.id);

      return docRef;
    } catch (error) {
      console.error("Error creating note:", error);
      throw error;
    }
  };

  // ============================================
  // UPDATE NOTE
  // ============================================
  const updateNote = async (
    noteId,
    title,
    description,
  ) => {
    try {
      const user = auth.currentUser;

      if (!user) {
        throw new Error("User is not logged in.");
      }

      const noteRef = doc(
        db,
        "users",
        user.uid,
        "notes",
        noteId,
      );

      await updateDoc(noteRef, {
        title,
        description,
        date: serverTimestamp(),
      });

      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === noteId
            ? {
                ...note,
                title,
                description,
              }
            : note,
        ),
      );
    } catch (error) {
      console.error("Error updating note:", error);
      throw error;
    }
  };

  // ============================================
  // MOVE NOTE TO DRAFT
  // ============================================
  const draftNote = async (noteId) => {
    try {
      const user = auth.currentUser;

      if (!user) {
        throw new Error("User is not logged in.");
      }

      const noteRef = doc(
        db,
        "users",
        user.uid,
        "notes",
        noteId,
      );

      await updateDoc(noteRef, {
        status: "draft",
      });

      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === noteId
            ? {
                ...note,
                status: "draft",
              }
            : note,
        ),
      );
    } catch (error) {
      console.error(
        "Error moving note to draft:",
        error,
      );

      throw error;
    }
  };

  // ============================================
  // REMOVE FROM DRAFT
  // ============================================
  const removeDraft = async (noteId) => {
    try {
      const user = auth.currentUser;

      if (!user) {
        throw new Error("User is not logged in.");
      }

      const noteRef = doc(
        db,
        "users",
        user.uid,
        "notes",
        noteId,
      );

      await updateDoc(noteRef, {
        status: "active",
      });

      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === noteId
            ? {
                ...note,
                status: "active",
              }
            : note,
        ),
      );
    } catch (error) {
      console.error(
        "Error removing draft:",
        error,
      );

      throw error;
    }
  };

  // ============================================
  // MOVE NOTE TO TRASH
  // ============================================
  const deleteNote = async (noteId) => {
    try {
      const user = auth.currentUser;

      if (!user) {
        throw new Error("User is not logged in.");
      }

      const noteRef = doc(
        db,
        "users",
        user.uid,
        "notes",
        noteId,
      );

      await updateDoc(noteRef, {
        deleted: true,
        deletedAt: serverTimestamp(),
      });

      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === noteId
            ? {
                ...note,
                deleted: true,
              }
            : note,
        ),
      );

      console.log("Note moved to Trash:", noteId);
    } catch (error) {
      console.error(
        "Error moving note to Trash:",
        error,
      );

      throw error;
    }
  };

  // ============================================
  // RESTORE NOTE FROM TRASH
  // ============================================
  const restoreNote = async (noteId) => {
    try {
      const user = auth.currentUser;

      if (!user) {
        throw new Error("User is not logged in.");
      }

      const noteRef = doc(
        db,
        "users",
        user.uid,
        "notes",
        noteId,
      );

      await updateDoc(noteRef, {
        deleted: false,
      });

      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === noteId
            ? {
                ...note,
                deleted: false,
              }
            : note,
        ),
      );
    } catch (error) {
      console.error(
        "Error restoring note:",
        error,
      );

      throw error;
    }
  };

  // ============================================
  // REORDER NOTES (DND)
  // ============================================
  const reorderNotes = async (noteIds) => {
    try {
      const user = auth.currentUser;

      if (!user) {
        throw new Error("User is not logged in.");
      }

      const batchUpdates = noteIds.map((id, index) => {
        const noteRef = doc(db, "users", user.uid, "notes", id);
        return updateDoc(noteRef, { order: index });
      });

      await Promise.all(batchUpdates);

      setNotes((prevNotes) => {
        const noteMap = new Map(prevNotes.map((note) => [note.id, note]));
        return noteIds.map((id, index) => ({
          ...noteMap.get(id),
          order: index,
        }));
      });
    } catch (error) {
      console.error("Error reordering notes:", error);
      throw error;
    }
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        activeNotes,
        draftNotes,
        deletedNotes,
        loading,

        createNote,
        updateNote,
        draftNote,
        removeDraft,
        deleteNote,
        restoreNote,
        reorderNotes,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

// ============================================
// CUSTOM HOOK
// ============================================
export const useNotes = () => {
  return useContext(NotesContext);
};