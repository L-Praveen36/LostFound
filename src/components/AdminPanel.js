import React, { useState, useEffect, useCallback } from 'react';
import { Link , useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';


const AdminPanel = () => {
 const token = sessionStorage.getItem('adminToken');
 
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [highlightedId, setHighlightedId] = useState(null);
  const navigate = useNavigate();

useEffect(() => {
  const checkAuth = () => {
    if (!sessionStorage.getItem("adminToken")) {
     navigate('/admin-login', { replace: true }); // ⛔ Avoid history entry
    }
  };

  checkAuth(); // On load

  const handlePageShow = (e) => {
    if (e.persisted || performance.getEntriesByType("navigation")[0]?.type === "back_forward") {
      checkAuth(); // Prevent showing cached admin panel after logout
    }
  };

  window.addEventListener("pageshow", handlePageShow);
  return () => {
    window.removeEventListener("pageshow", handlePageShow);
  };
}, [navigate]);





 // ✅ Define fetchItems using useCallback to satisfy ESLint
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

  // 🧠 Call fetchItems once
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const moderateItem = async (itemId, status) => {
  const confirmed = window.confirm(`Are you sure you want to ${status} this item?`);
  if (!confirmed) return;

  try {
    const token = sessionStorage.getItem('adminToken'); // ✅ get token again here
    const response = await fetch(`https://lostfound-api.onrender.com/api/admin/items/${itemId}/moderate`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` // ✅ pass token here
      },
      body: JSON.stringify({ status, moderatorName: 'Admin' })
    });

    if (response.ok) {
      alert(`Item ${status}`);
      setHighlightedId(itemId);
      fetchItems();
      setTimeout(() => setHighlightedId(null), 3000);
    } else if (response.status === 401) {
  alert("Session expired. Please log in again.");
  sessionStorage.removeItem("adminToken");
  navigate('/admin-login', { replace: true });

    }else {
      const err = await response.json();
      alert('Moderation failed: ' + (err.message || 'Unknown error'));
    }
  } catch (error) {
    console.error('Error moderating item:', error);
  }
};


  const resolveItem = async (itemId) => {
  const confirmed = window.confirm('Mark this item as resolved?');
  if (!confirmed) return;

  try {
    const token = sessionStorage.getItem('adminToken');
    const response = await fetch(`https://lostfound-api.onrender.com/api/admin/items/${itemId}/resolve`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` // ✅ Add this line
      }
    });

    if (response.ok) {
  alert("Item marked as resolved");
  setHighlightedId(itemId);
  fetchItems();
  setTimeout(() => setHighlightedId(null), 3000);
} else if (response.status === 401) {
  alert("Session expired. Please log in again.");
  sessionStorage.removeItem("adminToken");
  navigate('/admin-login', { replace: true });

} else {
  const err = await response.json();
  alert("Failed to resolve: " + (err.message || "Unknown error"));
}

  } catch (error) {
    console.error('Error resolving item:', error);
  }
};

  function formatDateDMY(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}


  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return badges[status] || badges.pending;
  };

  if (loading) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-4">
        {Array(4).fill().map((_, i) => (
          <div key={i} className="p-4 border rounded-lg shadow">
            <Skeleton height={25} width="40%" className="mb-2" />
            <Skeleton height={15} count={3} />
          </div>
        ))}
      </div>
    </div>
  );
}

const filteredItems = items.filter(item => {
  if (filter === 'all') return true;

  if (filter === 'resolved') return item.resolved === true;

  if (filter === 'pending') return item.status === 'approved' && !item.resolved; // FIXED: Pending = approved but not resolved
  if (filter === 'approved') return item.status === 'approved';
  if (filter === 'rejected') return item.status === 'rejected';

  return true;
});



  return (
    
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-6">
  <h2 className="text-xl font-bold">🛡️ Admin Panel</h2>
  <div className="space-x-4 flex items-center">
     <Link to="/" className="text-blue-500 underline">🏠Home</Link>
    <span className="text-red-300 cursor-default">Admin</span>
    <button
  onClick={() => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      sessionStorage.removeItem('adminToken');
      navigate('/admin-login', { replace: true });
     // window.location.reload();
    }
  }}
  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
>
  Logout
</button>

  </div>
</header>


      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard title="Total Items" count={items.length} color="blue" />
<StatCard
  title="Pending"
  count={items.filter(i => i.status === 'approved' && !i.resolved).length}
  color="yellow"
/>
<StatCard
  title="Approved"
  count={items.filter(i => i.status === 'approved' && !i.resolved).length}
  color="green"
/>
<StatCard
  title="Rejected"
  count={items.filter(i => i.status === 'rejected').length}
  color="red"
/>
<StatCard
  title="Resolved"
  count={items.filter(i => i.resolved).length}
  color="purple"
/>

        </div>

        {/* Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {['all', 'pending', 'approved', 'rejected', 'resolved'].map(status => (
  <button
    key={status}
    onClick={() => setFilter(status)}
    className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
      filter === status
        ? 'bg-blue-500 text-white'
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    }`}
  >
    {status}
  </button>
))}

          </div>
        </div>

        {/* Item List */}
        <div className="space-y-4">
          {filteredItems.map(item => (
            <div
              key={item._id}
              className={`border rounded-lg p-4 transition-shadow ${
                highlightedId === item._id ? 'ring-2 ring-blue-400' : 'hover:shadow-md'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.type === 'lost' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {item.type}
                    </span>
                    {item.resolved && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Resolved
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-2">{item.description}</p>
                  <div className="text-sm text-gray-500">
                    <p>Category: {item.category || 'Other'} | Location: {item.location}</p>
                    <p>Contact: {item.contactInfo || item.contact} | Submitted by: {item.submittedBy || 'Anonymous'}</p>
                    <p>Date: {formatDateDMY(item.date || item.submittedAt)}</p>
                    {item.moderatedBy && (
                      <p>Moderated by: {item.moderatedBy} on {new Date(item.moderatedAt).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>

                {(item.imageUrl || item.image) ? (
  <img
    src={item.imageUrl || item.image}
    alt={item.title}
    className="w-20 h-20 object-cover rounded-lg"
  />
) : (
  <Skeleton height={80} width={80} />
)}

              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex gap-2 flex-wrap">
                {item.status === 'pending' && (
                  <>
                    <button
                      onClick={() => moderateItem(item._id, 'approved')}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => moderateItem(item._id, 'rejected')}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Reject
                    </button>
                  </>
                )}
                {item.status === 'approved' && !item.resolved && (
                  <button
                    onClick={() => resolveItem(item._id)}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    Mark as Resolved
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No items found for the selected filter.</p>
          </div>
        )}
      </div>
    </div>
  );

};

// Small card component for stats
const StatCard = ({ title, count, color }) => (
  <div className={`bg-${color}-50 p-4 rounded-lg`}>
    <h3 className={`text-lg font-semibold text-${color}-800`}>{title}</h3>
    <p className={`text-2xl font-bold text-${color}-600`}>{count}</p>
  </div>
);

export default AdminPanel;
