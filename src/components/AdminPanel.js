// components/AdminPanel.js
import React from 'react';

function AdminPanel({ visible, onClose }) {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="glass-card w-full max-w-5xl p-8 rounded-2xl relative overflow-y-auto max-h-screen">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          &#x2715;
        </button>
        <h3 className="text-2xl font-semibold mb-6">Admin Dashboard</h3>
        <div className="mb-6">
          <h4 className="text-lg font-medium mb-2">Pending Approvals</h4>
          <div className="bg-white bg-opacity-50 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="text-left">
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-2">Item</th>
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2">Location</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2">iPhone</td>
                  <td className="px-4 py-2">Electronics</td>
                  <td className="px-4 py-2">Library</td>
                  <td className="px-4 py-2 space-x-2">
                    <button className="text-green-600">Approve</button>
                    <button className="text-red-600">Reject</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
