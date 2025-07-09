// ✅ UPDATED: AuthContext.js (handles email link on load)
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "./firebase";
import {
  onAuthStateChanged,
  signOut,
  isSignInWithEmailLink,
  signInWithEmailLink
} from "firebase/auth";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    const tryEmailLinkSignIn = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = localStorage.getItem("emailForSignIn");
        if (!email) email = window.prompt("Enter your email to complete sign-in:");

        try {
          const result = await signInWithEmailLink(auth, email, window.location.href);
          const firebaseUser = result.user;

          const userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
            photoURL: firebaseUser.photoURL,
          };

          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
          sessionStorage.setItem("userToken", firebaseUser.accessToken);
          sessionStorage.setItem("userEmail", firebaseUser.email);
          localStorage.removeItem("emailForSignIn");
        } catch (err) {
          console.error("❌ Email link sign-in failed:", err);
        }
      }
    };

    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        sessionStorage.setItem("userToken", firebaseUser.accessToken);
        sessionStorage.setItem("userEmail", firebaseUser.email);
      } else {
        setUser(null);
        localStorage.removeItem("user");
        sessionStorage.removeItem("userToken");
        sessionStorage.removeItem("userEmail");
      }
    });

    tryEmailLinkSignIn();
    return () => unsub();
  }, []);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
