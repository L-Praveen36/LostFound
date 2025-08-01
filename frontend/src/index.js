// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeContext';
import 'react-toastify/dist/ReactToastify.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>           {/* ✅ Theme first */}
      <AuthProvider>          {/* ✅ Then Auth */}
        <App />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
