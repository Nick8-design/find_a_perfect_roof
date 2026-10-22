import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({
  onToggleSidebar,
  isSidebarOpen = true,
  setActivePage,
  onOpenChat,
  onOpenProfile,
}) {
  const { user, isAuthenticated } = useAuth();

  return (
    <header className="navbar navbar-expand bg-white border-bottom sticky-top px-3 py-2">
      <div className="container-fluid px-0 d-flex align-items-center justify-content-between">
        
        {/* Left: Sidebar Toggle & Brand */}
        <div className="d-flex align-items-center gap-2">
          {/* Sidebar Toggle Button */}
          <button
            type="button"
            className="btn btn-sm btn-light border rounded-circle d-flex align-items-center justify-content-center p-0"
            style={{ width: 34, height: 34 ,backgroundColor:"#001C3D"}}
            onClick={onToggleSidebar}
            title={isSidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
            aria-label="Toggle Sidebar"
          >
            <i
              className={`bi ${isSidebarOpen ? 'bi-layout-sidebar-inset-reverse' : 'bi-layout-sidebar-inset'}`}
              style={{ color: '#e9ebec', fontSize: '15px' }}
            ></i>
          </button>

          {/* Brand */}
          <div
            className="d-flex align-items-center gap-2 ms-1"
            style={{ cursor: 'pointer' }}
            onClick={() => setActivePage && setActivePage('explore')}
          >
            <div
              className="rounded-circle d-flex align-items-center justify-content-center text-white"
              style={{ width: 32, height: 32, backgroundColor: '#001C3D' }}
            >
              <i className="bi bi-houses-fill" style={{ fontSize: '14px' }}></i>
            </div>
            <span className="fw-bold fs-6 text-dark tracking-tight mb-0">NyumbaAI</span>
          </div>
        </div>

        {/* Right: AI Chat & Profile */}
        <div className="d-flex align-items-center gap-2">
          {/* Ask AI Button */}
          <button
            type="button"
            className="btn btn-sm text-white rounded-pill px-3 py-1 d-flex align-items-center gap-1 shadow-sm"
            style={{ backgroundColor: '#001C3D', fontSize: '13px', fontWeight: '500' }}
            onClick={onOpenChat}
          >
            <i className="bi bi-chat-dots-fill"></i>
            <span>Ask AI</span>
          </button>

          {/* User Profile Chip */}
          {isAuthenticated && user && (
            <button
              type="button"
              className="btn btn-sm btn-light border rounded-pill py-1 px-2 d-flex align-items-center gap-2"
              onClick={onOpenProfile}
              title="Profile"
            >
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                alt={user.name}
                className="rounded-circle"
                style={{ width: 22, height: 22, objectFit: 'cover' }}
              />
              <span className="small d-none d-sm-inline text-dark" style={{ fontSize: '13px', fontWeight: '500' }}>
                {user.name.split(' ')[0]}
              </span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
}