import React, { useState, useEffect, useCallback } from 'react';
import HouseCard from '../components/HouseCard';
import { getHouses } from '../services/api';
import { PLACEHOLDER_HOUSES } from '../assets/placeholders';

// Fallback seed data in case backend server is temporarily unstarted
const SAMPLE_FALLBACK_HOUSES = [
  {
    id: 'house_1',
    title: 'Modern 2-Bedroom Luxury Suite in Westlands',
    location: 'Westlands, Nairobi',
    bedrooms: 2,
    monthly_rent: 650,
    deposit_amount: 650,
    description: 'Spacious open-concept apartment with floor-to-ceiling windows, high-speed fiber internet, and 24/7 security concierge.',
    images: [PLACEHOLDER_HOUSES[0]],
    amenities: ['WiFi', 'Backup Generator', 'Parking', '24/7 Security', 'Borehole Water'],
    contact_name: 'David Mwangi',
    contact_phone: '+254712345678',
    contact_role: 'Caretaker',
    status: 'AVAILABLE',
  },
  {
    id: 'house_2',
    title: 'Cozy 1-Bedroom Studio near Yaya Centre',
    location: 'Kilimani, Nairobi',
    bedrooms: 1,
    monthly_rent: 420,
    deposit_amount: 420,
    description: 'Charming fully-tiled studio with private balcony and modern kitchen fittings. Walking distance to shopping and restaurants.',
    images: [PLACEHOLDER_HOUSES[1]],
    amenities: ['WiFi', 'Parking', 'Gym', 'CCTV Surveillance'],
    contact_name: 'Grace Wanjiku',
    contact_phone: '+254722987654',
    contact_role: 'Property Manager',
    status: 'AVAILABLE',
  },
  {
    id: 'house_3',
    title: 'Spacious 3-Bedroom Family Villa with Garden',
    location: 'Karen, Nairobi',
    bedrooms: 3,
    monthly_rent: 1200,
    deposit_amount: 1200,
    description: 'Quiet detached suburban home with manicured green lawn, solar water heating, servant quarters, and perimeter electric fence.',
    images: [PLACEHOLDER_HOUSES[2]],
    amenities: ['Private Garden', 'Electric Fence', 'Solar Heating', 'Pet Friendly', 'Borehole Water'],
    contact_name: 'Samuel Kiprop',
    contact_phone: '+254733112233',
    contact_role: 'Landlord',
    status: 'AVAILABLE',
  },
  {
    id: 'house_4',
    title: 'Executive 2-Bedroom Penthouse with Skyline View',
    location: 'Upper Hill, Nairobi',
    bedrooms: 2,
    monthly_rent: 850,
    deposit_amount: 850,
    description: 'Rooftop penthouse with panoramic views of the city skyline, private elevator access, and swimming pool.',
    images: [PLACEHOLDER_HOUSES[3]],
    amenities: ['Swimming Pool', 'Elevator', 'Gym', 'High-Speed WiFi', 'Backup Generator'],
    contact_name: 'Alex Otieno',
    contact_phone: '+254799001122',
    contact_role: 'Caretaker',
    status: 'AVAILABLE',
  },
];

