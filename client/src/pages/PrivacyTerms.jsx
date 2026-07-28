import React from 'react';

export default function PrivacyTerms() {
  return (
    <div className="app-container" style={{ padding: '60px 20px', maxWidth: '800px' }}>
      <div className="glass-panel" style={{ padding: '40px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>Privacy Policy & Terms of Service</h1>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '10px', color: 'var(--primary)' }}>1. Data Protection & Privacy</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>
            PropertyNest is committed to protecting your personal information. All user credentials, property enquiry messages, and financial data are encrypted using industry-standard protocols. We do not sell or lease user data to third-party marketing companies.
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '10px', color: 'var(--primary)' }}>2. Real Estate Listing Moderation</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>
            All property submissions by property sellers and real estate agents undergo verification by platform administrators to ensure listing authenticity, pricing transparency, and accurate property photo assets.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '10px', color: 'var(--primary)' }}>3. Fair Housing & Anti-Discrimination</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>
            PropertyNest strictly complies with equal opportunity fair housing laws. Discriminations based on race, religion, gender, family status, or national origin are strictly prohibited on this platform.
          </p>
        </section>
      </div>
    </div>
  );
}
