import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../ui/Button';

const ManageNotificationsModal = ({ isOpen, onClose, settings, backendUrl, onSuccess }) => {
  const [formData, setFormData] = useState({
    notifications: true,
    securityAlerts: true,
    weeklyDigest: true,
    leaderboardUpdates: true
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  // Initialize form data when settings change
  useEffect(() => {
    if (settings) {
      setFormData({
        notifications: settings.notifications ?? true,
        securityAlerts: settings.securityAlerts ?? true,
        weeklyDigest: settings.weeklyDigest ?? true,
        leaderboardUpdates: settings.leaderboardUpdates ?? true
      });
    }
  }, [settings, isOpen]);

  const handleToggle = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: !prev[field]
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
        `${backendUrl}/api/profile/notifications`,
        formData,
        { withCredentials: true }
      );

      if (response.data.success) {
        setSuccess('Notification settings saved!');
        setTimeout(() => {
          onSuccess && onSuccess(response.data.data);
          onClose();
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update notification settings');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const notificationOptions = [
    {
      key: 'notifications',
      label: 'General Notifications',
      description: 'Receive general notifications and updates'
    },
    {
      key: 'securityAlerts',
      label: 'Security Alerts',
      description: 'Get notified about account security events'
    },
    {
      key: 'weeklyDigest',
      label: 'Weekly Digest',
      description: 'Receive a weekly summary of your progress'
    },
    {
      key: 'leaderboardUpdates',
      label: 'Leaderboard Updates',
      description: 'Get notified about leaderboard changes'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: 'var(--surface)' }}
      >
        <h2 className="text-2xl font-bold mb-6">Notification Settings</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Notification Options */}
          {notificationOptions.map(option => (
            <div
              key={option.key}
              className="p-4 rounded-lg border flex items-start gap-3"
              style={{
                backgroundColor: 'var(--surface2)',
                borderColor: 'var(--border)'
              }}
            >
              <input
                type="checkbox"
                id={option.key}
                checked={formData[option.key]}
                onChange={() => handleToggle(option.key)}
                className="mt-1"
                style={{ accentColor: 'var(--brand)' }}
              />
              <label htmlFor={option.key} className="flex-1 cursor-pointer">
                <div className="font-medium">{option.label}</div>
                <div className="text-sm" style={{ color: 'var(--textSec)' }}>
                  {option.description}
                </div>
              </label>
            </div>
          ))}

          {/* Summary */}
          <div
            className="p-3 rounded-lg text-sm"
            style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--brand)' }}
          >
            <strong>Enabled:</strong> {Object.values(formData).filter(Boolean).length} of {notificationOptions.length}
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
              Close
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
              style={{ backgroundColor: 'var(--brand)', color: 'white' }}
            >
              {loading ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageNotificationsModal;
