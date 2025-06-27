import React, { useState } from 'react';

function ClaimModal({ visible, onClose, item }) {
  const [form, setForm] = useState({ rollNo: '', name: '', email: '' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  if (!visible || !item) return null;

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      const res = await fetch(`https://lostfound-api.onrender.com/api/items/${item._id}/claim`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to claim item');
      }

      setMessage('✅ Successfully claimed! Item marked as resolved.');
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 1500);
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="glass-card max-w-md w-full p-8 rounded-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          &#x2715;
        </button>
        <h3 className="text-2xl font-semibold mb-6">Claim This Item</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm mb-1">Roll No</label>
            <input
              name="rollNo"
              className="input w-full"
              placeholder="Enter your roll number"
              value={form.rollNo}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Name</label>
            <input
              name="name"
              className="input w-full"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">College Email</label>
            <input
              name="email"
              type="email"
              className="input w-full"
              placeholder="yourid@college.edu"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {message && <p className="text-sm mb-4 text-center">{message}</p>}

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-full">Cancel</button>
            <button
              type="submit"
              className="neumorphic-btn px-6 py-2 rounded-full"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Claim'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ClaimModal;
