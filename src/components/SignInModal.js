import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase'; // Adjust path if needed

function SignInModal({ onClose, onSuccess }) {
  const [mode, setMode] = useState('otp'); // 'otp' or 'google'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const maskedEmail = (email) => {
    const [user, domain] = email.split('@');
    return user[0] + '***' + user.slice(-1) + '@' + domain;
  };

  const saveUserLocally = (user) => {
    const userData = {
      uid: user.uid || user.email,
      email: user.email,
      displayName: user.displayName || user.email?.split('@')[0],
      photoURL: user.photoURL || null,
      token: user.token || null,
    };
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      saveUserLocally(user);
      onSuccess(user.accessToken || '');
      onClose();
    } catch (err) {
      console.error(err);
      setError('Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setStep(2);
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        saveUserLocally({ email, token: data.token });
        onSuccess(data.token);
        onClose();
      } else {
        setError(data.message || 'Invalid OTP');
      }
    } catch (err) {
      setError('Network error');
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

        {/* Mode Switch */}
        <div className="flex justify-center space-x-4 mb-6">
          <button
            className={`px-4 py-2 rounded-full ${mode === 'otp'
              ? 'bg-purple-600 text-white'
              : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'}`}
            onClick={() => setMode('otp')}
          >
            Email OTP
          </button>
          <button
            className={`px-4 py-2 rounded-full ${mode === 'google'
              ? 'bg-purple-600 text-white'
              : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'}`}
            onClick={() => setMode('google')}
          >
            Google
          </button>
        </div>

        {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}

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

        {/* OTP Sign-In */}
        {mode === 'otp' && (
          <div>
            {step === 1 ? (
              <form onSubmit={handleSendOtp}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-3 mb-4 rounded-lg bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-60 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-full"
                >
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp}>
                <p className="text-sm text-white text-center mb-2">
                  Enter the OTP sent to {maskedEmail(email)}
                </p>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  required
                  className="w-full px-4 py-3 mb-4 rounded-lg bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-60 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-full"
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </form>
            )}
          </div>
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
