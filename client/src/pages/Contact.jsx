import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="app-container" style={{ padding: '60px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>Get In Touch With Us</h1>
        <p style={{ color: 'var(--text-muted)' }}>Have questions about listing a property or platform support? We are here to help 24/7.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '36px', maxWidth: '1000px', margin: '0 auto' }}>
        {/* Contact Info */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '24px' }}>Headquarters & Support</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div className="brand-logo-icon"><MapPin size={20} /></div>
              <div>
                <strong>National Headquarters</strong>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>BKC Corporate Plaza, 12th Floor, Mumbai, MH 400051</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div className="brand-logo-icon"><Phone size={20} /></div>
              <div>
                <strong>Support Hotline</strong>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>+91 1800-555-NEST (6378)</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div className="brand-logo-icon"><Mail size={20} /></div>
              <div>
                <strong>Email Inquiries</strong>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>support@propertynest.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '30px 0' }}>
              <CheckCircle2 size={48} style={{ color: 'var(--success)', marginBottom: '12px' }} />
              <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>Message Received!</h3>
              <p style={{ color: 'var(--text-muted)' }}>Thank you for reaching out. Our support team will reply within 2 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '20px' }}>Send Us A Message</h2>

              <div className="form-group">
                <label className="form-label">Name</label>
                <input type="text" placeholder="Your name..." required />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" placeholder="Your email address..." required />
              </div>

              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea rows={4} placeholder="How can we assist you?" required />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                <Send size={16} /> Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
