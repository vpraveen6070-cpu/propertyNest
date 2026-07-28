import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, Bed, Bath, Maximize, Calendar, Car, Shield, Eye, Heart, Share2, 
  Phone, Mail, MessageSquare, Waves, Trees, Dumbbell, ShieldCheck, Wind, Sun, 
  Cpu, Wifi, ArrowUpCircle, Flame, Zap, CheckCircle2, ChevronLeft, ChevronRight, X 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import EnquiryModal from '../components/EnquiryModal';
import PropertyCard from '../components/PropertyCard';
import { getMockPropertyById, MOCK_PROPERTIES } from '../data/mockProperties';

export default function PropertyDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/properties/${id}`)
      .then(res => {
        const contentType = res.headers.get('content-type');
        if (res.ok && contentType && contentType.includes('application/json')) {
          return res.json();
        }
        throw new Error('Not JSON');
      })
      .then(data => {
        if (data && data.id) {
          setProperty(data);
          if (user) {
            fetch('/api/favourites', {
              headers: { 'Authorization': `Bearer ${localStorage.getItem('estate_token')}` }
            })
            .then(r => r.json())
            .then(favs => {
              if (Array.isArray(favs)) {
                setIsSaved(favs.some(f => f.id === data.id));
              }
            })
            .catch(() => {});
          }

          fetch(`/api/properties?property_type=${data.property_type}&limit=3`)
            .then(r => r.json())
            .then(sim => setSimilarProperties((sim.properties || []).filter(p => p.id !== data.id)))
            .catch(() => {
              const sim = MOCK_PROPERTIES.filter(p => p.property_type === data.property_type && p.id !== data.id).slice(0, 3);
              setSimilarProperties(sim);
            });
        } else {
          const fallback = getMockPropertyById(id);
          if (fallback) {
            setProperty(fallback);
            setSimilarProperties(MOCK_PROPERTIES.filter(p => p.property_type === fallback.property_type && p.id !== fallback.id).slice(0, 3));
          }
        }
        setLoading(false);
      })
      .catch(() => {
        const fallback = getMockPropertyById(id);
        if (fallback) {
          setProperty(fallback);
          setSimilarProperties(MOCK_PROPERTIES.filter(p => p.property_type === fallback.property_type && p.id !== fallback.id).slice(0, 3));
        }
        setLoading(false);
      });
  }, [id, user]);

  const handleToggleSave = () => {
    if (!user) {
      alert('Please log in to save properties.');
      return;
    }
    fetch(`/api/favourites/${id}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('estate_token')}` }
    })
    .then(r => r.json())
    .then(data => setIsSaved(data.saved));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Property link copied to clipboard!');
    }
  };

  if (loading) {
    return <div className="app-container" style={{ padding: '80px 20px', textAlign: 'center' }}>Loading property details...</div>;
  }

  if (!property) {
    return (
      <div className="app-container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>Property Not Found</h2>
        <Link to="/properties" className="btn btn-primary" style={{ marginTop: '16px' }}>Back to Listings</Link>
      </div>
    );
  }

  const formatPrice = (val, type) => {
    if (!val) return '₹0';
    let str = '';
    if (val >= 10000000) {
      const cr = val / 10000000;
      str = `₹ ${cr % 1 === 0 ? cr : cr.toFixed(2)} Cr`;
    } else if (val >= 100000) {
      const lakh = val / 100000;
      str = `₹ ${lakh % 1 === 0 ? lakh : lakh.toFixed(2)} Lakh`;
    } else {
      str = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
    }
    return type === 'Rent' ? `${str} / mo` : str;
  };

  const formattedPrice = formatPrice(property.price, property.listing_type);

  return (
    <div className="app-container" style={{ padding: '40px 20px' }}>
      {/* Top Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            <span className={`badge ${property.listing_type === 'Sale' ? 'badge-sale' : 'badge-rent'}`}>
              For {property.listing_type}
            </span>
            <span className="badge badge-primary">{property.property_type}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ref: #{property.ref_number}</span>
          </div>

          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', marginBottom: '8px' }}>{property.title}</h1>
          <p style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1rem' }}>
            <MapPin size={18} style={{ color: 'var(--primary)' }} />
            {property.address}, {property.city} {property.postcode}
          </p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
            {formattedPrice}
            {property.listing_type === 'Rent' && <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}> / mo</span>}
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '12px', justifyContent: 'flex-end' }}>
            <button className={`btn btn-secondary btn-sm ${isSaved ? 'btn-danger' : ''}`} onClick={handleToggleSave}>
              <Heart size={16} fill={isSaved ? "#ef4444" : "none"} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
            <button className="btn btn-secondary btn-sm" onClick={handleShare}>
              <Share2 size={16} />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Photo Gallery & Lightbox */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', height: '480px' }}>
          {/* Main Large Featured Image */}
          <div style={{ position: 'relative', height: '100%', cursor: 'pointer' }} onClick={() => setLightboxOpen(true)}>
            <img 
              src={property.images[activeImageIndex] || property.images[0]} 
              alt={property.title} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
            <div style={{ position: 'absolute', bottom: '16px', right: '16px', background: 'rgba(15,23,42,0.85)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem' }}>
              🔍 Click to Enlarge ({activeImageIndex + 1}/{property.images.length})
            </div>
          </div>

          {/* Thumbnails Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto' }}>
            {property.images.map((imgUrl, idx) => (
              <img 
                key={idx}
                src={imgUrl} 
                alt={`Thumbnail ${idx}`} 
                onClick={() => setActiveImageIndex(idx)}
                style={{ 
                  width: '100%', 
                  height: '110px', 
                  objectFit: 'cover', 
                  borderRadius: 'var(--radius-md)', 
                  cursor: 'pointer',
                  border: activeImageIndex === idx ? '3px solid var(--primary)' : '2px solid transparent',
                  opacity: activeImageIndex === idx ? 1 : 0.75
                }} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
        <div>
          {/* Quick Specs Grid */}
          <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '20px', textAlign: 'center' }}>
            <div>
              <Bed size={24} style={{ color: 'var(--primary)', marginBottom: '6px' }} />
              <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{property.bedrooms}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Bedrooms</div>
            </div>
            <div>
              <Bath size={24} style={{ color: 'var(--primary)', marginBottom: '6px' }} />
              <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{property.bathrooms}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Bathrooms</div>
            </div>
            <div>
              <Maximize size={24} style={{ color: 'var(--primary)', marginBottom: '6px' }} />
              <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{property.area_sqft.toLocaleString()}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sq Ft</div>
            </div>
            <div>
              <Car size={24} style={{ color: 'var(--primary)', marginBottom: '6px' }} />
              <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{property.parking_spaces}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Parking</div>
            </div>
            <div>
              <Calendar size={24} style={{ color: 'var(--primary)', marginBottom: '6px' }} />
              <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{property.construction_year || 2023}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Year Built</div>
            </div>
          </div>

          {/* Description */}
          <div className="glass-panel" style={{ padding: '28px', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '16px' }}>Property Description</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '1rem', whitespace: 'pre-line' }}>
              {property.description}
            </p>
          </div>

          {/* Amenities Grid */}
          <div className="glass-panel" style={{ padding: '28px', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '20px' }}>Features & Amenities</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
              {property.amenities && property.amenities.length > 0 ? (
                property.amenities.map((am, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-sm)' }}>
                    <CheckCircle2 size={18} style={{ color: 'var(--success)' }} />
                    <span style={{ fontSize: '0.9rem' }}>{am.name || am}</span>
                  </div>
                ))
              ) : (
                <p style={{ color: 'var(--text-muted)' }}>Standard luxury property amenities included.</p>
              )}
            </div>
          </div>

          {/* Map Location */}
          <div className="glass-panel" style={{ padding: '28px', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '16px' }}>Location Map</h2>
            <div style={{ width: '100%', height: '300px', background: 'rgba(15,23,42,0.9)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyCenter: 'center', gap: '12px', border: '1px dashed var(--border-glow)' }}>
              <MapPin size={40} style={{ color: 'var(--primary)', marginTop: '80px' }} />
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{property.address}, {property.city}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Coordinates: {property.latitude}, {property.longitude}</div>
            </div>
          </div>
        </div>

        {/* Sidebar Representative Contact Panel */}
        <aside>
          <div className="glass-panel" style={{ padding: '28px', position: 'sticky', top: '90px' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <img 
                src={property.owner?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'} 
                alt={property.owner?.name} 
                style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)', marginBottom: '12px' }}
              />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{property.owner?.name}</h3>
              <span className="badge badge-primary">Property Representative</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              <a href={`tel:${property.owner?.phone || '+15550192834'}`} className="btn btn-secondary" style={{ width: '100%' }}>
                <Phone size={16} />
                <span>{property.owner?.phone || '+1 (555) 234-5678'}</span>
              </a>

              <button className="btn btn-primary" onClick={() => setEnquiryModalOpen(true)} style={{ width: '100%' }}>
                <MessageSquare size={16} />
                <span>Send Direct Message</span>
              </button>
            </div>

            <div style={{ paddingTop: '20px', borderTop: '1px solid var(--border-color)', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Views Count:</span>
                <strong style={{ color: '#fff' }}>{property.view_count || 1} views</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Date Listed:</span>
                <strong style={{ color: '#fff' }}>{new Date(property.created_at).toLocaleDateString()}</strong>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="modal-overlay" onClick={() => setLightboxOpen(false)}>
          <button className="modal-close" onClick={() => setLightboxOpen(false)}><X size={24} /></button>
          <img 
            src={property.images[activeImageIndex]} 
            alt="Enlarged property view" 
            style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: 'var(--radius-md)' }} 
          />
        </div>
      )}

      {/* Enquiry Modal */}
      {enquiryModalOpen && (
        <EnquiryModal property={property} onClose={() => setEnquiryModalOpen(false)} />
      )}
    </div>
  );
}
