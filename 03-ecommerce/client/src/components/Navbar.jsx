import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Search, Menu, X, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { itemsCount, openCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'All Objects', to: '/shop' },
    { label: 'Audio', to: '/shop?category=Audio' },
    { label: 'Workspace', to: '/shop?category=Workspace' },
    { label: 'Living', to: '/shop?category=Living' },
    { label: 'Carry', to: '/shop?category=Carry' },
    { label: 'Our Story', to: '/about' },
    { label: 'Contact', to: '/contact' }
  ];

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: 'rgba(250, 248, 245, 0.95)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid var(--border-subtle)',
          transition: 'all 0.2s ease'
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '74px'
          }}
        >
          {/* Left: Mobile hamburger & Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="mobile-nav-toggle"
              style={{
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.4rem',
                color: 'var(--text-primary)'
              }}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '1.4rem' }}>
              {navLinks.slice(0, 5).map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  style={({ isActive }) => ({
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    letterSpacing: '0.02em',
                    textTransform: 'uppercase',
                    color: isActive ? 'var(--accent-olive)' : 'var(--text-secondary)',
                    borderBottom: isActive ? '2px solid var(--accent-olive)' : '2px solid transparent',
                    paddingBottom: '4px'
                  })}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Center: Brand Logo */}
          <div style={{ textAlign: 'center' }}>
            <Link
              to="/"
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.65rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                color: 'var(--text-primary)',
                display: 'inline-block',
                textTransform: 'uppercase'
              }}
            >
              NOVA SUPPLY
            </Link>
            <div
              style={{
                fontSize: '0.65rem',
                letterSpacing: '0.15em',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                marginTop: '-4px'
              }}
            >
              Objects for Living
            </div>
          </div>

          {/* Right: Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search catalog"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                color: 'var(--text-primary)',
                padding: '0.4rem'
              }}
            >
              <Search size={19} />
              <span className="search-text-label" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Search
              </span>
            </button>

            <Link
              to={isAuthenticated ? '/account' : '/login'}
              aria-label="User Account"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: 'var(--text-primary)',
                padding: '0.4rem'
              }}
            >
              <User size={19} />
              {isAuthenticated && (
                <span className="nav-user-label" style={{ fontSize: '0.825rem', fontWeight: 500, color: 'var(--accent-olive)' }}>
                  {user?.name?.split(' ')[0]}
                </span>
              )}
            </Link>

            <button
              onClick={openCart}
              aria-label={`Shopping cart with ${itemsCount} items`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'var(--text-primary)',
                color: '#FAF8F5',
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                transition: 'background-color 0.2s'
              }}
            >
              <ShoppingBag size={17} />
              <span style={{ fontSize: '0.825rem', fontWeight: 600 }}>{itemsCount}</span>
            </button>
          </div>
        </div>

        {/* Search Modal Overlay */}
        {searchOpen && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              width: '100%',
              backgroundColor: 'var(--bg-card)',
              borderBottom: '1px solid var(--border-medium)',
              boxShadow: 'var(--shadow-card)',
              padding: '1.5rem 0',
              animation: 'fadeIn 0.2s ease-out'
            }}
          >
            <div className="container">
              <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Search
                    size={20}
                    style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                  />
                  <input
                    type="search"
                    placeholder="Search objects, acoustic headphones, desk mats, kettles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    style={{
                      paddingLeft: '3rem',
                      height: '52px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ height: '52px' }}>
                  Search Catalog <ArrowRight size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  aria-label="Close search"
                  style={{ padding: '0.5rem', color: 'var(--text-muted)' }}
                >
                  <X size={24} />
                </button>
              </form>
              <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>Popular:</span>
                <button
                  type="button"
                  onClick={() => { setSearchQuery('Headphones'); navigate('/shop?search=Headphones'); setSearchOpen(false); }}
                  style={{ color: 'var(--accent-olive)', textDecoration: 'underline' }}
                >
                  Headphones
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => { setSearchQuery('Desk'); navigate('/shop?search=Desk'); setSearchOpen(false); }}
                  style={{ color: 'var(--accent-olive)', textDecoration: 'underline' }}
                >
                  Desk Shelf
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => { setSearchQuery('Cast Iron'); navigate('/shop?search=Cast Iron'); setSearchOpen(false); }}
                  style={{ color: 'var(--accent-olive)', textDecoration: 'underline' }}
                >
                  Kettle
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99,
            backgroundColor: 'rgba(26, 25, 24, 0.4)',
            backdropFilter: 'blur(4px)'
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '80%',
              maxWidth: '320px',
              height: '100%',
              backgroundColor: 'var(--bg-primary)',
              padding: '2rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 'var(--shadow-drawer)'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 600 }}>NOVA SUPPLY</span>
                <button onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {navLinks.map(link => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    style={({ isActive }) => ({
                      fontSize: '1.1rem',
                      fontFamily: 'var(--font-serif)',
                      color: isActive ? 'var(--accent-olive)' : 'var(--text-primary)',
                      padding: '0.4rem 0'
                    })}
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
              <Link
                to={isAuthenticated ? '/account' : '/login'}
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-secondary btn-full"
                style={{ marginBottom: '0.75rem' }}
              >
                <User size={16} />
                {isAuthenticated ? 'My Account' : 'Sign In'}
              </Link>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                Objects for everyday living.
              </p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-nav-toggle {
            display: flex !important;
          }
          .search-text-label {
            display: none;
          }
        }
        @media (max-width: 600px) {
          .nav-user-label {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
