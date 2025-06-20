// src/AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
  const unsub = onAuthStateChanged(auth, (firebaseUser) => {
    setUser(firebaseUser);
    if (firebaseUser) {
      sessionStorage.setItem("userToken", firebaseUser.accessToken); // optional
      sessionStorage.setItem("userEmail", firebaseUser.email);
    } else {
      sessionStorage.removeItem("userToken");
      sessionStorage.removeItem("userEmail");
    }
  });
  return () => unsub();
}, []);


  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};
