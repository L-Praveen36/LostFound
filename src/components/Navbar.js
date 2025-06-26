import React, { useState } from 'react';
import { auth } from '../firebase';
import GoogleSignIn from './GoogleSignIn';

function Navbar({  onShowAdminSignIn }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));

  const handleSignOut = () => {
    auth.signOut();
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <nav className="gradient-bg text-white shadow-lg z-50 relative">
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

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6">
            <a href="#home" className="hover:text-gray-200 transition">Home</a>
            <a href="#listings" className="hover:text-gray-200 transition">Browse Items</a>
            <a href="#report" className="hover:text-gray-200 transition">Report Item</a>
            <a href="#how-it-works" className="hover:text-gray-200 transition">How It Works</a>
          </div>

          {/* Desktop Right Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={onShowAdminSignIn}
              className="px-4 py-2 rounded-full border border-white text-white hover:bg-white hover:text-purple-700 transition"
            >
              Admin
            </button>

            {!user ? (
              <GoogleSignIn onSuccess={(u) => setUser(u)} />
            ) : (
              <div className="relative group">
                <img src={user.photoURL} alt="profile" className="w-10 h-10 rounded-full cursor-pointer" />
                <div className="absolute right-0 mt-2 hidden group-hover:block bg-white text-black rounded-lg shadow-lg w-40 z-50">
                  <p className="px-4 py-2 hover:bg-gray-100 cursor-pointer">My Profile</p>
                  <p className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Help</p>
                  <p
                    onClick={handleSignOut}
                    className="px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer"
                  >
                    Sign Out
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu Items */}
        {menuOpen && (
          <div className="md:hidden pt-4">
            <div className="flex flex-col space-y-3">
              <a href="#home" className="block hover:text-gray-200 transition">Home</a>
              <a href="#listings" className="block hover:text-gray-200 transition">Browse Items</a>
              <a href="#report" className="block hover:text-gray-200 transition">Report Item</a>
              <a href="#how-it-works" className="block hover:text-gray-200 transition">How It Works</a>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  onShowAdminSignIn();
                }}
                className="block hover:text-gray-200 transition text-left"
              >
                Admin
              </button>

              {!user ? (
                <GoogleSignIn onSuccess={(u) => {
                  setUser(u);
                  setMenuOpen(false);
                }} />
              ) : (
                <div className="mt-4">
                  <img src={user.photoURL} className="w-10 h-10 rounded-full mx-auto" alt="user" />
                  <div className="mt-2 bg-white text-black rounded-lg shadow w-full text-center">
                    <p className="py-2 hover:bg-gray-100 cursor-pointer">My Profile</p>
                    <p className="py-2 hover:bg-gray-100 cursor-pointer">Help</p>
                    <p
                      onClick={handleSignOut}
                      className="py-2 text-red-500 hover:bg-gray-100 cursor-pointer"
                    >
                      Sign Out
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
