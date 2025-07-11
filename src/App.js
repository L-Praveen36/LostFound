import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import HowItWorks from './components/HowItWorks';
import Listings from './components/Listings';
import ReportForm from './components/ReportForm';
import Future from './components/Future';
import Footer from './components/Footer';
import MyProfileModal from './components/MyProfileModal';
import ClaimModal from './components/Modals/ClaimModal';
import ContactModal from './components/Modals/ContactModal';
import AdminPanel from './components/Modals/AdminPanel';
import SignInModal from './components/SignInModal';
import AdminSignInModal from './components/AdminSignInModal';
import QrModal from './components/Modals/QrModal';

import { useAuth } from './AuthContext';

function App() {
  const { user } = useAuth();

  // 🧾 Modal state
  const [showSignIn, setShowSignIn] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAdminSignIn, setShowAdminSignIn] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(() => !!sessionStorage.getItem('adminToken'));
  const [showQr, setShowQr] = useState(false);

  const [selectedClaimItem, setSelectedClaimItem] = useState(null);
  const [selectedContactItem, setSelectedContactItem] = useState(null);

  // 🔔 Listen for custom modal open events
  useEffect(() => {
    const handleOpenClaim = (e) => {
      user ? setSelectedClaimItem(e.detail) : setShowSignIn(true);
    };

    const handleOpenContact = (e) => {
      user ? setSelectedContactItem(e.detail) : setShowSignIn(true);
    };

    const handleOpenAdminPanel = () => setShowAdminPanel(true);
    const handleOpenQr = () => setShowQr(true);

    window.addEventListener("openClaimModal", handleOpenClaim);
    window.addEventListener("openContactModal", handleOpenContact);
    window.addEventListener("openAdminPanel", handleOpenAdminPanel);
    window.addEventListener("openQrModal", handleOpenQr);

    return () => {
      window.removeEventListener("openClaimModal", handleOpenClaim);
      window.removeEventListener("openContactModal", handleOpenContact);
      window.removeEventListener("openAdminPanel", handleOpenAdminPanel);
      window.removeEventListener("openQrModal", handleOpenQr);
    };
  }, [user]);

  // ✅ Admin sign-in success
  const handleAdminLogin = (token) => {
    sessionStorage.setItem('adminToken', token);
    setShowAdminSignIn(false);
    setShowAdminPanel(true);
  };

  return (
  <div className="relative font-sans min-h-screen text-white">


    <Navbar
      onAdminLogin={handleAdminLogin}
      onShowSignIn={() => setShowSignIn(true)}
      onShowAdminSignIn={() => setShowAdminSignIn(true)}
    />

    <Hero />
    <Listings />
    <ReportForm
      isSignedIn={!!user}
      onRequireSignIn={() => setShowSignIn(true)}
    />
    <Stats />
    <HowItWorks />
    <Future />
    <Footer />

    {/* 🔐 Admin */}
    {showAdminPanel && <AdminPanel onClose={() => setShowAdminPanel(false)} />}
    {showAdminSignIn && (
      <AdminSignInModal
        onClose={() => setShowAdminSignIn(false)}
        onSuccess={handleAdminLogin}
      />
    )}

    {/* 🔐 User */}
    {showSignIn && <SignInModal onClose={() => setShowSignIn(false)} />}

    {/* 🧾 Item modals */}
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

    {/* 📱 QR Modal */}
    {showQr && <QrModal onClose={() => setShowQr(false)} />}

      {showProfile && <MyProfileModal onClose={() => setShowProfile(false)} />}

  </div>
);
}

export default App;
