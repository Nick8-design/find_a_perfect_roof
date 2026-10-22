import React, { useState, useEffect } from 'react';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { createBookingOrder, captureBookingOrder, cancelBookingOrder } from '../services/api';
import { useAuth } from '../context/AuthContext';
import GoogleMapEmbed from './GoogleMapEmbed';
import { PLACEHOLDER_HOUSES } from '../assets/placeholders';

export default function BookingModal({ house, isOpen, onClose, onBookingSuccess }) {
  const { user } = useAuth();

  if (!isOpen || !house) return null;

  const rent = Number(house.monthly_rent || house.monthlyRent || 0);
  const deposit = Number(house.deposit_amount || house.depositAmount || 0);

  const [tenantName, setTenantName] = useState(user?.name || '');
  const [tenantPhone, setTenantPhone] = useState(user?.phone || '');
  const [tenantEmail, setTenantEmail] = useState(user?.email || '');
  const [monthsPaid, setMonthsPaid] = useState(1);
  const [startDate, setStartDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [tenantNotes, setTenantNotes] = useState('');
  const [showMap, setShowMap] = useState(false);

  const [isReadyForPayment, setIsReadyForPayment] = useState(false);
  const [activeBookingId, setActiveBookingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    if (user) {
      if (!tenantName) setTenantName(user.name || '');
      if (!tenantEmail) setTenantEmail(user.email || '');
      if (!tenantPhone) setTenantPhone(user.phone || '');
    }
  }, [user]);

  const totalRent = rent * monthsPaid;
  const totalPayable = totalRent + deposit;

  const calculateEndDate = (start, months) => {
    if (!start) return '';
    const d = new Date(start);
    d.setMonth(d.getMonth() + Number(months));
    return d.toISOString().split('T')[0];
  };

  const endDate = calculateEndDate(startDate, monthsPaid);

  const validateForm = () => {
    if (!tenantName.trim()) {
      setErrorMessage('Full name is required.');
      return false;
    }
    if (!tenantPhone.trim()) {
      setErrorMessage('Phone number is required.');
      return false;
    }
    if (!tenantEmail.trim() || !tenantEmail.includes('@')) {
      setErrorMessage('Valid email address is required.');
      return false;
    }
    if (!startDate) {
      setErrorMessage('Select a move-in date.');
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const handleProceedToPayment = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setErrorMessage(null);

      const userId = user?.id || localStorage.getItem('house_hunter_userId') || `user_${Date.now()}`;
      localStorage.setItem('house_hunter_userId', userId);

      const payload = {
        houseId: house.id,
        userId,
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
        setIsReadyForPayment(true);
      } else {
        throw new Error(result.error || 'Failed to initialize PayPal order.');
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.error || err.message || 'Failed to reserve house.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (data) => {
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
        const fullReceipt = {
          booking_id: activeBookingId,
          house_id: house.id,
          house_title: house.title,
          house_location: house.location,
          house_image: (Array.isArray(house.images) && house.images[0]) || PLACEHOLDER_HOUSES[0],
          tenant_name: tenantName,
          tenant_phone: tenantPhone,
          tenant_email: tenantEmail,
          months_paid: Number(monthsPaid),
          monthly_rent: rent,
          deposit_amount: deposit,
          total_amount_paid: totalPayable,
          start_date: startDate,
          end_date: endDate,
          paypal_capture_id: result.booking.paypal_capture_id || data.orderID,
          caretaker_name: house.contact_name,
          caretaker_phone: house.contact_phone,
          paid_at: new Date().toISOString(),
          status: 'PAID',
        };

        const existingBookings = JSON.parse(localStorage.getItem('confirmed_bookings') || '[]');
        existingBookings.unshift(fullReceipt);
        localStorage.setItem('confirmed_bookings', JSON.stringify(existingBookings));

        setReceipt(fullReceipt);
        if (onBookingSuccess) onBookingSuccess(fullReceipt);
      } else {
        throw new Error(result.error || 'Failed to capture payment.');
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.error || err.message || 'Payment capture failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelPayment = async () => {
    if (activeBookingId) {
      try {
        await cancelBookingOrder({ houseId: house.id, bookingId: activeBookingId });
      } catch (err) {
        console.error('Error canceling order:', err);
      }
    }
    setIsReadyForPayment(false);
    setActiveBookingId(null);
  };

  const handleCloseModal = () => {
    if (isReadyForPayment && !receipt) handleCancelPayment();
    onClose();
  };

  const houseImages = Array.isArray(house.images) && house.images.length > 0 ? house.images : PLACEHOLDER_HOUSES;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 28, 61, 0.6)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content rounded-4 border-0 shadow-lg overflow-hidden bg-white">
          
          {/* Header */}
          <div className="p-4 border-bottom d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center text-white"
                style={{ width: 32, height: 32, backgroundColor: '#0070BA' }}
              >
                <i className="bi bi-paypal" style={{ fontSize: '15px' }}></i>
              </div>
              <div>
                <h6 className="fw-bold text-dark mb-0">Reserve Property</h6>
                <span className="text-muted small">15-minute reservation hold</span>
              </div>
            </div>
            <button type="button" className="btn-close" onClick={handleCloseModal} disabled={loading}></button>
          </div>

          <div className="modal-body p-4">
            
            {/* SUCCESS RECEIPT VIEW */}
            {receipt ? (
              <div className="text-center py-4">
                <div
                  className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center text-white"
                  style={{ width: 48, height: 48, backgroundColor: '#059669' }}
                >
                  <i className="bi bi-check-lg fs-4"></i>
                </div>
                <h5 className="fw-bold text-dark mb-1">Reservation Confirmed</h5>
                <p className="text-muted small mx-auto mb-4" style={{ maxWidth: 380 }}>
                  Your deposit for <strong>{receipt.house_title}</strong> has been secured via PayPal.
                </p>

                <div className="p-3 rounded-3 text-start small mb-4 mx-auto border" style={{ maxWidth: 420, backgroundColor: '#F8FAFC' }}>
                  <div className="d-flex justify-content-between mb-1 text-muted">
                    <span>Reference:</span>
                    <strong className="text-dark font-monospace">{receipt.booking_id}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-1 text-muted">
                    <span>Duration:</span>
                    <strong className="text-dark">{receipt.months_paid} month(s)</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-1 text-muted">
                    <span>Total Paid:</span>
                    <strong style={{ color: '#059669' }}>${Number(receipt.total_amount_paid).toFixed(2)}</strong>
                  </div>
                  <div className="d-flex justify-content-between border-top pt-2 mt-2 text-muted">
                    <span>Caretaker Contact:</span>
                    <strong className="text-dark">{receipt.caretaker_name} ({receipt.caretaker_phone})</strong>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn text-white px-4 py-2 rounded-pill fw-semibold"
                  style={{ backgroundColor: '#001C3D' }}
                  onClick={handleCloseModal}
                >
                  Done
                </button>
              </div>
            ) : (
              // BOOKING FORM VIEW
              <div className="row g-4">
                
                {/* Left Column: Property Summary */}
                <div className="col-md-5 border-end">
                  <div className="rounded-3 overflow-hidden mb-3" style={{ height: 160 }}>
                    <img src={houseImages[0]} alt={house.title} className="w-100 h-100 object-fit-cover" />
                  </div>
                  <h6 className="fw-bold text-dark mb-1 text-truncate">{house.title}</h6>
                  <div className="text-muted small mb-3">
                    <i className="bi bi-geo-alt me-1"></i>
                    {house.location}
                  </div>

                  <div className="p-3 rounded-3 small mb-3 border" style={{ backgroundColor: '#F8FAFC' }}>
                    <div className="d-flex justify-content-between mb-1 text-muted">
                      <span>Rent ({monthsPaid} mo):</span>
                      <span className="text-dark">${totalRent.toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2 text-muted">
                      <span>Deposit:</span>
                      <span className="text-dark">${deposit.toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between border-top pt-2 fw-bold text-dark">
                      <span>Total Due:</span>
                      <span style={{ color: '#0070BA' }}>${totalPayable.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-sm btn-link text-decoration-none p-0"
                    style={{ color: '#0070BA', fontSize: '13px' }}
                    onClick={() => setShowMap(!showMap)}
                  >
                    {showMap ? 'Hide map' : 'View on map'}
                  </button>
                  {showMap && <GoogleMapEmbed location={house.location} title={house.title} height={140} />}
                </div>

                {/* Right Column: Details or PayPal */}
                <div className="col-md-7">
                  {errorMessage && (
                    <div className="alert alert-danger py-2 px-3 rounded-3 small mb-3 border-0">
                      {errorMessage}
                    </div>
                  )}

                  {!isReadyForPayment ? (
                    <form onSubmit={handleProceedToPayment}>
                      <h6 className="fw-bold text-dark mb-3">Tenancy Details</h6>

                      <div className="mb-2">
                        <label className="form-label small fw-semibold text-muted mb-1">Full Name</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Jane Doe"
                          value={tenantName}
                          onChange={(e) => setTenantName(e.target.value)}
                          required
                        />
                      </div>

                      <div className="row g-2 mb-2">
                        <div className="col-sm-6">
                          <label className="form-label small fw-semibold text-muted mb-1">Email</label>
                          <input
                            type="email"
                            className="form-control form-control-sm"
                            placeholder="name@example.com"
                            value={tenantEmail}
                            onChange={(e) => setTenantEmail(e.target.value)}
                            required
                          />
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label small fw-semibold text-muted mb-1">Phone</label>
                          <input
                            type="tel"
                            className="form-control form-control-sm"
                            placeholder="+254 700 000 000"
                            value={tenantPhone}
                            onChange={(e) => setTenantPhone(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="row g-2 mb-3">
                        <div className="col-sm-6">
                          <label className="form-label small fw-semibold text-muted mb-1">Duration</label>
                          <select
                            className="form-select form-select-sm"
                            value={monthsPaid}
                            onChange={(e) => setMonthsPaid(Number(e.target.value))}
                          >
                            <option value={1}>1 Month</option>
                            <option value={2}>2 Months</option>
                            <option value={3}>3 Months</option>
                            <option value={6}>6 Months</option>
                            <option value={12}>12 Months</option>
                          </select>
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label small fw-semibold text-muted mb-1">Move-in Date</label>
                          <input
                            type="date"
                            className="form-control form-control-sm"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label small fw-semibold text-muted mb-1">Notes (Optional)</label>
                        <textarea
                          className="form-control form-control-sm"
                          rows="2"
                          placeholder="Arrival time, parking preference..."
                          value={tenantNotes}
                          onChange={(e) => setTenantNotes(e.target.value)}
                        />
                      </div>

                      <div className="d-flex justify-content-end gap-2 pt-2 border-top">
                        <button type="button" className="btn btn-sm btn-outline-secondary rounded-pill px-3" onClick={handleCloseModal}>
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="btn btn-sm text-white rounded-pill px-4"
                          style={{ backgroundColor: '#001C3D' }}
                          disabled={loading}
                        >
                          {loading ? 'Locking...' : 'Continue to PayPal'}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="fw-bold text-dark mb-0">Checkout</h6>
                        <button
                          type="button"
                          className="btn btn-link btn-sm p-0 text-decoration-none"
                          style={{ color: '#0070BA', fontSize: '13px' }}
                          onClick={handleCancelPayment}
                          disabled={loading}
                        >
                          Back
                        </button>
                      </div>

                      <div className="p-2 rounded-3 small mb-3 border text-muted" style={{ backgroundColor: '#F8FAFC' }}>
                        <i className="bi bi-clock me-1"></i>
                        Property held for 15 minutes. Complete payment to confirm lease.
                      </div>

                      <div className="mt-3">
                        <PayPalButtons
                          style={{ layout: 'vertical', shape: 'pill', color: 'gold' }}
                          createOrder={async () => {
                            const res = await createBookingOrder({
                              houseId: house.id,
                              userId: user?.id || localStorage.getItem('house_hunter_userId') || `user_${Date.now()}`,
                              tenantName,
                              tenantPhone,
                              tenantEmail,
                              monthsPaid: Number(monthsPaid),
                              startDate,
                              tenantNotes,
                            });
                            setActiveBookingId(res.bookingId);
                            return res.orderId;
                          }}
                          onApprove={handleApprove}
                          onError={() => setErrorMessage('Payment could not be completed. Please try again.')}
                          onCancel={handleCancelPayment}
                        />
                      </div>
                    </div>
                  )}

                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}