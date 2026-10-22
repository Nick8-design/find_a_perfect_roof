import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({
  activePage,
  setActivePage,
  bookingsCount = 0,
  isOpen,
  onClose,
  onOpenProfile,
}) {
  const { user, isAuthenticated, logout } = useAuth();

  const navItems = [
    {
      id: 'explore',
      label: 'Explore',
      icon: 'bi-compass',
    },
    {
      id: 'bookings',
      label: 'My Bookings',
      icon: 'bi-receipt',
      badge: bookingsCount > 0 ? bookingsCount : null,
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="sidebar-backdrop d-lg-none position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-25"
          style={{ zIndex: 1025 }}
          onClick={onClose}
        ></div>
      )}

      <aside className={`app-sidebar bg-white border-end d-flex flex-column ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {/* Header */}
        <div className="p-3 border-bottom d-flex align-items-center justify-content-between">
          <span className="fw-semibold text-dark small">Menu</span>
          <button
            type="button"
            className="btn btn-sm btn-light border rounded-circle d-flex align-items-center justify-content-center p-1"
            style={{ width: 28, height: 28 }}
            onClick={onClose}
            title="Collapse Sidebar"
            aria-label="Collapse Sidebar"
          >
            <i className="bi bi-chevron-left" style={{ fontSize: '12px' }}></i>
          </button>
        </div>

        {/* Navigation Links */}
        <div className="p-3 flex-grow-1 overflow-y-auto">
          <nav className="nav flex-column gap-1">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`btn text-start d-flex align-items-center justify-content-between px-3 py-2 rounded-3 border-0 transition-all ${
                    isActive ? 'text-white' : 'text-dark'
                  }`}
                  style={{
                    backgroundColor: isActive ? '#001C3D' : 'transparent',
                    fontSize: '14px',
                    fontWeight: isActive ? '600' : '500',
                  }}
                  onClick={() => {
                    setActivePage(item.id);
                    if (window.innerWidth < 992 && onClose) onClose();
                  }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <i className={`bi ${item.icon}`}></i>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className="badge rounded-pill"
                      style={{
                        backgroundColor: isActive ? '#FFFFFF' : '#0070BA',
                        color: isActive ? '#0070BA' : '#FFFFFF',
                        fontSize: '11px',
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Powered by Footer */}
        <div className="small text-muted text-center py-3 border-top" style={{ fontSize: '12px' }}>
          Powered by <strong>Gemini AI</strong> & <strong>PayPal</strong>
        </div>

        {/* User Account Footer */}
        {isAuthenticated && user && (
          <div className="p-3 border-top" style={{ backgroundColor: '#F8FAFC' }}>
            <div className="d-flex align-items-center justify-content-between">
              <div
                className="d-flex align-items-center gap-2 flex-grow-1 overflow-hidden"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  if (onOpenProfile) onOpenProfile();
                }}
                title="Profile"
              >
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                  alt={user.name}
                  className="rounded-circle border"
                  style={{ width: 32, height: 32, objectFit: 'cover' }}
                />
                <div className="overflow-hidden">
                  <div className="fw-semibold text-dark text-truncate" style={{ fontSize: '13px' }}>
                    {user.name}
                  </div>
                  <div className="text-muted text-truncate" style={{ fontSize: '11px' }}>
                    {user.email}
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary border-0 p-1 rounded-circle"
                style={{ width: 28, height: 28 }}
                onClick={logout}
                title="Sign Out"
              >
                <i className="bi bi-box-arrow-right" style={{ fontSize: '13px' }}></i>
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}