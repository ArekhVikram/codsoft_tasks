import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, SlidersHorizontal, Search, RotateCcw } from 'lucide-react';
import { api } from '../services/api.js';
import ProductCard from '../components/ProductCard.jsx';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // State from URL or defaults
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';
  const initialSort = searchParams.get('sort') || 'featured';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [category, setCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [sortOption, setSortOption] = useState(initialSort);
  const [maxPrice, setMaxPrice] = useState(400);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state if URL changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setCategory(cat);
    const q = searchParams.get('search');
    if (q !== null) setSearchTerm(q);
    const s = searchParams.get('sort');
    if (s) setSortOption(s);
  }, [searchParams]);

  // Fetch products
  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.getProducts({
          category: category !== 'All' ? category : '',
          search: searchTerm,
          sort: sortOption
        });
        if (res.success) {
          setProducts(res.products || []);
        } else {
          setError('Could not retrieve objects.');
        }
      } catch (err) {
        setError(err.message || 'Error connecting to server.');
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [category, searchTerm, sortOption]);

  // Client-side quick filter for price slider and in-stock toggle
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchPrice = p.price <= maxPrice;
      const matchStock = inStockOnly ? p.stock > 0 : true;
      return matchPrice && matchStock;
    });
  }, [products, maxPrice, inStockOnly]);

  const categories = ['All', 'Audio', 'Workspace', 'Living', 'Carry'];

  const handleCategorySelect = (cat) => {
    setCategory(cat);
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', cat);
    }
    setSearchParams(newParams);
  };

  const handleSortChange = (e) => {
    const val = e.target.value;
    setSortOption(val);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', val);
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setCategory('All');
    setSearchTerm('');
    setSortOption('featured');
    setMaxPrice(400);
    setInStockOnly(false);
    setSearchParams({});
  };

  const hasActiveFilters = category !== 'All' || searchTerm !== '' || maxPrice < 400 || inStockOnly || sortOption !== 'featured';

  return (
    <div style={{ padding: '3rem 0 6rem', minHeight: '80vh' }}>
      <div className="container">
        {/* Header & Breadcrumb */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-olive)', fontWeight: 600, marginBottom: '0.5rem' }}>
            Catalog Overview
          </div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
            {category === 'All' ? 'All Living Objects' : `${category} Collection`}
          </h1>
          <p style={{ maxWidth: '640px', fontSize: '0.95rem' }}>
            Understated acoustic gear, milled desk accessories, and living goods crafted from enduring materials.
          </p>
        </div>

        {/* Search & Mobile Filter Row */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            paddingBottom: '1.5rem',
            marginBottom: '2rem',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          {/* Category Tabs */}
          <div className="category-tabs" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                style={{
                  padding: '0.55rem 1.15rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  backgroundColor: category === cat ? 'var(--text-primary)' : 'var(--bg-card)',
                  color: category === cat ? '#FAF8F5' : 'var(--text-secondary)',
                  border: `1px solid ${category === cat ? 'var(--text-primary)' : 'var(--border-medium)'}`,
                  transition: 'all 0.15s ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search, Sort & Filter Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, justifyContent: 'flex-end', minWidth: '280px' }}>
            {/* Live Search input */}
            <div style={{ position: 'relative', width: '220px' }}>
              <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Filter by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: '0.5rem 0.75rem 0.5rem 2.25rem',
                  fontSize: '0.85rem',
                  borderRadius: 'var(--radius-sm)'
                }}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Sort Select */}
            <select
              value={sortOption}
              onChange={handleSortChange}
              aria-label="Sort products"
              style={{
                width: 'auto',
                padding: '0.55rem 1rem',
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              <option value="featured">Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest Arrivals</option>
              <option value="rating">Highest Rated</option>
            </select>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="mobile-filter-btn"
              style={{
                display: 'none',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.55rem 0.85rem',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem'
              }}
            >
              <SlidersHorizontal size={15} />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Active filters:</span>
            {category !== 'All' && (
              <span className="badge badge-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                Category: {category}
                <button onClick={() => handleCategorySelect('All')} aria-label="Remove category filter"><X size={12} /></button>
              </span>
            )}
            {searchTerm && (
              <span className="badge badge-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                Query: "{searchTerm}"
                <button onClick={() => setSearchTerm('')} aria-label="Remove search query"><X size={12} /></button>
              </span>
            )}
            {maxPrice < 400 && (
              <span className="badge badge-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                Max ${maxPrice}
                <button onClick={() => setMaxPrice(400)} aria-label="Reset price filter"><X size={12} /></button>
              </span>
            )}
            {inStockOnly && (
              <span className="badge badge-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                In Stock Only
                <button onClick={() => setInStockOnly(false)} aria-label="Remove stock filter"><X size={12} /></button>
              </span>
            )}
            <button
              onClick={handleClearFilters}
              style={{ fontSize: '0.8rem', color: 'var(--accent-olive)', textDecoration: 'underline', display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '0.5rem' }}
            >
              <RotateCcw size={12} /> Clear all filters
            </button>
          </div>
        )}

        {/* Main Content Layout (Sidebar + Grid) */}
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '3rem', alignItems: 'start' }} className="shop-layout">
          {/* Left Desktop Filters Sidebar */}
          <aside
            className={`shop-sidebar ${mobileFilterOpen ? 'shop-sidebar-mobile-open' : ''}`}
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '1.5rem',
              position: 'sticky',
              top: '90px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
                <Filter size={16} />
                <span>Refine Selection</span>
              </div>
              {hasActiveFilters && (
                <button onClick={handleClearFilters} style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Reset
                </button>
              )}
            </div>

            {/* Price Slider */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label htmlFor="price-range" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Price Range</label>
                <span style={{ fontSize: '0.85rem', color: 'var(--accent-olive)', fontWeight: 600 }}>Up to ${maxPrice}</span>
              </div>
              <input
                id="price-range"
                type="range"
                min="40"
                max="400"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--accent-olive)', padding: 0 }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                <span>$40</span>
                <span>$400</span>
              </div>
            </div>

            {/* Availability Checkbox */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.75rem' }}>Availability</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--accent-olive)' }}
                />
                <span>In Stock Only ({products.filter(p => p.stock > 0).length})</span>
              </label>
            </div>

            {/* Sourcing guarantee */}
            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', fontSize: '0.785rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <strong style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Direct from Workshop</strong>
              All objects ship directly from our Copenhagen and Brooklyn partner mills.
            </div>
          </aside>

          {/* Product Grid Area */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <span>Showing <strong>{filteredProducts.length}</strong> objects</span>
              {loading && <span>Refreshing catalog...</span>}
            </div>

            {/* Error State */}
            {error && (
              <div
                style={{
                  padding: '2rem',
                  backgroundColor: 'var(--status-danger-bg)',
                  border: '1px solid var(--status-danger)',
                  borderRadius: 'var(--radius-sm)',
                  textAlign: 'center',
                  color: 'var(--status-danger)'
                }}
              >
                <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Failed to load objects</p>
                <p style={{ fontSize: '0.85rem' }}>{error}</p>
                <button
                  onClick={handleClearFilters}
                  className="btn btn-secondary btn-sm"
                  style={{ marginTop: '1rem' }}
                >
                  Reset & Try Again
                </button>
              </div>
            )}

            {/* Loading Skeletons */}
            {loading && !error && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: '1.75rem'
                }}
              >
                {Array(6).fill(0).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden'
                    }}
                  >
                    <div style={{ paddingTop: '115%', backgroundColor: '#EFECE5' }} />
                    <div style={{ padding: '1.25rem' }}>
                      <div style={{ height: '12px', width: '40%', backgroundColor: '#E5E1D7', marginBottom: '10px' }} />
                      <div style={{ height: '18px', width: '80%', backgroundColor: '#E5E1D7', marginBottom: '8px' }} />
                      <div style={{ height: '14px', width: '100%', backgroundColor: '#ECE9E0' }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredProducts.length === 0 && (
              <div
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '4rem 2rem',
                  textAlign: 'center'
                }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--bg-secondary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: 'var(--text-muted)' }}>
                  <Search size={22} />
                </div>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>No matching objects found</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
                  We could not find anything matching your current filters. Try expanding the price range or resetting query terms.
                </p>
                <button onClick={handleClearFilters} className="btn btn-primary">
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Populated Grid */}
            {!loading && !error && filteredProducts.length > 0 && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: '1.75rem'
                }}
              >
                {filteredProducts.map(product => (
                  <ProductCard key={product.id || product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .shop-layout {
            grid-template-columns: 1fr !important;
          }
          .mobile-filter-btn {
            display: inline-flex !important;
          }
          .shop-sidebar {
            display: none;
          }
          .shop-sidebar-mobile-open {
            display: block !important;
            margin-bottom: 2rem;
          }
        }
      `}</style>
    </div>
  );
}
