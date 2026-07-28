import React from 'react';
import { Building2, ShieldCheck, Award, Users, Globe, TrendingUp } from 'lucide-react';

export default function About() {
  return (
    <div className="app-container" style={{ padding: '60px 20px' }}>
      <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 60px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Redefining Modern Real Estate</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.7 }}>
          PropertyNest is India’s premier real estate technology platform connecting luxury home buyers and verified property sellers through seamless digital experiences.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '70px' }}>
        <div className="glass-panel" style={{ padding: '30px', textAlign: 'center' }}>
          <Building2 size={36} style={{ color: 'var(--primary)', marginBottom: '14px' }} />
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>$4.2 Billion+</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Gross Real Estate Volume</p>
        </div>
        <div className="glass-panel" style={{ padding: '30px', textAlign: 'center' }}>
          <Globe size={36} style={{ color: 'var(--secondary)', marginBottom: '14px' }} />
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>45+ Cities</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Metropolitan Locations</p>
        </div>
        <div className="glass-panel" style={{ padding: '30px', textAlign: 'center' }}>
          <Users size={36} style={{ color: 'var(--accent)', marginBottom: '14px' }} />
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>120,000+</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Registered Platform Members</p>
        </div>
        <div className="glass-panel" style={{ padding: '30px', textAlign: 'center' }}>
          <ShieldCheck size={36} style={{ color: 'var(--success)', marginBottom: '14px' }} />
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>100% Verified</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Listing Integrity & Ownership</p>
        </div>
      </div>
    </div>
  );
}
