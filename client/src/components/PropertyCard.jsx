import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bed, Bath, Maximize, MapPin, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { isPropertySaved, toggleSavedFavourite } from '../utils/favourites';

export default function PropertyCard({ property, isSaved: initialSaved, onToggleSave }) {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(() => {
    if (typeof initialSaved === 'boolean') return initialSaved;
    return isPropertySaved(property.id);
  });

  useEffect(() => {
    const handleUpdate = () => {
      setIsSaved(isPropertySaved(property.id));
    };
    window.addEventListener('estate_favourites_updated', handleUpdate);
    return () => window.removeEventListener('estate_favourites_updated', handleUpdate);
  }, [property.id]);

  const handleSaveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert('Please log in to save favourite properties.');
      return;
    }

    const nextState = toggleSavedFavourite(property.id);
    setIsSaved(nextState);
    if (onToggleSave) onToggleSave(property.id, nextState);

    // Also sync with backend if available
    fetch(`/api/favourites/${property.id}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('estate_token')}`
      }
    }).catch(() => {});
  };

  const formatPrice = (val, type) => {
    if (!val) return '₹0';
    let str = '';
    if (val >= 10000000) {
      const cr = val / 10000000;
      str = `₹${cr % 1 === 0 ? cr : cr.toFixed(2)} Cr`;
    } else if (val >= 100000) {
      const lakh = val / 100000;
      str = `₹${lakh % 1 === 0 ? lakh : lakh.toFixed(2)} Lakh`;
    } else {
      str = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
    }
    return type === 'Rent' ? `${str} / mo` : str;
  };

  const formattedPrice = formatPrice(property.price, property.listing_type);

  return (
    <div className="glass-panel property-card glass-panel-hover animate-fade-in">
      <div className="card-img-wrapper">
        <img 
          src={property.featured_image || (property.images && property.images[0])} 
          alt={property.title} 
          className="card-img" 
          loading="lazy"
        />

        <div className="card-badges">
          <span className={`badge ${property.listing_type === 'Sale' ? 'badge-sale' : 'badge-rent'}`}>
            For {property.listing_type}
          </span>
          <span className="badge badge-primary">
            {property.property_type}
          </span>
          {property.is_featured === 1 && (
            <span className="badge badge-warning">Featured</span>
          )}
        </div>

        <button 
          className={`fav-btn ${isSaved ? 'active' : ''}`}
          onClick={handleSaveClick}
          title={isSaved ? "Remove from favourites" : "Save to favourites"}
        >
          <Heart size={18} fill={isSaved ? "#ef4444" : "none"} />
        </button>
      </div>

      <div className="card-body">
        <div className="card-price">
          {formattedPrice}
          {property.listing_type === 'Rent' && <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 400 }}> / month</span>}
        </div>

        <h3 className="card-title">
          <Link to={`/properties/${property.id}`}>
            {property.title}
          </Link>
        </h3>

        <p className="card-address">
          <MapPin size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
          <span>{property.address}, {property.city} {property.postcode}</span>
        </p>

        <div className="card-specs">
          <div className="spec-item">
            <Bed size={16} />
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="spec-item">
            <Bath size={16} />
            <span>{property.bathrooms} Baths</span>
          </div>
          <div className="spec-item">
            <Maximize size={16} />
            <span>{property.area_sqft.toLocaleString()} sqft</span>
          </div>
        </div>
      </div>
    </div>
  );
}
