import React, { useState, useEffect } from 'react';
import { getMyBookings } from '../services/api';
import { useAuth } from '../context/AuthContext';
import GoogleMapEmbed from '../components/GoogleMapEmbed';
import { PLACEHOLDER_HOUSES } from '../assets/placeholders';

// Image Carousel Component
function HouseImageCarousel({ images, title }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const imageList = Array.isArray(images) && images.length > 0 ? images : [PLACEHOLDER_HOUSES[0]];

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="position-relative overflow-hidden rounded-3 bg-dark" style={{ height: 210 }}>
      <img
        src={imageList[currentIndex]}
        alt={`${title} - Photo ${currentIndex + 1}`}
        className="w-100 h-100 object-fit-cover"
      />

      {imageList.length > 1 && (
        <>
          <button
            type="button"
            className="btn btn-sm btn-dark bg-opacity-50 text-white position-absolute top-50 start-0 translate-middle-y ms-2 rounded-circle p-0 d-flex align-items-center justify-content-center"
            style={{ width: 28, height: 28 }}
            onClick={handlePrev}
            title="Previous"
          >
            <i className="bi bi-chevron-left" style={{ fontSize: '12px' }}></i>
          </button>
          <button
            type="button"
            className="btn btn-sm btn-dark bg-opacity-50 text-white position-absolute top-50 end-0 translate-middle-y me-2 rounded-circle p-0 d-flex align-items-center justify-content-center"
            style={{ width: 28, height: 28 }}
            onClick={handleNext}
            title="Next"
          >
            <i className="bi bi-chevron-right" style={{ fontSize: '12px' }}></i>
          </button>
          <div
            className="position-absolute bottom-0 end-0 m-2 badge rounded-pill bg-dark bg-opacity-75 text-white fw-normal"
            style={{ fontSize: '11px' }}
          >
            {currentIndex + 1} / {imageList.length}
          </div>
        </>
      )}
    </div>
  );
}

