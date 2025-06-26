import React, { useEffect, useState } from 'react';

function ClaimModal() {
  const [visible, setVisible] = useState(false);
  const [item, setItem] = useState(null); // holds selected item

  useEffect(() => {
    const handleOpen = (e) => {
      setItem(e.detail);    // the clicked item from Listings
      setVisible(true);     // show the modal
    };

    window.addEventListener('openContactModal', handleOpen);
    return () => window.removeEventListener('openContactModal', handleOpen);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setItem(null);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const name = formData.get('name');
  const email = formData.get('email');
  

  try {
    const res = await fetch(`https://lostfound-api.onrender.com/api/items/${item._id}/claim`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email })
    });

    const data = await res.json();

    if (res.ok) {
      alert("✅ Claim submitted. Item marked as resolved.");
      handleClose();
    } else {
      alert("❌ Claim failed: " + (data.message || "Unknown error"));
    }
  } catch (err) {
    console.error("Claim error:", err);
    alert("❌ Server error while submitting claim.");
  }
};


  if (!visible || !item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="glass-card max-w-md w-full p-8 rounded-2xl relative">
        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          &#x2715;
        </button>

        <h3 className="text-2xl font-semibold mb-6">Claim: <span className="text-purple-600">{item.title}</span></h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm mb-1">Verification Question</label>
            <input className="input w-full" placeholder="Answer here..." required />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Your Name</label>
            <input className="input w-full" placeholder="Your name" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Email</label>
            <input type="email" className="input w-full" placeholder="you@example.com" required />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={handleClose} className="px-4 py-2 border rounded-full">
              Cancel
            </button>
            <button type="submit" className="neumorphic-btn px-6 py-2 rounded-full">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ClaimModal;
