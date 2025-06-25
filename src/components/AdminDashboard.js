// components/AdminDashboard.js
import React, { useState, useEffect } from 'react';

function AdminDashboard() {
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://lostfound-api.netlify.app/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });
      if (!res.ok) throw new Error('Login failed');
      const data = await res.json();
      localStorage.setItem('adminToken', data.token);
      setToken(data.token);
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  useEffect(() => {
    if (!token) return;
    fetch('https://lostfound-api.netlify.app/api/admin/items')
      .then(res => res.json())
      .then(setItems)
      .catch(console.error);
  }, [token]);

  const updateStatus = async (id, status) => {
    await fetch(`https://lostfound-api.netlify.app/api/admin/items/${id}/moderate`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    setItems(prev => prev.map(item => item._id === id ? { ...item, status } : item));
  };

  const resolveItem = async (id) => {
    await fetch(`https://lostfound-api.netlify.app/api/admin/items/${id}/resolve`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` }
    });
    setItems(prev => prev.map(item => item._id === id ? { ...item, resolved: true } : item));
  };

  const deleteItem = async (id) => {
    await fetch(`https://lostfound-api.netlify.app/api/admin/items/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    setItems(prev => prev.filter(item => item._id !== id));
  };

  if (!token) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <form onSubmit={handleLogin} className="glass-card p-8 rounded-xl w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6">Admin Login</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <input name="username" value={loginData.username} onChange={e => setLoginData({ ...loginData, username: e.target.value })} className="input mb-4" placeholder="Username" required />
          <input name="password" type="password" value={loginData.password} onChange={e => setLoginData({ ...loginData, password: e.target.value })} className="input mb-6" placeholder="Password" required />
          <button type="submit" className="neumorphic-btn w-full py-2">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-10">
      <h2 className="text-3xl font-bold text-center mb-8">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => (
          <div key={item._id} className="glass-card p-6 rounded-xl">
            <div className="flex justify-between mb-2">
              <h3 className="font-bold text-lg">{item.title}</h3>
              <span className="text-sm text-gray-500">{item.type}</span>
            </div>
            <p className="text-sm mb-2">{item.description}</p>
            <p className="text-xs text-gray-500 mb-2">Status: {item.status}</p>
            <div className="flex flex-wrap gap-2">
              {item.status !== 'approved' && <button onClick={() => updateStatus(item._id, 'approved')} className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">Approve</button>}
              {item.status !== 'rejected' && <button onClick={() => updateStatus(item._id, 'rejected')} className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-full">Reject</button>}
              {!item.resolved && <button onClick={() => resolveItem(item._id)} className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full">Mark Resolved</button>}
              <button onClick={() => deleteItem(item._id)} className="px-3 py-1 text-sm bg-gray-200 text-gray-800 rounded-full">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
