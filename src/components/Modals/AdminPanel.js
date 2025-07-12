import React, { useState, useEffect, useCallback } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const AdminPanel = ({ onClose }) => {
  const token = sessionStorage.getItem('adminToken');
  const [search, setSearch] = useState('');
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [highlightedId, setHighlightedId] = useState(null);

  const handleUnauthorized = () => {
    alert("⚠️ Session expired. Please sign in again.");
    sessionStorage.removeItem('adminToken');
    window.location.reload();
  };

  const fetchItems = useCallback(async () => {
    try {
      const response = await fetch('https://lostfound-api.onrender.com/api/admin/items', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        return;
      }

      const data = await response.json();
      data.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
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

      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        return;
      }

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

      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        return;
      }

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

  const handleFoundBySecurity = async (id, newValue) => {
    try {
      const response = await fetch(`https://lostfound-api.onrender.com/api/admin/items/${id}/found-by-security`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ foundBySecurity: newValue })
      });

      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        return;
      }

      if (response.ok) {
        fetchItems();
      } else {
        const err = await response.json();
        alert('Update failed: ' + (err.message || 'Unknown error'));
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

      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        return;
      }

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

  const formatDateDMY = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  const getStatusBadge = (status) => {
    const classes = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-700';
  };

  const filteredItems = items
    .filter(item => {
      const matchFilter =
        filter === 'all' ||
        (filter === 'pending' && item.status === 'approved' && !item.resolved) ||
        (filter === 'approved' && item.status === 'approved') ||
        (filter === 'rejected' && item.status === 'rejected') ||
        (filter === 'resolved' && item.resolved);

      const matchSearch =
        item.title?.toLowerCase().includes(search.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.toLowerCase()) ||
        item.location?.toLowerCase().includes(search.toLowerCase()) ||
        item.userEmail?.toLowerCase().includes(search.toLowerCase());

      return matchFilter && matchSearch;
    })
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 py-8 max-w-7xl mx-auto">
        <div className="glass-card rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-white">🛡️ Admin Panel</h2>
            <div className="flex items-center gap-4">
              <button onClick={onClose} className="px-4 py-2 bg-white bg-opacity-10 text-white rounded-full hover:bg-opacity-20">Close</button>
              <button onClick={() => { sessionStorage.removeItem('adminToken'); window.location.reload(); }} className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600">Logout</button>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            {['all', 'pending', 'approved', 'rejected', 'resolved'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${filter === status ? 'bg-purple-600 text-white' : 'bg-white bg-opacity-10 text-white hover:bg-opacity-20'}`}
              >
                {status}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Search items..."
            className="input mb-6 w-full px-4 py-2 rounded-lg bg-white bg-opacity-10 text-white placeholder-white placeholder-opacity-70 focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {loading ? (
            <Skeleton count={5} height={120} className="mb-4" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map(item => (
                <div key={item._id} className={`glass-card p-4 rounded-xl ${highlightedId === item._id ? 'ring-2 ring-purple-500' : ''}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                      <p className="text-sm text-white/80">{item.description}</p>
                    </div>
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt="" className="w-20 h-20 rounded-lg object-cover ml-4" />
                    ) : <Skeleton width={80} height={80} />}
                  </div>

                  <div className="text-sm text-white/80 space-y-1">
                    <p><strong>Location:</strong> {item.location}</p>
                    <p><strong>Date:</strong> {formatDateDMY(item.date || item.submittedAt)}</p>
                    <p><strong>Type:</strong> {item.type}</p>
                    <p><strong>Category:</strong> {item.category || 'N/A'}</p>
                    <p><strong>Submitted By:</strong> {item.submittedBy || 'N/A'}</p>
                    <p><strong>Email:</strong> {item.userEmail || 'N/A'}</p>
                    <p><strong>Phone:</strong> {item.phone || 'N/A'}</p>
                    <p><strong>School ID:</strong> {item.schoolId || 'N/A'}</p>
                    <p>
                      <strong>Status:</strong>{' '}
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(item.status)}`}>
                        {item.status}
                      </span>
                    </p>
                    {item.type === 'lost' && (
                      <div className="flex items-center gap-2 mt-2">
                        <input
                          type="checkbox"
                          checked={item.foundBySecurity}
                          onChange={() => handleFoundBySecurity(item._id, !item.foundBySecurity)}
                        />
                        <label>Found by Security</label>
                      </div>
                    )}
                    {item.resolved && (
                      <p className="text-purple-300 font-semibold mt-2">
                        ✅ Resolved {item.resolvedBy ? `by ${item.resolvedBy}` : ''}
                      </p>
                    )}
                    {item.resolved && item.claimedInfo && (
                      <div className="mt-3 p-3 bg-purple-100 bg-opacity-10 border border-purple-200 rounded-lg text-sm text-purple-100">
                        <p className="font-semibold mb-1">📦 Claimed By:</p>
                        <p><strong>👤 Name:</strong> {item.claimedInfo.name || 'N/A'}</p>
                        <p><strong>🎓 Roll No:</strong> {item.claimedInfo.rollNo || 'N/A'}</p>
                        <p><strong>📧 Email:</strong>{' '}
                          {item.claimedInfo.email ? (
                            <a href={`mailto:${item.claimedInfo.email}`} className="text-blue-300 underline">
                              {item.claimedInfo.email}
                            </a>
                          ) : 'N/A'}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex gap-2 flex-wrap">
                    {item.status === 'pending' && (
                      <>
                        <button onClick={() => moderateItem(item._id, 'approved')} className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600">Approve</button>
                        <button onClick={() => moderateItem(item._id, 'rejected')} className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600">Reject</button>
                      </>
                    )}
                    {item.status === 'approved' && !item.resolved && (
                      <button onClick={() => resolveItem(item._id)} className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700">Mark Resolved</button>
                    )}
                    <button onClick={() => handleDelete(item._id)} className="px-4 py-2 bg-white bg-opacity-10 text-white rounded-full hover:bg-opacity-20">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
