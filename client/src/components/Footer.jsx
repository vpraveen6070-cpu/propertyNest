import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin, Send, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  const location = useLocation();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/forgot-password';
  if (isAuthPage) return null;

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="footer">
      <div className="app-container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div>
            <div className="brand-logo" style={{ marginBottom: '16px' }}>
              <div className="brand-logo-icon">
                <Building2 size={22} />
              </div>
              <span>Property<span style={{ color: 'var(--primary)' }}>Nest</span></span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
              Premier luxury & commercial real estate marketplace. Discover dream homes and verified properties across India.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a href="#" className="fav-btn" style={{ position: 'relative', top: 0, right: 0 }}><Facebook size={16} /></a>
              <a href="#" className="fav-btn" style={{ position: 'relative', top: 0, right: 0 }}><Twitter size={16} /></a>
              <a href="#" className="fav-btn" style={{ position: 'relative', top: 0, right: 0 }}><Instagram size={16} /></a>
              <a href="#" className="fav-btn" style={{ position: 'relative', top: 0, right: 0 }}><Linkedin size={16} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '16px' }}>Popular Locations</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <li><Link to="/properties?city=Mumbai" className="nav-link">Mumbai, MH</Link></li>
              <li><Link to="/properties?city=Bengaluru" className="nav-link">Bengaluru, KA</Link></li>
              <li><Link to="/properties?city=New+Delhi" className="nav-link">New Delhi, DL</Link></li>
              <li><Link to="/properties?city=Hyderabad" className="nav-link">Hyderabad, TS</Link></li>
              <li><Link to="/properties?city=Gurgaon" className="nav-link">Gurgaon, HR</Link></li>
              <li><Link to="/properties?city=Pune" className="nav-link">Pune, MH</Link></li>
              <li><Link to="/properties?city=Goa" className="nav-link">Goa</Link></li>
            </ul>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '16px' }}>Navigation</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <li><Link to="/properties" className="nav-link">Browse All Listings</Link></li>
              <li><Link to="/about" className="nav-link">About PropertyNest</Link></li>
              <li><Link to="/contact" className="nav-link">Contact Support</Link></li>
              <li><Link to="/privacy-terms" className="nav-link">Privacy Policy & Terms</Link></li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '16px' }}>Market Insights Newsletter</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '14px' }}>
              Subscribe to get exclusive price drop alerts, market reports, and hot listing notifications.
            </p>

            {subscribed ? (
              <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid var(--success)', borderRadius: 'var(--radius-sm)', color: 'var(--success)', fontSize: '0.85rem' }}>
                ✓ Thank you! You have been subscribed to market updates.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="email" 
                  placeholder="Enter your email address..." 
                  value={newsletterEmail} 
                  onChange={(e) => setNewsletterEmail(e.target.value)} 
                  required 
                  style={{ flex: 1, fontSize: '0.85rem' }}
                />
                <button type="submit" className="btn btn-primary btn-sm">
                  <Send size={16} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} PropertyNest Real Estate Platform. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link to="/privacy-terms" className="nav-link">Privacy Policy</Link>
            <Link to="/privacy-terms" className="nav-link">Terms of Service</Link>
            <Link to="/contact" className="nav-link">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
