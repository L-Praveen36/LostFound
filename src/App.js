import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";

import ReportForm from "./components/ReportForm";
import ItemList from "./components/ItemList";
import AdminPanel from "./components/AdminPanel";
import AdminLogin from './components/AdminLogin';



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
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const location = useLocation();
  
  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Top Nav */}
      <header className="flex justify-between items-center mb-6">
       <h1 className="text-3xl font-bold text-center my-4">LOST AND FOUND</h1>
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


      {/* Search + Filter */}
      <div className="bg-white p-4 rounded shadow mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <input
          type="text"
          placeholder="🔍 Search for items"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full md:w-2/3 px-4 py-2 border border-gray-300 rounded"
        />
        <div className="flex gap-2 w-full md:w-1/3 justify-end">
          {["all", "lost", "found", "resolved"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-2 rounded ${
                filter === type ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>
      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              ✖
            </button>
            <ReportForm showForm={showForm} onClose={() => setShowForm(false)} />
          </div>
        </div>
      )}

      {/* Item List */}
      <ItemList filter={filter} search={search} />
    </div>
  );
}

export default App;
