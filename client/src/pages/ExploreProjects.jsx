import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, Calendar, Award, CheckCircle2, ArrowRight, ShieldCheck, Sparkles, SlidersHorizontal } from 'lucide-react';

const FEATURED_PROJECTS = [
  {
    id: 1,
    name: "Prestige Golfshire Estate",
    developer: "Prestige Group",
    status: "Ready to Move",
    city: "Bengaluru",
    location: "Nandi Hills Road, Devanahalli",
    priceRange: "₹ 4.50 Cr - ₹ 12.00 Cr",
    configurations: "4, 5 BHK Golf Villas & Penthouses",
    areaRange: "4,200 - 8,500 sq.ft.",
    possession: "2024 (Ready)",
    reraNo: "PRM/KA/RERA/1250/303/PR/171015/000451",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    highlights: ["18-Hole Championship Golf Course", "Private Infinity Pool in Every Villa", "Clubhouse & JW Marriott Access"]
  },
  {
    id: 2,
    name: "DLF Cybercity Crest",
    developer: "DLF India",
    status: "Under Construction",
    city: "Gurgaon",
    location: "Golf Course Extension Road, Sector 54",
    priceRange: "₹ 3.50 Cr - ₹ 8.80 Cr",
    configurations: "3, 4 BHK Luxury Apartments & Tech Suites",
    areaRange: "2,400 - 4,800 sq.ft.",
    possession: "December 2026",
    reraNo: "HRERA-PKL-GGM-1142-2023",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    highlights: ["DLF CyberHub Proximity", "Triple Height Glass Atrium", "LEED Platinum Green Certified"]
  },
  {
    id: 3,
    name: "Worli Oceanfront Towers",
    developer: "Oberoi Realty",
    status: "New Launch",
    city: "Mumbai",
    location: "Worli Sea Face, Mumbai South",
    priceRange: "₹ 6.50 Cr - ₹ 22.00 Cr",
    configurations: "3, 4 BHK Sea-Facing Sky Residences",
    areaRange: "2,100 - 5,600 sq.ft.",
    possession: "March 2027",
    reraNo: "P51900034891",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    highlights: ["Unobstructed Arabian Sea Vistas", "Helipad & Private Marina Deck", "Concierge by St. Regis"]
  },
  {
    id: 4,
    name: "Jubilee Hills Imperial Heights",
    developer: "Aparna Constructions",
    status: "Ready to Move",
    city: "Hyderabad",
    location: "Road No. 36, Jubilee Hills",
    priceRange: "₹ 5.20 Cr - ₹ 14.50 Cr",
    configurations: "4, 5 BHK Ultra-Luxury Gated Estates",
    areaRange: "3,800 - 7,200 sq.ft.",
    possession: "2025 (Ready)",
    reraNo: "P02500004123",
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
    highlights: ["Smart Home Automation System", "Private Terrace Garden & Jacuzzi", "50,000 sq.ft. Luxury Clubhouse"]
  },
  {
    id: 5,
    name: "Sobha Windsor Royal Enclave",
    developer: "Sobha Limited",
    status: "Under Construction",
    city: "Bengaluru",
    location: "Whitefield Main Road, East Bengaluru",
    priceRange: "₹ 1.80 Cr - ₹ 4.20 Cr",
    configurations: "2, 3 & 4 BHK Victorian Style Apartments",
    areaRange: "1,550 - 3,200 sq.ft.",
    possession: "September 2026",
    reraNo: "PRM/KA/RERA/1251/446/PR/210408/004112",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    highlights: ["English Architecture & Coaxed Lawns", "Zero-Water-Waste Eco System", "Heated Indoor Swimming Pool"]
  },
  {
    id: 6,
    name: "Anjuna Palms Eco Resort & Villas",
    developer: "Vianaar Homes",
    status: "New Launch",
    city: "Goa",
    location: "Assagao-Anjuna Hilltop Road",
    priceRange: "₹ 3.20 Cr - ₹ 7.50 Cr",
    configurations: "3, 4 BHK Beachfront Private Pool Villas",
    areaRange: "2,600 - 4,500 sq.ft.",
    possession: "October 2026",
    reraNo: "PRGO09211412",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    highlights: ["Portuguese Heritage Aesthetics", "Private Plunge Pools & Deck", "Full Rental Management Support"]
  },
  {
    id: 7,
    name: "Koregaon Park Green Skyline",
    developer: "Panchshil Realty",
    status: "Under Construction",
    city: "Pune",
    location: "Lane 7, Koregaon Park",
    priceRange: "₹ 2.90 Cr - ₹ 6.80 Cr",
    configurations: "3, 4 BHK Executive Penthouses & Lofts",
    areaRange: "2,200 - 4,600 sq.ft.",
    possession: "June 2026",
    reraNo: "P52100028910",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
    highlights: ["Yoo Pune Designer Interiors", "Sky Deck Oxygen Park", "EV Charging Bays per Flat"]
  },
  {
    id: 8,
    name: "Vasant Vihar Embassy Enclave",
    developer: "Tata Housing",
    status: "Ready to Move",
    city: "New Delhi",
    location: "Vasant Vihar Block C, South Delhi",
    priceRange: "₹ 8.50 Cr - ₹ 28.00 Cr",
    configurations: "4, 5 BHK Heritage Duplex Residences",
    areaRange: "4,500 - 9,200 sq.ft.",
    possession: "2024 (Ready)",
    reraNo: "DLRERA2022P0018",
    image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
    highlights: ["Embassy Zone Security Perimeter", "Private Hydraulic Elevator", "Solar Grid Net Metering"]
  }
];

