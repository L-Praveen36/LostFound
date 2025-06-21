import { useState } from "react";
import { useAuth } from "./AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { Menu } from "@headlessui/react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

import ImageSlider from "./components/ImageSlider";
import Login from "./components/Login";
import Signup from "./components/Signup";
import LoginWarning from "./components/LoginWarning";
import ReportForm from "./components/ReportForm";
import AdminPanel from "./components/AdminPanel";
import AdminLogin from "./components/AdminLogin";
import ItemList from "./components/ItemList";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./components/Profile";

import "./App.css";

// App Wrapper
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

// Home Page Component
function HomePage() {
  const [showForm, setShowForm] = useState(false);
  const [search] = useState("");
  const [filter] = useState("all");
  const { user } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const navigate = useNavigate();

  const handleUploadClick = () => {
    if (!user) {
      setShowWarning(true);
    } else {
      setShowForm(true);
    }
  };

  const handleAdminClick = () => {
    const token = sessionStorage.getItem("adminToken");
    navigate(token ? "/admin" : "/admin-login");
  };

  return (
    <div className="max-w-6xl mx-auto p-4 relative">
      {/* Header */}
      <header className="flex justify-between items-center mb-6 px-2">
        {/* Left: Hamburger */}
        <Menu as="div" className="relative">
          <Menu.Button className="p-2 rounded hover:bg-gray-100">
            <Bars3Icon className="h-6 w-6 text-gray-800" />
          </Menu.Button>
          <Menu.Items className="absolute left-0 mt-2 w-40 bg-white border rounded-md shadow-md z-50">
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

        {/* Center: Title */}
        <h1 className="text-3xl font-bold flex-1 text-center md:text-center">
          LOST AND FOUND
        </h1>

        {/* Right: Login/Profile */}
        <div className="flex items-center">
          {!user ? (
            <button
              onClick={() => navigate("/login")}
              className="text-lg text-blue-600"
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
                    className="w-8 h-8 rounded-full border"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white">
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
                      🔁 Login with another
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

      {/* Upload Button */}
      <div className="text-center mb-6">
        <button
          onClick={handleUploadClick}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          📤 Upload Lost or Found Item
        </button>
      </div>

      {/* Image Slider */}
      <div className="w-full max-w-5xl mx-auto mb-6">
        <ImageSlider />
      </div>

      {/* Items */}
      <ItemList filter={filter} search={search} />

      {/* Report Form Modal */}
      {showForm && (
        <ReportForm showForm={showForm} onClose={() => setShowForm(false)} />
      )}

      {/* Login Required Popup */}
      {showWarning && (
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
      )}
    </div>
  );
}

export default App;
