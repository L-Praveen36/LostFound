// components/ProfileModal.js
import React, { useEffect, useState } from 'react';

function ProfileModal({ user, onClose }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    fetch(`https://lostfound-api.onrender.com/api/items?userEmail=${encodeURIComponent(user.email)}`)
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-start pt-16">
      <div className="bg-white max-w-4xl w-full rounded-2xl p-6 shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold mb-4">👤 My Profile</h2>
        <div className="mb-6">
          <p><strong>Name:</strong> {user.displayName}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>

        <h3 className="text-xl font-semibold mb-4">📦 My Submitted Items</h3>

        {loading ? (
          <p>Loading your items...</p>
        ) : items.length === 0 ? (
          <p className="text-gray-500">No items submitted yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {items.map(item => (
              <div key={item._id} className="glass-card p-4 rounded-xl">
                <img
                  src={item.imageUrl || 'https://via.placeholder.com/150x100?text=No+Image'}
                  alt={item.title}
                  className="w-full h-40 object-cover rounded-md mb-2"
                />
                <h4 className="font-bold">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.description}</p>
                <p className="text-xs text-gray-500 mt-1">{item.type} • {item.location}</p>
                {item.resolved && (
                  <span className="text-green-600 text-sm font-medium mt-1 block">✅ Resolved</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileModal;
