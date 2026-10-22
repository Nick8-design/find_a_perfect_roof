import React, { useState } from 'react';
import { getRandomHouseImage } from '../assets/placeholders';
import GoogleMapEmbed from './GoogleMapEmbed';

export default function HouseCard({ house, onBook, onAskAI }) {
  const [imageError, setImageError] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const id = house.id;
  const title = house.title || 'Rental Property';
  const location = house.location || 'Nairobi';
  const bedrooms = house.bedrooms || 1;
  const rent = house.monthly_rent || house.monthlyRent || 0;
  const deposit = house.deposit_amount || house.depositAmount || 0;
  const description = house.description || '';
  const contactName = house.contact_name || house.contactName || 'Caretaker';
  const contactPhone = house.contact_phone || house.contactPhone || '';
  const contactRole = house.contact_role || house.contactRole || 'Caretaker';
  const status = house.status || 'AVAILABLE';

  let amenities = [];
  if (Array.isArray(house.amenities)) {
    amenities = house.amenities;
  } else if (typeof house.amenities === 'string') {
    try {
      amenities = JSON.parse(house.amenities);
    } catch {
      amenities = house.amenities.split(',').map((a) => a.trim());
    }
  }

  let displayImage = null;
  if (!imageError) {
    if (Array.isArray(house.images) && house.images.length > 0) {
      displayImage = house.images[0];
    } else if (typeof house.images === 'string' && house.images.startsWith('http')) {
      displayImage = house.images;
    }
  }
  if (!displayImage) {
    displayImage = getRandomHouseImage(id ? id.length : 1);
  }

  const isBooked = status === 'BOOKED';
  const isPending = status === 'PENDING_PAYMENT';
  const cleanPhone = contactPhone.replace(/[^0-9]/g, '');

  return (
    <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden bg-white d-flex flex-column">
      {/* Property Thumbnail */}
      <div className="position-relative" style={{ height: 190 }}>
        <img
          src={displayImage}
          alt={title}
          className="w-100 h-100 object-fit-cover"
          onError={() => setImageError(true)}
        />
        <div className="position-absolute top-0 start-0 m-2 d-flex gap-1">
          <span
            className="badge rounded-pill fw-normal"
            style={{
              backgroundColor: isBooked ? '#DC2626' : isPending ? '#D97706' : '#059669',
              fontSize: '11px',
            }}
          >
            {status}
          </span>
          <span className="badge rounded-pill bg-dark bg-opacity-60 fw-normal" style={{ fontSize: '11px' }}>
            {bedrooms} {bedrooms === 1 ? 'bed' : 'beds'}
          </span>
        </div>
      </div>

      <div className="card-body p-3 d-flex flex-column flex-grow-1">
        {/* Title, Location & Map Link */}
        <div className="mb-2">
          <div className="d-flex justify-content-between align-items-start gap-1">
            <h6 className="card-title fw-bold text-dark text-truncate mb-0" title={title}>
              {title}
            </h6>
            <button
              type="button"
              className="btn btn-link btn-sm p-0 text-decoration-none"
              style={{ color: '#0070BA', fontSize: '12px' }}
              onClick={() => setShowMap(!showMap)}
            >
              {showMap ? 'Hide map' : 'Map'}
            </button>
          </div>
          <div className="text-muted small">
            <i className="bi bi-geo-alt me-1"></i>
            {location}
          </div>
        </div>

        {/* Collapsible Google Map */}
        {showMap && (
          <div className="mb-2 rounded-3 overflow-hidden">
            <GoogleMapEmbed location={location} title={title} height={140} />
          </div>
        )}

        {/* Price & Deposit Summary */}
        <div className="d-flex align-items-baseline justify-content-between my-2">
          <div>
            <span className="fs-5 fw-bold text-dark">${rent}</span>
            <span className="text-muted small">/mo</span>
          </div>
          <span className="text-muted" style={{ fontSize: '12px' }}>
            Deposit: ${deposit}
          </span>
        </div>

        {/* Description */}
        {description && (
          <p
            className="card-text text-muted small mb-2"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              fontSize: '13px',
            }}
          >
            {description}
          </p>
        )}

        {/* Amenities Chips */}
        {amenities.length > 0 && (
          <div className="d-flex flex-wrap gap-1 mb-3">
            {amenities.slice(0, 3).map((amenity, idx) => (
              <span
                key={idx}
                className="badge rounded-pill fw-normal text-muted"
                style={{ backgroundColor: '#F1F5F9', fontSize: '11px' }}
              >
                {amenity}
              </span>
            ))}
            {amenities.length > 3 && (
              <span className="badge rounded-pill fw-normal text-muted" style={{ backgroundColor: '#F1F5F9', fontSize: '11px' }}>
                +{amenities.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Caretaker Strip */}
        <div className="d-flex align-items-center justify-content-between p-2 rounded-3 border mb-3 mt-auto" style={{ backgroundColor: '#FAFAFA' }}>
          <div>
            <div className="fw-semibold text-dark" style={{ fontSize: '13px' }}>{contactName}</div>
            <div className="text-muted" style={{ fontSize: '11px' }}>{contactRole}</div>
          </div>
          <div className="d-flex gap-1">
            {contactPhone && (
              <a
                href={`tel:${contactPhone}`}
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
                rel="noreferrer"
                className="btn btn-sm btn-outline-success rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: 28, height: 28, padding: 0 }}
                title="WhatsApp"
              >
                <i className="bi bi-whatsapp" style={{ fontSize: '12px' }}></i>
              </a>
            )}
          </div>
        </div>

        {/* Actions: Ask AI & PayPal Reserve */}
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary rounded-pill flex-grow-1"
            onClick={() => onAskAI && onAskAI(house)}
          >
            Ask AI
          </button>
          <button
            type="button"
            className="btn btn-sm text-white rounded-pill flex-grow-1 d-flex align-items-center justify-content-center gap-1"
            style={{ backgroundColor: isBooked ? '#94A3B8' : '#001C3D' }}
            disabled={isBooked}
            onClick={() => onBook && onBook(house)}
          >
            <i className="bi bi-paypal"></i>
            <span>{isBooked ? 'Booked' : 'Book'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}