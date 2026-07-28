import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Phone, Mail, Award, ArrowRight } from 'lucide-react';

export default function Agents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/agents')
      .then(res => res.json())
      .then(data => {
        setAgents(Array.isArray(data) ? data : []);
        setLoading(false);
      });
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
