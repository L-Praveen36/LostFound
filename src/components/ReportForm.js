// components/ReportForm.js
import React, { useState } from 'react';

function ReportForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    type: '',
    location: '',
    date: '',
    contactInfo: '',
    submittedBy: '',
    userEmail: '',
    image: null
  });

  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    Object.keys(formData).forEach(key => form.append(key, formData[key]));

    try {
      const res = await fetch('https://lostfound-api.netlify.app/api/items', {
        method: 'POST',
        body: form
      });
      if (!res.ok) throw new Error('Failed to submit');
      setStatus('success');
      setFormData({
        title: '', description: '', category: '', type: '', location: '', date: '',
        contactInfo: '', submittedBy: '', userEmail: '', image: null
      });
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <section id="report" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Report Lost or Found Item</h2>

        <div className="glass-card max-w-3xl mx-auto p-8 rounded-2xl">
          {status === 'success' && <p className="text-green-600 text-center mb-4">Item submitted successfully!</p>}
          {status === 'error' && <p className="text-red-600 text-center mb-4">Submission failed. Please try again.</p>}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <input name="title" value={formData.title} onChange={handleChange} className="input" placeholder="Item Title" required />
              <select name="category" value={formData.category} onChange={handleChange} className="input" required>
                <option value="">Select Category</option>
                <option>Electronics</option>
                <option>Accessories</option>
                <option>Books</option>
                <option>Clothing</option>
                <option>Other</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <input name="location" value={formData.location} onChange={handleChange} className="input" placeholder="Location" required />
              <input name="date" type="date" value={formData.date} onChange={handleChange} className="input" required />
            </div>

            <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="input mb-6" placeholder="Description" required></textarea>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <input name="submittedBy" value={formData.submittedBy} onChange={handleChange} className="input" placeholder="Your Name" required />
              <input name="userEmail" type="email" value={formData.userEmail} onChange={handleChange} className="input" placeholder="Your Email" required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <input name="contactInfo" value={formData.contactInfo} onChange={handleChange} className="input" placeholder="Contact Info (Phone/Email)" required />
              <select name="type" value={formData.type} onChange={handleChange} className="input" required>
                <option value="">Lost or Found?</option>
                <option value="lost">Lost</option>
                <option value="found">Found</option>
              </select>
            </div>

            <div className="mb-6">
              <input name="image" type="file" accept="image/*" onChange={handleChange} className="input" />
            </div>

            <div className="text-center">
              <button type="submit" className="neumorphic-btn px-8 py-3 rounded-full font-medium text-purple-700">Submit Report</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default ReportForm;
