import React, { useState, useEffect, useCallback } from 'react';
import HouseCard from '../components/HouseCard';
import GoogleMapEmbed from '../components/GoogleMapEmbed';
import { getHouses } from '../services/api';
import { PLACEHOLDER_HOUSES } from '../assets/placeholders';

const SAMPLE_FALLBACK_HOUSES = [
  {
    id: 'house_1',
    title: 'Modern 2-Bedroom Suite in Westlands',
    location: 'Westlands, Nairobi',
    latitude: -1.2683,
    longitude: 36.8044,
    bedrooms: 2,
    monthly_rent: 650,
    deposit_amount: 650,
    description: 'Bright open-plan apartment with master ensuite, high-speed fiber internet, modern kitchen, and 24/7 security.',
    images: [
      PLACEHOLDER_HOUSES[0],
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['WiFi', 'Backup Generator', 'Parking', '24/7 Security', 'Borehole'],
    contact_name: 'David Mwangi',
    contact_phone: '+254712345678',
    contact_role: 'Caretaker',
    status: 'AVAILABLE',
  },
  {
    id: 'house_2',
    title: 'Studio Apartment near Yaya Centre in Kilimani',
    location: 'Kilimani, Nairobi',
    latitude: -1.2921,
    longitude: 36.7865,
    bedrooms: 1,
    monthly_rent: 420,
    deposit_amount: 420,
    description: 'Furnished studio with private balcony, fitted kitchen, and sitting nook. Walking distance to shopping and dining.',
    images: [
      PLACEHOLDER_HOUSES[1],
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['WiFi', 'Parking', 'Gym', 'CCTV'],
    contact_name: 'Grace Wanjiku',
    contact_phone: '+254722987654',
    contact_role: 'Property Manager',
    status: 'AVAILABLE',
  },
  {
    id: 'house_3',
    title: '3-Bedroom Villa with Garden in Karen',
    location: 'Karen, Nairobi',
    latitude: -1.3197,
    longitude: 36.7065,
    bedrooms: 3,
    monthly_rent: 1200,
    deposit_amount: 1200,
    description: 'Quiet detached suburban home with sunken sitting room, country kitchen, private green lawn, and solar water heating.',
    images: [
      PLACEHOLDER_HOUSES[2],
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Private Garden', 'Electric Fence', 'Solar Heating', 'Pet Friendly'],
    contact_name: 'Samuel Kiprop',
    contact_phone: '+254733112233',
    contact_role: 'Landlord',
    status: 'AVAILABLE',
  },
  {
    id: 'house_4',
    title: 'Executive 2-Bedroom Penthouse in Upper Hill',
    location: 'Upper Hill, Nairobi',
    latitude: -1.2995,
    longitude: 36.8163,
    bedrooms: 2,
    monthly_rent: 850,
    deposit_amount: 850,
    description: 'Penthouse with skyline views, large sitting room, modern fitted kitchen, private elevator access, and rooftop swimming pool.',
    images: [
      PLACEHOLDER_HOUSES[3],
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Swimming Pool', 'Elevator', 'Gym', 'High-Speed WiFi'],
    contact_name: 'Alex Otieno',
    contact_phone: '+254799001122',
    contact_role: 'Caretaker',
    status: 'AVAILABLE',
  },
];

export default function ExplorePage({ onBookHouse, onAskAI, searchQuery = '', setSearchQuery }) {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  // Filters
  const [locationFilter, setLocationFilter] = useState('');
  const [maxRent, setMaxRent] = useState(2500);
  const [bedrooms, setBedrooms] = useState('all');

  // Map State & Pinned House
  const [selectedMapHouse, setSelectedMapHouse] = useState(null);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [showGlobalMapView, setShowGlobalMapView] = useState(false);

  useEffect(() => {
    if (searchQuery !== undefined) {
      setLocationFilter(searchQuery);
    }
  }, [searchQuery]);

  const fetchListingData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getHouses({
        location: locationFilter || undefined,
        maxRent: maxRent > 0 ? maxRent : undefined,
        bedrooms: bedrooms !== 'all' ? bedrooms : undefined,
      });

      if (res && res.houses) {
        setHouses(res.houses);
        setUsingFallback(false);
      } else {
        throw new Error('Invalid response structure');
      }
    } catch {
      let filtered = [...SAMPLE_FALLBACK_HOUSES];
      if (locationFilter.trim()) {
        const q = locationFilter.toLowerCase();
        filtered = filtered.filter(
          (h) => h.location.toLowerCase().includes(q) || h.title.toLowerCase().includes(q)
        );
      }
      if (maxRent) {
        filtered = filtered.filter((h) => (h.monthly_rent || h.monthlyRent) <= Number(maxRent));
      }
      if (bedrooms !== 'all') {
        filtered = filtered.filter((h) => h.bedrooms === Number(bedrooms));
      }
      setHouses(filtered);
      setUsingFallback(true);
    } finally {
      setLoading(false);
    }
  }, [locationFilter, maxRent, bedrooms]);

  useEffect(() => {
    const timer = setTimeout(() => fetchListingData(), 250);
    return () => clearTimeout(timer);
  }, [fetchListingData]);

  const handleResetFilters = () => {
    setLocationFilter('');
    if (setSearchQuery) setSearchQuery('');
    setMaxRent(2500);
    setBedrooms('all');
  };

  const handleViewOnMap = (house) => {
    setSelectedMapHouse(house);
    setIsMapModalOpen(true);
  };

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: '#F5F7FA', minHeight: '100vh' }}>
      
      {/* Filter Bar */}
      <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-white">
        <div className="row g-3 align-items-center">
          
          {/* Location Search */}
          <div className="col-lg-4 col-md-6">
            <label className="form-label small fw-semibold text-muted mb-1">Location / Neighborhood</label>
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-transparent border-end-0 text-muted">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                style={{ borderColor: '#CBD5E1' }}
                placeholder="e.g. Westlands, Kilimani, Karen..."
                value={locationFilter}
                onChange={(e) => {
                  setLocationFilter(e.target.value);
                  if (setSearchQuery) setSearchQuery(e.target.value);
                }}
              />
            </div>
          </div>

          {/* Bedrooms */}
          <div className="col-lg-3 col-md-6">
            <label className="form-label small fw-semibold text-muted mb-1">Bedrooms</label>
            <select
              className="form-select form-select-sm"
              style={{ borderColor: '#CBD5E1' }}
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
            >
              <option value="all">All Bedrooms</option>
              <option value="1">1 Bedroom / Studio</option>
              <option value="2">2 Bedrooms</option>
              <option value="3">3 Bedrooms</option>
              <option value="4">4+ Bedrooms / Villas</option>
            </select>
          </div>

          {/* Max Rent Slider */}
          <div className="col-lg-3 col-md-8">
            <div className="d-flex justify-content-between mb-1">
              <label className="form-label small fw-semibold text-muted mb-0">Max Budget</label>
              <span className="fw-bold small" style={{ color: '#001C3D' }}>${maxRent}/mo</span>
            </div>
            <input
              type="range"
              className="form-range"
              min="200"
              max="3000"
              step="50"
              value={maxRent}
              onChange={(e) => setMaxRent(Number(e.target.value))}
            />
          </div>

          {/* Reset Action */}
          <div className="col-lg-2 col-md-4 d-flex align-items-end">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary rounded-pill w-100 py-1"
              onClick={handleResetFilters}
            >
              Reset Filters
            </button>
          </div>

        </div>
      </div>

      {/* Results Header with View Mode Toggle */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3 px-1">
        <div className="d-flex align-items-center gap-2">
          <h5 className="fw-bold text-dark mb-0">Available Properties</h5>
          <span className="badge rounded-pill px-2 py-1" style={{ backgroundColor: '#EDF1F5', color: '#001C3D' }}>
            {houses.length}
          </span>
          {usingFallback && (
            <span className="badge bg-warning bg-opacity-25 text-warning-emphasis small">
              ● Offline Mode
            </span>
          )}
        </div>

        {/* Global Map Toggle */}
        {/* <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            className={`btn btn-sm rounded-pill px-3 d-flex align-items-center gap-1 shadow-xs ${
              showGlobalMapView ? 'btn-primary' : 'btn-outline-primary bg-white'
            }`}
            onClick={() => setShowGlobalMapView(!showGlobalMapView)}
          >
            <i className={`bi ${showGlobalMapView ? 'bi-grid-fill' : 'bi-map-fill'} text-danger`}></i>
            <span>{showGlobalMapView ? 'Show Property Grid' : 'Map View Explorer'}</span>
          </button>
        </div> */}
      </div>

      {/* Global Interactive Map Section (when toggled) */}
      {/* {showGlobalMapView && (
        <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-white animate-fade-in">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-geo-alt-fill text-danger fs-5"></i>
              <span className="fw-bold text-dark">Nairobi Rental Location Explorer</span>
              <span className="text-muted small">
                ({houses.length} properties available in this area)
              </span>
            </div>
            <button
              type="button"
              className="btn-close"
              aria-label="Close Map"
              onClick={() => setShowGlobalMapView(false)}
            ></button>
          </div>
          <GoogleMapEmbed
            location={locationFilter || 'Nairobi, Kenya'}
            latitude={selectedMapHouse?.latitude || -1.286389}
            longitude={selectedMapHouse?.longitude || 36.817223}
            title={selectedMapHouse ? selectedMapHouse.title : 'Nairobi Rentals Map'}
            height={360}
            zoom={selectedMapHouse ? 16 : 13}
          />
        </div>
      )} */}

      {/* Properties Grid */}
      {loading ? (
        <div className="row g-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="col-xl-3 col-lg-4 col-md-6">
              <div className="card border-0 shadow-sm rounded-4 p-3 placeholder-glow h-100 bg-white">
                <div className="placeholder rounded-3 mb-3 w-100" style={{ height: 200 }}></div>
                <div className="placeholder col-8 mb-2"></div>
                <div className="placeholder col-4 mb-3"></div>
                <div className="placeholder col-12 mb-2"></div>
                <div className="placeholder col-10 mb-4"></div>
                <div className="placeholder col-12 py-3 rounded-pill"></div>
              </div>
            </div>
          ))}
        </div>
      ) : houses.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center my-4 bg-white">
          <div className="mb-3 text-muted">
            <i className="bi bi-search fs-1"></i>
          </div>
          <h5 className="fw-bold text-dark">No properties found matching your criteria</h5>
          <p className="text-muted small mx-auto mb-4" style={{ maxWidth: 420 }}>
            Try increasing your maximum budget or clearing location filters. You can also ask our AI agent Nixy to recommend alternative neighborhoods.
          </p>
          <div className="d-flex gap-2 justify-content-center">
            <button className="btn btn-sm btn-outline-secondary rounded-pill px-3" onClick={handleResetFilters}>
              Clear Filters
            </button>
            <button
              className="btn btn-sm text-white rounded-pill px-3 shadow-xs"
              style={{ backgroundColor: '#0070BA' }}
              onClick={() => onAskAI && onAskAI()}
            >
              <i className="bi bi-stars me-1"></i>
              Ask Nixy AI
            </button>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {houses.map((house) => (
            <div key={house.id || house.title} className="col-xl-3 col-lg-4 col-md-6">
              <HouseCard
                house={house}
                onBook={onBookHouse}
                onAskAI={() => {
                  if (onAskAI) {
                    onAskAI(`Tell me more about ${house.title} in ${house.location} ($${house.monthly_rent || house.monthlyRent}/mo).`);
                  }
                }}
                onViewOnMap={handleViewOnMap}
              />
            </div>
          ))}
        </div>
      )}

      {/* Pinned House Location Modal (when "View on Map" is clicked) */}
      {isMapModalOpen && selectedMapHouse && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', zIndex: 1060 }}
          onClick={() => setIsMapModalOpen(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
              
              {/* Modal Header */}
              <div className="modal-header  text-white p-3 px-4 border-0"  style={{ backgroundColor: '#001C3D'}}     >
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-geo-alt-fill text-danger fs-5"></i>
                  <div>
                    <h6 className="modal-title fw-bold text-white mb-0 text-truncate" style={{ maxWidth: 450 }}>
                      {selectedMapHouse.title}
                    </h6>
                    <span className="extra-small text-white-50">
                      📍 {selectedMapHouse.location}
                      {selectedMapHouse.latitude && selectedMapHouse.longitude && (
                        ` • ${Number(selectedMapHouse.latitude).toFixed(4)}°, ${Number(selectedMapHouse.longitude).toFixed(4)}°`
                      )}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  aria-label="Close"
                  onClick={() => setIsMapModalOpen(false)}
                ></button>
              </div>

              {/* Modal Body: Map + Property Summary */}
              <div className="modal-body p-3">
                {/* Embedded Interactive Map pinned at coordinates */}
                <GoogleMapEmbed
                  location={selectedMapHouse.location}
                  latitude={selectedMapHouse.latitude}
                  longitude={selectedMapHouse.longitude}
                  title={selectedMapHouse.title}
                  height={320}
                  zoom={16}
                />

                {/* Quick House Snapshot */}
                <div className="d-flex flex-wrap align-items-center justify-content-between p-3 mt-2 rounded-3 bg-light border">
                  <div>
                    <div className="d-flex align-items-baseline gap-2">
                      <span className="fs-5 fw-bold text-dark">
                        ${selectedMapHouse.monthly_rent || selectedMapHouse.monthlyRent}
                      </span>
                      <span className="text-muted small">/month</span>
                      <span className="badge rounded-pill bg-primary bg-opacity-10 text-primary small ms-2">
                        {selectedMapHouse.bedrooms} {selectedMapHouse.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}
                      </span>
                    </div>
                    <div className="text-muted small mt-1">
                      Caretaker: <strong>{selectedMapHouse.contact_name || selectedMapHouse.contactName || 'Caretaker'}</strong>
                      {selectedMapHouse.contact_phone || selectedMapHouse.contactPhone ? ` (${selectedMapHouse.contact_phone || selectedMapHouse.contactPhone})` : ''}
                    </div>
                  </div>

                  <div className="d-flex gap-2 mt-2 mt-sm-0">
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm rounded-pill px-3"
                      onClick={() => {
                        setIsMapModalOpen(false);
                        if (onAskAI) onAskAI(selectedMapHouse);
                      }}
                    >
                      <i className="bi bi-stars me-1 text-primary"></i>
                      Ask AI
                    </button>
                    <button
                      type="button"
                      className="btn btn-dark btn-sm rounded-pill px-4 shadow-sm d-flex align-items-center gap-1"
                      style={{ backgroundColor: '#001C3D'}} 
                      onClick={() => {
                        setIsMapModalOpen(false);
                        if (onBookHouse) onBookHouse(selectedMapHouse);
                      }}
                    >
                      <i className="bi bi-paypal text-primary"></i>
                      <span>Reserve Property</span>
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
