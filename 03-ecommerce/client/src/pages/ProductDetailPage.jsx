import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Plus, Minus, Check, ShieldCheck, Truck, RotateCcw, Star, ArrowLeft } from 'lucide-react';
import { api } from '../services/api.js';
import { useCart } from '../context/CartContext.jsx';
import ProductCard from '../components/ProductCard.jsx';

const FALLBACK_IMAGE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='800' viewBox='0 0 800 800'><rect fill='%23EDEAE2' width='800' height='800'/><text fill='%238A857B' font-family='sans-serif' font-size='26' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle'>NOVA SUPPLY</text></svg>";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' | 'materials' | 'shipping'
  const [addedSuccess, setAddedSuccess] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      setError(null);
      setSelectedImageIndex(0);
      setQuantity(1);

      try {
        const res = await api.getProductById(id);
        if (res.success && res.product) {
          setProduct(res.product);

          // Fetch related products in same category
          const catRes = await api.getProducts({ category: res.product.category, limit: 4 });
          if (catRes.success) {
            setRelatedProducts(catRes.products.filter(p => (p.id !== res.product.id && p.slug !== res.product.slug)));
          }
        } else {
          setError('Product not found.');
        }
      } catch (err) {
        setError(err.message || 'Error loading product details.');
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading object specifications...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Object Not Located</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          {error || 'This object might have been archived or does not exist.'}
        </p>
        <Link to="/shop" className="btn btn-primary">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [FALLBACK_IMAGE];
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const success = addToCart(product, quantity);
    if (success) {
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2000);
    }
  };

  return (
    <div style={{ padding: '2.5rem 0 6rem' }}>
      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
          <Link to="/" style={{ color: 'var(--text-secondary)' }}>Home</Link>
          <span>/</span>
          <Link to="/shop" style={{ color: 'var(--text-secondary)' }}>Shop</Link>
          <span>/</span>
          <Link to={`/shop?category=${product.category}`} style={{ color: 'var(--text-secondary)' }}>{product.category}</Link>
          <span>/</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{product.name}</span>
        </nav>

        {/* Product Details Hero Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '4rem',
            alignItems: 'start',
            marginBottom: '6rem'
          }}
        >
          {/* Gallery Left */}
          <div>
            {/* Main Stage Image */}
            <div
              style={{
                backgroundColor: '#F3F0EA',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                position: 'relative',
                paddingTop: '100%',
                marginBottom: '1rem',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <img
                src={images[selectedImageIndex]}
                alt={`${product.name} view ${selectedImageIndex + 1}`}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = FALLBACK_IMAGE;
                }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'opacity 0.25s ease'
                }}
              />
              {product.badge && (
                <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
                  <span className="badge badge-charcoal">{product.badge}</span>
                </div>
              )}
            </div>

            {/* Thumbnail Row */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    style={{
                      width: '74px',
                      height: '74px',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      border: `2px solid ${selectedImageIndex === idx ? 'var(--accent-olive)' : 'var(--border-medium)'}`,
                      opacity: selectedImageIndex === idx ? 1 : 0.7,
                      flexShrink: 0,
                      backgroundColor: 'var(--bg-secondary)',
                      padding: 0
                    }}
                    aria-label={`View photo ${idx + 1}`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = FALLBACK_IMAGE;
                      }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Purchasing Right */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent-olive)', fontWeight: 600 }}>
                {product.category}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}>
                <Star size={14} fill="#C49B66" color="#C49B66" />
                <span style={{ fontWeight: 600 }}>{product.rating}</span>
                <span style={{ color: 'var(--text-muted)' }}>({product.reviewsCount} reviews)</span>
              </div>
            </div>

            <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', lineHeight: 1.15, marginBottom: '0.75rem' }}>
              {product.name}
            </h1>

            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginBottom: '1.75rem' }}>
              {product.subtitle}
            </p>

            {/* Price & Inventory row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '1rem',
                padding: '1.25rem 0',
                borderTop: '1px solid var(--border-subtle)',
                borderBottom: '1px solid var(--border-subtle)',
                marginBottom: '2rem'
              }}
            >
              <span style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                ${product.price}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span style={{ fontSize: '1.15rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                  ${product.originalPrice}
                </span>
              )}
              <span
                style={{
                  marginLeft: 'auto',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  color: isOutOfStock ? 'var(--status-danger)' : isLowStock ? 'var(--status-warning)' : 'var(--accent-olive)'
                }}
              >
                {isOutOfStock ? 'Currently Out of Stock' : isLowStock ? `Low Inventory (${product.stock} remaining)` : `In Stock (${product.stock} units)`}
              </span>
            </div>

            {/* Editorial Description */}
            <p style={{ fontSize: '0.975rem', lineHeight: 1.7, marginBottom: '2rem' }}>
              {product.description}
            </p>

            {/* Purchasing Action Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {/* Quantity Stepper */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-card)',
                    height: '52px'
                  }}
                >
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    aria-label="Decrease quantity"
                    style={{ padding: '0 1rem', height: '100%', color: 'var(--text-secondary)' }}
                  >
                    <Minus size={15} />
                  </button>
                  <span style={{ padding: '0 0.75rem', fontSize: '1rem', fontWeight: 600, minWidth: '32px', textAlign: 'center' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock || isOutOfStock}
                    aria-label="Increase quantity"
                    style={{ padding: '0 1rem', height: '100%', color: 'var(--text-secondary)' }}
                  >
                    <Plus size={15} />
                  </button>
                </div>

                {/* Main Add Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="btn btn-primary"
                  style={{
                    flex: 1,
                    height: '52px',
                    backgroundColor: addedSuccess ? 'var(--accent-olive)' : isOutOfStock ? '#E2DFD7' : 'var(--text-primary)',
                    color: isOutOfStock ? 'var(--text-muted)' : '#FAF8F5',
                    cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                    fontSize: '0.95rem'
                  }}
                >
                  {addedSuccess ? (
                    <>
                      <Check size={18} /> Added to Shopping Bag
                    </>
                  ) : isOutOfStock ? (
                    'Sold Out'
                  ) : (
                    `Add to Bag · $${(product.price * quantity).toFixed(2)}`
                  )}
                </button>
              </div>

              {isLowStock && (
                <div style={{ fontSize: '0.8rem', color: 'var(--accent-rust)', fontWeight: 500 }}>
                  Order soon: only {product.stock} items remaining in this studio run.
                </div>
              )}
            </div>

            {/* Value Guarantees list */}
            <div
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-sm)',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
                fontSize: '0.825rem',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Truck size={17} color="var(--accent-olive)" />
                <span>Complimentary carbon-neutral dispatch over $100</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <ShieldCheck size={17} color="var(--accent-olive)" />
                <span>2-Year Comprehensive Studio Warranty & Free Repairs</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <RotateCcw size={17} color="var(--accent-olive)" />
                <span>30-Day In-Home Evaluation Period</span>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specifications Accordion / Tabs */}
        <div style={{ marginBottom: '6rem', maxWidth: '840px' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', marginBottom: '2rem' }}>
            <button
              onClick={() => setActiveTab('specs')}
              style={{
                padding: '0.85rem 1.5rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: activeTab === 'specs' ? 'var(--text-primary)' : 'var(--text-muted)',
                borderBottom: `2px solid ${activeTab === 'specs' ? 'var(--text-primary)' : 'transparent'}`
              }}
            >
              Technical Features
            </button>
            <button
              onClick={() => setActiveTab('materials')}
              style={{
                padding: '0.85rem 1.5rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: activeTab === 'materials' ? 'var(--text-primary)' : 'var(--text-muted)',
                borderBottom: `2px solid ${activeTab === 'materials' ? 'var(--text-primary)' : 'transparent'}`
              }}
            >
              Materials & Dimensions
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              style={{
                padding: '0.85rem 1.5rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: activeTab === 'shipping' ? 'var(--text-primary)' : 'var(--text-muted)',
                borderBottom: `2px solid ${activeTab === 'shipping' ? 'var(--text-primary)' : 'transparent'}`
              }}
            >
              Shipping & Packaging
            </button>
          </div>

          <div style={{ minHeight: '140px', lineHeight: 1.7, fontSize: '0.925rem' }}>
            {activeTab === 'specs' && (
              <ul style={{ listStyle: 'disc', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {product.features && product.features.map((feat, i) => (
                  <li key={i}>{feat}</li>
                ))}
              </ul>
            )}

            {activeTab === 'materials' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <strong style={{ display: 'block', color: 'var(--text-primary)' }}>Authentic Materials</strong>
                  <p>{product.materials || 'Solid machined aluminium, organic vegetable-tanned leather, natural wool felt.'}</p>
                </div>
                <div>
                  <strong style={{ display: 'block', color: 'var(--text-primary)' }}>Physical Dimensions & Weight</strong>
                  <p>{product.dimensions || 'Precision engineered dimensions for daily ergonomic utility.'}</p>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div>
                <p style={{ marginBottom: '0.75rem' }}>
                  {product.shippingInfo || 'Dispatched in 100% plastic-free recycled paper pulp unboxing packaging.'}
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  All shipments are tracked via DHL Express or UPS Carbon Neutral Ground. Signature required upon arrival for high-value acoustic hardware.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="section-header">
              <span className="section-eyebrow">Complementary Objects</span>
              <h2 className="section-title" style={{ fontSize: '2rem' }}>You may also appreciate</h2>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '1.75rem'
              }}
            >
              {relatedProducts.map(rel => (
                <ProductCard key={rel.id || rel._id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
