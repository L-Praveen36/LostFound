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
  setLoading(true);
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    saveUserLocally(user);
    onClose();
  } catch (err) {
    console.error('Google auth error:', err);
    if (err.code === 'auth/popup-closed-by-user') {
      setError('Popup closed before sign-in. Please try again.');
    } else if (err.code === 'auth/cancelled-popup-request') {
      setError('Multiple popups detected. Please wait...');
    } else {
      setError('Google Sign-In failed. Try again later.');
    }
  } finally {
    setLoading(false);
  }
};


  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="glass-card p-8 w-full max-w-md rounded-2xl shadow-2xl relative border border-white border-opacity-20 bg-white bg-opacity-10 backdrop-blur-xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-red-400 text-xl"
          >
            &times;
          </button>
          <h2 className="text-2xl font-bold mb-6 text-center text-white">🔐 Sign In</h2>

          <div className="space-y-4">
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-60 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />

            <button
              onClick={handleEmailLinkSignIn}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-full transition font-semibold"
            >
              {loading ? 'Sending Link...' : 'Sign In with Email'}
            </button>

            <div className="text-center text-white opacity-70">or</div>

           <button
  onClick={handleGoogleAuth}
  disabled={loading}
  className={`w-full bg-white bg-opacity-20 text-white py-3 rounded-full border border-white border-opacity-30 hover:bg-white hover:bg-opacity-30 transition font-medium ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
>
  {loading ? 'Signing In...' : 'Sign In with Google'}
</button>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default SignInModal;
