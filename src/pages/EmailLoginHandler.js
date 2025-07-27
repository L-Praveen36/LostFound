// src/pages/EmailLoginHandler.js
import { useEffect, useState } from 'react';
import {
  auth,
  isSignInWithEmailLink,
  signInWithEmailLink
} from '../firebase';

function EmailLoginHandler() {
  const [message, setMessage] = useState('Checking sign-in...');

  useEffect(() => {
    async function completeEmailSignIn() {
      const email = localStorage.getItem('emailForSignIn');
      if (!email) {
        setMessage('No email found. Please try signing in again.');
        return;
      }

      try {
        const result = await signInWithEmailLink(auth, email, window.location.href);
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
        setMessage('Signed in successfully!');
        window.location.href = '/'; // Redirect to homepage or dashboard
      } catch (error) {
        console.error('Error:', error);
        setMessage('Sign-in failed.');
      }
    }

    if (isSignInWithEmailLink(auth, window.location.href)) {
      completeEmailSignIn();
    }
  }, []);

  return <div className="text-white p-6">{message}</div>;
}

export default EmailLoginHandler;
