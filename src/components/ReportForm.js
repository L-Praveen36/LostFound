import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ReportForm({ isSignedIn, onRequireSignIn }) {
  const { user } = useAuth();
  const [type, setType] = useState('lost');
  const [location, setLocation] = useState('Library');
  const [customLocation, setCustomLocation] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    date: '',
    submittedBy: user?.displayName || '',
    userEmail: user?.email || '',
    studentId: '',
    phone: '',
    contactInfo: '',
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      submittedBy: user?.displayName || '',
      userEmail: user?.email || '',
    }));
  }, [user]);

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImages = (e) => {
    setSelectedImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isSignedIn) {
      onRequireSignIn();
      return;
    }

    setSubmitting(true);
    const locationToUse = location === 'Other' ? customLocation.trim() : location;

    if (!formData.title || !formData.description || !formData.category || !formData.submittedBy || !formData.userEmail || !locationToUse) {
      toast.error("Please fill all required fields.");
      setSubmitting(false);
      return;
    }

    const payload = new FormData();
    payload.append('type', type);
    payload.append('title', formData.title);
    payload.append('description', formData.description);
    payload.append('category', formData.category);
    payload.append('location', locationToUse);
    payload.append('date', formData.date || new Date().toISOString());
    payload.append('submittedBy', formData.submittedBy);
    payload.append('userEmail', formData.userEmail);
    payload.append('phone', formData.phone);
    if (formData.contactInfo) payload.append('contactInfo', formData.contactInfo);
    if (formData.studentId) payload.append('studentId', formData.studentId);
    selectedImages.forEach((file) => payload.append('images', file));

    try {
      await axios.post('https://lostfound-api.onrender.com/api/items', payload);
      toast.success("✅ Item submitted successfully!");

      // Reset
      setFormData({
        title: '',
        description: '',
        category: '',
        date: '',
        submittedBy: user?.displayName || '',
        userEmail: user?.email || '',
        studentId: '',
        phone: '',
        contactInfo: '',
      });
      setSelectedImages([]);
      setCustomLocation('');
      setLocation('Library');
      fileInputRef.current.value = '';
    } catch (err) {
      toast.error("❌ Submission failed: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const locationOptions = ['Library', 'Cafeteria', 'Dormitories', 'Sports Complex', 'Lecture Halls', 'Other'];

  return (
    <section id="report" className="py-20 text-white">
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Report Lost or Found Item</h2>
        
        <div className="glass-card max-w-3xl mx-auto p-8 rounded-2xl">
          <div className="flex border-b border-white/20 mb-8">
            <button
              type="button"
              className={`btn-secondary rounded-t px-6 py-2 ${type === 'lost' ? 'text-purple-300 bg-white/10' : 'text-white/50 hover:text-white'}`}
              onClick={() => setType('lost')}
            >
              Lost Item
            </button>
            <button
              type="button"
              className={`btn-secondary rounded-t px-6 py-2 ${type === 'found' ? 'text-purple-300 bg-white/10' : 'text-white/50 hover:text-white'}`}
              onClick={() => setType('found')}
            >
              Found Item
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block mb-2">Item Name</label>
                <input type="text" name="title" className="input" placeholder="e.g. iPhone 12, Backpack" value={formData.title} onChange={handleInput} required />
              </div>
              <div>
                <label className="block mb-2">Category</label>
                <select name="category" className="input" value={formData.category} onChange={handleInput} required>
                  <option value="">Select Category</option>
                  <option>Electronics</option>
                  <option>Accessories</option>
                  <option>Books</option>
                  <option>Clothing</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block mb-2">Location</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-2">
                {locationOptions.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setLocation(loc)}
                    className={`btn-secondary px-4 py-2 rounded-lg border border-white/10 ${location === loc ? 'bg-purple-300/10 text-purple-200' : 'hover:bg-white/10'}`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
              {location === 'Other' && (
                <input type="text" className="input mt-2" placeholder="Enter custom location" value={customLocation} onChange={(e) => setCustomLocation(e.target.value)} required />
              )}
            </div>

            <div className="mb-6">
              <label className="block mb-2">Date Lost/Found</label>
              <input type="date" max={new Date().toISOString().split("T")[0]} className="input" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
            </div>

            <div className="mb-6">
              <label className="block mb-2">Description</label>
              <textarea name="description" className="input" rows="4" placeholder="Provide details, markings, colors, etc." value={formData.description} onChange={handleInput}></textarea>
            </div>

            <div className="mb-6">
              <label className="block mb-2">Upload Photos (optional, &lt;2MB each)</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImages}
                ref={fileInputRef}
                className="input"
              />
              {selectedImages.length > 0 && (
                <p className="text-sm text-purple-200 mt-2">{selectedImages.length} image(s) selected</p>
              )}
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input name="submittedBy" className="input" placeholder="Full Name" value={formData.submittedBy} onChange={handleInput} required readOnly={!!user} />
                <input name="userEmail" type="email" className="input" placeholder="Email" value={formData.userEmail} onChange={handleInput} required readOnly={!!user} />
                <input name="phone" type="tel" className="input" placeholder="Phone Number" value={formData.phone} onChange={handleInput} required />
                <input name="contactInfo" className="input" placeholder="Other contact info (optional)" value={formData.contactInfo} onChange={handleInput} />
                <input name="studentId" className="input" placeholder="Student ID (optional)" value={formData.studentId} onChange={handleInput} />
              </div>
            </div>

            <div className="text-center">
              <button type="submit" className="btn-primary px-8 py-3 flex items-center justify-center gap-2" disabled={submitting}>
                {submitting ? (
                  <>
                    <svg className="animate-spin w-5 h-5 text-purple-200" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Submit Report'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default ReportForm;
