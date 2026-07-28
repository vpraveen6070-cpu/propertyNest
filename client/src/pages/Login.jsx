import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, Lock, Mail, LogIn } from 'lucide-react';
import HeroFrameAnimation from '../components/HeroFrameAnimation';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const MOCK_USERS = {
    'admin@estate.com': { user: { id: 1, name: 'System Admin', email: 'admin@estate.com', role: 'admin', phone: '+91 98765 01928', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80', bio: 'Platform Administrator & Content Moderator', status: 'active' }, token: 'mock-admin-token' },
    'sarah.agent@estate.com': { user: { id: 2, name: 'Priya Sharma', email: 'sarah.agent@estate.com', role: 'agent', phone: '+91 98201 23456', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80', bio: 'Top Luxury Real Estate Agent with over 10 years experience in prime seafront & urban properties.', status: 'active' }, token: 'mock-agent-token' },
    'john.seller@estate.com': { user: { id: 4, name: 'Rajesh Varma', email: 'john.seller@estate.com', role: 'seller', phone: '+91 98112 34567', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', bio: 'Private homeowner selling premium properties.', status: 'active' }, token: 'mock-seller-token' },
    'buyer@estate.com': { user: { id: 5, name: 'Ananya Sen', email: 'buyer@estate.com', role: 'buyer', phone: '+91 98765 43210', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80', bio: 'Active home buyer looking for modern luxury villas and apartments.', status: 'active' }, token: 'mock-buyer-token' }
  };

  const tryMockFallback = (loginEmail) => {
    const mock = MOCK_USERS[loginEmail.toLowerCase()];
    if (mock) {
      login(mock.user, mock.token);
      navigate('/dashboard');
      return true;
    }
    return false;
  };

  const executeLogin = (loginEmail, loginPassword) => {
    setError('');
    setLoading(true);

    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: loginEmail, password: loginPassword })
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
        // Fallback for static hosting (GitHub Pages) or offline server
        if (tryMockFallback(loginEmail)) return;
        setError(data.error || 'Login failed. Please check your credentials.');
      }
    })
    .catch((err) => {
      setLoading(false);
      if (tryMockFallback(loginEmail)) return;
      setError('Network error: Unable to connect to server. Please verify backend is running.');
    });
  };

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    executeLogin(email, password);
  };

  const handleQuickDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    executeLogin(demoEmail, demoPass);
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', marginTop: '-73px', paddingTop: '73px', paddingBottom: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <HeroFrameAnimation frameCount={240} fps={22} mode="loop" overlayGradient="linear-gradient(180deg, rgba(0, 0, 0, 0.22) 0%, rgba(0, 0, 0, 0.10) 50%, rgba(0, 0, 0, 0.28) 100%)" />
      <div className="app-container" style={{ position: 'relative', zIndex: 2, maxWidth: '480px', width: '100%' }}>
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
          <h1 style={{ fontSize: '1.8rem', marginBottom: '6px', color: 'var(--ink)' }}>Sign In To PropertyNest</h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', fontWeight: 500 }}>Access your property dashboard & saved listings</p>
        </div>

        {error && (
          <div style={{ padding: '10px 14px', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', marginBottom: '20px', fontWeight: 600 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 700 }}>Email Address</label>
            <input 
              type="email" 
              placeholder="e.g. buyer@estate.com" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              required 
              style={{ background: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.85)', color: 'var(--ink)', fontWeight: 500 }}
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label" style={{ fontWeight: 700 }}>Password</label>
              <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: 'var(--forest)', fontWeight: 700 }}>Forgot Password?</Link>
            </div>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              required 
              style={{ background: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.85)', color: 'var(--ink)', fontWeight: 500 }}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '10px', boxShadow: '0 8px 25px rgba(32, 79, 66, 0.35)' }} disabled={loading}>
            <LogIn size={18} />
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        <hr style={{ borderColor: 'rgba(0, 0, 0, 0.08)', margin: '24px 0' }} />

        {/* Quick Demo Credentials Buttons */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--ink-soft)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>
            ⚡ One-Click Demo Logins
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button type="button" className="btn btn-sm" style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.85)', color: 'var(--ink)', fontWeight: 600 }} onClick={() => handleQuickDemo('admin@estate.com', 'admin123')}>Admin</button>
            <button type="button" className="btn btn-sm" style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.85)', color: 'var(--ink)', fontWeight: 600 }} onClick={() => handleQuickDemo('sarah.agent@estate.com', 'agent123')}>Agent</button>
            <button type="button" className="btn btn-sm" style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.85)', color: 'var(--ink)', fontWeight: 600 }} onClick={() => handleQuickDemo('john.seller@estate.com', 'seller123')}>Seller</button>
            <button type="button" className="btn btn-sm" style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.85)', color: 'var(--ink)', fontWeight: 600 }} onClick={() => handleQuickDemo('buyer@estate.com', 'buyer123')}>Buyer</button>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--ink-soft)', fontWeight: 500 }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--forest)', fontWeight: 700 }}>Register Now</Link>
        </p>
      </div>
    </div>
  </div>
  );
}
