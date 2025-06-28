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

function App() {
  // 🔐 Admin state
  const [showSignIn, setShowSignIn] = useState(false);
  const [showAdminSignIn, setShowAdminSignIn] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(() => !!sessionStorage.getItem('adminToken'));

  // 🧾 Modals for item actions
  const [selectedClaimItem, setSelectedClaimItem] = useState(null);
  const [selectedContactItem, setSelectedContactItem] = useState(null);

  // ✅ Listen for modal open events
  useEffect(() => {
    const openClaimListener = (e) => setSelectedClaimItem(e.detail);
    const openContactListener = (e) => setSelectedContactItem(e.detail);
    const openAdminListener = () => setShowAdminPanel(true);

    window.addEventListener('openClaimModal', openClaimListener);
    window.addEventListener('openContactModal', openContactListener);
    window.addEventListener('openAdminPanel', openAdminListener);

    return () => {
      window.removeEventListener('openClaimModal', openClaimListener);
      window.removeEventListener('openContactModal', openContactListener);
      window.removeEventListener('openAdminPanel', openAdminListener);
    };
  }, []);

  // 🔐 When admin logs in
  const handleAdminLogin = () => {
    sessionStorage.setItem('adminToken', 'valid'); // Mark session
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
      <ReportForm />
      <Stats />
      <HowItWorks />
      <Future />
      <Footer />

      {/* Admin */}
      {showAdminPanel && <AdminPanel onClose={() => setShowAdminPanel(false)} />}
      {showAdminSignIn && (
        <AdminSignInModal
          onClose={() => setShowAdminSignIn(false)}
          onSuccess={handleAdminLogin}
        />
      )}
      {showSignIn && <SignInModal onClose={() => setShowSignIn(false)} />}

      {/* Item Modals */}
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
