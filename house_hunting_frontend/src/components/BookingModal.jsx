import React, { useState, useEffect } from 'react';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { createBookingOrder, captureBookingOrder, cancelBookingOrder } from '../services/api';

export default function BookingModal({ house, isOpen, onClose, onBookingSuccess }) {
  if (!isOpen || !house) return null;

  const rent = Number(house.monthly_rent || house.monthlyRent || 0);
  const deposit = Number(house.deposit_amount || house.depositAmount || 0);

  // Form states
  const [tenantName, setTenantName] = useState('');
  const [tenantPhone, setTenantPhone] = useState('');
  const [tenantEmail, setTenantEmail] = useState('');
  const [monthsPaid, setMonthsPaid] = useState(1);
  const [startDate, setStartDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [tenantNotes, setTenantNotes] = useState('');

  // Transaction states
  const [isReadyForPayment, setIsReadyForPayment] = useState(false);
  const [activeBookingId, setActiveBookingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [receipt, setReceipt] = useState(null);

  // Totals
  const totalRent = rent * monthsPaid;
  const totalPayable = totalRent + deposit;

  // Calculate calculated end date
  const calculateEndDate = (start, months) => {
    if (!start) return '';
    const d = new Date(start);
    d.setMonth(d.getMonth() + Number(months));
    return d.toISOString().split('T')[0];
  };

  const endDate = calculateEndDate(startDate, monthsPaid);

  // Validation
  const validateForm = () => {
    if (!tenantName.trim()) {
      setErrorMessage('Please enter your full name.');
      return false;
    }
    if (!tenantPhone.trim()) {
      setErrorMessage('Please enter your phone number.');
      return false;
    }
    if (!tenantEmail.trim() || !tenantEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return false;
    }
    if (!startDate) {
      setErrorMessage('Please select a move-in date.');
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsReadyForPayment(true);
    }
  };

  // PayPal createOrder handler
  const handleCreatePayPalOrder = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);

      // Unique user ID simulation
      const storedUserId = localStorage.getItem('house_hunter_userId') || `user_${Date.now()}`;
      localStorage.setItem('house_hunter_userId', storedUserId);

      const payload = {
        houseId: house.id,
        userId: storedUserId,
        tenantName,
        tenantPhone,
        tenantEmail,
        monthsPaid: Number(monthsPaid),
        startDate,
        tenantNotes,
      };

      const result = await createBookingOrder(payload);

      if (result.success && result.orderId) {
        setActiveBookingId(result.bookingId);
        return result.orderId;
      } else {
        throw new Error(result.error || 'Failed to initialize PayPal order.');
      }
    } catch (err) {
      console.error('Create order error:', err);
      const msg = err.response?.data?.error || err.message || 'Could not place lock on house.';
      setErrorMessage(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // PayPal onApprove handler
  const handleApprovePayment = async (data) => {
    try {
      setLoading(true);
      setErrorMessage(null);

      const capturePayload = {
        orderId: data.orderID,
        bookingId: activeBookingId,
        houseId: house.id,
      };

      const result = await captureBookingOrder(capturePayload);

      if (result.success && result.booking) {
        const fullBookingReceipt = {
          ...result.booking,
          house_title: house.title,
          house_location: house.location,
          caretaker_name: house.contact_name || house.contactName,
          caretaker_phone: house.contact_phone || house.contactPhone,
          house_image: Array.isArray(house.images) ? house.images[0] : house.images,
        };

        // Persist confirmed booking in localStorage for MyBookingsPage
        const existing = JSON.parse(localStorage.getItem('confirmed_bookings') || '[]');
        const updated = [fullBookingReceipt, ...existing];
        localStorage.setItem('confirmed_bookings', JSON.stringify(updated));

        setReceipt(fullBookingReceipt);
        if (onBookingSuccess) {
          onBookingSuccess(fullBookingReceipt);
        }
      } else {
        throw new Error(result.error || 'Payment capture failed.');
      }
    } catch (err) {
      console.error('Capture error:', err);
      const msg = err.response?.data?.error || err.message || 'Payment approval failed.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  // PayPal onCancel handler
  const handleCancelPayment = async () => {
    if (activeBookingId) {
      try {
        await cancelBookingOrder({
          houseId: house.id,
          bookingId: activeBookingId,
        });
      } catch (err) {
        console.error('Cancel order error:', err);
      }
    }
    setErrorMessage('Payment cancelled. Your 15-minute temporary hold has been released.');
  };

  // Clean close
  const handleClose = () => {
    setReceipt(null);
    setIsReadyForPayment(false);
    setActiveBookingId(null);
    setErrorMessage(null);
    onClose();
  };

  return (
    <div className="modal fade show d-block booking-modal-overlay" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div className="modal-content shadow-lg border-0 rounded-4 overflow-hidden">
          
          {/* Header */}
          <div className="modal-header bg-primary text-white py-3 px-4">
            <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
              <i className="bi bi-shield-check"></i>
              {receipt ? 'Booking Receipt Confirmed!' : `Reserve & Book: ${house.title}`}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              aria-label="Close"
              onClick={handleClose}
            ></button>
          </div>

          <div className="modal-body p-4">
            {/* If Receipt Exists: Display Success Screen */}
            {receipt ? (
              <div className="receipt-view text-center py-2">
                <div className="success-icon mb-3">
                  <div className="rounded-circle bg-success bg-opacity-10 text-success d-inline-flex p-3 fs-1">
                    <i className="bi bi-check-circle-fill"></i>
                  </div>
                </div>
                <h4 className="fw-bold text-dark mb-1">Payment Successfully Captured!</h4>
                <p className="text-muted small mb-4">
                  Your reservation is confirmed. The house is officially locked for your move-in.
                </p>

                <div className="card bg-light border-0 rounded-3 p-4 text-start mb-4">
                  <div className="d-flex justify-content-between border-bottom pb-2 mb-3">
                    <span className="text-muted small">Booking Reference</span>
                    <span className="fw-bold text-dark font-monospace">{receipt.booking_id}</span>
                  </div>
                  <div className="d-flex justify-content-between border-bottom pb-2 mb-3">
                    <span className="text-muted small">PayPal Capture ID</span>
                    <span className="fw-bold text-primary font-monospace">{receipt.paypal_capture_id || 'SANDBOX_OK'}</span>
                  </div>
                  <div className="d-flex justify-content-between border-bottom pb-2 mb-3">
                    <span className="text-muted small">Property</span>
                    <span className="fw-semibold text-dark">{receipt.house_title || house.title}</span>
                  </div>
                  <div className="d-flex justify-content-between border-bottom pb-2 mb-3">
                    <span className="text-muted small">Lease Period</span>
                    <span className="fw-semibold text-dark">
                      {receipt.start_date} to {receipt.end_date} ({receipt.months_paid} month{receipt.months_paid > 1 ? 's' : ''})
                    </span>
                  </div>
                  <div className="d-flex justify-content-between border-bottom pb-2 mb-3">
                    <span className="text-muted small">Tenant Name</span>
                    <span className="fw-semibold text-dark">{receipt.tenant_name}</span>
                  </div>
                  <div className="d-flex justify-content-between border-bottom pb-2 mb-3">
                    <span className="text-muted small">Caretaker for Key Handover</span>
                    <span className="fw-semibold text-success">
                      {receipt.caretaker_name || house.contact_name} ({receipt.caretaker_phone || house.contact_phone})
                    </span>
                  </div>
                  <div className="d-flex justify-content-between pt-1 fs-5">
                    <span className="fw-bold text-dark">Total Paid (USD)</span>
                    <span className="fw-bold text-success">${Number(receipt.total_amount_paid).toFixed(2)}</span>
                  </div>
                </div>

                <div className="d-flex gap-2 justify-content-center">
                  <button
                    type="button"
                    className="btn btn-outline-secondary px-4"
                    onClick={() => window.print()}
                  >
                    <i className="bi bi-printer me-1"></i> Print Receipt
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary px-4"
                    onClick={handleClose}
                  >
                    <i className="bi bi-check2-circle me-1"></i> Done & View Bookings
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {/* Error Banner */}
                {errorMessage && (
                  <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
                    <i className="bi bi-exclamation-triangle-fill"></i>
                    <div>{errorMessage}</div>
                  </div>
                )}

                <div className="row g-4">
                  {/* Left Column: Tenant Form */}
                  <div className="col-lg-7">
                    <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                      <i className="bi bi-person-lines-fill text-primary"></i>
                      Step 1: Tenant Information & Lease Terms
                    </h6>

                    <form onSubmit={handleProceedToPayment}>
                      <div className="row g-2 mb-3">
                        <div className="col-12">
                          <label className="form-label small fw-semibold text-secondary">Full Name *</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="e.g. Jane Doe"
                            value={tenantName}
                            onChange={(e) => setTenantName(e.target.value)}
                            disabled={isReadyForPayment}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label small fw-semibold text-secondary">Phone Number *</label>
                          <input
                            type="tel"
                            className="form-control"
                            placeholder="+254712345678"
                            value={tenantPhone}
                            onChange={(e) => setTenantPhone(e.target.value)}
                            disabled={isReadyForPayment}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label small fw-semibold text-secondary">Email Address *</label>
                          <input
                            type="email"
                            className="form-control"
                            placeholder="jane@example.com"
                            value={tenantEmail}
                            onChange={(e) => setTenantEmail(e.target.value)}
                            disabled={isReadyForPayment}
                            required
                          />
                        </div>
                      </div>

                      <div className="row g-2 mb-3">
                        <div className="col-md-6">
                          <label className="form-label small fw-semibold text-secondary">Move-in Date *</label>
                          <input
                            type="date"
                            className="form-control"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            disabled={isReadyForPayment}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label small fw-semibold text-secondary">Duration (Months) *</label>
                          <select
                            className="form-select"
                            value={monthsPaid}
                            onChange={(e) => setMonthsPaid(Number(e.target.value))}
                            disabled={isReadyForPayment}
                          >
                            <option value={1}>1 Month (Standard)</option>
                            <option value={2}>2 Months</option>
                            <option value={3}>3 Months (Quarterly)</option>
                            <option value={6}>6 Months (Half Year)</option>
                            <option value={12}>12 Months (Full Year)</option>
                          </select>
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label small fw-semibold text-secondary">Special Notes / Caretaker Requests</label>
                        <textarea
                          className="form-control"
                          rows="2"
                          placeholder="e.g. Need parking permit, moving in with a pet, weekend key handover..."
                          value={tenantNotes}
                          onChange={(e) => setTenantNotes(e.target.value)}
                          disabled={isReadyForPayment}
                        ></textarea>
                      </div>

                      {!isReadyForPayment ? (
                        <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold">
                          Confirm Lease Terms & Proceed to Payment
                          <i className="bi bi-arrow-right ms-2"></i>
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => setIsReadyForPayment(false)}
                        >
                          <i className="bi bi-pencil me-1"></i> Edit Tenant Details
                        </button>
                      )}
                    </form>
                  </div>

                  {/* Right Column: Pricing Breakdown & PayPal Buttons */}
                  <div className="col-lg-5">
                    <div className="p-3 bg-light rounded-3 border">
                      <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                        <i className="bi bi-receipt text-primary"></i>
                        Financial Breakdown
                      </h6>

                      <div className="d-flex justify-content-between small mb-2 text-secondary">
                        <span>Monthly Rent</span>
                        <span>${rent.toFixed(2)}</span>
                      </div>
                      <div className="d-flex justify-content-between small mb-2 text-secondary">
                        <span>Duration</span>
                        <span>{monthsPaid} Month{monthsPaid > 1 ? 's' : ''}</span>
                      </div>
                      <div className="d-flex justify-content-between small mb-2 text-secondary">
                        <span>Subtotal Rent</span>
                        <span className="fw-semibold text-dark">${totalRent.toFixed(2)}</span>
                      </div>
                      <div className="d-flex justify-content-between small mb-2 text-secondary">
                        <span>Refundable Deposit</span>
                        <span className="fw-semibold text-dark">${deposit.toFixed(2)}</span>
                      </div>

                      <div className="border-top pt-2 mt-2 mb-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="fw-bold text-dark">Total Due Now</span>
                          <span className="fw-bold text-primary fs-5">${totalPayable.toFixed(2)}</span>
                        </div>
                        <div className="text-muted extra-small mt-1">
                          Calculated lease: {startDate} to {endDate}
                        </div>
                      </div>

                      {/* Step 2: PayPal Payment */}
                      <div className="mt-4 pt-3 border-top">
                        <h6 className="fw-bold text-dark mb-2 small d-flex align-items-center gap-1">
                          <i className="bi bi-paypal text-primary"></i>
                          Step 2: PayPal Sandbox Payment
                        </h6>

                        {!isReadyForPayment ? (
                          <div className="text-center py-4 text-muted small bg-white rounded border border-dashed">
                            <i className="bi bi-lock-fill d-block fs-3 mb-1 text-secondary"></i>
                            Complete and confirm tenant details to activate PayPal payment button.
                          </div>
                        ) : (
                          <div className="paypal-button-container mt-2">
                            <p className="extra-small text-muted mb-2">
                              Clicking PayPal will atomically reserve this house for <strong>15 minutes</strong> while you complete checkout.
                            </p>
                            <PayPalButtons
                              style={{ layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay' }}
                              createOrder={handleCreatePayPalOrder}
                              onApprove={handleApprovePayment}
                              onCancel={handleCancelPayment}
                              onError={(err) => {
                                console.error('PayPal button error:', err);
                                setErrorMessage('PayPal encountered an error. Please try again or refresh.');
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

