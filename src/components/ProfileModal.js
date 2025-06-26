import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';

function MyProfileModal({ onClose }) {
  const { user } = useAuth();
  const [userItems, setUserItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;
    fetch(`https://lostfound-api.netlify.app/api/items?userEmail=${user.email}`)
      .then(res => res.json())
      .then(data => {
        setUserItems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading user items:', err);
        setLoading(false);
      });
  }, [user]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white max-w-3xl w-full p-6 rounded-2xl shadow-xl overflow-y-auto max-h-[90vh] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          &#x2715;
        </button>
        <h2 className="text-2xl font-bold mb-4">👤 My Profile</h2>

        {user && (
          <div className="mb-6">
            <p><strong>Name:</strong> {user.displayName || 'N/A'}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        )}

        <h3 className="text-lg font-semibold mb-3">📦 My Submitted Items</h3>

        {loading ? (
          <p>Loading your items...</p>
        ) : userItems.length === 0 ? (
          <p>No items submitted yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {userItems.map(item => (
              <div key={item._id} className="bg-gray-100 rounded-xl p-4 shadow">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-lg">{item.title}</h4>
                  <span className="text-sm px-2 py-1 rounded-full bg-blue-200 text-blue-800">
                    {item.type}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2 line-clamp-2">{item.description}</p>
                <p className="text-xs text-gray-500">Location: {item.location}</p>
                <p className="text-xs text-gray-500">Status: {item.status}</p>
                {item.resolved && (
                  <p className="text-xs text-purple-600 font-semibold mt-1">✅ Resolved</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyProfileModal;
