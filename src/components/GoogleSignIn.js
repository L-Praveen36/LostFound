import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase'; // ✅ correct import

function GoogleSignIn({ onSuccess }) {
  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider); // ✅ use googleProvider
      const user = result.user;
      localStorage.setItem("user", JSON.stringify(user));
      onSuccess(user);
    } catch (error) {
      console.error("Google Sign-In error", error);
    }
  };

  return (
    <button onClick={handleSignIn} className="px-4 py-2 bg-white text-purple-700 rounded-full">
      Sign In with Google
    </button>
  );
}

export default GoogleSignIn;
