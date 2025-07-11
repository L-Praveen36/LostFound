import React, { useEffect } from 'react';

function ContactModal({ visible, onClose, item }) {
  if (!visible || !item || !item.userEmail || item.resolved) return null;

  const email = item.userEmail;
  const isEmail = /\S+@\S+\.\S+/.test(email);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleContact = () => {
    if (isEmail) {
      window.location.href = `mailto:${email}?subject=Regarding your Lost & Found item: ${item.title}`;
    } else {
      alert("No valid email found.");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade"
      tabIndex={-1}
    >
      <div className="glass-card max-w-md w-full p-8 rounded-2xl relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
          aria-label="Close modal"
        >
          &times;
        </button>

        <h3 className="text-2xl font-semibold mb-6 text-center">Contact Finder</h3>

        {isEmail ? (
          <div className="text-sm text-gray-700 space-y-4">
            <p>
              The finder has shared their email. You can click the button below to contact them.
            </p>

            <div className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-lg">
              <span className="text-blue-600 break-all">{email}</span>
              <button
                onClick={() => navigator.clipboard.writeText(email)}
                className="text-sm text-purple-600 hover:underline"
              >
                Copy
              </button>
            </div>

            <button
              onClick={handleContact}
              className="w-full bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700 transition"
            >
              Open Email App
            </button>
          </div>
        ) : (
          <div className="text-red-600 text-center font-medium">
            ⚠️ No valid email address found for this user.
          </div>
        )}
      </div>
    </div>
  );
}

export default ContactModal;
