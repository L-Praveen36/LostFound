// firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink
} from "firebase/auth";

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCWX1k4uNa8TPl7w5vbp_nSlcW19OHtE4k",
  authDomain: "lostfound-api.firebaseapp.com",
  projectId: "lostfound-api",
  storageBucket: "lostfound-api.appspot.com",
  messagingSenderId: "461112286783",
  appId: "1:461112286783:web:369ce7e89f6ad636baa28a",
  measurementId: "G-KE9MRH4SGF",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export auth & providers
export const auth = getAuth(app);
auth.useDeviceLanguage(); // Automatically use user’s browser language
export const googleProvider = new GoogleAuthProvider();

// ✅ Export for passwordless email link sign-in
export {
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink
};
