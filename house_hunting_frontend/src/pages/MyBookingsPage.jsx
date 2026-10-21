import React, { useState, useEffect } from 'react';
import { PLACEHOLDER_HOUSES } from '../assets/placeholders';

// Sample demonstration booking if tenant hasn't made a live payment yet
const SAMPLE_DEMO_BOOKING = {
  booking_id: 'BOOK-1772404000',
  house_id: 'house_1',
  house_title: 'Modern 2-Bedroom Luxury Suite in Westlands',
  house_location: 'Westlands, Nairobi',
  house_image: PLACEHOLDER_HOUSES[0],
  tenant_name: 'Alex Johnson',
  tenant_phone: '+254712345678',
  tenant_email: 'alex.johnson@example.com',
  months_paid: 2,
  monthly_rent: 650,
  deposit_amount: 650,
  total_amount_paid: 1950.00,
  currency: 'USD',
  start_date: '2026-11-01',
  end_date: '2027-01-01',
  status: 'PAID',
  paypal_capture_id: '8XY9283740192847B',
  paypal_payer_email: 'sb-buyer@business.example.com',
  paid_at: '2026-10-21T00:30:00.000Z',
  caretaker_name: 'David Mwangi',
  caretaker_phone: '+254712345678',
  tenant_notes: 'Require ground floor parking slot.',
};

