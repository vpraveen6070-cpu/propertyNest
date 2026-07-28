import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, User, Heart, PlusCircle, LayoutDashboard, LogOut, Menu, X, Shield, ArrowLeft } from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/forgot-password';

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="app-container nav-container">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo">
          <div className="brand-logo-icon">
            <Building2 size={22} />
          </div>
          <span>Property<span style={{ color: 'var(--primary)' }}>Nest</span></span>
        </Link>

        {isAuthPage ? (
          <Link 
            to="/" 
            className="btn btn-secondary btn-sm"
            style={{
              background: 'rgba(255, 255, 255, 0.75)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.85)',
              borderRadius: '24px',
              padding: '8px 18px',
              fontWeight: 700,
              color: 'var(--ink)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>
        ) : (
          <>
            <nav className="nav-links">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/properties" className="nav-link">Explore Properties</Link>
              <Link to="/projects" className="nav-link">Explore Projects</Link>
              <Link to="/about" className="nav-link">About Us</Link>
              <Link to="/contact" className="nav-link">Contact</Link>
            </nav>

            {/* Right User Controls */}
            <div className="user-menu">
              {user && (user.role === 'seller' || user.role === 'admin') && (
                <Link to="/properties/add" className="btn btn-primary btn-sm">
                  <PlusCircle size={16} />
                  <span>List Property</span>
                </Link>
              )}

              {user ? (
                <div style={{ position: 'relative' }}>
                  <button 
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)} 
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 8px', borderRadius: '20px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)' }}
                  >
                    <img src={user.avatar} alt={user.name} className="user-avatar" />
                    <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{user.name.split(' ')[0]}</span>
                    <span className={`badge ${user.role === 'admin' ? 'badge-danger' : 'badge-rent'}`} style={{ textTransform: 'capitalize' }}>
                      {user.role}
                    </span>
                  </button>

                  {userDropdownOpen && (
                    <div 
                      className="glass-panel" 
                      style={{
                        position: 'absolute',
                        top: '110%',
                        right: 0,
                        width: '220px',
                        padding: '8px',
                        zIndex: 200,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px'
                      }}
                    >
                      <Link 
                        to="/dashboard" 
                        className="nav-link" 
                        onClick={() => setUserDropdownOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '6px' }}
                      >
                        <LayoutDashboard size={16} />
                        <span>Dashboard</span>
                      </Link>

                      <Link 
                        to="/favourites" 
                        className="nav-link" 
                        onClick={() => setUserDropdownOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '6px' }}
                      >
                        <Heart size={16} />
                        <span>Saved Properties</span>
                      </Link>

                      {user.role === 'admin' && (
                        <Link 
                          to="/dashboard?tab=admin" 
                          className="nav-link" 
                          onClick={() => setUserDropdownOpen(false)}
                          style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '6px', color: 'var(--accent)' }}
                        >
                          <Shield size={16} />
                          <span>Admin Moderation</span>
                        </Link>
                      )}

                      <hr style={{ borderColor: 'var(--border-color)', margin: '4px 0' }} />

                      <button 
                        onClick={handleLogout} 
                        className="nav-link" 
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', color: 'var(--danger)', width: '100%', textAlign: 'left' }}
                      >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Link to="/login" className="btn btn-secondary btn-sm">Sign In</Link>
                  <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ display: 'none', color: '#fff' }}>
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
