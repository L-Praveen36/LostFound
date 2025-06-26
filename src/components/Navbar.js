import React, { useState } from 'react';
import SignInModal from './SignInModal';
import AdminSignInModal from './AdminSignInModal';

function Navbar({ onAdminLogin }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showAdminSignIn, setShowAdminSignIn] = useState(false);

  return (
    <nav className="gradient-bg text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <lottie-player
              src="https://assets3.lottiefiles.com/packages/lf20_5tkzkblw.json"
              background="transparent"
              speed="1"
              style={{ width: '40px', height: '40px' }}
              loop
              autoPlay
            ></lottie-player>
            <span className="text-xl font-bold">CampusFind</span>
          </div>

          {/* Links */}
          <div className="hidden md:flex space-x-6">
            <a href="#home" className="hover:text-gray-200 transition">Home</a>
            <a href="#listings" className="hover:text-gray-200 transition">Browse Items</a>
            <a href="#report" className="hover:text-gray-200 transition">Report Item</a>
            <a href="#how-it-works" className="hover:text-gray-200 transition">How It Works</a>
          </div>

          {/* Buttons */}
          <div className="flex items-center space-x-3">
            {/* Admin button - LEFT */}
            <button
              onClick={() => setShowAdminSignIn(true)}
              className="px-4 py-2 rounded-full border border-white text-white hover:bg-white hover:text-purple-700 transition"
            >
              Admin
            </button>

            {/* Sign In button - RIGHT */}
            <button
              onClick={() => setShowSignIn(true)}
              className="px-4 py-2 rounded-full border border-white text-white hover:bg-white hover:text-purple-700 transition"
            >
              Sign In
            </button>

            {/* Mobile menu icon */}
            <button
              className="md:hidden text-white focus:outline-none"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pt-4">
            <div className="flex flex-col space-y-3">
              <a href="#home" className="block hover:text-gray-200 transition">Home</a>
              <a href="#listings" className="block hover:text-gray-200 transition">Browse Items</a>
              <a href="#report" className="block hover:text-gray-200 transition">Report Item</a>
              <a href="#how-it-works" className="block hover:text-gray-200 transition">How It Works</a>
              
              <button
                onClick={() => setShowAdminSignIn(true)}
                className="w-full text-left px-4 py-2 rounded-full bg-white text-purple-700 font-medium hover:bg-gray-100 transition"
              >
                Admin
              </button>
              <button
                onClick={() => setShowSignIn(true)}
                className="w-full text-left px-4 py-2 rounded-full border border-white text-white hover:bg-white hover:text-purple-700 transition"
              >
                Sign In
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showSignIn && (
        <SignInModal onClose={() => setShowSignIn(false)} />
      )}
      {showAdminSignIn && (
        <AdminSignInModal
          onClose={() => setShowAdminSignIn(false)}
          onSuccess={() => {
            setShowAdminSignIn(false);
            onAdminLogin(); // this will show the admin panel
          }}
        />
      )}
    </nav>
  );
}

export default Navbar;
