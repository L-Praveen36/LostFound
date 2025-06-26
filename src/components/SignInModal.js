import React from 'react';

function SignInModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="glass-card max-w-md w-full p-8 rounded-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h3 className="text-2xl font-semibold mb-6 text-center">Sign In</h3>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              className="w-full bg-gray-100 border-0 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="Your email"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              className="w-full bg-gray-100 border-0 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="Your password"
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="neumorphic-btn px-8 py-3 rounded-full font-medium text-purple-700"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignInModal;
