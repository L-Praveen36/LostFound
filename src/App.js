import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

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

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Top header */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">LOST AND FOUND</h1>
        <nav className="space-x-4">
          <Link to="/" className="text-blue-600 text-lg">🏠 Home</Link>
          <Link to="/admin" className="text-red-600 text-lg">Admin</Link>
        </nav>
      </header>

      {/* Upload Button */}
      <div className="text-center mb-6">
        <button
          onClick={() => setShowForm(prev => !prev)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md"
        >
          📤 Upload Lost or Found Item
        </button>
      </div>

      {/* Featured Image Section (centered) */}
      <div className="flex justify-center items-center space-x-4 mb-6">
        <div className="w-40 h-32 bg-white border rounded-lg shadow flex items-center justify-center">Image 1</div>
        <div className="w-40 h-32 bg-white border rounded-lg shadow flex items-center justify-center">Image 2</div>
        <div className="w-40 h-32 bg-white border rounded-lg shadow flex items-center justify-center">Image 3</div>
      </div>

      {/* Toggle Report Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <ReportForm />
        </div>
      )}

      {/* Search and filter section */}
      <div className="bg-white p-4 rounded shadow mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <input
          type="text"
          placeholder="🔍 Search for items"
          className="w-full md:w-2/3 px-4 py-2 border border-gray-300 rounded"
        />
        <select className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded">
          <option value="all">All</option>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* Recent Images or Item List */}
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-3">📸 Recent Items</h2>
        <ItemList />
      </div>
    </div>
  );
}

export default App;
