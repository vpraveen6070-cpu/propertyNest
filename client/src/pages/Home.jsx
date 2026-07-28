import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Building, DollarSign, ArrowRight, Star, ShieldCheck, Sparkles, CheckCircle2, Award, Users } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import HeroFrameAnimation from '../components/HeroFrameAnimation';

export default function Home() {
  const navigate = useNavigate();
  const heroTrackRef = useRef(null);
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [recentProperties, setRecentProperties] = useState([]);
  const [agents, setAgents] = useState([]);

  // Search state
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    city: '',
    property_type: 'All',
    listing_type: 'All',
    maxPrice: '',
    bedrooms: 'Any'
  });

  useEffect(() => {
    // Fetch featured
    fetch('/api/properties/featured')
      .then(res => res.ok ? res.json() : [])
      .then(data => setFeaturedProperties(Array.isArray(data) ? data : []))
      .catch(() => {});

    // Fetch recent
    fetch('/api/properties?limit=6&sort=newest')
      .then(res => res.ok ? res.json() : {})
      .then(data => setRecentProperties(data.properties || []))
      .catch(() => {});

    // Fetch agents
    fetch('/api/agents')
      .then(res => res.ok ? res.json() : [])
      .then(data => setAgents(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (searchParams.keyword) query.set('keyword', searchParams.keyword);
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
                <input
                  type="text"
                  placeholder="📍 Keyword / City"
                  value={searchParams.keyword}
                  onChange={e => setSearchParams({ ...searchParams, keyword: e.target.value })}
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

              <div style={{ flex: '1 1 110px', minWidth: '100px' }}>
                <input
                  type="text"
                  placeholder="🏙️ City"
                  value={searchParams.city}
                  onChange={e => setSearchParams({ ...searchParams, city: e.target.value })}
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
              { type: 'Villa', title: 'Luxury Villas', count: '14+ Listings', icon: '🏡' },
              { type: 'Penthouse', title: 'Sky Penthouses', count: '8+ Listings', icon: '🌆' },
              { type: 'Apartment', title: 'Modern Apartments', count: '24+ Listings', icon: '🏢' },
              { type: 'House', title: 'Suburban Houses', count: '19+ Listings', icon: '🏠' },
              { type: 'Office', title: 'Commercial Offices', count: '12+ Listings', icon: '💼' }
            ].map(cat => (
              <Link
                key={cat.type}
                to={`/properties?property_type=${cat.type}`}
                className="glass-panel glass-panel-hover"
                style={{ padding: '28px', textAlign: 'center', textDecoration: 'none' }}
              >
                <div style={{ fontSize: '2.6rem', marginBottom: '14px' }}>{cat.icon}</div>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--ink)', marginBottom: '4px' }}>{cat.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)' }}>{cat.count}</p>
              </Link>
            ))}
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
            <p style={{ color: 'var(--ink-soft)' }}>Built on transparency, verified listings, and direct agent communication</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '28px' }}>
            {[
              { step: '01', title: '100% Verified Properties', desc: 'Every villa, apartment, and penthouse listing is inspected and verified by certified agents.' },
              { step: '02', title: 'Transparent Pricing', desc: 'No hidden broker charges. View complete financial breakdown, maintenance specs, and area details.' },
              { step: '03', title: 'Direct Agent Connect', desc: 'Instant message certified estate agents directly through our secure platform messaging engine.' },
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

      {/* Featured Agents */}
      <section style={{ padding: '70px 0', background: 'var(--paper)' }}>
        <div className="app-container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div className="eyebrow-tag" style={{ justifyContent: 'center' }}>LICENSED CONSULTANTS</div>
            <h2 style={{ fontSize: '2.2rem', color: 'var(--ink)' }}>Meet Our Top Estate Agents</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {agents.slice(0, 3).map(agent => (
              <div key={agent.id} className="glass-panel glass-panel-hover" style={{ padding: '28px', textAlign: 'center' }}>
                <img
                  src={agent.avatar}
                  alt={agent.name}
                  style={{ width: '96px', height: '96px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--forest)', margin: '0 auto 16px' }}
                />
                <h3 style={{ fontSize: '1.25rem', color: 'var(--ink)', marginBottom: '4px' }}>{agent.name}</h3>
                <p style={{ color: 'var(--forest)', fontSize: '0.9rem', fontWeight: 700, marginBottom: '10px' }}>{agent.agency_name}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: 'var(--gold)', fontSize: '0.9rem', marginBottom: '16px' }}>
                  <Star size={16} fill="var(--gold)" />
                  <span style={{ fontWeight: 700, color: 'var(--ink)' }}>{agent.rating}</span>
                  <span style={{ color: 'var(--ink-soft)' }}>({agent.review_count} client reviews)</span>
                </div>
                <Link to={`/agents/${agent.id}`} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                  View Active Portfolio ({agent.active_listings_count})
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
