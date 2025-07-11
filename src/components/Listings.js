import React, { useEffect, useState, useMemo } from 'react';

// Constants
const FILTER_TYPES = ['all', 'lost', 'found', 'resolved'];

// Utility: Format date
const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, '0');
  const month = d.toLocaleString('default', { month: 'short' });
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

// Reusable Chip
const Chip = ({ text, colorClass }) => (
  <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
    {text}
  </span>
);

function Listings() {
  const [items, setItems] = useState([]);
  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoomImage, setZoomImage] = useState(null);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    const fetchItems = async (retries = 3) => {
      try {
        const res = await fetch('https://lostfound-api.onrender.com/api/items');
        if (!res.ok) throw new Error('Fetch failed');
        const data = await res.json();
        setItems(data);
        setLoading(false);
      } catch (err) {
        if (retries > 0) {
          setTimeout(() => fetchItems(retries - 1), 2000);
        } else {
          setError('Unable to load items.');
          setLoading(false);
        }
      }
    };
    fetchItems();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') setZoomImage(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const filtered = useMemo(() => {
    let filteredItems = [...items];
    if (typeFilter === 'lost') filteredItems = filteredItems.filter(i => i.type === 'lost');
    else if (typeFilter === 'found') filteredItems = filteredItems.filter(i => i.type === 'found');
    else if (typeFilter === 'resolved') filteredItems = filteredItems.filter(i => i.resolved);

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      filteredItems = filteredItems.filter(i =>
        i.title?.toLowerCase().includes(q) ||
        i.description?.toLowerCase().includes(q) ||
        i.location?.toLowerCase().includes(q) ||
        i.category?.toLowerCase().includes(q) ||
        new Date(i.date || i.submittedAt).toLocaleDateString().includes(q)
      );
    }
    return filteredItems;
  }, [items, typeFilter, debouncedSearch]);

  const handleLoadMore = () => setVisibleCount(v => v + 6);

  return (
    <section id="listings" className="py-20 bg-gradient-to-br from-[#0d0b1f] to-[#1a1330] text-white relative">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-extrabold text-center mb-10 text-[#ff4d4f]">
          Browse Lost & Found Items
        </h2>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <input
            type="text"
            placeholder="🔍 Search title, location, category, date..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-2/3 px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          <div className="flex flex-wrap gap-2">
            {FILTER_TYPES.map(type => (
              <button
                key={type}
                onClick={() => {
                  setTypeFilter(type);
                  setVisibleCount(6);
                }}
                className={`px-4 py-2 rounded-full font-medium capitalize transition-all ${
                  typeFilter === type
                    ? 'bg-[#ff4d4f] text-white shadow-lg'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Listings */}
        {loading ? (
          <p className="text-center text-purple-300">Loading items...</p>
        ) : error ? (
          <p className="text-center text-red-400">{error}</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-purple-200 italic">No items found. Try different filters.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.slice(0, visibleCount).map(item => {
                const imageSrc = item.imageUrl || 'https://via.placeholder.com/500x300?text=No+Image';
                return (
                  <div
                    key={item._id}
                    className={`glass-card bg-white/5 backdrop-blur-md p-5 rounded-2xl shadow-md border border-white/10 transition-transform hover:scale-[1.03] ${
                      item.resolved ? 'opacity-60' : ''
                    }`}
                  >
                    <div
                      className="relative h-48 cursor-pointer overflow-hidden rounded-xl group"
                      onClick={() => setZoomImage(imageSrc)}
                    >
                      <img
                        loading="lazy"
                        src={imageSrc}
                        alt={item.title || 'Lost/Found item'}
                        className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-110"
                      />
                      <div
                        className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow ${
                          item.type === 'lost' ? 'bg-yellow-500 text-black' : 'bg-green-300 text-green-900'
                        }`}
                      >
                        {item.type}
                      </div>
                      {item.resolved && (
                        <div className="absolute top-3 left-3 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                          ✅ Resolved
                        </div>
                      )}
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold">{item.title}</h3>
                        <span className="text-xs text-white/60">{formatDate(item.date || item.submittedAt)}</span>
                      </div>
                      <p className="text-sm text-white/80 line-clamp-3">{item.description}</p>

                      <div className="flex flex-wrap gap-2 mt-2">
                        <Chip text={item.category} colorClass="bg-purple-100 text-purple-900" />
                        <Chip text={item.location} colorClass="bg-blue-100 text-blue-900" />
                      </div>

                      {!item.resolved && item.status === 'approved' && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {item.type === 'lost' && item.foundBySecurity && (
                            <button
                              onClick={() =>
                                window.dispatchEvent(new CustomEvent('openClaimModal', { detail: item }))
                              }
                              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full transition"
                            >
                              Claim This Item
                            </button>
                          )}
                          {item.userEmail && (
                            <button
                              onClick={() =>
                                window.dispatchEvent(new CustomEvent('openContactModal', { detail: item }))
                              }
                              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition"
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

            {visibleCount < filtered.length && (
              <div className="text-center mt-10">
                <button
                  onClick={handleLoadMore}
                  className="px-6 py-3 bg-[#ff4d4f] text-white rounded-full font-semibold hover:bg-red-600 transition"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Zoom Image Modal */}
      {zoomImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setZoomImage(null)}
        >
          <img
            src={zoomImage}
            alt="Zoomed"
            className="max-w-full max-h-full object-contain p-4"
          />
        </div>
      )}
    </section>
  );
}

export default Listings;
