import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Phone, Mail, Award, ShieldCheck, MapPin } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';

export default function AgentProfile() {
  const { id } = useParams();
  const [agentData, setAgentData] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/agents/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.agent) {
          setAgentData(data.agent);
          setListings(data.listings || []);
        }
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="app-container" style={{ padding: '80px 20px' }}>Loading agent profile...</div>;
  if (!agentData) return <div className="app-container" style={{ padding: '80px 20px' }}>Agent Profile Not Found</div>;

  return (
    <div className="app-container" style={{ padding: '40px 20px' }}>
      {/* Agent Banner */}
      <div className="glass-panel" style={{ padding: '36px', marginBottom: '40px', display: 'flex', gap: '30px', alignItems: 'center', flexWrap: 'wrap' }}>
        <img 
          src={agentData.avatar} 
          alt={agentData.name} 
          style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--primary)' }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <h1 style={{ fontSize: '2rem' }}>{agentData.name}</h1>
            <span className="badge badge-primary">Certified Agent</span>
          </div>

          <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '1.05rem', marginBottom: '8px' }}>
            {agentData.agency_name} (Lic: #{agentData.license_number})
          </p>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '16px', maxWidth: '680px' }}>
            {agentData.bio}
          </p>

          <div style={{ display: 'flex', gap: '20px', fontSize: '0.9rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Experience: </span>
              <strong>{agentData.experience_years} Years</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Specialization: </span>
              <strong>{agentData.specialization}</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent)' }}>
              <Star size={16} fill="var(--accent)" />
              <strong style={{ color: '#fff' }}>{agentData.rating}</strong> ({agentData.review_count} reviews)
            </div>
          </div>
        </div>
      </div>

      {/* Active Listings Section */}
      <h2 style={{ fontSize: '1.6rem', marginBottom: '20px' }}>
        Listings Represented by {agentData.name} ({listings.length})
      </h2>

      {listings.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No active properties listed under this agent profile currently.</p>
      ) : (
        <div className="properties-grid">
          {listings.map(prop => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      )}
    </div>
  );
}
