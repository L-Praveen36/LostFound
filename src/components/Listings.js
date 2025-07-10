import React, { useEffect, useState } from 'react';


function Listings() {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoomImage, setZoomImage] = useState(null);


useEffect(() => {
  const fetchItems = async (retries = 3) => {
    try {
      const res = await fetch('https://lostfound-api.onrender.com/api/items');
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setItems(data);
      setLoading(false);
    } catch (err) {
      if (retries > 0) {
        console.warn('Retrying fetch...');
        setTimeout(() => fetchItems(retries - 1), 2000); // Retry after 2 sec
      } else {
        console.error(err);
        setError('Unable to load items.');
        setLoading(false);
      }
    }
  };

  fetchItems();
}, []);


  useEffect(() => {
    let filteredItems = [...items];

    if (typeFilter === 'lost') {
      filteredItems = filteredItems.filter(item => item.type === 'lost');
    } else if (typeFilter === 'found') {
      filteredItems = filteredItems.filter(item => item.type === 'found');
    } else if (typeFilter === 'resolved') {
      filteredItems = filteredItems.filter(item => item.resolved);
    }

    if (search) {
      const q = search.toLowerCase();
      filteredItems = filteredItems.filter(item =>
        item.title?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.location?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q) ||
        new Date(item.date || item.submittedAt).toLocaleDateString().includes(q)
      );
    }

    setFiltered(filteredItems);
  }, [items, typeFilter, search]);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <section id="listings" className="py-20 bg-white relative">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          Browse Lost & Found Items
        </h2>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <input
            type="text"
            placeholder="🔍 Search title, location, category, date..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-2/3 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <div className="flex flex-wrap gap-2">
            {['all', 'lost', 'found', 'resolved'].map(type => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-4 py-2 rounded-full font-medium capitalize ${typeFilter === type
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Listings */}
        {loading ? (
          <p className="text-center text-gray-500">Loading items...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-400">No matching items found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(item => {
              const imageSrc = item.imageUrl || 'https://via.placeholder.com/500x300?text=No+Image';
              return (
                <div
                  key={item._id}
                  className={`item-card glass-card rounded-2xl overflow-hidden shadow-md transition-transform duration-300 hover:scale-[1.02] ${item.resolved ? 'opacity-80' : ''
                    }`}
                >
                  {/* Clickable Image */}
                  <div className="relative h-48 bg-gray-200 cursor-pointer" onClick={() => setZoomImage(imageSrc)}>
                    <img
                      src={imageSrc}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-medium shadow ${item.type === 'lost' ? 'bg-yellow-500 text-white' : 'bg-green-100 text-green-800'
                      }`}>
                      {item.type}
                    </div>
                    {item.resolved && (
                      <div className="absolute top-3 left-3 bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                        ✅ Resolved
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-semibold">{item.title}</h3>
                      <span className="text-sm text-gray-500">
                        {formatDate(item.date || item.submittedAt)}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-3">{item.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="category-chip bg-purple-100 text-purple-800">{item.category}</span>
                      <span className="category-chip bg-blue-100 text-blue-800">{item.location}</span>
                    </div>

                    {/* Actions */}
                    {!item.resolved && item.status === 'approved' && (
                      <div className="flex flex-col gap-2">
                        {item.type === 'lost' && item.foundBySecurity && !item.resolved && (
  <button
    onClick={() =>
      window.dispatchEvent(new CustomEvent('openClaimModal', { detail: item }))
    }
    className="bg-green-500 text-white py-2 rounded-full font-medium hover:bg-green-600 transition"
  >
    Claim This Item
  </button>
)}

                        {item.status === 'approved' && item.userEmail && (
                          <button
                            onClick={() =>
                              window.dispatchEvent(new CustomEvent('openContactModal', { detail: item }))
                            }
                            className="bg-blue-500 text-white py-2 rounded-full font-medium hover:bg-blue-600 transition"
                          >
                            Contact Finder
                          </button>
                        )}

                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal for Zoomed Image */}
      {zoomImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setZoomImage(null)}
        >
          <img src={zoomImage} alt="Zoomed" className="max-w-full max-h-full object-contain p-4" />
        </div>
      )}

    </section>
  );
}

export default Listings;
