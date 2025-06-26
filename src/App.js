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
import SignInModal from './SignInModal';
import AdminSignInModal from './AdminSignInModal';

function App() {
  const [showSignIn, setShowSignIn] = useState(false); 
  const [showAdminSignIn, setShowAdminSignIn] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  return (
    <div className="font-sans bg-gray-50 text-gray-800">
      <Navbar onAdminLogin={() => setShowAdminPanel(true)} />
      <Hero />
      <Listings />
      <ReportForm />
      <Stats />           
      <HowItWorks />     
      <Future />
      <Footer />
      <ClaimModal />
      <ContactModal />
      {showAdminPanel && <AdminPanel onClose={() => setShowAdminPanel(false)} />}
      {showSignIn && <SignInModal onClose={() => setShowSignIn(false)} />}
      {showAdminSignIn && (
        <AdminSignInModal
          onClose={() => setShowAdminSignIn(false)}
          onSuccess={() => {
            setShowAdminSignIn(false);
            setShowAdminPanel(true);
          }}
        />
      )}
    </div>
  );
}

export default App;
