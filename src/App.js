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

function App() {
  const [adminVisible, setAdminVisible] = useState(false);

  return (
    <div className="font-sans bg-gray-50 text-gray-800">
      <Navbar onAdminLogin={() => setAdminVisible(true)} />
      <Hero />
      <Stats />
      <HowItWorks />
      <Listings />
      <ReportForm />
      <Future />
      <Footer />

      {/* Global modals */}
      <ClaimModal />
      <ContactModal />
      {adminVisible && <AdminPanel onClose={() => setAdminVisible(false)} />}
    </div>
  );
}

export default App;
