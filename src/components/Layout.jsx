import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Signin from "./Signin";
import Signup from "./Signup";
import { AuthActionsProvider } from "../context/AuthActionsContext";

function Layout({ children }) {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const openLogin = () => {
    setShowSignup(false);
    setShowLogin(true);
  };

  const openSignup = () => {
    setShowLogin(false);
    setShowSignup(true);
  };

  return (
    <AuthActionsProvider onOpenLogin={openLogin} onOpenSignup={openSignup}>
      <div className="relative min-h-screen bg-white text-gray-900 antialiased overflow-x-hidden">
        <Header />
        <Sidebar />

        {children}

        {showLogin && (
          <Signin onClose={() => setShowLogin(false)} onSignupClick={openSignup} />
        )}

        {showSignup && (
          <Signup onClose={() => setShowSignup(false)} onLoginClick={openLogin} />
        )}
      </div>
    </AuthActionsProvider>
  );
}

export default Layout;
