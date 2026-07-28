import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, LayoutGrid, List, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, X } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';

const DEFAULT_PROPERTIES = [
  {
    id: 1,
    title: "Seafront Luxury Villa in Bandra West",
    ref_number: "PROP-1001",
    description: "An architectural masterpiece featuring floor-to-ceiling glass walls, an infinity pool overlooking Arabian Sea vistas.",
    property_type: "Villa",
    listing_type: "Sale",
    price: 245000000,
    address: "742 Carter Road, Bandra West",
    city: "Mumbai",
    postcode: "400050",
    bedrooms: 5,
    bathrooms: 6,
    area_sqft: 6200,
    is_featured: 1,
    featured_image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 2,
    title: "Sky Penthouse Overlooking Cubbon Park",
    ref_number: "PROP-1002",
    description: "Stunning downtown penthouse with private rooftop deck, gourmet Italian kitchen, customized walk-in closets.",
    property_type: "Penthouse",
    listing_type: "Sale",
    price: 185000000,
    address: "100 UB City Boulevard, Lavelle Road",
    city: "Bengaluru",
    postcode: "560001",
    bedrooms: 4,
    bathrooms: 5,
    area_sqft: 4800,
    is_featured: 1,
    featured_image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 3,
    title: "Independent Luxury Duplex Bungalow",
    ref_number: "PROP-1003",
    description: "Beautifully maintained duplex bungalow with open-concept living area, teakwood flooring, large backyard garden.",
    property_type: "House",
    listing_type: "Sale",
    price: 78500000,
    address: "Road No. 36, Jubilee Hills",
    city: "Hyderabad",
    postcode: "500033",
    bedrooms: 4,
    bathrooms: 4,
    area_sqft: 3800,
    is_featured: 1,
    featured_image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 4,
    title: "Modern Executive Smart Apartment",
    ref_number: "PROP-1004",
    description: "Fully furnished minimalist 2BHK smart apartment ideal for IT & corporate professionals.",
    property_type: "Apartment",
    listing_type: "Rent",
    price: 65000,
    address: "Golf Course Extension Road, Sector 54",
    city: "Gurgaon",
    postcode: "122002",
    bedrooms: 2,
    bathrooms: 2,
    area_sqft: 1250,
    is_featured: 0,
    featured_image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 6,
    title: "Portuguese Heritage Villa with Private Pool",
    ref_number: "PROP-1006",
    description: "Nestled near Candolim Beach, this luxury eco-friendly smart villa features private pool, outdoor fire lounge.",
    property_type: "Villa",
    listing_type: "Sale",
    price: 145000000,
    address: "Bambolim Beach Road, Candolim",
    city: "Goa",
    postcode: "403515",
    bedrooms: 4,
    bathrooms: 5,
    area_sqft: 5100,
    is_featured: 1,
    featured_image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 7,
    title: "DLF Aralias Ultra Luxury Golf Residence",
    ref_number: "PROP-1007",
    description: "Exclusive golf course facing 4BHK apartment with private lift lobby, central VRV air conditioning.",
    property_type: "Apartment",
    listing_type: "Sale",
    price: 120000000,
    address: "DLF Phase 5, Sector 42",
    city: "Gurgaon",
    postcode: "122009",
    bedrooms: 4,
    bathrooms: 4,
    area_sqft: 4500,
    is_featured: 1,
    featured_image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 8,
    title: "Ultra Luxury Villa in Koregaon Park",
    ref_number: "PROP-1008",
    description: "Modern 4BHK gated community villa featuring private terrace garden, solar power backup, Italian marble.",
    property_type: "Villa",
    listing_type: "Sale",
    price: 92000000,
    address: "Lane 7, Koregaon Park",
    city: "Pune",
    postcode: "411001",
    bedrooms: 4,
    bathrooms: 4,
    area_sqft: 4100,
    is_featured: 1,
    featured_image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 10,
    title: "Prestige Golfshire Hillside Villa",
    ref_number: "PROP-1010",
    description: "Scenic villa at the foot of Nandi Hills facing 18-hole championship golf course.",
    property_type: "Villa",
    listing_type: "Sale",
    price: 89000000,
    address: "Nandi Hills Road",
    city: "Bengaluru",
    postcode: "562103",
    bedrooms: 4,
    bathrooms: 4,
    area_sqft: 4200,
    is_featured: 1,
    featured_image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80"
  }
];

export default function Properties() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState(DEFAULT_PROPERTIES);
  const [totalCount, setTotalCount] = useState(DEFAULT_PROPERTIES.length);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter Form Controls
  const [filters, setFilters] = useState({
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
      .then(res => {
        const ct = res.headers.get('content-type');
        if (res.ok && ct && ct.includes('application/json')) return res.json();
        throw new Error('Not JSON');
      })
      .then(data => {
        if (data && Array.isArray(data.properties)) {
          setProperties(data.properties);
          setTotalCount(data.totalCount || data.properties.length);
          setTotalPages(data.totalPages || 1);
        }
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
              <label className="form-label">City</label>
              <select 
                value={filters.city}
                onChange={e => setFilters({ ...filters, city: e.target.value })}
              >
                <option value="">All Cities</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Gurgaon">Gurgaon</option>
                <option value="Goa">Goa</option>
                <option value="Pune">Pune</option>
                <option value="New Delhi">New Delhi</option>
              </select>
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
