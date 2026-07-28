import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Send, CheckCircle2 } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSent(true);
    }
  };

  return (
    <div className="app-container" style={{ padding: '60px 20px', maxWidth: '460px' }}>
      <div className="glass-panel animate-fade-in" style={{ padding: '36px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div className="brand-logo-icon" style={{ margin: '0 auto 12px' }}>
            <Building2 size={24} />
          </div>
          <h1 style={{ fontSize: '1.6rem', marginBottom: '6px' }}>Reset Your Password</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Enter your email to receive password recovery instructions</p>
        </div>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <CheckCircle2 size={48} style={{ color: 'var(--success)', marginBottom: '12px' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Recovery Link Dispatched</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
              If an account associated with <strong>{email}</strong> exists, you will receive password reset instructions shortly.
            </p>
            <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>Back to Login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                placeholder="e.g. user@example.com" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required 
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '10px' }}>
              <Send size={16} />
              <span>Send Reset Instructions</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
