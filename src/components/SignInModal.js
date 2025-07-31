
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  auth,
  googleProvider,
  signInWithEmailAndPassword,
} from "../firebase";
import { signInWithPopup } from "firebase/auth";
import SignUpModal from "./SignUpModal";

function SignInModal({ onClose = () => {}, onSuccess = () => {} }) {
  const [mode, setMode] = useState("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSignUp, setShowSignUp] = useState(false);

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const token = await user.getIdToken();
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        token,
      };
      localStorage.setItem("user", JSON.stringify(userData));
      onSuccess(userData);
      onClose();
    } catch (err) {
      console.error("Google sign-in error:", err);
      setError("Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailPasswordLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      const token = await user.getIdToken();
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        token,
      };
      localStorage.setItem("user", JSON.stringify(userData));
      onSuccess(userData);
      onClose();
    } catch (err) {
  console.error("Email/password login error:", err);
  try {
    const checkRes = await fetch(`${API}/api/auth/check-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await checkRes.json();
    if (data.exists && data.provider === "google") {
      setError("This account was created using Google. Please sign in with Google.");
    } else {
      setError("Invalid email or password");
    }
  } catch (checkErr) {
    setError("Login failed");
  }
}
 finally {
      setLoading(false);
    }
  };

  if (showSignUp) {
    return (
      <SignUpModal
        onClose={() => setShowSignUp(false)}
        onSuccess={(userData) => {
          onSuccess(userData);
          setShowSignUp(false);
          onClose();
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-card bg-white/60 backdrop-blur-lg border border-white/30 text-gray-800 rounded-2xl p-8 w-full max-w-md shadow-xl"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>

        <div className="flex justify-center space-x-4 mb-6">
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium shadow-sm transition ${
              mode === "email" ? "bg-purple-600 text-white" : "bg-white/30 text-gray-800 hover:bg-white/50"
            }`}
            onClick={() => setMode("email")}
          >
            Email & Password
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium shadow-sm transition ${
              mode === "google" ? "bg-purple-600 text-white" : "bg-white/30 text-gray-800 hover:bg-white/50"
            }`}
            onClick={() => setMode("google")}
          >
            Google
          </button>
        </div>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        {mode === "google" && (
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full transition font-semibold"
          >
            {loading ? "Signing in..." : "Continue with Google"}
          </button>
        )}

        {mode === "email" && (
          <form onSubmit={handleEmailPasswordLogin}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="input bg-white/80 placeholder-gray-500"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your Password"
              required
              className="input bg-white/80 placeholder-gray-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-full"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>
        )}

        <p className="text-sm mt-4 text-center">
          Don’t have an account?{' '}
          <button
            onClick={() => setShowSignUp(true)}
            className="text-blue-600 hover:underline"
          >
            Sign up here
          </button>
        </p>

        <button
          onClick={onClose}
          className="mt-6 w-full text-sm text-gray-600 hover:underline"
        >
          Cancel
        </button>
      </motion.div>
    </div>
  );
}

export default SignInModal;