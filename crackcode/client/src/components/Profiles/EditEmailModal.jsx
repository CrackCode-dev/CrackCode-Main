import React, { useState } from 'react';
import axios from 'axios';
import Button from '../ui/Button';

const EditEmailModal = ({ isOpen, onClose, currentEmail, backendUrl, onSuccess }) => {
  const [formData, setFormData] = useState({
    newEmail: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await axios.put(
        `${backendUrl}/api/profile/email`,
        formData,
        { withCredentials: true }
      );

      if (response.data.success) {
        setSuccess('Email updated successfully!');
        setFormData({ newEmail: '', password: '' });
        setTimeout(() => {
          onSuccess && onSuccess(response.data.data);
          onClose();
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update email');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="rounded-2xl p-8 max-w-md w-full"
        style={{ backgroundColor: 'var(--surface)' }}
      >
        <h2 className="text-2xl font-bold mb-6">Update Email Address</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Email Display */}
          <div>
            <label className="block text-sm font-medium mb-2">Current Email</label>
            <div
              className="w-full px-4 py-2 rounded-lg border"
              style={{
                backgroundColor: 'var(--surface2)',
                borderColor: 'var(--border)',
                color: 'var(--textSec)'
              }}
            >
              {currentEmail}
            </div>
          </div>

          {/* New Email Input */}
          <div>
            <label className="block text-sm font-medium mb-2">New Email Address</label>
            <input
              type="email"
              name="newEmail"
              value={formData.newEmail}
              onChange={handleChange}
              placeholder="Enter new email"
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
              style={{
                backgroundColor: 'var(--surface2)',
                borderColor: 'var(--border)',
                '--tw-ring-color': 'var(--brand)'
              }}
              required
            />
          </div>

          {/* Password Verification */}
          <div>
            <label className="block text-sm font-medium mb-2">Current Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
              style={{
                backgroundColor: 'var(--surface2)',
                borderColor: 'var(--border)',
                '--tw-ring-color': 'var(--brand)'
              }}
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}>
              {success}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 mt-6 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
              style={{ backgroundColor: 'var(--brand)', color: 'white' }}
            >
              {loading ? 'Updating...' : 'Update Email'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmailModal;
