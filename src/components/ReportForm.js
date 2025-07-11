import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../AuthContext';
import { toast, ToastContainer } from 'react-toastify';

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
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Report Lost or Found Item</h2>
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl max-w-3xl mx-auto p-8 rounded-2xl">
          <div className="flex border-b border-white/20 mb-8">
            <button
              type="button"
              className={`px-4 py-2 font-medium rounded-t ${type === 'lost' ? 'bg-white/10 text-purple-300' : 'text-white/50 hover:text-white'}`}
              onClick={() => setType('lost')}
            >
              Lost Item
            </button>
            <button
              type="button"
              className={`px-4 py-2 font-medium rounded-t ${type === 'found' ? 'bg-white/10 text-purple-300' : 'text-white/50 hover:text-white'}`}
              onClick={() => setType('found')}
            >
              Found Item
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block mb-2">Item Name</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInput}
                  required
                  className="input"
                  placeholder="e.g. iPhone 12, Backpack"
                />
              </div>
              <div>
                <label className="block mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInput}
                  required
                  className="input"
                >
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
                    className={`px-4 py-2 rounded-lg border border-white/10 ${location === loc ? 'bg-purple-200/20 text-purple-300' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
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

            <div className="mb-6">
              <label className="block mb-2">Date Lost/Found</label>
              <input
                type="date"
                max={new Date().toISOString().split("T")[0]}
                className="input"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInput}
                className="input"
                rows="4"
                placeholder="Provide details, markings, colors, etc."
              ></textarea>
            </div>

            <div className="mb-6">
              <label className="block mb-2">Upload Photos (optional, less than 2 MB)</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImages}
                ref={fileInputRef}
                className="bg-white/10 border border-white/20 text-white w-full rounded-lg p-3"
              />
              {selectedImages.length > 0 && (
                <p className="text-sm text-purple-200 mt-2">{selectedImages.length} image(s) selected</p>
              )}
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="submittedBy"
                  value={formData.submittedBy}
                  onChange={handleInput}
                  className="input"
                  placeholder="Full Name"
                  required
                  readOnly={!!user}
                />
                <input
                  type="email"
                  name="userEmail"
                  value={formData.userEmail}
                  onChange={handleInput}
                  className="input"
                  placeholder="Email"
                  required
                  readOnly={!!user}
                />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInput}
                  className="input"
                  placeholder="Phone Number"
                  required
                />
                <input
                  type="text"
                  name="contactInfo"
                  value={formData.contactInfo}
                  onChange={handleInput}
                  className="input"
                  placeholder="Other contact info (optional email/R.no/etc)"
                />
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleInput}
                  className="input"
                  placeholder="Student ID (optional)"
                />
              </div>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="px-8 py-3 rounded-full font-medium text-purple-300 bg-white/10 hover:bg-purple-300/10 border border-white/20 transition-all flex items-center justify-center gap-2"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin w-5 h-5 text-purple-300" viewBox="0 0 24 24">
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
