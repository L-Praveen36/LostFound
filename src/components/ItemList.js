import React, { useState, useEffect } from 'react';
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

const ItemList = () => {

  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(true);
  
  const [filter, setFilter] = useState('all');
const [search, setSearch] = useState('');

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('https://lostfound-api.onrender.com/api/items');
      const data = await response.json();
      setItems(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching items:', error);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://lostfound-api.onrender.com/api/categories');
      await response.json();
      
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  function formatDateDMY(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}


  const filteredItems = items.filter(item => {
  const matchesFilter =
    filter === 'all' ||
    item.type === filter ||
    (filter === 'resolved' && item.resolved);

  const matchesSearch =
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.description.toLowerCase().includes(search.toLowerCase()) ||
    item.location.toLowerCase().includes(search.toLowerCase());

  return matchesFilter && matchesSearch;
});


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">📱 Lost & Found Items</h2>

<div className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-col md:flex-row md:items-center gap-4">
  <input
    type="text"
    placeholder="🔍 Search for items"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
  />

  <div className="flex flex-wrap gap-2">
    {['all', 'lost', 'found', 'resolved'].map(type => (
      <button
        key={type}
        onClick={() => setFilter(type)}
        className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
          filter === type
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        {type}
      </button>
    ))}
  </div>
</div>


      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <div key={item._id} className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative ${
            item.resolved ? 'opacity-75' : ''
          }`}>
            
            {/* Resolved Badge Overlay */}
            {item.resolved && (
              <div className="absolute top-2 right-2 z-10">
                <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  ✅ Resolved
                </span>
              </div>
            )}

            {(item.imageUrl || item.image) && (
  <div className="h-48 bg-gray-200 flex items-center justify-center">
    <Zoom>
      <img
        src={item.imageUrl || item.image}
        alt={item.title}
        className="w-full h-full object-cover cursor-zoom-in"
        style={{ maxHeight: '12rem', maxWidth: '100%' }}
      />
    </Zoom>
  </div>
)}
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className={`text-xl font-semibold truncate ${
                  item.resolved ? 'text-gray-500 line-through' : 'text-gray-800'
                }`}>
                  {item.title}
                </h3>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.type === 'lost' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {item.type === 'lost' ? '❌ Lost' : '✅ Found'}
                  </span>
                  
                  {/* Resolved Badge in Header */}
                  {item.resolved && (
                    <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">
                      Resolved
                    </span>
                  )}
                </div>
              </div>
              
              <p className={`mb-4 line-clamp-3 ${
                item.resolved ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {item.description}
              </p>
              
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  <span className="font-medium">Category:</span>
                  <span className="ml-1">{item.category || 'Other'}</span>
                </div>
                
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  <span className="font-medium">Location:</span>
                  <span className="ml-1">{item.location}</span>
                </div>
                
                <div className="flex items-center">
                 <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                 <span className="font-medium">Date:</span>
                 <span className="ml-1">{formatDateDMY(item.date || item.submittedAt)}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
               {!item.resolved ? (
  <a
    href={
      /\S+@\S+\.\S+/.test(item.contactInfo || item.contact)
        ? `mailto:${item.contactInfo || item.contact}`
        : `tel:${(item.contactInfo || item.contact || '').replace(/[\s-]/g, '')}`
    }
    className="inline-block w-full text-center py-2 px-4 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors"
    style={{ textDecoration: "none" }}
  >
    {/\S+@\S+\.\S+/.test(item.contactInfo || item.contact)
      ? `✉️ Email: ${item.contactInfo || item.contact}`
      : `📞 Call: ${item.contactInfo || item.contact}`}
  </a>
) : (
  <button
    className="w-full block text-center py-2 px-4 rounded-lg font-medium bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none"
    disabled
  >
    🔒 Item Resolved
  </button>
)}




              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No items found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default ItemList;
