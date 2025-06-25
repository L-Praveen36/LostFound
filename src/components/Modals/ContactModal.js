// components/ContactModal.js
import React from 'react';

function ContactModal({ visible, onClose }) {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="glass-card max-w-md w-full p-8 rounded-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          &#x2715;
        </button>
        <h3 className="text-2xl font-semibold mb-6">Contact Finder</h3>
        <form>
          <div className="mb-4">
            <textarea className="input w-full" rows="4" placeholder="Your message..." />
          </div>
          <div className="mb-4">
            <input className="input w-full" placeholder="Your name" />
          </div>
          <div className="mb-4">
            <input type="email" className="input w-full" placeholder="you@example.com" />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-full">Cancel</button>
            <button type="submit" className="neumorphic-btn px-6 py-2 rounded-full">Send</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContactModal;
