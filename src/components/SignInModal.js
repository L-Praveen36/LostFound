// components/SignInModal.js
import React, { useState } from 'react';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  EmailAuthProvider,
  linkWithCredential
} from 'firebase/auth';

import { auth, googleProvider } from '../firebase';

function SignInModal({ onClose }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // 🔐 Google Sign-In and optional password link
  const handleGoogleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // ✅ Prompt to set password only if not already linked
      const methods = await fetchSignInMethodsForEmail(auth, user.email);
      const alreadyLinked = methods.includes('password');

      if (!alreadyLinked) {
        const shouldLink = window.confirm("✅ Signed in with Google.\nDo you want to set a password for this account?");
        if (shouldLink) {
          const newPw = prompt("Enter a new password (min 6 characters):");
          if (newPw && newPw.length >= 6) {
            const cred = EmailAuthProvider.credential(user.email, newPw);
            await linkWithCredential(user, cred);
            alert("✅ Password set! You can now log in with email/password too.");
          } else {
            alert("❌ Password too short. You can still sign in with Google.");
          }
        }
      }

      localStorage.setItem("user", JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email.split('@')[0],
        photoURL: user.photoURL
      }));

      onClose();
    } catch (err) {
      console.error("Google sign-in failed", err);
      setError("Google Sign-In failed. Try again.");
    }
  };

  // 🔐 Email/Password Sign-In or Sign-Up
  const handleEmailAuth = async () => {
    setError('');
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);

      if (!isSignUp && methods.length === 0) {
        setError("No account found with this email.");
        document.getElementById("switch-to-signup")?.classList.add("text-red-600", "font-semibold");
        return;
      }

      if (isSignUp && methods.length > 0) {
        setError("An account already exists. Please sign in instead.");
        return;
      }

      const method = isSignUp ? createUserWithEmailAndPassword : signInWithEmailAndPassword;
      const result = await method(auth, email, password);
      const user = result.user;

      localStorage.setItem("user", JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email.split('@')[0],
        photoURL: user.photoURL
      }));

      onClose();
    } catch (err) {
      console.error("Email auth error", err);
      setError(err.message || "Authentication failed.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">&times;</button>
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </h2>

        <div className="space-y-4">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="input w-full"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="input w-full"
          />

          <button
            onClick={handleEmailAuth}
            className="w-full bg-purple-600 text-white py-2 rounded-full hover:bg-purple-700 transition"
          >
            {isSignUp ? 'Sign Up with Email' : 'Sign In with Email'}
          </button>

          <div className="text-center text-gray-500">or</div>

          <button
            onClick={handleGoogleAuth}
            className="w-full bg-white border border-gray-300 py-2 rounded-full text-purple-700 font-medium hover:shadow"
          >
            {isSignUp ? 'Sign Up with Google' : 'Sign In with Google'}
          </button>
        </div>

        <p className="text-center mt-6 text-sm text-gray-500">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            id="switch-to-signup"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
              document.getElementById("switch-to-signup")?.classList.remove("text-red-600", "font-semibold");
            }}
            className="text-purple-600 hover:underline font-medium"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default SignInModal;
