import { useState } from "react";
import { useAuth } from "./AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import ImageSlider from "./components/ImageSlider";
import Login from "./components/Login";
import Signup from "./components/Signup";
import LoginWarning from "./components/LoginWarning";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import ReportForm from "./components/ReportForm";
import AdminPanel from "./components/AdminPanel";
import AdminLogin from "./components/AdminLogin";
import ItemList from "./components/ItemList";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./components/Profile";

import { Menu } from "@headlessui/react"; // ✅ Install with: npm i @headlessui/react

import "./App.css";

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

function HomePage() {
  const [showForm, setShowForm] = useState(false);
  const [search] = useState("");
  const [filter] = useState("all");
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showWarning, setShowWarning] = useState(false);

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
      <header className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-2 md:space-y-0">
        <h1 className="text-3xl font-bold text-center md:text-left">
          LOST AND FOUND
        </h1>
        <div className="flex items-center space-x-4">
          <Link
            to="/"
            className={`text-lg ${
              location.pathname === "/" ? "underline font-semibold" : ""
            }`}
          >
            🏠 Home
          </Link>
          <button
            onClick={handleAdminClick}
            className={`text-lg text-red-500 ${
              location.pathname === "/admin" ||
              location.pathname === "/admin-login"
                ? "underline font-semibold"
                : ""
            }`}
          >
            Admin
          </button>

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

      {/* Items List */}
      <ItemList filter={filter} search={search} />

      {/* Report Form */}
      {showForm && (
        <ReportForm showForm={showForm} onClose={() => setShowForm(false)} />
      )}

      {/* Login Warning */}
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
