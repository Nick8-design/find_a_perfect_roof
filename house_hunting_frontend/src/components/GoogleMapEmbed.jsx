import React from 'react';

export default function GoogleMapEmbed({
  location,
  latitude,
  longitude,
  title = 'House Location',
  height = 240,
  zoom = 16,
}) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || import.meta.env.GOOGLE_MAP || '';

  const hasCoords =
    latitude !== undefined &&
    latitude !== null &&
    longitude !== undefined &&
    longitude !== null &&
    !isNaN(Number(latitude)) &&
    !isNaN(Number(longitude));

  // If coordinates exist, construct exact pin query; otherwise fall back to neighborhood name
  const query = hasCoords
    ? `${Number(latitude).toFixed(6)},${Number(longitude).toFixed(6)}`
    : `${location || 'Nairobi'}, Kenya`;

  // Use Google Maps Embed API if key is provided, or universal Google Maps iframe
  const mapSrc = apiKey
    ? `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(query)}&zoom=${zoom}`
    : `https://maps.google.com/maps?q=${encodeURIComponent(query)}&hl=en&z=${zoom}&ie=UTF8&iwloc=&output=embed`;

  const externalMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

  return (
    <div className="google-map-container rounded-3 overflow-hidden border shadow-sm my-2 position-relative bg-white">
      <div className="d-flex justify-content-between align-items-center bg-white px-3 py-2 border-bottom">
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-geo-alt-fill text-danger fs-6 animate-bounce"></i>
          <div>
            <span className="small fw-bold text-dark text-truncate d-block" style={{ maxWidth: 220 }}>
              {title || location || 'Nairobi, Kenya'}
            </span>
            {hasCoords && (
              <span className="extra-small text-muted font-monospace" style={{ fontSize: '10px' }}>
                📍 {Number(latitude).toFixed(4)}°, {Number(longitude).toFixed(4)}°
              </span>
            )}
          </div>
        </div>
        <a
          href={externalMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline-primary btn-sm py-1 px-2 extra-small d-flex align-items-center gap-1 rounded-pill"
          title="Open in full Google Maps"
        >
          <i className="bi bi-box-arrow-up-right"></i>
          <span>Open Maps</span>
        </a>
      </div>

      <iframe
        title={`Map location for ${title}`}
        width="100%"
        height={height}
        style={{ border: 0, display: 'block' }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={mapSrc}
      ></iframe>
    </div>
  );
}
