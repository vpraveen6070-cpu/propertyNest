import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="app-container" style={{ padding: '100px 20px', textAlign: 'center', maxWidth: '500px' }}>
      <div className="glass-panel" style={{ padding: '50px 30px' }}>
        <div style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>404</div>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>Property Page Not Found</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '28px' }}>
          The real estate page or listing reference you are looking for does not exist or has been relocated.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link to="/" className="btn btn-primary">Return Home</Link>
          <Link to="/properties" className="btn btn-secondary">Search Properties</Link>
        </div>
      </div>
    </div>
  );
}
