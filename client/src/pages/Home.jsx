import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Building, DollarSign, ArrowRight, Star, ShieldCheck, Sparkles, CheckCircle2, Award, Users } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import HeroFrameAnimation from '../components/HeroFrameAnimation';

const INITIAL_FEATURED = [
  {
    id: 1,
    title: "Seafront Luxury Villa in Bandra West",
    ref_number: "PROP-1001",
    description: "An architectural masterpiece featuring floor-to-ceiling glass walls, an infinity pool overlooking Arabian Sea vistas.",
    property_type: "Villa",
    listing_type: "Sale",
    price: 245000000,
    address: "742 Carter Road, Bandra West",
    city: "Mumbai",
    postcode: "400050",
    bedrooms: 5,
    bathrooms: 6,
    area_sqft: 6200,
    is_featured: 1,
    featured_image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 2,
    title: "Sky Penthouse Overlooking Cubbon Park",
    ref_number: "PROP-1002",
    description: "Stunning downtown penthouse with private rooftop deck, gourmet Italian kitchen, customized walk-in closets.",
    property_type: "Penthouse",
    listing_type: "Sale",
    price: 185000000,
    address: "100 UB City Boulevard, Lavelle Road",
    city: "Bengaluru",
    postcode: "560001",
    bedrooms: 4,
    bathrooms: 5,
    area_sqft: 4800,
    is_featured: 1,
    featured_image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 3,
    title: "Independent Luxury Duplex Bungalow",
    ref_number: "PROP-1003",
    description: "Beautifully maintained duplex bungalow with open-concept living area, teakwood flooring, large backyard garden.",
    property_type: "House",
    listing_type: "Sale",
    price: 78500000,
    address: "Road No. 36, Jubilee Hills",
    city: "Hyderabad",
    postcode: "500033",
    bedrooms: 4,
    bathrooms: 4,
    area_sqft: 3800,
    is_featured: 1,
    featured_image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 6,
    title: "Portuguese Heritage Villa with Private Pool",
    ref_number: "PROP-1006",
    description: "Nestled near Candolim Beach, this luxury eco-friendly smart villa features private pool, outdoor fire lounge.",
    property_type: "Villa",
    listing_type: "Sale",
    price: 145000000,
    address: "Bambolim Beach Road, Candolim",
    city: "Goa",
    postcode: "403515",
    bedrooms: 4,
    bathrooms: 5,
    area_sqft: 5100,
    is_featured: 1,
    featured_image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 7,
    title: "DLF Aralias Ultra Luxury Golf Residence",
    ref_number: "PROP-1007",
    description: "Exclusive golf course facing 4BHK apartment with private lift lobby, central VRV air conditioning.",
    property_type: "Apartment",
    listing_type: "Sale",
    price: 120000000,
    address: "DLF Phase 5, Sector 42",
    city: "Gurgaon",
    postcode: "122009",
    bedrooms: 4,
    bathrooms: 4,
    area_sqft: 4500,
    is_featured: 1,
    featured_image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 10,
    title: "Prestige Golfshire Hillside Villa",
    ref_number: "PROP-1010",
    description: "Scenic villa at the foot of Nandi Hills facing 18-hole championship golf course.",
    property_type: "Villa",
    listing_type: "Sale",
    price: 89000000,
    address: "Nandi Hills Road",
    city: "Bengaluru",
    postcode: "562103",
    bedrooms: 4,
    bathrooms: 4,
    area_sqft: 4200,
    is_featured: 1,
    featured_image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80"
  }
];

