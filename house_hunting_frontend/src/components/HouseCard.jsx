import React, { useState } from 'react';
import { getRandomHouseImage } from '../assets/placeholders';

export default function HouseCard({ house, onBook, onAskAI }) {
  const [imageError, setImageError] = useState(false);

  // Normalize field names (handles both camelCase and snake_case from DB)
  const id = house.id;
  const title = house.title || 'Comfortable Rental Property';
  const location = house.location || 'Nairobi';
  const bedrooms = house.bedrooms || 1;
  const rent = house.monthly_rent || house.monthlyRent || 0;
  const deposit = house.deposit_amount || house.depositAmount || 0;
  const description = house.description || 'No description provided.';
  const contactName = house.contact_name || house.contactName || 'Caretaker';
  const contactPhone = house.contact_phone || house.contactPhone || '+254700000000';
  const contactRole = house.contact_role || house.contactRole || 'Caretaker';
  const status = house.status || 'AVAILABLE';

  // Normalize amenities
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

  // Normalize image
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

  return (
    <div className="card house-card h-100 shadow-sm border-0 overflow-hidden">
      {/* Property Image & Status Badges */}
      <div className="position-relative card-img-wrapper">
        <img
          src={displayImage}
          alt={title}
          className="card-img-top property-img"
          onError={() => setImageError(true)}
        />
        <div className="position-absolute top-0 start-0 m-3 d-flex gap-2">
          <span className={`badge rounded-pill ${
            isBooked ? 'bg-danger' : isPending ? 'bg-warning text-dark' : 'bg-success'
          }`}>
            <i className={`bi ${isBooked ? 'bi-lock-fill' : isPending ? 'bi-hourglass-split' : 'bi-check-circle-fill'} me-1`}></i>
            {status}
          </span>
          <span className="badge rounded-pill bg-dark bg-opacity-75 text-white">
            <i className="bi bi-door-closed me-1"></i>
            {bedrooms} {bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}
          </span>
        </div>
        <div className="position-absolute bottom-0 end-0 m-3">
          <div className="price-tag px-3 py-1 rounded-3 bg-white text-dark shadow-sm fw-bold">
            <span className="text-primary fs-5">${rent}</span>
            <span className="text-muted small"> /mo</span>
          </div>
        </div>
      </div>

      <div className="card-body d-flex flex-column p-4">
        {/* Title & Location */}
        <div className="mb-2">
          <h5 className="card-title fw-bold text-dark text-truncate mb-1" title={title}>
            {title}
          </h5>
          <div className="text-muted small d-flex align-items-center">
            <i className="bi bi-geo-alt-fill text-danger me-1"></i>
            <span>{location}</span>
          </div>
        </div>

        {/* Deposit Info */}
        <div className="d-flex align-items-center justify-content-between py-2 px-3 bg-light rounded-2 mb-3 small">
          <span className="text-secondary">Security Deposit:</span>
          <span className="fw-semibold text-dark">${deposit} (refundable)</span>
        </div>

        {/* Description */}
        <p className="card-text text-muted small mb-3 description-clamp">
          {description}
        </p>

        {/* Amenities */}
        {amenities && amenities.length > 0 && (
          <div className="d-flex flex-wrap gap-1 mb-3">
            {amenities.slice(0, 4).map((amenity, idx) => (
              <span key={idx} className="badge bg-light text-secondary border small fw-normal py-1 px-2">
                <i className="bi bi-check2 text-primary me-1"></i>
                {amenity}
              </span>
            ))}
            {amenities.length > 4 && (
              <span className="badge bg-light text-muted border small fw-normal py-1 px-2">
                +{amenities.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Caretaker / Landlord Info */}
        <div className="caretaker-info-box p-2 rounded-2 border mb-3 d-flex align-items-center justify-content-between mt-auto">
          <div className="d-flex align-items-center gap-2">
            <div className="avatar-circle bg-primary bg-opacity-10 text-primary fw-bold">
              {contactName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="fw-semibold small text-dark">{contactName}</div>
              <div className="text-muted extra-small">{contactRole}</div>
            </div>
          </div>
          <div className="d-flex gap-1">
            <a
              href={`tel:${contactPhone}`}
              className="btn btn-sm btn-outline-secondary rounded-circle icon-btn"
              title="Call Caretaker"
            >
              <i className="bi bi-telephone"></i>
            </a>
            <a
              href={`https://wa.me/${contactPhone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-sm btn-outline-success rounded-circle icon-btn"
              title="WhatsApp Caretaker"
            >
              <i className="bi bi-whatsapp"></i>
            </a>
          </div>
        </div>

        {/* Actions */}
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-primary btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-1"
            onClick={() => onAskAI && onAskAI(house)}
          >
            <i className="bi bi-stars"></i>
            Ask AI
          </button>
          <button
            type="button"
            className={`btn btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-1 ${
              isBooked ? 'btn-secondary disabled' : 'btn-primary'
            }`}
            disabled={isBooked}
            onClick={() => onBook && onBook(house)}
          >
            <i className="bi bi-paypal"></i>
            {isBooked ? 'Booked' : 'Book Now'}
          </button>
        </div>
      </div>
    </div>
  );
}

