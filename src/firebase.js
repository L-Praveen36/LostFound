// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCWX1k4uNa8TPl7w5vbp_nSlcW19OHtE4k",
  authDomain: "lostfound-api.firebaseapp.com",
  projectId: "lostfound-api",
  storageBucket: "lostfound-api.firebasestorage.app",
  messagingSenderId: "461112286783",
  appId: "1:461112286783:web:369ce7e89f6ad636baa28a",
  measurementId: "G-KE9MRH4SGF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);