import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";

import ReportForm from "./components/ReportForm";
import AdminPanel from "./components/AdminPanel";
import AdminLogin from "./components/AdminLogin";
import ItemList from "./components/ItemList"; // ✅ Make sure this is imported

import "./App.css";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-cyan-100">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin-login" element={<AdminLogin />} />
        </Routes>
      </div>
    </Router>
  );
}

function HomePage() {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");     // ✅ ADD THIS
  const [filter, setFilter] = useState("all");  // ✅ ADD THIS
  const location = useLocation();

  return (
    <div className="max-w-6xl mx-auto p-4 relative">
      {/* Top Nav */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-center my-4 mx-auto">LOST AND FOUND</h1>
        <div className="absolute top-6 right-6 space-x-4">
          <Link
            to="/"
            className={`text-lg ${location.pathname === "/" ? "underline font-semibold" : ""}`}
          >
            🏠 Home
          </Link>
          <Link
            to="/admin"
            className={`text-lg ${location.pathname === "/admin" ? "underline font-semibold" : ""} text-red-500`}
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
        <div className="w-40 h-32 bg-white border rounded-lg shadow flex items-center justify-center">Image 1</div>
        <div className="w-40 h-32 bg-white border rounded-lg shadow flex items-center justify-center">Image 2</div>
        <div className="w-40 h-32 bg-white border rounded-lg shadow flex items-center justify-center">Image 3</div>
      </div>

      {/* Search + Filter Section */}
      <div className="bg-white p-4 rounded shadow mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <input
          type="text"
          placeholder="🔍 Search for items"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-2/3 px-4 py-2 border border-gray-300 rounded"
        />
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