export default function MyBookingsPage({ onNavigateExplore }) {
  const [bookings, setBookings] = useState([]);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('confirmed_bookings') || '[]');
      if (stored.length > 0) {
        setBookings(stored);
      } else {
        // Provide demo booking so the user sees verified layout
        setBookings([SAMPLE_DEMO_BOOKING]);
      }
    } catch {
      setBookings([SAMPLE_DEMO_BOOKING]);
    }
  };

  const handleClearDemo = () => {
    localStorage.removeItem('confirmed_bookings');
    setBookings([]);
  };

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-3">
        <div>
          <h3 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
            <i className="bi bi-receipt-cutoff text-primary"></i>
            My Confirmed Bookings
          </h3>
          <p className="text-muted small mb-0">
            View your verified PayPal transaction receipts, tenancy duration, and key collection caretaker contacts.
          </p>
        </div>

        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={loadBookings}
          >
            <i className="bi bi-arrow-clockwise me-1"></i> Refresh
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onNavigateExplore}
          >
            <i className="bi bi-compass me-1"></i> Explore More Houses
          </button>
        </div>
      </div>

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center my-4">
          <div className="empty-icon text-muted mb-3">
            <i className="bi bi-calendar-x display-4"></i>
          </div>
          <h4 className="fw-bold text-dark">No Bookings Found</h4>
          <p className="text-muted small mx-auto mb-4" style={{ maxWidth: 460 }}>
            You have not booked any rental properties yet. Browse our verified listings in Westlands, Kilimani, Karen and lock your lease instantly with PayPal.
          </p>
          <div>
            <button className="btn btn-primary px-4" onClick={onNavigateExplore}>
              Browse Available Listings
            </button>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {bookings.map((b, index) => {
            const rent = Number(b.monthly_rent || 0);
            const months = Number(b.months_paid || 1);
            const deposit = Number(b.deposit_amount || 0);
            const total = Number(b.total_amount_paid || (rent * months + deposit));

            return (
              <div key={b.booking_id || index} className="col-lg-6">
                <div className="card booking-receipt-card border-0 shadow-sm rounded-4 overflow-hidden h-100">
                  {/* Card Header with Status & PayPal Tag */}
                  <div className="card-header bg-white border-bottom p-3 d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge bg-success bg-opacity-10 text-success fw-bold px-2 py-1">
                        <i className="bi bi-check-circle-fill me-1"></i> {b.status || 'PAID'}
                      </span>
                      <span className="badge bg-primary bg-opacity-10 text-primary small">
                        <i className="bi bi-paypal me-1"></i> PayPal Captured
                      </span>
                    </div>
                    <span className="text-muted font-monospace small">
                      {b.booking_id}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="card-body p-4">
                    <div className="d-flex gap-3 mb-3">
                      <img
                        src={b.house_image || PLACEHOLDER_HOUSES[0]}
                        alt={b.house_title || 'Rental Property'}
                        className="rounded-3 object-fit-cover shadow-sm"
                        style={{ width: 100, height: 100 }}
                      />
                      <div className="flex-grow-1">
                        <h5 className="fw-bold text-dark mb-1">{b.house_title || 'House Rental'}</h5>
                        <div className="text-muted small mb-2 d-flex align-items-center">
                          <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                          {b.house_location || 'Nairobi, Kenya'}
                        </div>
                        <div className="small text-secondary">
                          <span className="fw-semibold text-dark">Tenant:</span> {b.tenant_name || 'Tenant'}
                        </div>
                      </div>
                    </div>

                    {/* Lease Timeline Box */}
                    <div className="p-3 bg-light rounded-3 mb-3 small">
                      <div className="row g-2 text-center">
                        <div className="col-4 border-end">
                          <span className="text-muted extra-small d-block">Move-in Date</span>
                          <span className="fw-bold text-dark">{b.start_date || 'N/A'}</span>
                        </div>
                        <div className="col-4 border-end">
                          <span className="text-muted extra-small d-block">Lease Duration</span>
                          <span className="fw-bold text-primary">{months} Month{months > 1 ? 's' : ''}</span>
                        </div>
                        <div className="col-4">
                          <span className="text-muted extra-small d-block">End Date</span>
                          <span className="fw-bold text-dark">{b.end_date || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Breakdown table */}
                    <div className="border rounded-3 p-3 mb-3 small">
                      <div className="d-flex justify-content-between mb-1 text-secondary">
                        <span>Rent ({months} × ${rent}/mo)</span>
                        <span className="text-dark font-monospace">${(rent * months).toFixed(2)}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-1 text-secondary">
                        <span>Refundable Security Deposit</span>
                        <span className="text-dark font-monospace">${deposit.toFixed(2)}</span>
                      </div>
                      <div className="d-flex justify-content-between pt-2 border-top fw-bold">
                        <span className="text-dark">Total Paid (PayPal Sandbox)</span>
                        <span className="text-success font-monospace fs-6">${total.toFixed(2)}</span>
                      </div>
                      {b.paypal_capture_id && (
                        <div className="extra-small text-muted mt-2 pt-2 border-top">
                          <strong>Capture ID:</strong> <span className="font-monospace text-primary">{b.paypal_capture_id}</span>
                        </div>
                      )}
                    </div>

                    {/* Caretaker Handover Box */}
                    <div className="p-3 rounded-3 bg-success bg-opacity-10 border border-success border-opacity-25 d-flex align-items-center justify-content-between">
                      <div>
                        <div className="extra-small text-success fw-bold text-uppercase">
                          Key Handover Caretaker
                        </div>
                        <div className="fw-semibold text-dark small">
                          {b.caretaker_name || 'Assigned Caretaker'} ({b.caretaker_phone || '+254700000000'})
                        </div>
                      </div>
                      <div className="d-flex gap-1">
                        <a
                          href={`tel:${b.caretaker_phone || '+254700000000'}`}
                          className="btn btn-sm btn-success rounded-pill px-3"
                        >
                          <i className="bi bi-telephone-fill me-1"></i> Call
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="card-footer bg-white border-top p-3 d-flex justify-content-between align-items-center">
                    <span className="text-muted extra-small">
                      <i className="bi bi-clock-history me-1"></i>
                      {b.paid_at ? new Date(b.paid_at).toLocaleDateString() : 'Confirmed'}
                    </span>
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => setSelectedReceipt(b)}
                    >
                      <i className="bi bi-file-earmark-text me-1"></i> Full Printable Receipt
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Printable Receipt Modal */}
      {selectedReceipt && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)' }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content rounded-4 p-4 border-0 shadow-lg">
              <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                <div className="d-flex align-items-center gap-2">
                  <div className="bg-primary text-white p-2 rounded-3">
                    <i className="bi bi-house-heart-fill"></i>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-0 text-dark">HouseNest Receipt</h5>
                    <span className="extra-small text-muted">Official Tenancy Payment Record</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedReceipt(null)}
                ></button>
              </div>

              <div className="receipt-content text-start mb-4">
                <div className="mb-3">
                  <div className="text-muted extra-small text-uppercase">Reference</div>
                  <div className="fw-bold font-monospace">{selectedReceipt.booking_id}</div>
                </div>
                <div className="mb-3">
                  <div className="text-muted extra-small text-uppercase">Property</div>
                  <div className="fw-semibold">{selectedReceipt.house_title}</div>
                  <div className="small text-muted">{selectedReceipt.house_location}</div>
                </div>
                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <div className="text-muted extra-small text-uppercase">Tenant</div>
                    <div className="small fw-semibold">{selectedReceipt.tenant_name}</div>
                    <div className="extra-small text-muted">{selectedReceipt.tenant_phone}</div>
                  </div>
                  <div className="col-6">
                    <div className="text-muted extra-small text-uppercase">Lease Period</div>
                    <div className="small fw-semibold">
                      {selectedReceipt.start_date} to {selectedReceipt.end_date}
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-light rounded-3 mb-3">
                  <div className="d-flex justify-content-between small mb-1">
                    <span>Rent ({selectedReceipt.months_paid} mos):</span>
                    <span>${(selectedReceipt.monthly_rent * selectedReceipt.months_paid).toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between small mb-1">
                    <span>Deposit:</span>
                    <span>${Number(selectedReceipt.deposit_amount).toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between fw-bold pt-2 border-top">
                    <span>Total Paid:</span>
                    <span className="text-success">${Number(selectedReceipt.total_amount_paid).toFixed(2)}</span>
                  </div>
                </div>

                <div className="extra-small text-muted">
                  <strong>PayPal Transaction:</strong> {selectedReceipt.paypal_capture_id || 'SANDBOX_CAPTURE'}
                </div>
              </div>

              <div className="d-flex gap-2 justify-content-end">
                <button className="btn btn-secondary btn-sm" onClick={() => setSelectedReceipt(null)}>
                  Close
                </button>
                <button className="btn btn-primary btn-sm" onClick={() => window.print()}>
                  <i className="bi bi-printer me-1"></i> Print / Save PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

