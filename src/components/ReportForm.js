import React, { useRef, useState, useEffect } from 'react';
import { useAuth } from "../AuthContext";
import { useNavigate } from 'react-router-dom'; // ✅

const ReportForm = ({ showForm, onClose }) => {
  const modalRef = useRef();
  const { user } = useAuth();
  const navigate = useNavigate(); // ✅

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    type: 'lost',
    location: '',
    date: '',
    contactInfo: '',
    submittedBy: ''
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const categories = [
    'Electronics', 'Clothing', 'Books', 'Accessories', 'Documents',
    'Keys', 'Bags', 'Sports Equipment','Bicycle', 'Jewelry', 'Other'
  ];
  const handleClickOutside = (e) => {
  if (modalRef.current && !modalRef.current.contains(e.target)) {
    onClose();
  }
}; // ✅ Move this above useEffect
   // Close on outside click
  useEffect(() => {
    if (showForm) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden"; // prevent background scroll
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto"; // re-enable scroll
    };
  }, [showForm, onClose]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!user) {
    setMessage("❌ Please log in to submit an item.");
    return;
  }
    setLoading(true);
    setMessage('');

    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key]);
    });
    submitData.append('userId', user.uid);
  submitData.append('userEmail', user.email);
    if (image) {
      submitData.append('image', image);
    }

    try {
      const response = await fetch('https://lostfound-api.onrender.com/api/items', {
        method: 'POST',
        body: submitData
      });
     const data = await response.json(); 
      if (response.ok) {
        setMessage('Item submitted successfully! It will be reviewed by our team.');
        setFormData({
          title: '',
          description: '',
          category: '',
          type: 'lost',
          location: '',
          date: '',
          contactInfo: '',
          submittedBy: ''
        });
        setImage(null);
      } else {
        setMessage("❌ Submission failed: " + (data.message || "Try again."));
      }
    } catch (err) {
      setMessage("❌ Error submitting form.");
    } finally {
      setLoading(false);
    }
  };
    
   if (!showForm) return null;
   if (!user) {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md text-center">
        <p className="text-red-600 text-lg font-medium mb-4">Please login to report a lost or found item.</p>
        <button
          onClick={onClose}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
}


  return (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center px-4">
      <div ref={modalRef} className="bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6 relative">

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-xl font-bold"
        >
          &times;
        </button>
    <h2 className="text-3xl font-bold text-gray-800 mb-6">📝 Report Lost/Found Item</h2>
        
        {message && (
          <div className={`mb-4 p-4 rounded-lg ${
            message.includes('successfully') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Item Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., iPhone 12, Blue Backpack"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type *
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="lost"
                  checked={formData.type === 'lost'}
                  onChange={handleChange}
                  className="mr-2"
                />
                ❌ Lost
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="found"
                  checked={formData.type === 'found'}
                  onChange={handleChange}
                  className="mr-2"
                />
                ✅ Found
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Provide detailed description..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Library, Computer Lab, Cafeteria"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              max={new Date().toISOString().split("T")[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Information *
            </label>
            <input
              type="text"
              name="contactInfo"
              value={formData.contactInfo}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Email or phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name *
            </label>
            <input
              type="text"
              name="submittedBy"
              value={formData.submittedBy}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Report'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportForm;
