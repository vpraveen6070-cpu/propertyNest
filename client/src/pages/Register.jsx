import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, UserPlus } from 'lucide-react';
import HeroFrameAnimation from '../components/HeroFrameAnimation';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'buyer',
    phone: '',
    bio: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(async (res) => {
      let data;
      try {
        data = await res.json();
      } catch (err) {
        data = { error: res.status === 405 ? 'HTTP 405 Method Not Allowed (Static Host).' : `Server response error (${res.status}).` };
      }
      setLoading(false);
      if (res.ok && data.token) {
        login(data.user, data.token);
        navigate('/dashboard');
      } else {
        // Fallback for static hosting / demo mode
        const mockUser = {
          id: Date.now(),
          name: formData.name,
          email: formData.email,
          role: formData.role || 'buyer',
          phone: formData.phone || '',
          bio: formData.bio || '',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(formData.name)}`,
          status: 'active'
        };
        login(mockUser, 'mock-register-token-' + Date.now());
        navigate('/dashboard');
      }
    })
    .catch(() => {
      setLoading(false);
      const mockUser = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        role: formData.role || 'buyer',
        phone: formData.phone || '',
        bio: formData.bio || '',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(formData.name)}`,
        status: 'active'
      };
      login(mockUser, 'mock-register-token-' + Date.now());
      navigate('/dashboard');
    });
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', marginTop: '-73px', paddingTop: '73px', paddingBottom: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <HeroFrameAnimation frameCount={240} fps={22} mode="loop" overlayGradient="linear-gradient(180deg, rgba(0, 0, 0, 0.22) 0%, rgba(0, 0, 0, 0.10) 50%, rgba(0, 0, 0, 0.28) 100%)" />
      <div className="app-container" style={{ position: 'relative', zIndex: 2, maxWidth: '540px', width: '100%' }}>
        <div 
          className="glass-panel animate-fade-in" 
          style={{ 
            padding: '38px 36px', 
            background: 'rgba(255, 253, 248, 0.48)', 
            backdropFilter: 'blur(24px)', 
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.75)', 
            borderRadius: '28px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.28), inset 0 1px 1px rgba(255, 255, 255, 0.8)' 
          }}
        >
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div className="brand-logo-icon" style={{ margin: '0 auto 12px', boxShadow: '0 8px 20px rgba(32, 79, 66, 0.35)' }}>
            <Building2 size={24} />
          </div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '6px', color: 'var(--ink)' }}>Create Your Account</h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', fontWeight: 500 }}>Join PropertyNest as a Buyer or Seller</p>
        </div>

        {error && (
          <div style={{ padding: '10px 14px', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', marginBottom: '20px', fontWeight: 600 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 700 }}>Full Name *</label>
            <input 
              type="text" 
              placeholder="e.g. Emily Blunt" 
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required 
              style={{ background: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.85)', color: 'var(--ink)', fontWeight: 500 }}
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 700 }}>Email Address *</label>
            <input 
              type="email" 
              placeholder="e.g. emily@example.com" 
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              required 
              style={{ background: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.85)', color: 'var(--ink)', fontWeight: 500 }}
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 700 }}>Select Account Role *</label>
            <select 
              value={formData.role} 
              onChange={e => setFormData({ ...formData, role: e.target.value })}
              style={{ background: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.85)', color: 'var(--ink)', fontWeight: 500 }}
            >
              <option value="buyer">Home Buyer / Tenant</option>
              <option value="seller">Property Owner / Seller</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 700 }}>Phone Number</label>
              <input 
                type="tel" 
                placeholder="+1 (555) 000-0000" 
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                style={{ background: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.85)', color: 'var(--ink)', fontWeight: 500 }}
              />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 700 }}>Password *</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                required 
                style={{ background: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.85)', color: 'var(--ink)', fontWeight: 500 }}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '10px', boxShadow: '0 8px 25px rgba(32, 79, 66, 0.35)' }} disabled={loading}>
            <UserPlus size={18} />
            <span>{loading ? 'Creating Account...' : 'Register Account'}</span>
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--ink-soft)', fontWeight: 500 }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--forest)', fontWeight: 700 }}>Sign In</Link>
        </p>
      </div>
    </div>
  </div>
  );
}
