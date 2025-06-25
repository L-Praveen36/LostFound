// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Listings from './components/Listings';
import ReportForm from './components/ReportForm';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="font-sans bg-gray-50 text-gray-800">
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <Listings />
                <ReportForm />
                <Footer />
              </>
            }
          />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;