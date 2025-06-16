import { useState } from "react";
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
      <header className="flex flex-col md:flex-row justify-between items-center mb-6 relative">
  <h1 className="text-3xl font-bold text-center md:text-left">LOST AND FOUND</h1>

  <div className="mt-4 md:mt-0 md:absolute md:top-6 md:right-6 space-x-4">
    <Link
      to="/"
      className={`text-lg ${location.pathname === "/" ? "underline font-semibold" : ""}`}
    >
      🏠 Home
    </Link>
    <Link
      to="/admin-login"
      className={`text-lg ${location.pathname === "/admin-login" ? "underline font-semibold" : ""} text-red-500`}
    >
      Admin
    </Link>
  </div>
</header>


      {/* Upload Button */}
      <div className="text-center mb-6">
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          📤 Upload Lost or Found Item
        </button>
      </div>

      {/* Image Cards */}
      <div className="flex justify-center items-center space-x-4 mb-6">
        <div className="w-40 h-32 bg-white border rounded-lg shadow flex items-center justify-center">
          Image 1
        </div>
        <div className="w-40 h-32 bg-white border rounded-lg shadow flex items-center justify-center">
          Image 2
        </div>
        <div className="w-40 h-32 bg-white border rounded-lg shadow flex items-center justify-center">
          Image 3
        </div>
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
