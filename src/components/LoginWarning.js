// src/components/LoginWarning.js
import React from "react";

const LoginWarning = ({ onClose, onLogin, onSignup }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 px-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-xl font-bold"
        >
          &times;
        </button>
        <h3 className="text-lg font-semibold mb-4 text-center text-gray-800">
          🔒 You must be logged in to upload items.
        </h3>
        <div className="flex justify-center gap-4">
          <button
            onClick={onLogin}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
          <button
            onClick={onSignup}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Signup
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginWarning;
