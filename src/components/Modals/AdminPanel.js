import React, { useState, useEffect, useCallback } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const AdminPanel = () => {
  const token = sessionStorage.getItem('adminToken');
  const [search, setSearch] = useState('');
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [highlightedId, setHighlightedId] = useState(null);

  const fetchItems = useCallback(async () => {
    try {
      const response = await fetch('https://lostfound-api.onrender.com/api/admin/items', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      data.sort((a, b) => new Date(b.date || b.submittedAt) - new Date(a.date || a.submittedAt));
      setItems(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching items:', error);
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const moderateItem = async (id, status) => {
    if (!window.confirm(`Are you sure you want to ${status} this item?`)) return;
    try {
      const response = await fetch(`https://lostfound-api.onrender.com/api/admin/items/${id}/moderate`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status, moderatorName: 'Admin' })
      });
      if (response.ok) {
        setHighlightedId(id);
        fetchItems();
        setTimeout(() => setHighlightedId(null), 3000);
      } else {
        const err = await response.json();
        alert('Moderation failed: ' + (err.message || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const resolveItem = async (id) => {
    if (!window.confirm('Mark this item as resolved?')) return;
    try {
      const response = await fetch(`https://lostfound-api.onrender.com/api/admin/items/${id}/resolve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        setHighlightedId(id);
        fetchItems();
        setTimeout(() => setHighlightedId(null), 3000);
      } else {
        const err = await response.json();
        alert('Resolve failed: ' + (err.message || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      const response = await fetch(`https://lostfound-api.onrender.com/api/admin/items/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        fetchItems();
      } else {
        const err = await response.json();
        alert("Delete failed: " + (err.message || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
    }
  };

  function formatDateDMY(dateString) {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth()+1).toString().padStart(2,'0')}/${date.getFullYear()}`;
  }

  const getStatusBadge = (status) => {
    const classes = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-700';
  };

  const filteredItems = items.filter(item => {
    const matchFilter =
      filter === 'all' ||
      (filter === 'pending' && item.status === 'pending') ||
      (filter === 'approved' && item.status === 'approved') ||
      (filter === 'rejected' && item.status === 'rejected') ||
      (filter === 'resolved' && item.resolved);
    const matchSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase()) ||
      (item.userEmail && item.userEmail.toLowerCase().includes(search.toLowerCase()));
    return matchFilter && matchSearch;
  });

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">🛡️ Admin Panel</h2>
        <button
          onClick={() => {
            sessionStorage.removeItem('adminToken');
            window.location.reload();
          }}
          className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      <div className="glass-card p-6 rounded-2xl shadow-lg">
        <div className="flex flex-wrap gap-2 mb-4">
          {['all', 'pending', 'approved', 'rejected', 'resolved'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${filter === status ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              {status}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search items..."
          className="input mb-6"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading ? (
          <Skeleton count={5} height={120} className="mb-4" />
        ) : (
          filteredItems.map(item => (
            <div key={item._id} className={`mb-4 p-4 rounded-xl border ${highlightedId === item._id ? 'ring-2 ring-purple-500' : ''} bg-white bg-opacity-60 backdrop-blur-lg shadow-md`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p><strong>Location:</strong> {item.location}</p>
                    <p><strong>Type:</strong> {item.type} | <strong>Date:</strong> {formatDateDMY(item.date || item.submittedAt)}</p>
                    <p><strong>Status:</strong> <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(item.status)}`}>{item.status}</span></p>
                    {item.resolved && <p className="text-purple-600 font-semibold">✅ Resolved</p>}
                  </div>
                </div>
                <div className="ml-4">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt="" className="w-20 h-20 rounded-lg object-cover" />
                  ) : (
                    <Skeleton width={80} height={80} />
                  )}
                </div>
              </div>

              <div className="mt-4 flex gap-2 flex-wrap">
                {item.status === 'pending' && (
                  <>
                    <button onClick={() => moderateItem(item._id, 'approved')} className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600">Approve</button>
                    <button onClick={() => moderateItem(item._id, 'rejected')} className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600">Reject</button>
                  </>
                )}
                {item.status === 'approved' && !item.resolved && (
                  <button onClick={() => resolveItem(item._id)} className="px-4 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600">Mark Resolved</button>
                )}
                <button onClick={() => handleDelete(item._id)} className="px-4 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-800">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
