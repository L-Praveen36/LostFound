import React, { useState } from 'react';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';

function ReportForm() {
  const [type, setType] = useState('lost');
  const [location, setLocation] = useState('Library');
  const [customLocation, setCustomLocation] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    date: '',
    contactInfo: '',
    submittedBy: '',
    userEmail: '',
    studentId: ''
  });
  const [ setMessage] = useState(null);

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImages = (e) => {
    setSelectedImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const locationToUse = location === 'Other' ? customLocation.trim() : location;

    if (!formData.title || !formData.description || !formData.category || !formData.contactInfo || !formData.submittedBy || !formData.userEmail || !locationToUse) {
      return setMessage("Please fill all required fields.");
    }

    const payload = new FormData();
    payload.append('type', type);
    payload.append('title', formData.title);
    payload.append('description', formData.description);
    payload.append('category', formData.category);
    payload.append('location', locationToUse);
    payload.append('date', formData.date || new Date().toISOString());
    payload.append('contactInfo', formData.contactInfo);
    payload.append('submittedBy', formData.submittedBy);
    payload.append('userEmail', formData.userEmail);
    if (formData.studentId) payload.append('studentId', formData.studentId);

    selectedImages.forEach(file => {
      payload.append('images', file);
    });

    try {
      await axios.post('/api/items', payload);
      toast.success("✅ Item submitted successfully!");

      // Reset form
      setFormData({});
      setSelectedImages([]);
      setCustomLocation('');
      setLocation('Library');
    } catch (err) {
      toast.error("❌ Submission failed: " + (err.response?.data?.message || err.message));
    }
  };

  const locationOptions = ['Library', 'Cafeteria', 'Dormitories', 'Sports Complex', 'Lecture Halls', 'Other'];

  return (
    <section id="report" className="py-20 bg-gray-50">
       <ToastContainer position="top-right" autoClose={5000} />
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Report Lost or Found Item</h2>

        <div className="glass-card max-w-3xl mx-auto p-8 rounded-2xl">
          <div className="flex border-b border-gray-200 mb-8">
            <button
              className={`px-4 py-2 font-medium border-b-2 ${type === 'lost' ? 'border-purple-600 text-purple-600' : 'text-gray-500'}`}
              onClick={() => setType('lost')}
            >
              Lost Item
            </button>
            <button
              className={`px-4 py-2 font-medium border-b-2 ${type === 'found' ? 'border-purple-600 text-purple-600' : 'text-gray-500'}`}
              onClick={() => setType('found')}
            >
              Found Item
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Title & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 mb-2">Item Name</label>
                <input type="text" name="title" onChange={handleInput} required className="input" placeholder="e.g. iPhone 12, Backpack" />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Category</label>
                <select name="category" onChange={handleInput} required className="input">
                  <option value="">Select Category</option>
                  <option>Electronics</option>
                  <option>Accessories</option>
                  <option>Books</option>
                  <option>Clothing</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            {/* Location */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Location</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-2">
                {locationOptions.map(loc => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setLocation(loc)}
                    className={`px-4 py-2 rounded-lg ${location === loc ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
              {location === 'Other' && (
                <input
                  type="text"
                  placeholder="Enter custom location"
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                  className="input mt-2"
                  required
                />
              )}
            </div>

            {/* Date */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Date Lost/Found</label>
              <input type="date" name="date" onChange={handleInput} className="input" />
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                onChange={handleInput}
                className="input"
                rows="4"
                placeholder="Provide details, markings, colors, etc."
              ></textarea>
            </div>

            {/* Upload */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Upload Photos (optional)</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImages}
                className="bg-white rounded-lg p-3 border border-gray-300 w-full"
              />
              {selectedImages.length > 0 && (
                <p className="text-sm text-gray-500 mt-2">{selectedImages.length} image(s) selected</p>
              )}
            </div>

            {/* Contact Info */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="text" name="submittedBy" onChange={handleInput} className="input" placeholder="Full Name" required />
                <input type="email" name="userEmail" onChange={handleInput} className="input" placeholder="Email" required />
                <input type="tel" name="contactInfo" onChange={handleInput} className="input" placeholder="Phone Number" required />
                <input type="text" name="studentId" onChange={handleInput} className="input" placeholder="Student ID (optional)" />
              </div>
            </div>

            <div className="text-center">
              <button type="submit" className="neumorphic-btn px-8 py-3 rounded-full font-medium text-purple-700">
                Submit Report
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default ReportForm;
