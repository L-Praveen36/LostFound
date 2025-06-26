import React from 'react';

function ContactModal({ visible, onClose, item }) {
  if (!visible || !item) return null;

  const isEmail = item.contactInfo && /\S+@\S+\.\S+/.test(item.contactInfo);

  const handleContact = () => {
    if (isEmail) {
      window.location.href = `mailto:${item.contactInfo}?subject=Regarding your Lost & Found Item: ${item.title}`;
    } else {
      alert("No valid email found to contact the finder.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="glass-card max-w-md w-full p-8 rounded-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          &#x2715;
        </button>

        <h3 className="text-2xl font-semibold mb-6">Contact Finder</h3>

        {isEmail ? (
          <div className="text-sm mb-4">
            <p className="mb-2 text-gray-700">
              You can reach the finder via email:
            </p>
            <p className="font-medium text-blue-600">{item.contactInfo}</p>
            <button
              onClick={handleContact}
              className="mt-4 w-full neumorphic-btn py-2 rounded-full"
            >
              Open Email App
            </button>
          </div>
        ) : (
          <div className="text-red-500">
            No valid email address available to contact this user.
          </div>
        )}
      </div>
    </div>
  );
}

export default ContactModal;
