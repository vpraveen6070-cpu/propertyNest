import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, Upload, Plus, Trash2, CheckCircle, MapPin } from 'lucide-react';

export default function AddEditProperty() {
  const { id } = useParams();
  const isEdit = !!id;
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    property_type: 'House',
    listing_type: 'Sale',
    price: '',
    address: '',
    city: '',
    postcode: '',
    latitude: 34.0259,
    longitude: -118.7798,
    bedrooms: 3,
    bathrooms: 2,
    area_sqft: 2200,
    construction_year: 2023,
    furnishing: 'Furnished',
    parking_spaces: 2,
    status: 'pending'
  });

  const [images, setImages] = useState([
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([1, 2, 4, 5]);
  const [masterAmenities, setMasterAmenities] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Fetch master amenities
    fetch('/api/master-data')
      .then(res => res.json())
      .then(data => setMasterAmenities(data.amenities || []));

    if (isEdit) {
      fetch(`/api/properties/${id}`)
        .then(res => res.json())
        .then(prop => {
          if (prop.id) {
            setFormData({
              title: prop.title || '',
              description: prop.description || '',
              property_type: prop.property_type || 'House',
              listing_type: prop.listing_type || 'Sale',
              price: prop.price || '',
              address: prop.address || '',
              city: prop.city || '',
              postcode: prop.postcode || '',
              latitude: prop.latitude || 34.0259,
              longitude: prop.longitude || -118.7798,
              bedrooms: prop.bedrooms || 0,
              bathrooms: prop.bathrooms || 0,
              area_sqft: prop.area_sqft || 0,
              construction_year: prop.construction_year || 2023,
              furnishing: prop.furnishing || 'Furnished',
              parking_spaces: prop.parking_spaces || 0,
              status: prop.status || 'active'
            });
            if (prop.images) setImages(prop.images);
            if (prop.amenities) {
              setSelectedAmenities(prop.amenities.map(a => typeof a === 'object' ? a.id : 1));
            }
          }
        });
    }
  }, [id, isEdit]);

  const handleAddImage = (e) => {
    e.preventDefault();
    if (newImageUrl.trim()) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleToggleAmenity = (amId) => {
    if (selectedAmenities.includes(amId)) {
      setSelectedAmenities(selectedAmenities.filter(i => i !== amId));
    } else {
      setSelectedAmenities([...selectedAmenities, amId]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.city || !formData.address) {
      alert('Please fill in all required property details.');
      return;
    }

    setSubmitting(true);
    const method = isEdit ? 'PUT' : 'POST';
    const url = isEdit ? `/api/properties/${id}` : '/api/properties';

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('estate_token')}`
      },
      body: JSON.stringify({
        ...formData,
        images,
        amenities: selectedAmenities
      })
    })
    .then(res => res.json())
    .then(data => {
      setSubmitting(false);
      if (data.property) {
        alert(isEdit ? 'Property updated successfully!' : 'Property submitted successfully!');
        navigate('/dashboard');
      } else {
        alert(data.error || 'Failed to save property.');
      }
    })
    .catch(() => {
      setSubmitting(false);
      alert('Error submitting property form.');
    });
  };

  return (
    <div className="app-container" style={{ padding: '40px 20px', maxWidth: '900px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>
          {isEdit ? 'Edit Property Listing' : 'Submit New Property'}
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Provide comprehensive specifications, location coordinates, and photo assets.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '32px' }}>
        {/* Basic Information */}
        <h2 style={{ fontSize: '1.3rem', marginBottom: '20px', color: 'var(--primary)' }}>1. Basic Property Details</h2>
        
        <div className="form-group">
          <label className="form-label">Property Title *</label>
          <input 
            type="text" 
            placeholder="e.g. Grand Horizon Luxury Villa with Ocean Views" 
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            required 
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Property Type</label>
            <select value={formData.property_type} onChange={e => setFormData({ ...formData, property_type: e.target.value })}>
              <option value="House">House</option>
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
              <option value="Penthouse">Penthouse</option>
              <option value="Office">Office</option>
              <option value="Land">Land</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Listing Type</label>
            <select value={formData.listing_type} onChange={e => setFormData({ ...formData, listing_type: e.target.value })}>
              <option value="Sale">For Sale</option>
              <option value="Rent">For Rent</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Price (₹ INR) *</label>
            <input 
              type="number" 
              placeholder="e.g. 245000000 (24.5 Cr) or 65000" 
              value={formData.price}
              onChange={e => setFormData({ ...formData, price: e.target.value })}
              required 
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea 
            rows={5}
            placeholder="Describe property highlights, interior architecture, terrace views..." 
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <hr style={{ borderColor: 'var(--border-color)', margin: '30px 0' }} />

        {/* Location Information */}
        <h2 style={{ fontSize: '1.3rem', marginBottom: '20px', color: 'var(--primary)' }}>2. Location & Address</h2>

        <div className="form-group">
          <label className="form-label">Street Address *</label>
          <input 
            type="text" 
            placeholder="e.g. 742 Carter Road, Bandra West" 
            value={formData.address}
            onChange={e => setFormData({ ...formData, address: e.target.value })}
            required 
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">City *</label>
            <input 
              type="text" 
              placeholder="e.g. Mumbai" 
              value={formData.city}
              onChange={e => setFormData({ ...formData, city: e.target.value })}
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Postcode / Pincode</label>
            <input 
              type="text" 
              placeholder="e.g. 400050" 
              value={formData.postcode}
              onChange={e => setFormData({ ...formData, postcode: e.target.value })}
            />
          </div>
        </div>

        <hr style={{ borderColor: 'var(--border-color)', margin: '30px 0' }} />

        {/* Property Specifications */}
        <h2 style={{ fontSize: '1.3rem', marginBottom: '20px', color: 'var(--primary)' }}>3. Specifications & Amenities</h2>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Bedrooms</label>
            <input 
              type="number" 
              value={formData.bedrooms}
              onChange={e => setFormData({ ...formData, bedrooms: parseInt(e.target.value, 10) })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Bathrooms</label>
            <input 
              type="number" 
              value={formData.bathrooms}
              onChange={e => setFormData({ ...formData, bathrooms: parseInt(e.target.value, 10) })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Area (Sq Ft)</label>
            <input 
              type="number" 
              value={formData.area_sqft}
              onChange={e => setFormData({ ...formData, area_sqft: parseInt(e.target.value, 10) })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Parking Spaces</label>
            <input 
              type="number" 
              value={formData.parking_spaces}
              onChange={e => setFormData({ ...formData, parking_spaces: parseInt(e.target.value, 10) })}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Select Amenities</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginTop: '6px' }}>
            {masterAmenities.map(am => (
              <label 
                key={am.id}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  padding: '10px 14px', 
                  background: selectedAmenities.includes(am.id) ? 'var(--primary-light)' : 'rgba(255,255,255,0.04)', 
                  border: selectedAmenities.includes(am.id) ? '1px solid var(--primary)' : '1px solid var(--border-color)', 
                  borderRadius: 'var(--radius-sm)', 
                  cursor: 'pointer',
                  fontSize: '0.85rem'
                }}
              >
                <input 
                  type="checkbox" 
                  checked={selectedAmenities.includes(am.id)}
                  onChange={() => handleToggleAmenity(am.id)}
                  style={{ display: 'none' }}
                />
                <span style={{ fontWeight: selectedAmenities.includes(am.id) ? 600 : 400 }}>{am.name}</span>
              </label>
            ))}
          </div>
        </div>

        <hr style={{ borderColor: 'var(--border-color)', margin: '30px 0' }} />

        {/* Photo Gallery Upload */}
        <h2 style={{ fontSize: '1.3rem', marginBottom: '20px', color: 'var(--primary)' }}>4. Property Images</h2>

        <div className="form-group">
          <label className="form-label">Add Image URL</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="url" 
              placeholder="https://images.unsplash.com/photo-..." 
              value={newImageUrl} 
              onChange={e => setNewImageUrl(e.target.value)} 
              style={{ flex: 1 }}
            />
            <button className="btn btn-secondary" onClick={handleAddImage}>
              <Plus size={16} /> Add Photo
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '14px', marginTop: '16px' }}>
          {images.map((url, idx) => (
            <div key={idx} style={{ position: 'relative', height: '100px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
              <img src={url} alt={`Property upload ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button 
                type="button"
                onClick={() => handleRemoveImage(idx)} 
                style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(239, 68, 68, 0.9)', color: '#fff', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>

        <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '40px' }} disabled={submitting}>
          {submitting ? 'Submitting Listing...' : isEdit ? 'Save Changes' : 'Publish Property Listing'}
        </button>
      </form>
    </div>
  );
}
