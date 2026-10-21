import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ProfileModal({ isOpen, onClose, onOpenBookings }) {
  const { user, updateProfile, logout } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  if (!isOpen || !user) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setStatusMessage(null);
      await updateProfile({ name, phone, avatar });
      setStatusMessage({ type: 'success', text: 'Profile updated.' });
      setIsEditing(false);
    } catch (err) {
      setStatusMessage({ type: 'danger', text: err.message || 'Update failed.' });
    } finally {
      setLoading(false);
    }
  };

  const AVATAR_OPTIONS = [
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name || 'User')}`,
    `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80`,
    `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80`,
  ];

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 28, 61, 0.6)' }}>
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 440 }}>
        <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden bg-white">
          
          {/* Header */}
          <div className="p-4 border-bottom d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                alt={user.name}
                className="rounded-circle border"
                style={{ width: 44, height: 44, objectFit: 'cover' }}
              />
              <div>
                <h6 className="fw-bold text-dark mb-0">{user.name}</h6>
                <span className="text-muted small">{user.email}</span>
              </div>
            </div>
            <button type="button" className="btn-close" onClick={onClose} disabled={loading}></button>
          </div>

          <div className="p-4">
            {statusMessage && (
              <div className={`alert alert-${statusMessage.type} py-2 px-3 rounded-3 small mb-3 border-0`}>
                {statusMessage.text}
              </div>
            )}

            {!isEditing ? (
              <div>
                <div className="p-3 rounded-3 mb-3 border" style={{ backgroundColor: '#F8FAFC' }}>
                  <div className="d-flex justify-content-between py-1 border-bottom">
                    <span className="text-muted small">Phone</span>
                    <span className="fw-semibold text-dark small">{user.phone || 'None'}</span>
                  </div>
                  <div className="d-flex justify-content-between py-1 pt-2">
                    <span className="text-muted small">Account</span>
                    <span className="text-dark small font-monospace">{user.id?.slice(0, 8)}...</span>
                  </div>
                </div>

                <div className="d-flex gap-2 mb-3">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary rounded-pill w-100 py-2"
                    onClick={() => {
                      setIsEditing(true);
                      setName(user.name || '');
                      setPhone(user.phone || '');
                      setAvatar(user.avatar || '');
                    }}
                  >
                    Edit Profile
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm text-white rounded-pill w-100 py-2"
                    style={{ backgroundColor: '#0070BA' }}
                    onClick={() => {
                      onClose();
                      if (onOpenBookings) onOpenBookings();
                    }}
                  >
                    My Bookings
                  </button>
                </div>

                <div className="border-top pt-3 text-end">
                  <button
                    type="button"
                    className="btn btn-sm btn-link text-danger text-decoration-none p-0"
                    onClick={() => {
                      logout();
                      onClose();
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSave}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-muted mb-1">Full Name</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold text-muted mb-1">Phone</label>
                  <input
                    type="tel"
                    className="form-control form-control-sm"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold text-muted mb-1">Avatar</label>
                  <div className="d-flex gap-2 mb-2">
                    {AVATAR_OPTIONS.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt="Preset"
                        className={`rounded-circle border ${avatar === url ? 'border-primary border-2' : ''}`}
                        style={{ width: 36, height: 36, objectFit: 'cover', cursor: 'pointer' }}
                        onClick={() => setAvatar(url)}
                      />
                    ))}
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2 pt-2 border-top">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                    onClick={() => setIsEditing(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-sm text-white rounded-pill px-4"
                    style={{ backgroundColor: '#0070BA' }}
                    disabled={loading}
                  >
                    Save
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}