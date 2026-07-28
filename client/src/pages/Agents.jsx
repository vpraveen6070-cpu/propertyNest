import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Phone, Mail, Award, ArrowRight } from 'lucide-react';

const DEFAULT_AGENTS = [
  {
    id: 2,
    name: "Priya Sharma",
    agency_name: "DLF Luxury Homes",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    rating: 4.9,
    review_count: 28,
    bio: "Top Luxury Real Estate Agent with over 10 years experience in prime seafront & urban properties.",
    active_listings_count: 4
  },
  {
    id: 3,
    name: "Vikramaditya Rao",
    agency_name: "Sobha Prestige Realty",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80",
    rating: 4.8,
    review_count: 19,
    bio: "Commercial & Residential Property Consultant specializing in modern high-rise penthouses & villas.",
    active_listings_count: 5
  },
  {
    id: 4,
    name: "Rajesh Varma",
    agency_name: "Independent Realty Specialist",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    rating: 4.9,
    review_count: 14,
    bio: "Private homeowner & estate developer selling premium eco-friendly suburban properties & villas.",
    active_listings_count: 3
  }
];

export default function Agents() {
  const [agents, setAgents] = useState(DEFAULT_AGENTS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/agents')
      .then(res => {
        const ct = res.headers.get('content-type');
        if (res.ok && ct && ct.includes('application/json')) return res.json();
        throw new Error('Not JSON');
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setAgents(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="app-container" style={{ padding: '40px 20px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>Certified Real Estate Agents</h1>
        <p style={{ color: 'var(--text-muted)' }}>Partner with top licensed brokers and luxury consultants</p>
      </div>

      {loading ? (
        <div>Loading agents...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {agents.map(agent => (
            <div key={agent.id} className="glass-panel glass-panel-hover" style={{ padding: '28px', textAlign: 'center' }}>
              <img 
                src={agent.avatar} 
                alt={agent.name} 
                style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)', margin: '0 auto 16px' }}
              />
              <h3 style={{ fontSize: '1.3rem', marginBottom: '4px' }}>{agent.name}</h3>
              <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px' }}>{agent.agency_name}</p>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: 'var(--accent)', fontSize: '0.9rem', marginBottom: '14px' }}>
                <Star size={16} fill="var(--accent)" />
                <span style={{ fontWeight: 700 }}>{agent.rating}</span>
                <span style={{ color: 'var(--text-muted)' }}>({agent.review_count} client reviews)</span>
              </div>

              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '20px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {agent.bio}
              </p>

              <div style={{ display: 'flex', gap: '10px' }}>
                <Link to={`/agents/${agent.id}`} className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                  <span>View Active Portfolio ({agent.active_listings_count})</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
