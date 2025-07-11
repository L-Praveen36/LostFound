// components/SignInModal.js
import React, { useState } from 'react';
import { auth, googleProvider } from '../firebase';
import {
  sendSignInLinkToEmail,
  signInWithPopup,
} from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';

function SignInModal({ onClose }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const saveUserLocally = (user) => {
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email?.split('@')[0],
      photoURL: user.photoURL,
    };
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleEmailLinkSignIn = async () => {
    setError('');
    if (!email) {
      setError('Please enter your email.');
      return;
    }
    setLoading(true);
    try {
      const actionCodeSettings = {
        url: 'https://lostfound-api.netlify.app',
        handleCodeInApp: true,
      };
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      localStorage.setItem('emailForSignIn', email);
      alert('📩 A sign-in link has been sent to your email.');
      onClose();
    } catch (err) {
      console.error('Email link error:', err);
      setError(err.message || 'Failed to send sign-in link.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      saveUserLocally(user);
      onClose();
    } catch (err) {
      console.error('Google auth error:', err);
      setError('Google Sign-In failed.');
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-2xl p-8 w-full max-w-md relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
          >
            &times;
          </button>
          <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>

          <div className="space-y-4">
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-black focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleEmailLinkSignIn}
              className="w-full bg-purple-600 text-white py-2 rounded-full hover:bg-purple-700 transition"
              disabled={loading}
            >
              {loading ? 'Sending Link...' : 'Sign In with Email'}
            </button>

            <div className="text-center text-gray-500">or</div>

            <button
              onClick={handleGoogleAuth}
              className="w-full border border-gray-300 py-2 rounded-full font-medium bg-white text-purple-700 hover:shadow"
            >
              Sign In with Google
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default SignInModal;
