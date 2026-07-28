import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PropertyCard from '../components/PropertyCard';

export default function Favourites() {
  const { user } = useAuth();
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetch('/api/favourites', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('estate_token')}` }
      })
      .then(r => r.json())
      .then(data => {
        setFavourites(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleToggleSave = (propId, saved) => {
    if (!saved) {
      setFavourites(favourites.filter(f => f.id !== propId));
    }
  };

  return (
    <div className="app-container" style={{ padding: '40px 20px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Heart size={28} style={{ color: 'var(--danger)' }} /> Saved Favourites
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Properties you have bookmarked for future reference</p>
      </div>

      {!user ? (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>Please log in to view your saved favourite properties.</p>
        </div>
      ) : loading ? (
        <div>Loading saved properties...</div>
      ) : favourites.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>You haven't saved any favourite properties yet.</p>
        </div>
      ) : (
        <div className="properties-grid">
          {favourites.map(prop => (
            <PropertyCard key={prop.id} property={prop} isSaved={true} onToggleSave={handleToggleSave} />
          ))}
        </div>
      )}
    </div>
  );
}
