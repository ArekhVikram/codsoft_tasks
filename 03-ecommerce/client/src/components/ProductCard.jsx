import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Check, Star } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';

// Fallback SVG data URI in case image fails to load
const FALLBACK_IMAGE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'><rect fill='%23EDEAE2' width='600' height='600'/><text fill='%238A857B' font-family='sans-serif' font-size='22' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle'>NOVA SUPPLY OBJECT</text></svg>";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const images = product.images && product.images.length > 0 ? product.images : [FALLBACK_IMAGE];
  const primaryImage = images[0];
  const secondaryImage = images.length > 1 ? images[1] : primaryImage;

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <div
      className="product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-sm)',
        overflow: 'hidden',
        position: 'relative',
        transition: 'transform var(--transition-normal), box-shadow var(--transition-normal)'
      }}
    >
      {/* Image Container */}
      <Link
        to={`/product/${product.slug || product.id}`}
        style={{
          display: 'block',
          position: 'relative',
          paddingTop: '115%', // 1:1.15 aspect ratio
          backgroundColor: '#F3F0EA',
          overflow: 'hidden'
        }}
      >
        <img
          src={isHovered ? secondaryImage : primaryImage}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease',
            transform: isHovered ? 'scale(1.04)' : 'scale(1.0)'
          }}
        />

        {/* Top Badges */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', flexDirection: 'column', gap: '6px', zIndex: 2 }}>
          {product.badge && (
            <span
              className={`badge ${
                product.badge.toLowerCase().includes('best')
                  ? 'badge-charcoal'
                  : product.badge.toLowerCase().includes('low') || isOutOfStock
                  ? 'badge-rust'
                  : 'badge-olive'
              }`}
            >
              {product.badge}
            </span>
          )}
          {isOutOfStock && !product.badge && (
            <span className="badge badge-rust">Out of Stock</span>
          )}
          {isLowStock && !product.badge && (
            <span className="badge badge-rust">Only {product.stock} Left</span>
          )}
        </div>

        {/* Quick Add Overlay on Hover */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            zIndex: 3
          }}
        >
          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            aria-label={`Add ${product.name} to cart`}
            style={{
              backgroundColor: isOutOfStock ? '#E5E2DA' : justAdded ? 'var(--accent-olive)' : 'var(--text-primary)',
              color: isOutOfStock ? 'var(--text-muted)' : '#FAF8F5',
              padding: '0.65rem',
              borderRadius: 'var(--radius-sm)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              cursor: isOutOfStock ? 'not-allowed' : 'pointer'
            }}
          >
            {justAdded ? <Check size={16} /> : <Plus size={16} />}
          </button>
        </div>
      </Link>

      {/* Information Container */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-olive)', fontWeight: 600 }}>
              {product.category}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              <Star size={12} fill="#C49B66" color="#C49B66" />
              <span>{product.rating}</span>
            </div>
          </div>

          <Link to={`/product/${product.slug || product.id}`}>
            <h3
              style={{
                fontSize: '1.15rem',
                color: 'var(--text-primary)',
                marginBottom: '0.35rem',
                fontWeight: 500,
                lineHeight: 1.3
              }}
            >
              {product.name}
            </h3>
          </Link>

          <p
            style={{
              fontSize: '0.825rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.4,
              marginBottom: '1rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {product.subtitle}
          </p>
        </div>

        {/* Price & Stock Indicator */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              ${product.price}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                ${product.originalPrice}
              </span>
            )}
          </div>

          <span
            style={{
              fontSize: '0.725rem',
              color: isOutOfStock ? 'var(--status-danger)' : isLowStock ? 'var(--status-warning)' : 'var(--accent-olive)',
              fontWeight: 500
            }}
          >
            {isOutOfStock ? 'Sold out' : isLowStock ? `${product.stock} left` : 'In stock'}
          </span>
        </div>
      </div>
    </div>
  );
}
