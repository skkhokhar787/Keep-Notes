import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

export const AuthActionsContext = createContext({
  user: null,
  openLogin: () => {},
  openSignup: () => {},
  handleLogout: () => {},
  isSidebarOpen: false,
  toggleSidebar: () => {},
  closeSidebar: () => {},
});

export function useAuthActions() {
  return useContext(AuthActionsContext);
}

export function AuthActionsProvider({ children, onOpenLogin, onOpenSignup }) {
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleAuth = () => {
      setUser(auth.currentUser ? { ...auth.currentUser } : null);
    };

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser ? { ...currentUser } : null);
    });

    window.addEventListener("auth-changed", handleAuth);

    return () => {
      unsubscribe();
      window.removeEventListener("auth-changed", handleAuth);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.dispatchEvent(new Event("auth-changed"));
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthActionsContext.Provider
      value={{
        user,
        openLogin: onOpenLogin,
        openSignup: onOpenSignup,
        handleLogout,
        isSidebarOpen,
        toggleSidebar: () => setIsSidebarOpen((prev) => !prev),
        closeSidebar: () => setIsSidebarOpen(false),
      }}
    >
      {children}
    </AuthActionsContext.Provider>
  );
}
