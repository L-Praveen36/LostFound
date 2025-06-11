import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import ReportForm from "./components/ReportForm";
import ItemList from "./components/ItemList";
import AdminPanel from "./components/AdminPanel";

import "./App.css";

function App() {
  return (
    <Router>
       <div className="min-h-screen bg-cyan-100">
      <div className="App" style={{ padding: "2rem" }}>
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Lost & Found Portal</h1>
          <nav className="space-x-4">
            <Link to="/" className="text-blue-500 underline">Home</Link>
            <Link to="/admin" className="text-red-500 underline">Admin</Link>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={
            <>
              <ReportForm />
              <hr className="my-4" />
              <ItemList />
            </>
          } />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
      </div>
    </Router>
  );
}

export default App;
