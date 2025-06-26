// components/ReportForm.js
import React, { useState } from 'react';

const categories = ['Electronics', 'Accessories', 'Books', 'Clothing', 'Other'];
const locations = ['Library', 'Cafeteria', 'Dormitories', 'Sports Complex', 'Lecture Halls', 'Other'];

function ReportForm() {
  const [mode, setMode] = useState('lost');
  const [formData, setFormData] = useState({
    itemName: '',
    category: '',
    location: '',
    date: '',
    description: '',
    fullName: '',
    email: '',
    phone: '',
    studentId: '',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value,
    }));
  };

  const handleLocationClick = (loc) => {
    setFormData((prev) => ({ ...prev, location: loc }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    Object.entries({ ...formData, type: mode }).forEach(([key, val]) => {
      if (val) payload.append(key, val);
    });

    try {
      const res = await fetch('/api/items', {
        method: 'POST',
        body: payload,
      });
      if (!res.ok) throw new Error('Failed to submit report');
      alert('Report submitted successfully');
      setFormData({
        itemName: '', category: '', location: '', date: '', description: '',
        fullName: '', email: '', phone: '', studentId: '', image: null,
      });
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <section id="report" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Report Lost or Found Item</h2>

        <div className="glass-card max-w-3xl mx-auto p-8 rounded-2xl">
          <div className="flex border-b border-gray-200 mb-8">
            <button
              className={`px-4 py-2 font-medium border-b-2 ${mode === 'lost' ? 'border-purple-600 text-purple-600' : 'text-gray-500 hover:text-purple-600'}`}
              onClick={() => setMode('lost')}
            >
              Lost Item
            </button>
            <button
              className={`px-4 py-2 font-medium ${mode === 'found' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-500 hover:text-purple-600'}`}
              onClick={() => setMode('found')}
            >
              Found Item
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 mb-2">Item Name</label>
                <input name="itemName" value={formData.itemName} onChange={handleChange} type="text" className="w-full bg-gray-100 border-0 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none" placeholder="e.g. iPhone 12, Calculus Book" />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-gray-100 border-0 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none">
                  <option value="">Select Category</option>
                  {categories.map(cat => <option key={cat}>{cat}</option>)}
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Location</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {locations.map(loc => (
                  <button
                    key={loc}
                    type="button"
                    className={`px-4 py-2 rounded-lg ${formData.location === loc ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}
                    onClick={() => handleLocationClick(loc)}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Date Lost/Found</label>
              <input name="date" value={formData.date} onChange={handleChange} type="date" className="w-full md:w-1/2 bg-gray-100 border-0 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none" />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="4" placeholder="Provide detailed description including any identifying marks, colors, contents, etc."
                className="w-full bg-gray-100 border-0 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none"></textarea>
            </div>

            <div className="mb-8">
              <label className="block text-gray-700 mb-2">Upload Photos</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input name="image" type="file" accept="image/*" onChange={handleChange} className="hidden" id="photo-upload" />
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  <p className="mt-2 text-sm text-gray-600">Click to upload or drag & drop</p>
                </label>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2">Full Name</label>
                  <input name="fullName" value={formData.fullName} onChange={handleChange} type="text" placeholder="Your name" className="w-full bg-gray-100 border-0 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="Your email" className="w-full bg-gray-100 border-0 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Phone</label>
                  <input name="phone" value={formData.phone} onChange={handleChange} type="tel" placeholder="Your phone number" className="w-full bg-gray-100 border-0 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Student ID</label>
                  <input name="studentId" value={formData.studentId} onChange={handleChange} type="text" placeholder="Optional for verification" className="w-full bg-gray-100 border-0 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none" />
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button type="submit" className="neumorphic-btn px-8 py-3 rounded-full font-medium text-purple-700">Submit Report</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default ReportForm;
