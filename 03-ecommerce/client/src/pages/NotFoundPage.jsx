import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Search, Compass } from 'lucide-react';

export default function NotFoundPage() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div style={{ padding: '6rem 0', minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '600px', textAlign: 'center' }}>
        <div
          style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-secondary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem',
            color: 'var(--accent-olive)'
          }}
        >
          <Compass size={32} />
        </div>

        <div style={{ fontSize: '0.85rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent-olive)', fontWeight: 600, marginBottom: '0.5rem' }}>
          Error 404
        </div>

        <h1 style={{ fontSize: '2.75rem', marginBottom: '1rem' }}>Page Not Located</h1>

        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
          The object or journal page you requested may have been archived, relocated, or does not exist in the NOVA SUPPLY collection.
        </p>

        {/* Search bar fallback */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', maxWidth: '420px', margin: '0 auto 2.5rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search all objects..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ paddingLeft: '2.5rem', fontSize: '0.85rem' }}
            />
          </div>
          <button type="submit" className="btn btn-secondary btn-sm" style={{ padding: '0 1rem' }}>
            Find
          </button>
        </form>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <Link to="/" className="btn btn-secondary">
            Return to Homepage
          </Link>
          <Link to="/shop" className="btn btn-primary">
            Browse Catalog <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
