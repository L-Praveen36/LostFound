import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  auth,
  googleProvider,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from '../firebase';
import { signInWithPopup } from 'firebase/auth';

function SignInModal({ onClose = () => {}, onSuccess = () => {} }) {
  const [mode, setMode] = useState('email'); // 'email' or 'google'
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle automatic sign-in if redirected via email link
  useEffect(() => {
    const url = window.location.href;
    if (isSignInWithEmailLink(auth, url)) {
      const storedEmail = window.localStorage.getItem('emailForSignIn');
      const promptEmail = !storedEmail ? window.prompt('Please enter your email') : storedEmail;

      if (!promptEmail) return;

      signInWithEmailLink(auth, promptEmail, url)
        .then(async (result) => {
          const user = result.user;
          const token = await user.getIdToken();
          const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email.split('@')[0],
            photoURL: user.photoURL,
            token,
          };
          localStorage.setItem('user', JSON.stringify(userData));
          window.localStorage.removeItem('emailForSignIn');
          onSuccess(userData);
          onClose();
        })
        .catch((error) => {
          console.error('Email link sign-in error:', error);
          setError('Failed to sign in with email link.');
        });
    }
  }, [onClose, onSuccess]);

  const handleGoogleSignIn = async () => {
    setError('');
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
      localStorage.setItem('user', JSON.stringify(userData));
      onSuccess(userData);
      onClose();
    } catch (err) {
      console.error('Google sign-in error:', err);
      setError('Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSendLink = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const actionCodeSettings = {
  url: 'https://lostfound-api.netlify.app',  // ✅ Static root URL — NOT window.location.href
  handleCodeInApp: true,
};


      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      setMessage(`Sign-in link sent to ${email}`);
    } catch (err) {
      console.error('Send sign-in link error:', err);
      setError('Failed to send sign-in link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="backdrop-blur-md bg-white bg-opacity-10 border border-white border-opacity-20 rounded-2xl p-8 w-full max-w-md shadow-2xl"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-white">Sign In</h2>

        <div className="flex justify-center space-x-4 mb-6">
          <button
            className={`px-4 py-2 rounded-full ${mode === 'email' ? 'bg-purple-600' : 'bg-white bg-opacity-20'} text-white`}
            onClick={() => setMode('email')}
          >
            Email Link
          </button>
          <button
            className={`px-4 py-2 rounded-full ${mode === 'google' ? 'bg-purple-600' : 'bg-white bg-opacity-20'} text-white`}
            onClick={() => setMode('google')}
          >
            Google
          </button>
        </div>

        {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}
        {message && <p className="text-green-400 text-sm text-center mb-4">{message}</p>}

        {/* Google Sign-In */}
        {mode === 'google' && (
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full transition font-semibold"
          >
            {loading ? 'Signing in...' : 'Continue with Google'}
          </button>
        )}

        {/* Email Link Sign-In */}
        {mode === 'email' && (
          <form onSubmit={handleSendLink}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-3 mb-4 rounded-lg bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-60 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-full"
            >
              {loading ? 'Sending link...' : 'Send Sign-In Link'}
            </button>
          </form>
        )}

        <button
          onClick={onClose}
          className="mt-6 w-full text-white text-sm hover:underline"
        >
          Cancel
        </button>
      </motion.div>
    </div>
  );
}

export default SignInModal;
