import React from 'react';

export default function GoogleMapEmbed({ location, title = 'House Location', height = 240 }) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || import.meta.env.GOOGLE_MAP || '';
  const query = `${location || 'Nairobi'}, Kenya`;

  // Use Google Maps Embed API if key is provided, or universal Google Maps iframe
  const mapSrc = apiKey
    ? `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(query)}`
    : `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  const externalMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

  return (
    <div className="google-map-container rounded-3 overflow-hidden border shadow-sm my-3 position-relative">
      <div className="d-flex justify-content-between align-items-center bg-white px-3 py-2 border-bottom">
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-geo-alt-fill text-danger"></i>
          <span className="small fw-bold text-dark text-truncate" style={{ maxWidth: 220 }}>
            {location || 'Nairobi, Kenya'}
          </span>
        </div>
        <a
          href={externalMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline-primary btn-sm py-0 px-2 extra-small d-flex align-items-center gap-1"
          title="Open in full Google Maps app"
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