export default function Home() {
  const navigate = useNavigate();
  const heroTrackRef = useRef(null);
  const [featuredProperties, setFeaturedProperties] = useState(INITIAL_FEATURED);
  const [recentProperties, setRecentProperties] = useState(INITIAL_FEATURED);
  const [activeTab, setActiveTab] = useState('All');
  const [typeCounts, setTypeCounts] = useState({
    Villa: 14,
    Penthouse: 8,
    Apartment: 24,
    House: 19,
    Office: 12
  });

  // Search state
  const [searchParams, setSearchParams] = useState({
    city: '',
    property_type: 'All',
    listing_type: 'All',
    maxPrice: '',
    bedrooms: 'Any'
  });

  const fetchJson = (url) => 
    fetch(url)
      .then(res => {
        const contentType = res.headers.get('content-type');
        if (res.ok && contentType && contentType.includes('application/json')) {
          return res.json();
        }
        throw new Error('Not JSON');
      });

  useEffect(() => {
    // Fetch property type counts
    fetchJson('/api/properties/type-counts')
      .then(counts => {
        if (counts && typeof counts === 'object') setTypeCounts(counts);
      })
      .catch(() => {});

    // Fetch featured
    fetchJson('/api/properties/featured')
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setFeaturedProperties(data);
      })
      .catch(() => {});

    // Fetch recent
    fetchJson('/api/properties?limit=6&sort=newest')
      .then(data => {
        if (data && Array.isArray(data.properties) && data.properties.length > 0) setRecentProperties(data.properties);
      })
      .catch(() => {});
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    let query = '/api/properties?limit=6&sort=newest';
    if (tab === 'Sale' || tab === 'Rent') {
      query += `&listing_type=${tab}`;
    } else if (tab !== 'All') {
      query += `&property_type=${tab}`;
    }

    fetchJson(query)
      .then(data => {
        if (data && Array.isArray(data.properties) && data.properties.length > 0) {
          setRecentProperties(data.properties);
        }
      })
      .catch(() => {});
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (searchParams.city) query.set('city', searchParams.city);
    if (searchParams.property_type !== 'All') query.set('property_type', searchParams.property_type);
    if (searchParams.listing_type !== 'All') query.set('listing_type', searchParams.listing_type);
    if (searchParams.maxPrice) query.set('maxPrice', searchParams.maxPrice);
    if (searchParams.bedrooms !== 'Any') query.set('bedrooms', searchParams.bedrooms);

    navigate(`/properties?${query.toString()}`);
  };

  return (
    <div className="home-page">
      {/* Scroll-Driven Sticky Track Hero Wrapper */}
      <div 
        ref={heroTrackRef}
        className="hero-scroll-track"
        style={{
          position: 'relative',
          height: '320vh',
          marginTop: '-73px'
        }}
      >
        <section style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          paddingTop: '73px'
        }}>
          <HeroFrameAnimation frameCount={240} fps={22} mode="scroll" scrollTargetRef={heroTrackRef} />
        <div className="app-container" style={{ position: 'relative', zIndex: 2, width: '100%' }}>
          <div style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto 32px' }}>
            <div className="eyebrow-tag" style={{
              justifyContent: 'center',
              display: 'inline-flex',
              background: 'rgba(255, 255, 255, 0.18)',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              color: '#ffffff',
              backdropFilter: 'blur(12px)',
              padding: '6px 18px',
              borderRadius: '30px',
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
              fontWeight: 700,
              fontSize: '0.82rem',
              letterSpacing: '0.05em'
            }}>
              <Sparkles size={15} />
              <span>ESTATENEXUS • INDIA'S PREMIER REAL ESTATE MARKETPLACE</span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2.4rem, 5.2vw, 3.8rem)',
              fontWeight: 800,
              color: '#ffffff',
              marginBottom: '16px',
              fontFamily: 'var(--font-heading)',
              textShadow: '0 4px 24px rgba(0, 0, 0, 0.8), 0 2px 6px rgba(0, 0, 0, 0.95)',
              letterSpacing: '-0.015em',
              lineHeight: 1.15
            }}>
              Discover Premier Real Estate Across Top Indian Metros
            </h1>

            <p style={{
              color: 'rgba(255, 255, 255, 0.95)',
              fontWeight: 500,
              fontSize: '1.1rem',
              lineHeight: 1.6,
              maxWidth: '650px',
              margin: '0 auto',
              textShadow: '0 2px 14px rgba(0, 0, 0, 0.85), 0 1px 3px rgba(0, 0, 0, 0.9)'
            }}>
              Explore verified luxury seafront villas, sky penthouses, smart city apartments, and commercial corporate floors in Mumbai, Bengaluru, Delhi NCR, Hyderabad & Goa.
            </p>
          </div>

          {/* Compact Single-Row Glass Pill Search Bar to Highlight Background */}
          <div style={{
            padding: '10px 14px',
            maxWidth: '960px',
            margin: '0 auto',
            borderRadius: '50px',
            background: 'rgba(255, 255, 255, 0.78)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.65)',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.25)'
          }}>
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 140px', minWidth: '120px' }}>
                <select
                  value={searchParams.city}
                  onChange={e => setSearchParams({ ...searchParams, city: e.target.value })}
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid rgba(0,0,0,0.08)',
                    borderRadius: '24px',
                    padding: '8px 14px',
                    fontSize: '0.88rem',
                    width: '100%',
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.04)',
                    color: searchParams.city ? 'var(--ink)' : '#555',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  <option value="">🏙️ Select City</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Gurgaon">Gurgaon</option>
                  <option value="Goa">Goa</option>
                  <option value="Pune">Pune</option>
                  <option value="New Delhi">New Delhi</option>
                </select>
              </div>

              <div style={{ flex: '1 1 110px', minWidth: '100px' }}>
                <select
                  value={searchParams.property_type}
                  onChange={e => setSearchParams({ ...searchParams, property_type: e.target.value })}
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid rgba(0,0,0,0.08)',
                    borderRadius: '24px',
                    padding: '8px 14px',
                    fontSize: '0.88rem',
                    width: '100%',
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.04)'
                  }}
                >
                  <option value="All">All Types</option>
                  <option value="House">House</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Penthouse">Penthouse</option>
                  <option value="Office">Office</option>
                </select>
              </div>

              <div style={{ flex: '1 1 100px', minWidth: '95px' }}>
                <select
                  value={searchParams.listing_type}
                  onChange={e => setSearchParams({ ...searchParams, listing_type: e.target.value })}
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid rgba(0,0,0,0.08)',
                    borderRadius: '24px',
                    padding: '8px 14px',
                    fontSize: '0.88rem',
                    width: '100%',
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.04)'
                  }}
                >
                  <option value="All">Buy & Rent</option>
                  <option value="Sale">For Sale</option>
                  <option value="Rent">For Rent</option>
                </select>
              </div>

              <div style={{ flex: '1 1 100px', minWidth: '95px' }}>
                <input
                  type="number"
                  placeholder="₹ Max Price (INR)"
                  value={searchParams.maxPrice}
                  onChange={e => setSearchParams({ ...searchParams, maxPrice: e.target.value })}
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid rgba(0,0,0,0.08)',
                    borderRadius: '24px',
                    padding: '8px 14px',
                    fontSize: '0.88rem',
                    width: '100%',
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.04)'
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  borderRadius: '24px',
                  padding: '9px 20px',
                  fontSize: '0.9rem',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }}
              >
                <Search size={15} />
                <span>Search</span>
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>

      {/* Categories Grid */}
      <section style={{ padding: '70px 0', background: 'var(--paper)' }}>
        <div className="app-container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div className="eyebrow-tag" style={{ justifyContent: 'center' }}>CATEGORY DIRECTORY</div>
            <h2 style={{ fontSize: '2.2rem', color: 'var(--ink)' }}>Browse By Property Type</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
            {[
              { type: 'Villa', title: 'Luxury Villas', icon: '🏡', defaultCount: 14 },
              { type: 'Penthouse', title: 'Sky Penthouses', icon: '🌆', defaultCount: 8 },
              { type: 'Apartment', title: 'Modern Apartments', icon: '🏢', defaultCount: 24 },
              { type: 'House', title: 'Suburban Houses', icon: '🏠', defaultCount: 19 },
              { type: 'Office', title: 'Commercial Offices', icon: '💼', defaultCount: 12 }
            ].map(cat => {
              const countVal = typeCounts[cat.type] ?? cat.defaultCount;
              return (
                <Link
                  key={cat.type}
                  to={`/properties?property_type=${cat.type}`}
                  className="glass-panel glass-panel-hover"
                  style={{ padding: '28px', textAlign: 'center', textDecoration: 'none' }}
                >
                  <div style={{ fontSize: '2.6rem', marginBottom: '14px' }}>{cat.icon}</div>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--ink)', marginBottom: '4px' }}>{cat.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', fontWeight: 600 }}>{countVal} Listings</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section style={{ padding: '70px 0', background: 'var(--white)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div className="app-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '36px' }}>
            <div>
              <div className="eyebrow-tag">HANDPICKED SELECTION</div>
              <h2 style={{ fontSize: '2.2rem', color: 'var(--ink)' }}>Featured Property Listings</h2>
            </div>
            <Link to="/properties" className="btn btn-secondary btn-sm">
              <span>Explore All Listings</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="properties-grid">
            {featuredProperties.map(prop => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        </div>
      </section>



      {/* PropertyNest Cream Section: How It Works / Values */}
      <section style={{ padding: '80px 0', background: 'var(--cream)', borderBottom: '1px solid var(--line)' }}>
        <div className="app-container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 50px' }}>
            <div className="eyebrow-tag" style={{ justifyContent: 'center' }}>OUR CORE VALUES</div>
            <h2 style={{ fontSize: '2.2rem', color: 'var(--ink)', marginBottom: '12px' }}>Why Choose PropertyNest</h2>
            <p style={{ color: 'var(--ink-soft)' }}>Built on transparency, verified listings, and direct owner communication</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '28px' }}>
            {[
              { step: '01', title: '100% Verified Properties', desc: 'Every villa, apartment, and penthouse listing is inspected and verified.' },
              { step: '02', title: 'Transparent Pricing', desc: 'No hidden broker charges. View complete financial breakdown, maintenance specs, and area details.' },
              { step: '03', title: 'Direct Owner Connect', desc: 'Instant message property owners directly through our secure platform messaging engine.' },
              { step: '04', title: 'End-To-End Support', desc: 'From initial search and virtual viewing to legal document signoff and key handover.' }
            ].map(item => (
              <div key={item.step} className="glass-panel" style={{ padding: '32px', background: 'var(--white)' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--gold)', marginBottom: '12px' }}>{item.step}</div>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--ink)', marginBottom: '10px' }}>{item.title}</h3>
                <p style={{ color: 'var(--ink-soft)', fontSize: '0.92rem', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
