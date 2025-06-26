import React, { useState } from 'react';

function ClaimModal({ visible, onClose, item }) {
  const [form, setForm] = useState({ name: '', email: '', answer: '' });
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
        body: JSON.stringify({ name: form.name, email: form.email })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to claim item');
      }

      setMessage('✅ Item successfully claimed!');
      setTimeout(() => {
        setSubmitting(false);
        onClose();
        window.location.reload(); // 🔁 Refresh listings to reflect resolved status
      }, 1500);
    } catch (err) {
      setMessage(`❌ ${err.message}`);
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
            <label className="block text-sm mb-1">Verification Answer</label>
            <input
              name="answer"
              className="input w-full"
              placeholder="Describe the item to verify ownership"
              value={form.answer}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Your Name</label>
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
            <label className="block text-sm mb-1">Your Email</label>
            <input
              name="email"
              type="email"
              className="input w-full"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {message && (
            <p className={`text-sm mb-4 ${message.startsWith('✅') ? 'text-green-600' : 'text-red-500'}`}>
              {message}
            </p>
          )}

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-full">
              Cancel
            </button>
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
