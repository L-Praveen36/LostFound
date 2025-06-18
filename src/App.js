import { useState } from "react";
import ImageSlider from "./components/ImageSlider";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { useAuth } from "./AuthContext"; // make sure this is imported


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
  
  const handleUploadClick = () => {
  if (!user) {
    alert("Please login to upload an item.");
    navigate("/login");
  } else {
    setShowForm(true);
  }
};
  // Redirect to correct admin route based on login state
  const handleAdminClick = () => {
    const token = sessionStorage.getItem("adminToken");
    if (token) {
      navigate("/admin");
    } else {
      navigate("/admin-login");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 relative">
      {/* Top Nav */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-2 md:space-y-0">
  <h1 className="text-3xl font-bold text-center md:text-left">LOST AND FOUND</h1>
  <div className="space-x-4">
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
        location.pathname === "/admin" || location.pathname === "/admin-login"
          ? "underline font-semibold"
          : ""
      }`}
    >
      Admin
    </button>
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
      {/* 3D Model Carousel */}
<div className="w-full max-w-5xl mx-auto mb-6">
  <ImageSlider />
</div>


      {/* Items List */}
      <ItemList filter={filter} search={search} />

      {/* Modal Report Form */}
      {showForm && (
        <ReportForm showForm={showForm} onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}

export default App;
