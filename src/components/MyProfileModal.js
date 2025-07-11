// components/MyProfileModal.js
import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

function MyProfileModal({ onClose }) {
  const { user } = useAuth();
  const [userItems, setUserItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.email) return;

    const controller = new AbortController();

    fetch(`https://lostfound-api.onrender.com/api/items?userEmail=${user.email}`, {
      signal: controller.signal,
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to load items');
        return res.json();
      })
      .then(data => {
        setUserItems(data);
        setLoading(false);
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error('Error loading user items:', err);
          setError('Failed to load your items.');
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [user]);

  const handleResolve = async (itemId) => {
    if (!window.confirm("Are you sure you want to mark this item as resolved?")) return;

    try {
      const response = await fetch(`https://lostfound-api.onrender.com/api/items/${itemId}/resolve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      });

      if (!response.ok) throw new Error("Failed to resolve item");

      const updated = await response.json();
      setUserItems(prev =>
        prev.map(item => item._id === updated.item._id ? updated.item : item)
      );
      alert("✅ Item marked as resolved.");
    } catch (err) {
      console.error("Resolve failed:", err);
      alert("❌ Could not mark item as resolved.");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white max-w-3xl w-full p-6 rounded-2xl shadow-xl overflow-y-auto max-h-[90vh] relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
          >
            &times;
          </button>

          <h2 className="text-2xl text-black font-bold mb-4">👤 My Profile</h2>

          {user && (
            <div className="mb-6 flex items-center space-x-4">
              {user.photoURL && (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
              <div >
                <p className="text-amber-400"><strong>Name:</strong> {user.displayName || 'Not available'}</p>
                <p className="text-amber-400"><strong>Email:</strong> {user.email}</p>
              </div>
            </div>
          )}

          <h3 className="text-lg text-black font-semibold mb-3">📦 My Submitted Items</h3>

          {loading ? (
            <p className="text-gray-500">Loading your items...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : userItems.length === 0 ? (
            <p className="text-gray-600">
              You haven’t submitted any items yet.{' '}
              <a href="#report" className="text-purple-600 hover:underline">Submit one now</a>.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {userItems.map(item => (
                <article
                  key={item._id}
                  className={`bg-gray-100 rounded-xl p-4 shadow ${item.resolved ? 'opacity-70' : ''}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-lg">{item.title || 'Untitled'}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full 
                      ${item.type === 'lost' ? 'bg-yellow-200 text-yellow-800' : 'bg-blue-200 text-blue-800'}`}>
                      {item.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2 line-clamp-2">{item.description || 'No description'}</p>
                  <p className="text-xs text-gray-500">📍 {item.location || 'Unknown'}</p>
                  <p className="text-xs text-gray-500">🗂 Status: {item.status}</p>
                  <p className="text-xs text-gray-500">🎓 School ID: {item.studentId || 'Not provided'}</p>
                  {item.resolved && (
                    <p className="text-xs text-purple-600 font-semibold mt-1">✅ Resolved</p>
                  )}
                  {!item.resolved && (
                    <button
                      onClick={() => handleResolve(item._id)}
                      className="mt-3 px-4 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
                    >
                      Mark Resolved
                    </button>
                  )}
                </article>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default MyProfileModal;
