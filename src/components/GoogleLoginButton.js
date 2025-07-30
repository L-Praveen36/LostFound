// frontend/src/components/GoogleLoginButton.js
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

function GoogleLoginButton({ onSuccess }) {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      onSuccess(user); // send to backend or set context
    } catch (err) {
      console.error("Google sign-in error", err);
    }
  };

  return (
    <button onClick={handleLogin} className="btn btn-google">
      Sign in with Google
    </button>
  );
}

export default GoogleLoginButton;
