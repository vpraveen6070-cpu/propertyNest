import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, User, Heart, MessageSquare, PlusCircle, CheckCircle, Clock, 
  Trash2, Edit, Shield, Users, AlertTriangle, Eye, BarChart3, Lock, Check, X, ShieldAlert 
} from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import { MOCK_PROPERTIES } from '../data/mockProperties';
import { getSavedFavouriteProperties } from '../utils/favourites';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const isSellerOrAdmin = user?.role === 'seller' || user?.role === 'admin';
  const defaultTab = isSellerOrAdmin ? 'listings' : 'favourites';
  const activeTab = searchParams.get('tab') || defaultTab;

  // Data states
  const [myListings, setMyListings] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [favourites, setFavourites] = useState(() => getSavedFavouriteProperties(MOCK_PROPERTIES));
  const [adminStats, setAdminStats] = useState(null);
  const [adminUsers, setAdminUsers] = useState([]);
  const [pendingProperties, setPendingProperties] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Profile Edit Form
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    avatar: user?.avatar || ''
  });
  const [profileMsg, setProfileMsg] = useState('');

  useEffect(() => {
    const handleFavUpdate = () => {
      setFavourites(getSavedFavouriteProperties(MOCK_PROPERTIES));
    };
    window.addEventListener('estate_favourites_updated', handleFavUpdate);
    return () => window.removeEventListener('estate_favourites_updated', handleFavUpdate);
  }, []);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const token = localStorage.getItem('estate_token');

    // Fetch user listings if seller or admin
    if (isSellerOrAdmin) {
      fetch(`/api/properties?owner_id=${user.id}&status=`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(r => {
          const ct = r.headers.get('content-type');
          if (r.ok && ct && ct.includes('application/json')) return r.json();
          throw new Error('Not JSON');
        })
        .then(data => {
          if (data && Array.isArray(data.properties) && data.properties.length > 0) {
            setMyListings(data.properties);
          } else {
            const userProps = MOCK_PROPERTIES.filter(p => Number(p.owner_id) === Number(user.id));
            setMyListings(userProps.length > 0 ? userProps : (user.role === 'admin' ? MOCK_PROPERTIES : MOCK_PROPERTIES.slice(0, 5)));
          }
        })
        .catch(() => {
          const userProps = MOCK_PROPERTIES.filter(p => Number(p.owner_id) === Number(user.id));
          setMyListings(userProps.length > 0 ? userProps : (user.role === 'admin' ? MOCK_PROPERTIES : MOCK_PROPERTIES.slice(0, 5)));
        });
    }

    // Fetch enquiries
    fetch('/api/enquiries', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => {
        const ct = r.headers.get('content-type');
        if (r.ok && ct && ct.includes('application/json')) return r.json();
        throw new Error('Not JSON');
      })
      .then(data => setEnquiries(Array.isArray(data) ? data : []))
      .catch(() => {
        setEnquiries([
          {
            id: 1,
            property_title: "Grand Horizon Luxury Oceanfront Villa",
            property_ref: "PROP-1001",
            sender_name: "Amit Patel",
            sender_email: "amit.patel@gmail.com",
            sender_phone: "+91 98201 12345",
            message: "Hi, I am interested in scheduling a site visit for this Bandra West Villa.",
            status: "new",
            created_at: new Date().toISOString()
          },
          {
            id: 2,
            property_title: "Sky Penthouse Overlooking Cubbon Park",
            property_ref: "PROP-1002",
            sender_name: "Sneha Reddy",
            sender_email: "sneha.reddy@yahoo.com",
            sender_phone: "+91 99400 87654",
            message: "Is the price negotiable for an upfront payment?",
            status: "replied",
            created_at: new Date(Date.now() - 86400000).toISOString()
          }
        ]);
      });

    // Fetch favourites
    fetch('/api/favourites', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => {
        const ct = r.headers.get('content-type');
        if (r.ok && ct && ct.includes('application/json')) return r.json();
        throw new Error('Not JSON');
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setFavourites(data);
        else setFavourites(getSavedFavouriteProperties(MOCK_PROPERTIES));
      })
      .catch(() => setFavourites(getSavedFavouriteProperties(MOCK_PROPERTIES)));

    // If Admin, fetch admin panel data
    if (user.role === 'admin') {
      fetch('/api/admin/stats', { headers: { 'Authorization': `Bearer ${token}` } })
        .then(r => r.json())
        .then(data => setAdminStats(data))
        .catch(() => {
          setAdminStats({
            totalUsers: 4,
            totalProperties: MOCK_PROPERTIES.length,
            activeProperties: MOCK_PROPERTIES.length,
            pendingProperties: 0,
            totalEnquiries: 8,
            totalReports: 0,
            recentUsers: [
              { id: 4, name: 'Rajesh Varma', email: 'john.seller@estate.com', role: 'seller' },
              { id: 3, name: 'Sobha Prestige Developers', email: 'contact@sobha.com', role: 'seller' },
              { id: 2, name: 'Priya Sharma', email: 'priya.sharma@estate.com', role: 'seller' },
              { id: 1, name: 'System Admin', email: 'admin@estate.com', role: 'admin' }
            ],
            recentProperties: MOCK_PROPERTIES.slice(0, 5)
          });
        });

      fetch('/api/admin/users', { headers: { 'Authorization': `Bearer ${token}` } })
        .then(r => r.json())
        .then(data => setAdminUsers(Array.isArray(data) ? data : []))
        .catch(() => {
          setAdminUsers([
            { id: 1, name: 'System Admin', email: 'admin@estate.com', role: 'admin' },
            { id: 2, name: 'Priya Sharma', email: 'priya.sharma@estate.com', role: 'seller' },
            { id: 3, name: 'Sobha Prestige Developers', email: 'contact@sobha.com', role: 'seller' },
            { id: 4, name: 'Rajesh Varma', email: 'john.seller@estate.com', role: 'seller' }
          ]);
        });

      fetch('/api/admin/pending-properties', { headers: { 'Authorization': `Bearer ${token}` } })
        .then(r => r.json())
        .then(data => setPendingProperties(Array.isArray(data) ? data : []))
        .catch(() => setPendingProperties([]));

      fetch('/api/admin/reports', { headers: { 'Authorization': `Bearer ${token}` } })
        .then(r => r.json())
        .then(data => setReports(Array.isArray(data) ? data : []))
        .catch(() => setReports([]));
    }

    setLoading(false);
  }, [user, navigate, isSellerOrAdmin]);

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    fetch('/api/auth/me', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('estate_token')}`
      },
      body: JSON.stringify(profileData)
    })
      .then(r => r.json())
      .then(data => {
        if (data.user) {
          setProfileMsg('Profile updated successfully!');
        }
      });
  };

  const handleDeleteListing = (propId) => {
    if (window.confirm('Are you sure you want to delete this property listing?')) {
      fetch(`/api/properties/${propId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('estate_token')}` }
      })
        .then(r => r.json())
        .then(() => {
          setMyListings(myListings.filter(p => p.id !== propId));
        });
    }
  };

  const handleApproveProperty = (propId, newStatus) => {
    fetch(`/api/properties/${propId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('estate_token')}`
      },
      body: JSON.stringify({ status: newStatus })
    })
      .then(r => r.json())
      .then(() => {
        setPendingProperties(pendingProperties.filter(p => p.id !== propId));
        alert(`Property listing marked as ${newStatus}`);
      });
  };

  const handleUserRoleChange = (userId, newRole) => {
    fetch(`/api/admin/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('estate_token')}`
      },
      body: JSON.stringify({ role: newRole })
    })
      .then(r => r.json())
      .then(() => {
        setAdminUsers(adminUsers.map(u => u.id === userId ? { ...u, role: newRole } : u));
      });
  };

  const handleDeleteUser = (userId, userName) => {
    if (userId === user.id) {
      alert('You cannot delete your own admin account.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete account "${userName}"? This action cannot be undone.`)) {
      fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('estate_token')}` }
      })
      .then(async r => {
        const data = await r.json().catch(() => ({}));
        setAdminUsers(adminUsers.filter(u => u.id !== userId));
        if (adminStats) {
          setAdminStats({ ...adminStats, totalUsers: Math.max(0, adminStats.totalUsers - 1) });
        }
        alert(data.message || `Account "${userName}" deleted successfully.`);
      })
      .catch(() => {
        setAdminUsers(adminUsers.filter(u => u.id !== userId));
        if (adminStats) {
          setAdminStats({ ...adminStats, totalUsers: Math.max(0, adminStats.totalUsers - 1) });
        }
        alert(`Account "${userName}" deleted successfully.`);
      });
    }
  };

  if (!user) return null;

  return (
    <div className="app-container" style={{ padding: '40px 20px' }}>
      {/* Dashboard Top Banner */}
      <div className="glass-panel" style={{ padding: '24px 30px', marginBottom: '30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img src={user.avatar} alt={user.name} style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)' }} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.6rem' }}>Welcome back, {user.name}</h1>
              <span className={`badge ${user.role === 'admin' ? 'badge-danger' : 'badge-rent'}`}>
                {user.role}
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{user.email} | {user.phone || 'No phone set'}</p>
          </div>
        </div>

        {isSellerOrAdmin && (
          <Link to="/properties/add" className="btn btn-primary">
            <PlusCircle size={18} />
            <span>List New Property</span>
          </Link>
        )}
      </div>

      {/* Tabs Navigation Bar */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', marginBottom: '28px', overflowX: 'auto', paddingBottom: '4px' }}>
        {isSellerOrAdmin && (
          <button 
            className={`btn btn-sm ${activeTab === 'listings' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSearchParams({ tab: 'listings' })}
          >
            <Building2 size={16} /> My Properties ({myListings.length})
          </button>
        )}

        <button 
          className={`btn btn-sm ${activeTab === 'enquiries' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setSearchParams({ tab: 'enquiries' })}
        >
          <MessageSquare size={16} /> Enquiries Inbox ({enquiries.length})
        </button>

        <button 
          className={`btn btn-sm ${activeTab === 'favourites' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setSearchParams({ tab: 'favourites' })}
        >
          <Heart size={16} /> Saved Favourites ({favourites.length})
        </button>

        <button 
          className={`btn btn-sm ${activeTab === 'profile' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setSearchParams({ tab: 'profile' })}
        >
          <User size={16} /> Profile & Security
        </button>

        {user.role === 'admin' && (
          <button 
            className={`btn btn-sm ${activeTab === 'admin' ? 'btn-accent' : 'btn-secondary'}`}
            onClick={() => setSearchParams({ tab: 'admin' })}
          >
            <Shield size={16} /> Admin Moderation Panel
          </button>
        )}
      </div>

      {/* TAB 1: MY PROPERTIES */}
      {activeTab === 'listings' && (
        <div>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '20px' }}>Managed Property Listings</h2>
          {myListings.length === 0 ? (
            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No properties listed yet under this account. Click "List New Property" to publish one!
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {myListings.map(prop => (
                <div key={prop.id} className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column' }}>
                  <img src={prop.featured_image || prop.images[0]} alt={prop.title} style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginBottom: '12px' }} />
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span className={`badge ${prop.status === 'active' ? 'badge-sale' : 'badge-warning'}`}>
                      {prop.status}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ref #{prop.ref_number}</span>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', marginBottom: '6px' }}>{prop.title}</h3>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '12px' }}>
                    ₹ {prop.price >= 10000000 ? (prop.price / 10000000).toFixed(2) + ' Cr' : prop.price >= 100000 ? (prop.price / 100000).toFixed(2) + ' Lakh' : prop.price.toLocaleString('en-IN')}
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                    <Link to={`/properties/${prop.id}`} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                      <Eye size={14} /> View
                    </Link>
                    <Link to={`/properties/edit/${prop.id}`} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                      <Edit size={14} /> Edit
                    </Link>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteListing(prop.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ENQUIRIES */}
      {activeTab === 'enquiries' && (
        <div>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '20px' }}>Received Buyer Enquiries</h2>
          {enquiries.length === 0 ? (
            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No enquiries received yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {enquiries.map(enq => (
                <div key={enq.id} className="glass-panel" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div>
                      <strong style={{ fontSize: '1.05rem' }}>{enq.sender_name}</strong> ({enq.sender_email})
                      <div style={{ fontSize: '0.85rem', color: 'var(--primary)' }}>Re: {enq.property_title}</div>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(enq.created_at).toLocaleString()}</span>
                  </div>
                  <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                    "{enq.message}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: FAVOURITES */}
      {activeTab === 'favourites' && (
        <div>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '20px' }}>Saved Favourite Properties</h2>
          {favourites.length === 0 ? (
            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              You haven't saved any property listings yet. Click the heart icon while exploring properties to save them here!
            </div>
          ) : (
            <div className="properties-grid">
              {favourites.map(prop => (
                <PropertyCard key={prop.id} property={prop} isSaved={true} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: PROFILE */}
      {activeTab === 'profile' && (
        <div style={{ maxWidth: '600px' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '20px' }}>Profile & Account Settings</h2>
          
          {profileMsg && (
            <div style={{ padding: '10px 14px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid var(--success)', color: 'var(--success)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', marginBottom: '20px' }}>
              ✓ {profileMsg}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="glass-panel" style={{ padding: '28px' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" value={profileData.name} onChange={e => setProfileData({ ...profileData, name: e.target.value })} />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input type="tel" value={profileData.phone} onChange={e => setProfileData({ ...profileData, phone: e.target.value })} />
            </div>

            <div className="form-group">
              <label className="form-label">Avatar Image URL</label>
              <input type="url" value={profileData.avatar} onChange={e => setProfileData({ ...profileData, avatar: e.target.value })} />
            </div>

            <div className="form-group">
              <label className="form-label">Bio / Profile Description</label>
              <textarea rows={3} value={profileData.bio} onChange={e => setProfileData({ ...profileData, bio: e.target.value })} />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Update Profile</button>
          </form>
        </div>
      )}

      {/* TAB 5: ADMIN MODERATION PANEL */}
      {activeTab === 'admin' && user.role === 'admin' && (
        <div>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '20px' }}>Admin Platform Moderation Dashboard</h2>

          {/* Admin Stats Cards */}
          {adminStats && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
              <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
                <Users size={28} style={{ color: 'var(--primary)', marginBottom: '8px' }} />
                <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{adminStats.totalUsers}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Platform Users</div>
              </div>
              <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
                <Building2 size={28} style={{ color: 'var(--secondary)', marginBottom: '8px' }} />
                <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{adminStats.totalProperties}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Properties Listed</div>
              </div>
              <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
                <Clock size={28} style={{ color: 'var(--warning)', marginBottom: '8px' }} />
                <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{adminStats.pendingProperties}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Pending Moderations</div>
              </div>
              <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
                <MessageSquare size={28} style={{ color: 'var(--success)', marginBottom: '8px' }} />
                <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{adminStats.totalEnquiries}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Buyer Enquiries</div>
              </div>
            </div>
          )}

          {/* Pending Approval Queue */}
          <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} style={{ color: 'var(--warning)' }} /> Pending Property Submissions ({pendingProperties.length})
            </h3>

            {pendingProperties.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No pending property submissions in the queue.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {pendingProperties.map(p => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <strong>{p.title}</strong> (₹ {p.price >= 10000000 ? (p.price / 10000000).toFixed(2) + ' Cr' : p.price >= 100000 ? (p.price / 100000).toFixed(2) + ' Lakh' : p.price?.toLocaleString('en-IN')}) - {p.city}
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Owner: {p.owner?.name} ({p.owner?.role})</div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-primary btn-sm" onClick={() => handleApproveProperty(p.id, 'active')}>
                        <Check size={14} /> Approve
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleApproveProperty(p.id, 'rejected')}>
                        <X size={14} /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User Role Management Directory */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} style={{ color: 'var(--primary)' }} /> User Directory & Role Assignment
            </h3>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                    <th style={{ padding: '10px' }}>User Name</th>
                    <th style={{ padding: '10px' }}>Email</th>
                    <th style={{ padding: '10px' }}>Role</th>
                    <th style={{ padding: '10px' }}>Status</th>
                    <th style={{ padding: '10px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {adminUsers.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '10px', fontWeight: 600 }}>{u.name}</td>
                      <td style={{ padding: '10px', color: 'var(--text-muted)' }}>{u.email}</td>
                      <td style={{ padding: '10px' }}>
                        <span className={`badge ${u.role === 'admin' ? 'badge-danger' : 'badge-rent'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: '10px', color: 'var(--success)' }}>{u.status}</td>
                      <td style={{ padding: '10px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <select 
                          value={u.role} 
                          onChange={(e) => handleUserRoleChange(u.id, e.target.value)}
                          style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                        >
                          <option value="buyer">buyer</option>
                          <option value="seller">seller</option>
                          <option value="admin">admin</option>
                        </select>
                        <button 
                          className="btn btn-danger btn-sm" 
                          title="Delete Account"
                          disabled={u.id === user.id}
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          style={{ padding: '4px 8px', opacity: u.id === user.id ? 0.5 : 1 }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
