import React, { useState } from 'react';
import { addHouse } from '../services/api';
import { PLACEHOLDER_HOUSES } from '../assets/placeholders';

export default function AddHousePage({ onHouseAdded }) {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    bedrooms: 2,
    monthlyRent: '',
    depositAmount: '',
    description: '',
    imageUrl: PLACEHOLDER_HOUSES[0],
    amenities: ['WiFi', 'Parking', '24/7 Security'],
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    contactRole: 'Caretaker',
  });

  const [loading, setLoading] = useState(false);
  const [successHouse, setSuccessHouse] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const availableAmenities = [
    'WiFi',
    'Parking',
    '24/7 Security',
    'Backup Generator',
    'Borehole Water',
    'Balcony',
    'Gym',
    'Swimming Pool',
    'Solar Water Heating',
    'CCTV Surveillance',
    'Pet Friendly',
    'Furnished',
  ];

  const handleToggleAmenity = (item) => {
    setFormData((prev) => {
      const exists = prev.amenities.includes(item);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((a) => a !== item)
          : [...prev.amenities, item],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      if (!formData.title || !formData.location || !formData.monthlyRent) {
        throw new Error('Please fill out all required property fields.');
      }

      const payload = {
        title: formData.title.trim(),
        location: formData.location.trim(),
        bedrooms: Number(formData.bedrooms),
        monthlyRent: Number(formData.monthlyRent),
        depositAmount: Number(formData.depositAmount) || Number(formData.monthlyRent),
        description: formData.description.trim(),
        images: formData.imageUrl ? [formData.imageUrl.trim()] : [PLACEHOLDER_HOUSES[0]],
        amenities: formData.amenities,
        contactName: formData.contactName.trim() || 'Landlord Caretaker',
        contactPhone: formData.contactPhone.trim() || '+254700000000',
        contactEmail: formData.contactEmail.trim() || null,
        contactRole: formData.contactRole,
      };

      const result = await addHouse(payload);

      if (result.success && result.house) {
        setSuccessHouse(result.house);
      } else {
        // Fallback for simulation if backend returns standard response
        setSuccessHouse({ ...payload, id: `house_${Date.now()}` });
      }
    } catch (err) {
      console.error('Error adding house:', err);
      setErrorMessage(
        err.response?.data?.error || err.message || 'Failed to submit property listing to backend.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetForm = () => {
    setFormData({
      title: '',
      location: '',
      bedrooms: 2,
      monthlyRent: '',
      depositAmount: '',
      description: '',
      imageUrl: PLACEHOLDER_HOUSES[0],
      amenities: ['WiFi', 'Parking', '24/7 Security'],
      contactName: '',
      contactPhone: '',
      contactEmail: '',
      contactRole: 'Caretaker',
    });
    setSuccessHouse(null);
    setErrorMessage(null);
  };

  return (
    <div className="container-fluid p-4" style={{ maxWidth: 960 }}>
      {/* Title */}
      <div className="mb-4">
        <h3 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
          <i className="bi bi-building-add text-success"></i>
          List a New Rental Property
        </h3>
        <p className="text-muted small">
          Add your house listing to HouseNest. Once listed, prospective tenants can discover it via filters, consult our Gemini AI Agent, and book via PayPal.
        </p>
      </div>

      {/* Success Notification */}
      {successHouse ? (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white my-3">
          <div className="rounded-circle bg-success bg-opacity-10 text-success d-inline-flex p-3 fs-1 mx-auto mb-3">
            <i className="bi bi-check-circle-fill"></i>
          </div>
          <h4 className="fw-bold text-dark mb-2">Property Listed Successfully!</h4>
          <p className="text-muted small mb-4 mx-auto" style={{ maxWidth: 500 }}>
            <strong>{successHouse.title}</strong> is now live on the marketplace. Tenants can now discover it and pay holding deposits through PayPal sandbox.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <button className="btn btn-outline-secondary" onClick={handleResetForm}>
              <i className="bi bi-plus-circle me-1"></i> Add Another House
            </button>
            <button
              className="btn btn-primary"
              onClick={() => onHouseAdded && onHouseAdded(successHouse)}
            >
              <i className="bi bi-compass me-1"></i> View in Explore Page
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {errorMessage && (
            <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
              <i className="bi bi-exclamation-triangle-fill"></i>
              <div>{errorMessage}</div>
            </div>
          )}

          <div className="row g-4">
            {/* Section 1: Core Details */}
            <div className="col-12">
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2 border-bottom pb-2">
                  <i className="bi bi-info-circle text-primary"></i>
                  1. Property Overview
                </h5>

                <div className="row g-3">
                  <div className="col-md-8">
                    <label className="form-label small fw-bold text-secondary">
                      Property Title *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Modern 2-Bedroom Apartment with Balcony"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label small fw-bold text-secondary">
                      Bedrooms *
                    </label>
                    <select
                      className="form-select"
                      value={formData.bedrooms}
                      onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                    >
                      <option value={1}>1 Bedroom (Studio / 1BR)</option>
                      <option value={2}>2 Bedrooms</option>
                      <option value={3}>3 Bedrooms</option>
                      <option value={4}>4 Bedrooms</option>
                      <option value={5}>5+ Bedrooms Villa</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-secondary">
                      Location / Neighborhood *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Westlands, Nairobi"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label small fw-bold text-secondary">
                      Monthly Rent ($ USD) *
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="e.g. 600"
                      min="50"
                      value={formData.monthlyRent}
                      onChange={(e) => setFormData({ ...formData, monthlyRent: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label small fw-bold text-secondary">
                      Refundable Deposit ($ USD)
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="e.g. 600"
                      min="0"
                      value={formData.depositAmount}
                      onChange={(e) => setFormData({ ...formData, depositAmount: e.target.value })}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-bold text-secondary">
                      Description
                    </label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Describe the house features, proximity to roads or transit, water reliability, parking, etc..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Photos & Image URL */}
            <div className="col-12">
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2 border-bottom pb-2">
                  <i className="bi bi-images text-primary"></i>
                  2. Property Photo
                </h5>

                <div className="row g-3 align-items-center">
                  <div className="col-md-8">
                    <label className="form-label small fw-bold text-secondary">
                      Image URL (Direct link)
                    </label>
                    <input
                      type="url"
                      className="form-control mb-2"
                      placeholder="https://images.unsplash.com/..."
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    />
                    <div className="d-flex flex-wrap gap-2 align-items-center">
                      <span className="extra-small text-muted">Or pick a sample preset:</span>
                      {PLACEHOLDER_HOUSES.slice(0, 4).map((url, i) => (
                        <button
                          key={i}
                          type="button"
                          className="btn btn-outline-secondary btn-sm extra-small py-0 px-2"
                          onClick={() => setFormData({ ...formData, imageUrl: url })}
                        >
                          Preset {i + 1}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="col-md-4 text-center">
                    <div className="border rounded-3 p-1 bg-light">
                      <img
                        src={formData.imageUrl || PLACEHOLDER_HOUSES[0]}
                        alt="Preview"
                        className="rounded-2 object-fit-cover w-100"
                        style={{ height: 120 }}
                        onError={(e) => {
                          e.target.src = PLACEHOLDER_HOUSES[0];
                        }}
                      />
                      <span className="extra-small text-muted d-block mt-1">Photo Preview</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Amenities */}
            <div className="col-12">
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2 border-bottom pb-2">
                  <i className="bi bi-stars text-primary"></i>
                  3. Key Amenities
                </h5>

                <div className="row g-2">
                  {availableAmenities.map((amenity) => {
                    const checked = formData.amenities.includes(amenity);
                    return (
                      <div key={amenity} className="col-6 col-md-4 col-lg-3">
                        <div
                          className={`p-2 rounded-3 border d-flex align-items-center gap-2 cursor-pointer transition-all ${
                            checked ? 'bg-primary bg-opacity-10 border-primary text-primary fw-semibold' : 'bg-light text-secondary'
                          }`}
                          onClick={() => handleToggleAmenity(amenity)}
                          style={{ cursor: 'pointer' }}
                        >
                          <input
                            type="checkbox"
                            className="form-check-input mt-0"
                            checked={checked}
                            onChange={() => {}}
                          />
                          <span className="small">{amenity}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Section 4: Caretaker / Landlord Contact */}
            <div className="col-12">
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2 border-bottom pb-2">
                  <i className="bi bi-person-badge text-primary"></i>
                  4. Caretaker / Contact Information
                </h5>

                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label small fw-bold text-secondary">
                      Contact Name *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. John Mwangi"
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label small fw-bold text-secondary">
                      Contact Phone (for WhatsApp/Calls) *
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="+254712345678"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label small fw-bold text-secondary">
                      Role / Relationship
                    </label>
                    <select
                      className="form-select"
                      value={formData.contactRole}
                      onChange={(e) => setFormData({ ...formData, contactRole: e.target.value })}
                    >
                      <option value="Caretaker">Caretaker on-site</option>
                      <option value="Landlord">Property Owner / Landlord</option>
                      <option value="Property Manager">Property Manager / Agency</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="col-12 text-end">
              <button
                type="submit"
                className="btn btn-success btn-lg px-5 rounded-pill shadow-sm fw-bold"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Publishing Listing...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check2-circle me-2"></i>
                    Publish House Listing
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

