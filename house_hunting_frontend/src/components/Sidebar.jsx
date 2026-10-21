import React from 'react';

export default function Sidebar({ activePage, setActivePage, bookingsCount = 0, onOpenChat, isOpen, onClose }) {
  const navItems = [
    {
      id: 'explore',
      label: 'Explore Houses',
      icon: 'bi-compass',
      description: 'Find & browse listings',
    },
    {
      id: 'bookings',
      label: 'My Bookings',
      icon: 'bi-receipt-cutoff',
      badge: bookingsCount > 0 ? bookingsCount : null,
      description: 'Confirmed PayPal receipts',
    },
    {
      id: 'add-house',
      label: 'List a Property',
      icon: 'bi-plus-square',
      description: 'Add a new rental',
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="sidebar-backdrop d-lg-none position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
          style={{ zIndex: 1040 }}
          onClick={onClose}
        ></div>
      )}

      <aside className={`app-sidebar bg-white border-end d-flex flex-column ${isOpen ? 'sidebar-open' : ''}`}>
        {/* Brand header in sidebar for mobile or branding */}
        <div className="p-3 border-bottom d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <div className="brand-icon bg-primary text-white rounded-3 p-2 d-flex align-items-center justify-content-center">
              <i className="bi bi-house-heart-fill fs-5"></i>
            </div>
            <div>
              <div className="fw-bold fs-5 text-dark lh-1">HouseNest</div>
              <span className="extra-small text-muted">AI House Hunting</span>
            </div>
          </div>
          {/* Close button on mobile */}
          <button
            type="button"
            className="btn btn-sm btn-light d-lg-none"
            onClick={onClose}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Navigation Links */}
        <div className="p-3 flex-grow-1 overflow-y-auto">
          <div className="text-uppercase extra-small fw-bold text-muted px-3 mb-2">
            Main Menu
          </div>
          <nav className="nav nav-pills flex-column gap-1">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`nav-link text-start d-flex align-items-center justify-content-between p-3 rounded-3 transition-all ${
                    isActive ? 'active bg-primary text-white shadow-sm' : 'text-dark hover-bg-light'
                  }`}
                  onClick={() => {
                    setActivePage(item.id);
                    if (onClose) onClose();
                  }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <i className={`bi ${item.icon} fs-5`}></i>
                    <div>
                      <div className="fw-semibold lh-1">{item.label}</div>
                      <div className={`extra-small mt-1 ${isActive ? 'text-white-50' : 'text-muted'}`}>
                        {item.description}
                      </div>
                    </div>
                  </div>
                  {item.badge && (
                    <span className={`badge rounded-pill ${isActive ? 'bg-white text-primary' : 'bg-primary text-white'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* AI Banner Callout */}
          <div className="mt-4 p-3 rounded-4 bg-gradient-ai text-white position-relative overflow-hidden shadow-sm">
            <div className="position-relative" style={{ zIndex: 1 }}>
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="badge bg-white text-dark fw-bold">
                  <i className="bi bi-stars text-primary me-1"></i> Gemini 2.5
                </span>
              </div>
              <h6 className="fw-bold mb-1">AI Hunting Partner</h6>
              <p className="extra-small text-white-50 mb-3">
                Need advice on neighborhoods, rent prices, or booking details? Ask our AI assistant anytime.
              </p>
              <button
                type="button"
                className="btn btn-sm btn-light w-100 fw-semibold text-primary d-flex align-items-center justify-content-center gap-2 shadow-sm"
                onClick={onOpenChat}
              >
                <i className="bi bi-chat-dots-fill"></i>
                Launch Assistant
              </button>
            </div>
          </div>
        </div>

        {/* Footer profile / sandbox mode indicator */}
        <div className="p-3 border-top bg-light">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <div className="avatar-circle bg-success bg-opacity-10 text-success fw-bold">
                <i className="bi bi-person-check-fill"></i>
              </div>
              <div>
                <div className="fw-semibold small text-dark">Tenant Portal</div>
                <div className="extra-small text-muted">PayPal Sandbox Mode</div>
              </div>
            </div>
            <span className="badge bg-warning bg-opacity-25 text-dark extra-small border border-warning">
              Sandbox
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}

