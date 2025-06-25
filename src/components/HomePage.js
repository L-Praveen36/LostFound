import React, { useState, Suspense, lazy } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { Menu } from "@headlessui/react";
import { Bars3Icon } from "@heroicons/react/24/outline";

const ImageSlider = lazy(() => import("./ImageSlider"));
const ItemList = lazy(() => import("./ItemList"));
const ReportForm = lazy(() => import("./ReportForm"));
const LoginWarning = lazy(() => import("./LoginWarning"));

function HomePage() {
  const [showForm, setShowForm] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [filter] = useState("all");
  const [search] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleUploadClick = () => {
    if (!user) setShowWarning(true);
    else setShowForm(true);
  };

  const handleAdminClick = () => {
    const token = sessionStorage.getItem("adminToken");
    navigate(token ? "/admin" : "/admin-login");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 relative">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        {/* Hamburger Menu */}
        <Menu as="div" className="relative">
          <Menu.Button className="p-2 rounded hover:bg-gray-100">
            <Bars3Icon className="h-6 w-6 text-gray-800" />
          </Menu.Button>
          <Menu.Items className="absolute left-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-50">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => navigate("/")}
                  className={`w-full px-4 py-2 text-left text-sm ${
                    active ? "bg-gray-100" : ""
                  }`}
                >
                  🏠 Home
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleAdminClick}
                  className={`w-full px-4 py-2 text-left text-sm text-red-600 ${
                    active ? "bg-gray-100" : ""
                  }`}
                >
                  🛡️ Admin
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => navigate("/profile")}
                  className={`w-full px-4 py-2 text-left text-sm ${
                    active ? "bg-gray-100" : ""
                  }`}
                >
                  👤 Profile
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => alert("Help section coming soon!")}
                  className={`w-full px-4 py-2 text-left text-sm ${
                    active ? "bg-gray-100" : ""
                  }`}
                >
                  ❓ Help
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Menu>

        {/* Title */}
        <h1 className="text-4xl font-extrabold text-center flex-1 text-gray-800 tracking-wide drop-shadow-sm">
          LOST & FOUND
        </h1>

        {/* Login/Profile */}
        <div className="flex items-center">
          {!user ? (
            <button
              onClick={() => navigate("/login")}
              className="text-lg text-blue-600 hover:text-blue-800 font-semibold"
            >
              Login
            </button>
          ) : (
            <Menu as="div" className="relative">
              <Menu.Button>
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="profile"
                    className="w-9 h-9 rounded-full border"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
                    😊
                  </div>
                )}
              </Menu.Button>
              <Menu.Items className="absolute right-0 mt-2 w-48 bg-white border rounded shadow z-50">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => navigate("/profile")}
                      className={`w-full text-left px-4 py-2 ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      👤 My Profile
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`w-full text-left px-4 py-2 ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      ⚙️ Settings
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => navigate("/login")}
                      className={`w-full text-left px-4 py-2 ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      🔁 Switch Account
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`w-full text-left px-4 py-2 ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      ❓ Help
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => signOut(auth)}
                      className={`w-full text-left px-4 py-2 text-red-600 ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      🚪 Logout
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Menu>
          )}
        </div>
      </header>

      {/* Upload CTA */}
      <div className="text-center mb-8">
        <button
          onClick={handleUploadClick}
          className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold rounded-full hover:scale-105 transition transform duration-300 shadow-lg"
        >
          📤 Upload Lost or Found Item
        </button>
      </div>

      {/* Slider */}
      <div className="w-full max-w-5xl mx-auto mb-10">
        <Suspense fallback={<div>Loading slider...</div>}>
          <ImageSlider />
        </Suspense>
      </div>

      {/* Items */}
      <Suspense fallback={<div>Loading items...</div>}>
        <ItemList filter={filter} search={search} />
      </Suspense>

      {/* Upload Modal */}
      {showForm && (
        <Suspense fallback={<div>Loading form...</div>}>
          <ReportForm showForm={showForm} onClose={() => setShowForm(false)} />
        </Suspense>
      )}

      {/* Warning Modal */}
      {showWarning && (
        <Suspense fallback={<div>Loading warning...</div>}>
          <LoginWarning
            onClose={() => setShowWarning(false)}
            onLogin={() => {
              setShowWarning(false);
              navigate("/login");
            }}
            onSignup={() => {
              setShowWarning(false);
              navigate("/signup");
            }}
          />
        </Suspense>
      )}
    </div>
  );
}

export default HomePage;