export default function MyBookingsPage({ onNavigateExplore }) {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [activeMapHouse, setActiveMapHouse] = useState(null);

  useEffect(() => {
    loadBookings();
  }, [user]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      if (user?.id) {
        const res = await getMyBookings(user.id);
        if (res.success && Array.isArray(res.bookings)) {
          setBookings(res.bookings);
          setLoading(false);
          return;
        }
      }

      const stored = JSON.parse(localStorage.getItem('confirmed_bookings') || '[]');
      setBookings(stored);
    } catch {
      const stored = JSON.parse(localStorage.getItem('confirmed_bookings') || '[]');
      setBookings(stored);
    } finally {
      setLoading(false);
    }
  };

  const calculateDaysRemaining = (booking) => {
    if (booking.days_remaining !== undefined && booking.days_remaining !== null) {
      return parseInt(booking.days_remaining, 10);
    }
    if (!booking.end_date) return 0;
    const end = new Date(booking.end_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = end.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: '#F5F7FA', minHeight: '100vh' }}>
      
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-3">
        <div>
          <h4 className="fw-bold text-dark mb-0">My Bookings</h4>
          <span className="text-muted small">Manage your active leases and view payment receipts.</span>
        </div>

        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary rounded-pill px-3"
            onClick={loadBookings}
            disabled={loading}
          >
            <i className="bi bi-arrow-clockwise me-1"></i> Refresh
          </button>
          <button
            type="button"
            className="btn btn-sm text-white rounded-pill px-3"
            style={{ backgroundColor: '#001C3D' }}
            onClick={onNavigateExplore}
          >
            Explore Houses
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="text-muted small mt-2">Loading bookings...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center my-4 bg-white">
          <div className="mb-3 text-muted">
            <i className="bi bi-calendar-check fs-1"></i>
          </div>
          <h5 className="fw-bold text-dark">No active bookings</h5>
          <p className="text-muted small mx-auto mb-4" style={{ maxWidth: 360 }}>
            You haven't reserved any properties yet. Once you place a holding deposit via PayPal, your lease will appear here.
          </p>
          <div>
            <button
              className="btn btn-sm text-white rounded-pill px-4"
              style={{ backgroundColor: '#001C3D' }}
              onClick={onNavigateExplore}
            >
              Browse Houses
            </button>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {bookings.map((b, index) => {
            const rent = Number(b.monthly_rent || 0);
            const months = Number(b.months_paid || 1);
            const deposit = Number(b.deposit_amount || 0);
            const total = Number(b.total_amount_paid || rent * months + deposit);
            const daysRemaining = calculateDaysRemaining(b);

            const isWarning = daysRemaining <= 5 && daysRemaining >= 0;
            const isExpired = daysRemaining < 0;

            const houseImages = b.house_images || (b.house_image ? [b.house_image] : PLACEHOLDER_HOUSES);
            const caretakerName = b.caretaker_name || b.contact_name || 'Caretaker';
            const caretakerPhone = b.caretaker_phone || b.contact_phone || '';
            const caretakerEmail = b.caretaker_email || b.contact_email || '';
            const cleanPhone = caretakerPhone.replace(/[^0-9]/g, '');

            return (
              <div key={b.booking_id || index} className="col-lg-6">
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100 d-flex flex-column bg-white">
                  
                  {/* Card Status Header */}
                  <div className="p-3 border-bottom d-flex align-items-center justify-content-between flex-wrap gap-2">
                    <div className="d-flex align-items-center gap-2">
                      <span
                        className="badge rounded-pill fw-semibold"
                        style={{
                          backgroundColor: isExpired ? '#FEE2E2' : '#DCFCE7',
                          color: isExpired ? '#DC2626' : '#15803D',
                          fontSize: '11px',
                        }}
                      >
                        {isExpired ? 'Ended' : b.status || 'Active'}
                      </span>
                      <span className="badge rounded-pill fw-normal" style={{ backgroundColor: '#EDF1F5', color: '#0070BA', fontSize: '11px' }}>
                        <i className="bi bi-paypal me-1"></i> Paid with PayPal
                      </span>
                    </div>

                    <div>
                      {isExpired ? (
                        <span className="text-muted small">Term completed</span>
                      ) : isWarning ? (
                        <span className="badge rounded-pill fw-bold text-dark" style={{ backgroundColor: '#FEF3C7', fontSize: '11px' }}>
                          <i className="bi bi-clock me-1 text-danger"></i>
                          {daysRemaining} day{daysRemaining === 1 ? '' : 's'} remaining
                        </span>
                      ) : (
                        <span className="text-muted small">
                          {daysRemaining} days remaining
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="card-body p-3 flex-grow-1">
                    <HouseImageCarousel images={houseImages} title={b.house_title || 'House'} />

                    {/* Title & Location */}
                    <div className="mt-3">
                      <div className="d-flex justify-content-between align-items-start gap-2">
                        <h6 className="fw-bold text-dark mb-1 text-truncate">{b.house_title || 'Rental Property'}</h6>
                        <button
                          type="button"
                          className="btn btn-link btn-sm p-0 text-decoration-none"
                          style={{ color: '#0070BA', fontSize: '12px' }}
                          onClick={() => setActiveMapHouse(activeMapHouse === b.booking_id ? null : b.booking_id)}
                        >
                          {activeMapHouse === b.booking_id ? 'Hide map' : 'Map'}
                        </button>
                      </div>
                      <div className="text-muted small mb-3">
                        <i className="bi bi-geo-alt me-1"></i>
                        {b.house_location || 'Nairobi'}
                      </div>

                      {activeMapHouse === b.booking_id && (
                        <div className="mb-3 rounded-3 overflow-hidden">
                          <GoogleMapEmbed location={b.house_location} title={b.house_title} height={160} />
                        </div>
                      )}
                    </div>

                    {/* Tenancy Dates */}
                    <div className="p-2 rounded-3 mb-3 small border" style={{ backgroundColor: '#F8FAFC' }}>
                      <div className="row g-1 text-center">
                        <div className="col-4 border-end">
                          <span className="text-muted d-block" style={{ fontSize: '11px' }}>Move-in</span>
                          <span className="fw-semibold text-dark">{b.start_date || 'N/A'}</span>
                        </div>
                        <div className="col-4 border-end">
                          <span className="text-muted d-block" style={{ fontSize: '11px' }}>Duration</span>
                          <span className="fw-semibold text-dark">{months} mo</span>
                        </div>
                        <div className="col-4">
                          <span className="text-muted d-block" style={{ fontSize: '11px' }}>End Date</span>
                          <span className="fw-semibold text-dark">{b.end_date || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="border rounded-3 p-3 mb-3 small bg-white">
                      <div className="d-flex justify-content-between mb-1 text-muted">
                        <span>Rent ({months} × ${rent}):</span>
                        <span className="text-dark">${(rent * months).toFixed(2)}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-1 text-muted">
                        <span>Deposit:</span>
                        <span className="text-dark">${deposit.toFixed(2)}</span>
                      </div>
                      <div className="d-flex justify-content-between pt-2 border-top fw-semibold text-dark">
                        <span>Total Paid:</span>
                        <span style={{ color: '#059669' }}>${total.toFixed(2)}</span>
                      </div>
                      {b.paypal_capture_id && (
                        <div className="mt-2 pt-2 border-top text-muted font-monospace" style={{ fontSize: '11px' }}>
                          PayPal Ref: {b.paypal_capture_id}
                        </div>
                      )}
                    </div>

                    {/* Contact Strip */}
                    <div className="p-2 rounded-3 border d-flex align-items-center justify-content-between" style={{ backgroundColor: '#FAFAFA' }}>
                      <div>
                        <div className="fw-semibold text-dark" style={{ fontSize: '13px' }}>{caretakerName}</div>
                        <div className="text-muted" style={{ fontSize: '11px' }}>{caretakerPhone || 'Property Contact'}</div>
                      </div>
                      <div className="d-flex gap-1">
                        {caretakerEmail && (
                          <a
                            href={`mailto:${caretakerEmail}`}
                            className="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: 28, height: 28, padding: 0 }}
                            title="Email"
                          >
                            <i className="bi bi-envelope" style={{ fontSize: '12px' }}></i>
                          </a>
                        )}
                        {caretakerPhone && (
                          <a
                            href={`tel:${caretakerPhone}`}
                            className="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: 28, height: 28, padding: 0 }}
                            title="Call"
                          >
                            <i className="bi bi-telephone" style={{ fontSize: '12px' }}></i>
                          </a>
                        )}
                        {cleanPhone && (
                          <a
                            href={`https://wa.me/${cleanPhone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-success rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: 28, height: 28, padding: 0 }}
                            title="WhatsApp"
                          >
                            <i className="bi bi-whatsapp" style={{ fontSize: '12px' }}></i>
                          </a>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Card Footer */}
                  <div className="card-footer bg-white border-top p-3 d-flex justify-content-between align-items-center">
                    <span className="text-muted" style={{ fontSize: '12px' }}>
                      {b.paid_at ? new Date(b.paid_at).toLocaleDateString() : 'Paid'}
                    </span>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                      onClick={() => setSelectedReceipt(b)}
                    >
                      Receipt
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Clean Receipt Modal */}
      {selectedReceipt && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 28, 61, 0.6)' }}>
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 460 }}>
            <div className="modal-content rounded-4 p-4 border-0 shadow-lg bg-white">
              <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                <div className="d-flex align-items-center gap-2">
                  <div className="rounded-circle p-2 text-white d-flex align-items-center justify-content-center" style={{ backgroundColor: '#0070BA', width: 32, height: 32 }}>
                    <i className="bi bi-receipt" style={{ fontSize: '14px' }}></i>
                  </div>
                  <h6 className="fw-bold mb-0 text-dark">Payment Receipt</h6>
                </div>
                <button type="button" className="btn-close" onClick={() => setSelectedReceipt(null)}></button>
              </div>

              <div className="text-start mb-4">
                <div className="mb-3">
                  <div className="text-muted small" style={{ fontSize: '11px' }}>Reference Number</div>
                  <div className="font-monospace fw-semibold text-dark">{selectedReceipt.booking_id}</div>
                </div>

                <div className="mb-3">
                  <div className="text-muted small" style={{ fontSize: '11px' }}>Property</div>
                  <div className="fw-semibold text-dark">{selectedReceipt.house_title}</div>
                  <div className="text-muted small">{selectedReceipt.house_location}</div>
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <div className="text-muted small" style={{ fontSize: '11px' }}>Tenant</div>
                    <div className="small fw-semibold text-dark">{selectedReceipt.tenant_name}</div>
                    <div className="text-muted" style={{ fontSize: '12px' }}>{selectedReceipt.tenant_phone}</div>
                  </div>
                  <div className="col-6">
                    <div className="text-muted small" style={{ fontSize: '11px' }}>Term</div>
                    <div className="small text-dark">{selectedReceipt.start_date} – {selectedReceipt.end_date}</div>
                    <div className="small fw-semibold" style={{ color: '#0070BA' }}>{selectedReceipt.months_paid} month(s)</div>
                  </div>
                </div>

                <div className="p-3 rounded-3 mb-3 border" style={{ backgroundColor: '#F8FAFC' }}>
                  <div className="d-flex justify-content-between small mb-1 text-muted">
                    <span>Rent ({selectedReceipt.months_paid} mo):</span>
                    <span className="text-dark">${(selectedReceipt.monthly_rent * selectedReceipt.months_paid).toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between small mb-1 text-muted">
                    <span>Deposit:</span>
                    <span className="text-dark">${Number(selectedReceipt.deposit_amount).toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between fw-bold pt-2 border-top text-dark">
                    <span>Total Paid:</span>
                    <span style={{ color: '#059669' }}>${Number(selectedReceipt.total_amount_paid).toFixed(2)}</span>
                  </div>
                </div>

                <div className="text-muted font-monospace" style={{ fontSize: '11px' }}>
                  Transaction ID: {selectedReceipt.paypal_capture_id || 'N/A'}
                </div>
              </div>

              <div className="d-flex gap-2 justify-content-end">
                <button className="btn btn-sm btn-outline-secondary rounded-pill px-3" onClick={() => setSelectedReceipt(null)}>
                  Close
                </button>
                <button className="btn btn-sm text-white rounded-pill px-3" style={{ backgroundColor: '#0070BA' }} onClick={() => window.print()}>
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}