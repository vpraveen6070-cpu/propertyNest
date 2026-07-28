import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, LayoutGrid, List, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, X } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';

export default function Properties() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter Form Controls
  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    city: searchParams.get('city') || '',
    postcode: searchParams.get('postcode') || '',
    property_type: searchParams.get('property_type') || 'All',
    listing_type: searchParams.get('listing_type') || 'All',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    bedrooms: searchParams.get('bedrooms') || 'Any',
    bathrooms: searchParams.get('bathrooms') || 'Any',
    minArea: searchParams.get('minArea') || '',
    maxArea: searchParams.get('maxArea') || '',
    furnishing: searchParams.get('furnishing') || 'Any',
    parking: searchParams.get('parking') === 'true',
    sort: searchParams.get('sort') || 'newest',
    page: parseInt(searchParams.get('page') || '1', 10)
  });

  const fetchProperties = () => {
    setLoading(true);
    const query = new URLSearchParams();
    if (filters.keyword) query.set('keyword', filters.keyword);
    if (filters.city) query.set('city', filters.city);
    if (filters.postcode) query.set('postcode', filters.postcode);
    if (filters.property_type !== 'All') query.set('property_type', filters.property_type);
    if (filters.listing_type !== 'All') query.set('listing_type', filters.listing_type);
    if (filters.minPrice) query.set('minPrice', filters.minPrice);
    if (filters.maxPrice) query.set('maxPrice', filters.maxPrice);
    if (filters.bedrooms !== 'Any') query.set('bedrooms', filters.bedrooms);
    if (filters.bathrooms !== 'Any') query.set('bathrooms', filters.bathrooms);
    if (filters.minArea) query.set('minArea', filters.minArea);
    if (filters.maxArea) query.set('maxArea', filters.maxArea);
    if (filters.furnishing !== 'Any') query.set('furnishing', filters.furnishing);
    if (filters.parking) query.set('parking', 'true');
    query.set('sort', filters.sort);
    query.set('page', filters.page);
    query.set('limit', 9);

    fetch(`/api/properties?${query.toString()}`)
      .then(res => res.ok ? res.json() : {})
      .then(data => {
        setProperties(data.properties || []);
        setTotalCount(data.totalCount || 0);
        setTotalPages(data.totalPages || 1);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchProperties();
  }, [searchParams, filters.page, filters.sort]);

  const handleApplyFilters = (e) => {
    if (e) e.preventDefault();
    setFilters({ ...filters, page: 1 });
    
    const query = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val && val !== 'All' && val !== 'Any' && val !== false) {
        query.set(key, val);
      }
    });
    setSearchParams(query);
    setMobileFilterOpen(false);
  };

  const handleResetFilters = () => {
    const reset = {
      keyword: '',
      city: '',
      postcode: '',
      property_type: 'All',
      listing_type: 'All',
      minPrice: '',
      maxPrice: '',
      bedrooms: 'Any',
      bathrooms: 'Any',
      minArea: '',
      maxArea: '',
      furnishing: 'Any',
      parking: false,
      sort: 'newest',
      page: 1
    };
    setFilters(reset);
    setSearchParams({});
  };

  return (
    <div className="properties-page app-container" style={{ padding: '40px 20px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>Real Estate Listings</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Showing <strong>{totalCount}</strong> verified properties found across top locations
        </p>
      </div>

      {/* Top Filter Bar & View Toggles */}
      <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <button className="btn btn-secondary btn-sm" onClick={() => setMobileFilterOpen(!mobileFilterOpen)}>
          <SlidersHorizontal size={16} />
          <span>Filters ({Object.values(filters).filter(v => v && v !== 'All' && v !== 'Any' && v !== false && v !== 'newest' && v !== 1).length})</span>
        </button>

        {/* Sorting Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ArrowUpDown size={14} /> Sort By:
          </label>
          <select 
            value={filters.sort} 
            onChange={(e) => {
              setFilters({ ...filters, sort: e.target.value });
            }}
            style={{ padding: '8px 12px', fontSize: '0.85rem' }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price_low">Lowest Price</option>
            <option value="price_high">Highest Price</option>
            <option value="area_largest">Largest Area</option>
            <option value="most_popular">Most Popular</option>
          </select>

          {/* View Mode Toggle */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-sm)', padding: '2px' }}>
            <button 
              className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('grid')}
              style={{ padding: '6px 10px' }}
            >
              <LayoutGrid size={16} />
            </button>
            <button 
              className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('list')}
              style={{ padding: '6px 10px' }}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '28px', alignItems: 'start' }}>
        {/* Sidebar Filters */}
        <aside className={`glass-panel ${mobileFilterOpen ? 'modal-overlay' : ''}`} style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={18} /> Search Filters
            </h3>
            <button onClick={handleResetFilters} style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>Reset All</button>
          </div>

          <form onSubmit={handleApplyFilters}>
            <div className="form-group">
              <label className="form-label">Keyword</label>
              <input 
                type="text" 
                placeholder="Search description, address..." 
                value={filters.keyword}
                onChange={e => setFilters({ ...filters, keyword: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">City</label>
              <input 
                type="text" 
                placeholder="City name..." 
                value={filters.city}
                onChange={e => setFilters({ ...filters, city: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Property Type</label>
              <select value={filters.property_type} onChange={e => setFilters({ ...filters, property_type: e.target.value })}>
                <option value="All">All Types</option>
                <option value="House">House</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="Penthouse">Penthouse</option>
                <option value="Office">Office</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Listing Type</label>
              <select value={filters.listing_type} onChange={e => setFilters({ ...filters, listing_type: e.target.value })}>
                <option value="All">All (Sale & Rent)</option>
                <option value="Sale">For Sale</option>
                <option value="Rent">For Rent</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Min Price (₹)</label>
                <input 
                  type="number" 
                  placeholder="Min (₹)" 
                  value={filters.minPrice}
                  onChange={e => setFilters({ ...filters, minPrice: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Max Price (₹)</label>
                <input 
                  type="number" 
                  placeholder="Max (₹)" 
                  value={filters.maxPrice}
                  onChange={e => setFilters({ ...filters, maxPrice: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Bedrooms</label>
                <select value={filters.bedrooms} onChange={e => setFilters({ ...filters, bedrooms: e.target.value })}>
                  <option value="Any">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Bathrooms</label>
                <select value={filters.bathrooms} onChange={e => setFilters({ ...filters, bathrooms: e.target.value })}>
                  <option value="Any">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Furnishing Status</label>
              <select value={filters.furnishing} onChange={e => setFilters({ ...filters, furnishing: e.target.value })}>
                <option value="Any">Any</option>
                <option value="Furnished">Furnished</option>
                <option value="Semi-Furnished">Semi-Furnished</option>
                <option value="Unfurnished">Unfurnished</option>
              </select>
            </div>

            <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
              <input 
                type="checkbox" 
                id="parkingCheck" 
                checked={filters.parking} 
                onChange={e => setFilters({ ...filters, parking: e.target.checked })} 
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <label htmlFor="parkingCheck" style={{ fontSize: '0.9rem', cursor: 'pointer' }}>Parking Available</label>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '14px' }}>
              Apply Filters
            </button>
          </form>
        </aside>

        {/* Property Grid / List Main Output */}
        <main>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              Loading properties...
            </div>
          ) : properties.length === 0 ? (
            <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center' }}>
              <Search size={48} style={{ color: 'var(--text-dim)', marginBottom: '16px' }} />
              <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>No Properties Found</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Try resetting your filter parameters or broadening your search criteria.</p>
              <button className="btn btn-secondary" onClick={handleResetFilters}>Reset Filters</button>
            </div>
          ) : (
            <div>
              <div className={viewMode === 'grid' ? 'properties-grid' : 'properties-list'}>
                {properties.map(prop => (
                  <PropertyCard key={prop.id} property={prop} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '40px' }}>
                  <button 
                    className="btn btn-secondary btn-sm" 
                    disabled={filters.page === 1}
                    onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                  >
                    <ChevronLeft size={16} /> Prev
                  </button>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Page {filters.page} of {totalPages}
                  </span>
                  <button 
                    className="btn btn-secondary btn-sm" 
                    disabled={filters.page === totalPages}
                    onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