export default function ExploreProjects() {
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const filteredProjects = FEATURED_PROJECTS.filter(project => {
    const matchesCity = selectedCity === 'All' || project.city.toLowerCase() === selectedCity.toLowerCase();
    const matchesStatus = selectedStatus === 'All' || project.status.toLowerCase() === selectedStatus.toLowerCase();
    return matchesCity && matchesStatus;
  });

  return (
    <div className="app-container" style={{ padding: '40px 20px' }}>
      {/* Header Banner */}
      <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 40px' }}>
        <div className="eyebrow-tag" style={{ justifyContent: 'center' }}>
          <Sparkles size={14} /> NEW LAUNCHES & MEGA DEVELOPMENTS
        </div>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--ink)', marginBottom: '14px' }}>
          Explore Premier Real Estate Projects
        </h1>
        <p style={{ color: 'var(--ink-soft)', fontSize: '1.05rem', lineHeight: 1.6 }}>
          Discover RERA-approved luxury townships, golf estates, beachfront villas, and Grade-A commercial towers by top developers across India.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel" style={{ padding: '20px 28px', marginBottom: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <SlidersHorizontal size={18} style={{ color: 'var(--forest)' }} />
          <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--ink)' }}>Filter Projects:</span>
        </div>

        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* City Filter */}
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--ink-soft)', fontWeight: 600, marginRight: '8px' }}>City:</label>
            <select
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
              style={{ padding: '8px 14px', borderRadius: '20px', border: '1px solid var(--line)', background: 'var(--white)', fontSize: '0.88rem', fontWeight: 600 }}
            >
              <option value="All">All Cities</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Gurgaon">Gurgaon</option>
              <option value="Goa">Goa</option>
              <option value="Pune">Pune</option>
              <option value="New Delhi">New Delhi</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--ink-soft)', fontWeight: 600, marginRight: '8px' }}>Status:</label>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              style={{ padding: '8px 14px', borderRadius: '20px', border: '1px solid var(--line)', background: 'var(--white)', fontSize: '0.88rem', fontWeight: 600 }}
            >
              <option value="All">All Statuses</option>
              <option value="New Launch">New Launch</option>
              <option value="Under Construction">Under Construction</option>
              <option value="Ready to Move">Ready to Move</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '32px' }}>
        {filteredProjects.map(project => (
          <div key={project.id} className="glass-panel glass-panel-hover" style={{ borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: 'var(--white)' }}>
            {/* Image & Badge Overlay */}
            <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
              <img
                src={project.image}
                alt={project.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', top: '14px', left: '14px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span className="badge badge-sale" style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700 }}>
                  {project.developer}
                </span>
                <span className={`badge ${project.status === 'Ready to Move' ? 'badge-rent' : project.status === 'New Launch' ? 'badge-danger' : 'badge-primary'}`} style={{ fontSize: '0.75rem' }}>
                  {project.status}
                </span>
              </div>
              <div style={{ position: 'absolute', bottom: '14px', right: '14px', background: 'rgba(0,0,0,0.75)', color: '#fff', padding: '4px 10px', borderRadius: '12px', fontSize: '0.78rem', backdropFilter: 'blur(6px)' }}>
                📍 {project.city}
              </div>
            </div>

            {/* Card Content */}
            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: '12px' }}>
                <h3 style={{ fontSize: '1.35rem', color: 'var(--ink)', marginBottom: '4px' }}>{project.name}</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={14} style={{ color: 'var(--forest)' }} /> {project.location}
                </p>
              </div>

              {/* Specs Grid */}
              <div style={{ background: 'var(--paper)', padding: '12px 16px', borderRadius: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ color: 'var(--ink-soft)', display: 'block', fontSize: '0.75rem' }}>Starting Price</span>
                  <strong style={{ color: 'var(--forest)', fontSize: '0.98rem' }}>{project.priceRange}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--ink-soft)', display: 'block', fontSize: '0.75rem' }}>Configurations</span>
                  <strong style={{ color: 'var(--ink)' }}>{project.configurations}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--ink-soft)', display: 'block', fontSize: '0.75rem' }}>Possession</span>
                  <strong style={{ color: 'var(--ink)' }}>{project.possession}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--ink-soft)', display: 'block', fontSize: '0.75rem' }}>Area Size</span>
                  <strong style={{ color: 'var(--ink)' }}>{project.areaRange}</strong>
                </div>
              </div>

              {/* Highlights */}
              <div style={{ marginBottom: '20px', flex: 1 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Project Highlights</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {project.highlights.map((h, i) => (
                    <li key={i} style={{ fontSize: '0.82rem', color: 'var(--ink-soft)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={13} style={{ color: 'var(--forest)', flexShrink: 0 }} />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* RERA Footer & Button */}
              <div style={{ borderTop: '1px solid var(--line)', paddingTop: '16px', marginTop: 'auto' }}>
                <div style={{ fontSize: '0.73rem', color: 'var(--ink-soft)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={14} style={{ color: 'var(--forest)' }} />
                  <span>RERA: {project.reraNo}</span>
                </div>

                <Link
                  to={`/properties?city=${encodeURIComponent(project.city)}`}
                  className="btn btn-primary"
                  style={{ width: '100%', borderRadius: '24px', justifyContent: 'center', fontSize: '0.9rem' }}
                >
                  <span>Explore Properties in {project.city}</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
