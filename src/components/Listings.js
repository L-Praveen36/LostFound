import React, { useEffect, useState } from 'react';

function Listings() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://lostfound-api.onrender.com/api/items')

      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch items');
        return res.json();
      })
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Unable to load items.');
        setLoading(false);
      });
  }, []);

  return (
    <section id="listings" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">Browse Lost & Found Items</h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading items...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map(item => (
              <div
                key={item._id}
                className={`item-card glass-card rounded-2xl overflow-hidden shadow-md transition-transform duration-300 hover:scale-[1.02] ${item.resolved ? 'opacity-80' : ''}`}
              >
                <div className="relative h-48 bg-gray-200">
                  <img
                    src={item.imageUrl || 'https://via.placeholder.com/500x300?text=No+Image'}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-medium shadow ${item.type === 'lost' ? 'bg-yellow-500 text-white' : 'bg-white text-black'}`}>
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
                      {new Date(item.submittedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-3">{item.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="category-chip bg-purple-100 text-purple-800">{item.category}</span>
                    <span className="category-chip bg-blue-100 text-blue-800">{item.location}</span>
                  </div>

                  <button
                    onClick={() => window.dispatchEvent(new CustomEvent('openContactModal', { detail: item }))}
                    className="w-full neumorphic-btn py-2 rounded-full font-medium"
                  >
                    {item.type === 'lost' ? 'Contact Finder' : 'Claim This Item'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Listings;
