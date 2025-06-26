import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import HowItWorks from './components/HowItWorks';
import Listings from './components/Listings';
import ReportForm from './components/ReportForm';
import Future from './components/Future';
import Footer from './components/Footer';
import ClaimModal from './components/Modals/ClaimModal';
import ContactModal from './components/Modals/ContactModal';
import AdminPanel from './components/Modals/AdminPanel';
import SignInModal from './components/SignInModal';
import AdminSignInModal from './components/AdminSignInModal';

function App() {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showAdminSignIn, setShowAdminSignIn] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // ✅ Fix: define this function to pass it cleanly
  const handleAdminLogin = () => {
    setShowAdminSignIn(false); // Close the modal first
    setShowAdminPanel(true);   // Then show the admin panel
  };

  return (
    <div className="font-sans bg-gray-50 text-gray-800">
      <Navbar
        onAdminLogin={handleAdminLogin}
        onShowSignIn={() => setShowSignIn(true)}
        onShowAdminSignIn={() => setShowAdminSignIn(true)}
      />
      <Hero />
      <Listings />
      <ReportForm />
      <Stats />
      <HowItWorks />
      <Future />
      <Footer />

      {/* Modals */}
      <ClaimModal />
      <ContactModal />

      {showAdminPanel && <AdminPanel onClose={() => setShowAdminPanel(false)} />}
      {showSignIn && <SignInModal onClose={() => setShowSignIn(false)} />}
      {showAdminSignIn && (
        <AdminSignInModal
          onClose={() => setShowAdminSignIn(false)}
          onSuccess={handleAdminLogin} // ✅ This now works correctly
        />
      )}
    </div>
  );
}

export default App;
