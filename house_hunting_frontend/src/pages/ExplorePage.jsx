import React, { useState, useEffect, useCallback } from 'react';
import HouseCard from '../components/HouseCard';
import { getHouses } from '../services/api';
import { PLACEHOLDER_HOUSES } from '../assets/placeholders';

const SAMPLE_FALLBACK_HOUSES = [
  {
    id: 'house_1',
    title: 'Modern 2-Bedroom Suite',
    location: 'Westlands, Nairobi',
    bedrooms: 2,
    monthly_rent: 650,
    deposit_amount: 650,
    description: 'Bright open-plan apartment with master ensuite, high-speed fiber internet, and 24/7 security.',
    images: [PLACEHOLDER_HOUSES[0]],
    amenities: ['WiFi', 'Backup Generator', 'Parking', '24/7 Security', 'Borehole'],
    contact_name: 'David Mwangi',
    contact_phone: '+254712345678',
    contact_role: 'Caretaker',
    status: 'AVAILABLE',
  },
  {
    id: 'house_2',
    title: 'Studio Apartment near Yaya Centre',
    location: 'Kilimani, Nairobi',
    bedrooms: 1,
    monthly_rent: 420,
    deposit_amount: 420,
    description: 'Furnished studio with private balcony and fitted kitchen. Walking distance to shopping and dining.',
    images: [PLACEHOLDER_HOUSES[1]],
    amenities: ['WiFi', 'Parking', 'Gym', 'CCTV'],
    contact_name: 'Grace Wanjiku',
    contact_phone: '+254722987654',
    contact_role: 'Property Manager',
    status: 'AVAILABLE',
  },
  {
    id: 'house_3',
    title: '3-Bedroom Villa with Garden',
    location: 'Karen, Nairobi',
    bedrooms: 3,
    monthly_rent: 1200,
    deposit_amount: 1200,
    description: 'Quiet detached suburban home with private green lawn, solar water heating, and perimeter fence.',
    images: [PLACEHOLDER_HOUSES[2]],
    amenities: ['Private Garden', 'Electric Fence', 'Solar Heating', 'Pet Friendly'],
    contact_name: 'Samuel Kiprop',
    contact_phone: '+254733112233',
    contact_role: 'Landlord',
    status: 'AVAILABLE',
  },
  {
    id: 'house_4',
    title: 'Executive 2-Bedroom Penthouse',
    location: 'Upper Hill, Nairobi',
    bedrooms: 2,
    monthly_rent: 850,
    deposit_amount: 850,
    description: 'Penthouse with skyline views, private elevator access, and rooftop swimming pool.',
    images: [PLACEHOLDER_HOUSES[3]],
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
  const [maxRent, setMaxRent] = useState(2000);
  const [bedrooms, setBedrooms] = useState('all');

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
        filtered = filtered.filter((h) => h.monthly_rent <= Number(maxRent));
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
    setMaxRent(2000);
    setBedrooms('all');
  };

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: '#F5F7FA', minHeight: '100vh' }}>
      
      {/* Filter Bar */}
      <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-white">
        <div className="row g-3 align-items-center">
          
          {/* Location Search */}
          <div className="col-lg-4 col-md-6">
            <label className="form-label small fw-semibold text-muted mb-1">Location</label>
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-transparent border-end-0 text-muted">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                style={{ borderColor: '#CBD5E1' }}
                placeholder="Search neighborhood..."
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
              <option value="all">All</option>
              <option value="1">1 Bedroom</option>
              <option value="2">2 Bedrooms</option>
              <option value="3">3 Bedrooms</option>
              <option value="4">4+ Bedrooms</option>
            </select>
          </div>

          {/* Max Rent Slider */}
          <div className="col-lg-3 col-md-8">
            <div className="d-flex justify-content-between mb-1">
              <label className="form-label small fw-semibold text-muted mb-0">Max Budget</label>
              <span className="fw-bold small" style={{ color: '#0070BA' }}>${maxRent}/mo</span>
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

          {/* Reset Action */}
          <div className="col-lg-2 col-md-4 d-flex align-items-end">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary rounded-pill w-100 py-1"
              onClick={handleResetFilters}
            >
              Reset
            </button>
          </div>

        </div>
      </div>

      {/* Results Header */}
      <div className="d-flex align-items-center justify-content-between mb-3 px-1">
        <div className="d-flex align-items-center gap-2">
          <h5 className="fw-bold text-dark mb-0">Available Properties</h5>
          <span className="badge rounded-pill px-2 py-1" style={{ backgroundColor: '#EDF1F5', color: '#001C3D' }}>
            {houses.length}
          </span>
        </div>
        {usingFallback && (
          <span className="small text-muted" style={{ fontSize: '12px' }}>
            ● Demo Mode
          </span>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="row g-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="col-xl-3 col-lg-4 col-md-6">
              <div className="card border-0 shadow-sm rounded-4 p-3 placeholder-glow h-100 bg-white">
                <div className="placeholder rounded-3 mb-3 w-100" style={{ height: 180 }}></div>
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
          <h5 className="fw-bold text-dark">No properties found</h5>
          <p className="text-muted small mx-auto mb-4" style={{ maxWidth: 400 }}>
            Try broadening your budget or clearing filters. You can also ask our AI agent to search alternative areas.
          </p>
          <div className="d-flex gap-2 justify-content-center">
            <button className="btn btn-sm btn-outline-secondary rounded-pill px-3" onClick={handleResetFilters}>
              Clear Filters
            </button>
            <button
              className="btn btn-sm text-white rounded-pill px-3"
              style={{ backgroundColor: '#0070BA' }}
              onClick={() => onAskAI && onAskAI()}
            >
              Ask AI
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
                    onAskAI(`Tell me about ${house.title} in ${house.location} ($${house.monthly_rent || house.monthlyRent}/mo).`);
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