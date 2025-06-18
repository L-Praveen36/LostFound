import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// ✅ Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCWX1k4uNa8TPl7w5vbp_nSlcW19OHtE4k",
  authDomain: "lostfound-api.firebaseapp.com",
  projectId: "lostfound-api",
  storageBucket: "lostfound-api.appspot.com", // 🛠️ fixed this (was incorrect in your code)
  messagingSenderId: "461112286783",
  appId: "1:461112286783:web:369ce7e89f6ad636baa28a",
  measurementId: "G-KE9MRH4SGF",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export auth instance to use in AuthContext
export const auth = getAuth(app);
