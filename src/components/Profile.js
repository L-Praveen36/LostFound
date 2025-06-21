import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [myItems, setMyItems] = useState([]);

  useEffect(() => {
    if (user) {
      fetch(`https://lostfound-api.onrender.com/api/items?userEmail=${encodeURIComponent(user.email)}`)

        .then(res => res.json())
        .then(data => setMyItems(data));
    }
  }, [user]);

  if (!user) return <p>Please log in to view your profile.</p>;

  return (
    <div className="max-w-3xl mx-auto mt-8 p-4">
      <h2 className="text-2xl font-bold mb-4">👤 Your Profile</h2>
      <p><strong>Name:</strong> {user.displayName || "Anonymous"}</p>
      <p><strong>Email:</strong> {user.email}</p>

      <h3 className="text-xl font-semibold mt-6 mb-2">📦 Your Items</h3>
      {myItems.length === 0 ? (
        <p>No items submitted yet.</p>
      ) : (
        <ul className="space-y-2">
          {myItems.map(item => (
            <li key={item._id} className="border rounded p-3 bg-white shadow">
              <p className="font-semibold">{item.title}</p>
              <p>{item.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Profile;
