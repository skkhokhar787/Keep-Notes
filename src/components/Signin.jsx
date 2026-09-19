import React, { useState } from "react";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase/firebase";
import { GoogleIcon } from "./SvgIcons";
import { X, StickyNote } from "lucide-react";

const Signin = ({ onClose, onSignupClick }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const googleProvider = new GoogleAuthProvider();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.log("Logged in:", userCredential.user);
      onClose();
    } catch (error) {
      console.error("Login error:", error);

      if (error.code === "auth/invalid-credential") {
        alert("Invalid email or password.");
      } else {
        alert("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Google user:", result.user);
      onClose();
    } catch (error) {
      console.error("Google login error:", error);

      if (error.code !== "auth/popup-closed-by-user") {
        alert("Google login failed. Please try again.");
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      {/* Modal */}
      <div
        className="relative w-full max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow-lg min-w-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-emerald-600 mb-2">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-emerald-50 border border-emerald-200">
              <StickyNote size={16} />
            </div>
            <span className="text-sm font-semibold tracking-tight text-gray-900">
              Keep Notes
            </span>
          </div>

          <h2 className="text-xl font-bold text-gray-900">
            Sign In
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            Enter your credentials to access your notes.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label
              htmlFor="login-email"
              className="block text-xs font-semibold uppercase tracking-wider text-gray-600"
            >
              Email address
            </label>

            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1.5 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-xs outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="login-password"
              className="block text-xs font-semibold uppercase tracking-wider text-gray-600"
            >
              Password
            </label>

            <input
              id="login-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1.5 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-xs outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-xs transition-colors hover:bg-emerald-700 disabled:opacity-50"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 py-1">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs uppercase text-gray-400">or</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={googleLogin}
            className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-xs transition-colors hover:bg-gray-50"
          >
            <GoogleIcon />
            <span>Continue with Google</span>
          </button>

          {/* Signup */}
          <div className="pt-2 text-center text-xs text-gray-500">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={onSignupClick}
              className="font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
            >
              Create an account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signin;