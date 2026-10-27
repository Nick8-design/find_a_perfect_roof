import React, { useState } from 'react';
import { getRandomHouseImage } from '../assets/placeholders';
import GoogleMapEmbed from './GoogleMapEmbed';

export default function HouseCard({ house, onBook, onAskAI, onViewOnMap }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const id = house.id;
  const title = house.title || 'Rental Property';
  const location = house.location || 'Nairobi';
  const latitude = house.latitude;
  const longitude = house.longitude;
  const bedrooms = house.bedrooms || 1;
  const rent = house.monthly_rent || house.monthlyRent || 0;
  const deposit = house.deposit_amount || house.depositAmount || 0;
  const description = house.description || '';
  const contactName = house.contact_name || house.contactName || 'Caretaker';
  const contactPhone = house.contact_phone || house.contactPhone || '';
  const contactRole = house.contact_role || house.contactRole || 'Caretaker';
  const status = house.status || 'AVAILABLE';

  // Parse amenities
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

  // Parse images array for Carousel
  let imageList = [];
  if (Array.isArray(house.images) && house.images.length > 0) {
    imageList = house.images.filter((img) => typeof img === 'string' && img.trim().length > 0);
  } else if (typeof house.images === 'string' && house.images.startsWith('http')) {
    imageList = [house.images];
  }

  if (imageList.length === 0 || imageError) {
    imageList = [getRandomHouseImage(id ? id.length : 1)];
  }

  const isBooked = status === 'BOOKED';
  const isPending = status === 'PENDING_PAYMENT';
  const cleanPhone = contactPhone.replace(/[^0-9]/g, '');

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % imageList.length);
  };

  return (
    <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden bg-white d-flex flex-column house-card-hover transition-all">
      {/* Property Thumbnail with Interactive Photo Carousel */}
      <div className="position-relative overflow-hidden group-carousel" style={{ height: 210 }}>
        <img
          src={imageList[currentImageIndex] || imageList[0]}
          alt={`${title} - Photo ${currentImageIndex + 1}`}
          className="w-100 h-100 object-fit-cover transition-all"
          onError={() => setImageError(true)}
          style={{ transition: 'transform 0.3s ease' }}
        />

        {/* Status & Bedroom Badges */}
        <div className="position-absolute top-0 start-0 m-2 d-flex gap-1" style={{ zIndex: 2 }}>
          <span
            className="badge rounded-pill fw-semibold shadow-xs"
            style={{
              backgroundColor: isBooked ? '#DC2626' : isPending ? '#D97706' : '#059669',
              fontSize: '11px',
            }}
          >
            {status}
          </span>
          <span className="badge rounded-pill bg-dark bg-opacity-70 fw-normal shadow-xs" style={{ fontSize: '11px' }}>
            {bedrooms} {bedrooms === 1 ? 'bed' : 'beds'}
          </span>
        </div>

        {/* Multi-Photo Carousel Controls & Counter (if > 1 image) */}
        {imageList.length > 1 && (
          <>
            {/* Photo Counter Badge */}
            <span
              className="badge rounded-pill bg-dark bg-opacity-75 position-absolute top-0 end-0 m-2 fw-semibold shadow-xs"
              style={{ fontSize: '11px', zIndex: 2 }}
            >
              <i className="bi bi-camera me-1"></i>
              {currentImageIndex + 1}/{imageList.length}
            </span>

            {/* Left Chevron Button */}
            <button
              type="button"
              className="btn btn-dark btn-sm rounded-circle p-0 position-absolute top-50 start-0 translate-middle-y ms-2 d-flex align-items-center justify-content-center bg-opacity-75 border-0 shadow"
              style={{ width: 28, height: 28, zIndex: 3 }}
              onClick={handlePrevImage}
              aria-label="Previous photo"
            >
              <i className="bi bi-chevron-left" style={{ fontSize: '13px' }}></i>
            </button>

            {/* Right Chevron Button */}
            <button
              type="button"
              className="btn btn-dark btn-sm rounded-circle p-0 position-absolute top-50 end-0 translate-middle-y me-2 d-flex align-items-center justify-content-center bg-opacity-75 border-0 shadow"
              style={{ width: 28, height: 28, zIndex: 3 }}
              onClick={handleNextImage}
              aria-label="Next photo"
            >
              <i className="bi bi-chevron-right" style={{ fontSize: '13px' }}></i>
            </button>

            {/* Dot Indicator Pills */}
            <div className="position-absolute bottom-0 start-50 translate-middle-x mb-2 d-flex gap-1" style={{ zIndex: 2 }}>
              {imageList.map((_, idx) => (
                <span
                  key={idx}
                  className={`rounded-pill transition-all ${idx === currentImageIndex ? 'bg-white shadow-xs' : 'bg-white bg-opacity-50'}`}
                  style={{ width: idx === currentImageIndex ? 14 : 5, height: 5 }}
                ></span>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="card-body p-3 d-flex flex-column flex-grow-1">
        {/* Title, Location & Map Link */}
        <div className="mb-2">
          <div className="d-flex justify-content-between align-items-start gap-1">
            <h6 className="card-title fw-bold text-dark text-truncate mb-0" title={title}>
              {title}
            </h6>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-1">
            <div className="text-muted small text-truncate" style={{ maxWidth: '65%' }}>
              <i className="bi bi-geo-alt text-danger me-1"></i>
              {location}
            </div>

            {/* View on Map Button with Red Pin */}
            <button
              type="button"
              className="btn btn-sm btn-outline-primary rounded-pill px-2 py-0 d-flex align-items-center gap-1 extra-small"
              onClick={(e) => {
                e.stopPropagation();
                if (onViewOnMap) {
                  onViewOnMap(house);
                } else {
                  setShowMap(!showMap);
                }
              }}
              title="Pin and view exact location on Map"
            >
              <i className="bi bi-geo-alt-fill text-danger" style={{ fontSize: '11px' }}></i>
              <span>View on Map</span>
            </button>
          </div>
        </div>

        {/* Collapsible Inline Google Map with Pin */}
        {showMap && (
          <div className="mb-2 rounded-3 overflow-hidden animate-fade-in">
            <GoogleMapEmbed
              location={location}
              latitude={latitude}
              longitude={longitude}
              title={title}
              height={140}
            />
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
                className="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center shadow-xs"
                style={{ width: 28, height: 28, padding: 0 }}
                title="Call Caretaker"
              >
                <i className="bi bi-telephone" style={{ fontSize: '12px' }}></i>
              </a>
            )}
            {cleanPhone && (
              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-outline-success rounded-circle d-flex align-items-center justify-content-center shadow-xs"
                style={{ width: 28, height: 28, padding: 0 }}
                title="WhatsApp Caretaker"
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
            <i className="bi bi-stars me-1 text-primary"></i>
            Ask AI
          </button>
          <button
            type="button"
            className="btn btn-sm text-white rounded-pill flex-grow-1 d-flex align-items-center justify-content-center gap-1 shadow-xs"
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
