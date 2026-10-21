import React from 'react';

export default function Navbar({ onToggleSidebar, activePage, setActivePage, bookingsCount = 0, onOpenChat, searchQuery, setSearchQuery }) {
  return (
    <header className="navbar navbar-expand bg-white border-bottom sticky-top px-3 py-2 shadow-xs">
      <div className="container-fluid px-0 d-flex align-items-center justify-content-between">
        
        {/* Left: Mobile Toggle & Brand */}
        <div className="d-flex align-items-center gap-3">
          <button
            type="button"
            className="btn btn-outline-secondary d-lg-none btn-sm border-0"
            onClick={onToggleSidebar}
            aria-label="Toggle Sidebar"
          >
            <i className="bi bi-list fs-4"></i>
          </button>

          <div className="d-flex align-items-center gap-2 cursor-pointer" onClick={() => setActivePage('explore')}>
            <div className="rounded-3 bg-primary text-white p-2 d-flex align-items-center justify-content-center shadow-sm">
              <i className="bi bi-house-heart-fill fs-5"></i>
            </div>
            <div>
              <span className="fw-bold fs-5 text-dark">HouseNest</span>
              <span className="badge bg-primary bg-opacity-10 text-primary ms-2 d-none d-sm-inline-block small">
                Kenya Rentals
              </span>
            </div>
          </div>
        </div>

        {/* Center: Quick Search Input if on Explore page */}
        {activePage === 'explore' && (
          <div className="d-none d-md-block flex-grow-1 mx-4" style={{ maxWidth: 420 }}>
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-light border-end-0 text-muted">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control bg-light border-start-0"
                placeholder="Search by neighborhood, city, or house title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="btn btn-light border border-start-0 text-muted"
                  type="button"
                  onClick={() => setSearchQuery('')}
                >
                  <i className="bi bi-x"></i>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Right: Quick Action Buttons */}
        <div className="d-flex align-items-center gap-2">
          {/* Quick AI Button */}
          <button
            type="button"
            className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2 rounded-pill px-3 py-1 shadow-sm"
            onClick={onOpenChat}
          >
            <i className="bi bi-stars text-primary"></i>
            <span className="d-none d-sm-inline fw-semibold">AI Assistant</span>
          </button>

          {/* My Bookings Quick Link */}
          <button
            type="button"
            className={`btn btn-sm position-relative rounded-pill px-3 py-1 ${
              activePage === 'bookings' ? 'btn-primary' : 'btn-light border'
            }`}
            onClick={() => setActivePage('bookings')}
            title="View Confirmed Bookings"
          >
            <i className="bi bi-receipt-cutoff me-1"></i>
            <span className="d-none d-md-inline">Bookings</span>
            {bookingsCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {bookingsCount}
              </span>
            )}
          </button>

          {/* Add House Link */}
          <button
            type="button"
            className={`btn btn-sm rounded-pill px-3 py-1 d-none d-sm-flex align-items-center gap-1 ${
              activePage === 'add-house' ? 'btn-success' : 'btn-outline-success'
            }`}
            onClick={() => setActivePage('add-house')}
          >
            <i className="bi bi-plus-circle"></i>
            <span>List House</span>
          </button>
        </div>

      </div>
    </header>
  );
}

