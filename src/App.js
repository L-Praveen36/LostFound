// App.js
import React, { useState, useEffect } from 'react';
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
import { useAuth } from './AuthContext';

function App() {
  const { user } = useAuth();

  // 🔐 Auth/admin logic
  const [showSignIn, setShowSignIn] = useState(false);
  const [showAdminSignIn, setShowAdminSignIn] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // 🧾 Item modal state
  const [selectedClaimItem, setSelectedClaimItem] = useState(null);
  const [selectedContactItem, setSelectedContactItem] = useState(null);

  // ✅ Listen for modal open events from Listings
  useEffect(() => {
    const openClaimListener = (e) => {
      if (user) setSelectedClaimItem(e.detail);
      else setShowSignIn(true);
    };
    const openContactListener = (e) => {
      if (user) setSelectedContactItem(e.detail);
      else setShowSignIn(true);
    };

    window.addEventListener("openClaimModal", openClaimListener);
    window.addEventListener("openContactModal", openContactListener);

    return () => {
      window.removeEventListener("openClaimModal", openClaimListener);
      window.removeEventListener("openContactModal", openContactListener);
    };
  }, [user]);

  // 🔐 When admin logs in
  const handleAdminLogin = () => {
    setShowAdminSignIn(false);
    setShowAdminPanel(true);
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
      <ReportForm
        onRequireSignIn={() => setShowSignIn(true)}
        isSignedIn={!!user}
      />
      <Stats />
      <HowItWorks />
      <Future />
      <Footer />

      {/* 🔓 Admin Panel */}
      {showAdminPanel && <AdminPanel onClose={() => setShowAdminPanel(false)} />}
      {showSignIn && <SignInModal onClose={() => setShowSignIn(false)} />}
      {showAdminSignIn && (
        <AdminSignInModal
          onClose={() => setShowAdminSignIn(false)}
          onSuccess={handleAdminLogin}
        />
      )}

      {/* 🧾 Item Modals */}
      {selectedClaimItem && (
        <ClaimModal
          visible={true}
          item={selectedClaimItem}
          onClose={() => setSelectedClaimItem(null)}
        />
      )}
      {selectedContactItem && (
        <ContactModal
          visible={true}
          item={selectedContactItem}
          onClose={() => setSelectedContactItem(null)}
        />
      )}
    </div>
  );
}

export default App;