export default function ExplorePage({ onBookHouse, onAskAI, searchQuery = '', setSearchQuery }) {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [locationFilter, setLocationFilter] = useState('');
  const [maxRent, setMaxRent] = useState(2000);
  const [bedrooms, setBedrooms] = useState('all');
  const [usingFallback, setUsingFallback] = useState(false);

  // Synchronize global search query into locationFilter
  useEffect(() => {
    if (searchQuery !== undefined) {
      setLocationFilter(searchQuery);
    }
  }, [searchQuery]);

  const fetchListingData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getHouses({
        location: locationFilter,
        maxRent: maxRent > 0 ? maxRent : undefined,
        bedrooms: bedrooms !== 'all' ? bedrooms : undefined,
      });

      if (res && res.houses) {
        setHouses(res.houses);
        setUsingFallback(false);
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (err) {
      console.warn('Backend fetch failed, using demonstration listings:', err.message);
      // Fallback filter
      let filtered = [...SAMPLE_FALLBACK_HOUSES];
      if (locationFilter.trim()) {
        const q = locationFilter.toLowerCase();
        filtered = filtered.filter(
          (h) => h.location.toLowerCase().includes(q) || h.title.toLowerCase().includes(q)
        );
      }
      if (maxRent) {
        filtered = filtered.filter((h) => h.monthly_rent <= Number(maxRent));
      }
      if (bedrooms !== 'all') {
        filtered = filtered.filter((h) => h.bedrooms === Number(bedrooms));
      }
      setHouses(filtered);
      setUsingFallback(true);
      setError(err.message || 'Connecting to backend...');
    } finally {
      setLoading(false);
    }
  }, [locationFilter, maxRent, bedrooms]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchListingData();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchListingData]);

  const handleResetFilters = () => {
    setLocationFilter('');
    if (setSearchQuery) setSearchQuery('');
    setMaxRent(2000);
    setBedrooms('all');
  };

  return (
    <div className="explore-page container-fluid p-4">
      
      {/* Hero Welcome Banner */}
      <div className="hero-banner p-4 p-md-5 rounded-4 mb-4 text-white shadow-sm position-relative overflow-hidden">
        <div className="position-relative" style={{ zIndex: 2, maxWidth: 680 }}>
          <span className="badge bg-white text-primary fw-bold mb-2 px-3 py-1">
            <i className="bi bi-shield-check me-1"></i> Verified Caretakers & Instant PayPal Booking
          </span>
          <h1 className="fw-extrabold display-6 mb-2 text-white">
            Find Your Dream Home in Kenya
          </h1>
          <p className="lead text-white-50 mb-4" style={{ fontSize: '1.05rem' }}>
            Explore verified rentals across Nairobi and beyond. Chat with our Gemini AI Agent to narrow down the perfect match and securely lock your lease with PayPal.
          </p>
          <div className="d-flex flex-wrap gap-2">
            <button
              className="btn btn-light fw-semibold text-primary px-4 py-2 rounded-pill shadow-sm"
              onClick={() => onAskAI && onAskAI()}
            >
              <i className="bi bi-stars me-2"></i> Ask Gemini to Recommend
            </button>
            <a href="#filters" className="btn btn-outline-light px-4 py-2 rounded-pill">
              <i className="bi bi-sliders me-1"></i> Filter Listings
            </a>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div id="filters" className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
        <div className="row g-3 align-items-end">
          
          {/* Location Search */}
          <div className="col-lg-4 col-md-6">
            <label className="form-label small fw-bold text-secondary">
              <i className="bi bi-geo-alt-fill text-danger me-1"></i> Location / Neighborhood
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control bg-light border-start-0"
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
            <label className="form-label small fw-bold text-secondary">
              <i className="bi bi-door-open-fill text-primary me-1"></i> Bedrooms
            </label>
            <select
              className="form-select bg-light"
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
            >
              <option value="all">Any Number of Bedrooms</option>
              <option value="1">1 Bedroom</option>
              <option value="2">2 Bedrooms</option>
              <option value="3">3 Bedrooms</option>
              <option value="4">4+ Bedrooms</option>
            </select>
          </div>

          {/* Max Rent Slider */}
          <div className="col-lg-3 col-md-8">
            <div className="d-flex justify-content-between">
              <label className="form-label small fw-bold text-secondary">
                <i className="bi bi-cash-stack text-success me-1"></i> Max Rent Budget
              </label>
              <span className="fw-bold text-primary small">${maxRent}/mo</span>
            </div>
            <input
              type="range"
              className="form-range"
              min="200"
              max="2500"
              step="50"
              value={maxRent}
              onChange={(e) => setMaxRent(Number(e.target.value))}
            />
          </div>

          {/* Reset Filters */}
          <div className="col-lg-2 col-md-4">
            <button
              type="button"
              className="btn btn-outline-secondary w-100 py-2 d-flex align-items-center justify-content-center gap-1"
              onClick={handleResetFilters}
            >
              <i className="bi bi-arrow-counterclockwise"></i>
              Reset Filters
            </button>
          </div>

        </div>
      </div>

      {/* Results Header */}
      <div className="d-flex align-items-center justify-content-between mb-3 px-1">
        <div>
          <h5 className="fw-bold text-dark mb-0">
            Available Rental Properties
            <span className="badge bg-primary bg-opacity-10 text-primary ms-2 fs-6">
              {houses.length} {houses.length === 1 ? 'house' : 'houses'}
            </span>
          </h5>
          {usingFallback && (
            <span className="extra-small text-muted">
              <i className="bi bi-info-circle me-1"></i>
              Showing offline sample listings. Start your Express backend on port 5000 to sync live database.
            </span>
          )}
        </div>
      </div>

      {/* Listings Grid */}
      {loading ? (
        <div className="row g-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="col-xl-3 col-lg-4 col-md-6">
              <div className="card border-0 shadow-sm rounded-3 p-3 placeholder-glow h-100">
                <div className="placeholder rounded-3 mb-3" style={{ height: 180 }}></div>
                <div className="placeholder col-8 mb-2"></div>
                <div className="placeholder col-5 mb-3"></div>
                <div className="placeholder col-12 mb-2"></div>
                <div className="placeholder col-10 mb-4"></div>
                <div className="placeholder col-12 py-3 rounded-2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : houses.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center my-4">
          <div className="empty-state-icon mx-auto mb-3 text-muted">
            <i className="bi bi-search display-3"></i>
          </div>
          <h4 className="fw-bold text-dark">No Houses Match Your Filter Criteria</h4>
          <p className="text-muted small mx-auto mb-4" style={{ maxWidth: 450 }}>
            Try broadening your budget, clearing the location filter, or asking our Gemini AI Assistant to help you discover alternative neighborhoods.
          </p>
          <div className="d-flex gap-2 justify-content-center">
            <button className="btn btn-outline-secondary" onClick={handleResetFilters}>
              Reset Filters
            </button>
            <button className="btn btn-primary" onClick={() => onAskAI && onAskAI()}>
              <i className="bi bi-stars me-1"></i> Ask AI Assistant
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
                    onAskAI(`Tell me more about ${house.title} in ${house.location}. Is it suitable for a budget of $${house.monthly_rent || house.monthlyRent}?`);
                  }
                }}
              />
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

