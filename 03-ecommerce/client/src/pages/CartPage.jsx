import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';

export default function CartPage() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    discount,
    appliedPromo,
    applyPromo,
    removePromo,
    tax,
    standardShippingCost,
    isFreeShipping,
    freeShippingThreshold,
    estimatedTotal
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const navigate = useNavigate();

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoInput.trim()) {
      applyPromo(promoInput.trim());
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center', minHeight: '60vh' }}>
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-secondary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem',
            color: 'var(--text-muted)'
          }}
        >
          <ShoppingBag size={32} />
        </div>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>Your shopping bag is empty</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto 2rem', fontSize: '0.95rem' }}>
          Explore our collection of understated lifestyle and workspace objects engineered for daily utility.
        </p>
        <Link to="/shop" className="btn btn-primary">
          Explore Catalog <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '3rem 0 6rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.25rem' }}>
          <div>
            <div style={{ fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-olive)', fontWeight: 600, marginBottom: '0.25rem' }}>
              Review Selection
            </div>
            <h1 style={{ fontSize: '2.5rem' }}>Shopping Bag</h1>
          </div>
          <button
            onClick={clearCart}
            style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'underline' }}
          >
            Clear entire bag
          </button>
        </div>

        {/* 2-Column Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 380px',
            gap: '3.5rem',
            alignItems: 'start'
          }}
          className="cart-grid"
        >
          {/* Items List */}
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {cartItems.map(item => (
                <div
                  key={item.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '100px 1fr auto',
                    gap: '1.5rem',
                    padding: '1.5rem',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    alignItems: 'center'
                  }}
                  className="cart-item-row"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: '100px',
                      height: '100px',
                      objectFit: 'cover',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-secondary)'
                    }}
                  />

                  {/* Info */}
                  <div>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent-olive)', fontWeight: 600 }}>
                      {item.category}
                    </span>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0.2rem 0 0.4rem' }}>
                      <Link to={`/product/${item.id}`} style={{ color: 'var(--text-primary)' }}>
                        {item.name}
                      </Link>
                    </h3>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      ${item.price} each
                    </div>
                  </div>

                  {/* Controls & Subtotal */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.85rem' }}>
                    <span style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {/* Quantity Stepper */}
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          border: '1px solid var(--border-medium)',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'var(--bg-primary)'
                        }}
                      >
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                          style={{ padding: '0.35rem 0.65rem' }}
                        >
                          <Minus size={13} />
                        </button>
                        <span style={{ padding: '0 0.65rem', fontSize: '0.9rem', fontWeight: 600, minWidth: '24px', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          aria-label="Increase quantity"
                          style={{
                            padding: '0.35rem 0.65rem',
                            color: item.quantity >= item.stock ? 'var(--text-muted)' : 'inherit',
                            cursor: item.quantity >= item.stock ? 'not-allowed' : 'pointer'
                          }}
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        aria-label="Remove item"
                        style={{ color: 'var(--text-muted)', padding: '0.35rem' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {item.quantity >= item.stock && (
                      <span style={{ fontSize: '0.7rem', color: 'var(--status-warning)' }}>
                        Max stock reached ({item.stock})
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '2rem' }}>
              <Link to="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-olive)', fontWeight: 500, fontSize: '0.9rem' }}>
                <ArrowLeft size={16} /> Continue Browsing Catalog
              </Link>
            </div>
          </div>

          {/* Order Summary Card Right */}
          <aside
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '2rem',
              position: 'sticky',
              top: '90px'
            }}
          >
            <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.2rem', fontWeight: 600, marginBottom: '1.5rem' }}>
              Order Summary
            </h2>

            {/* Promo Code Input */}
            <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
              {appliedPromo ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--accent-olive-light)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--accent-olive)', fontWeight: 600 }}>
                    <Tag size={15} />
                    <span>{appliedPromo.code} ({appliedPromo.label})</span>
                  </div>
                  <button
                    onClick={removePromo}
                    style={{ fontSize: '0.75rem', color: 'var(--accent-rust)', fontWeight: 600 }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Promo code (e.g. NOVA10)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    style={{ fontSize: '0.85rem', padding: '0.55rem 0.75rem' }}
                  />
                  <button type="submit" className="btn btn-secondary btn-sm" style={{ padding: '0 1rem' }}>
                    Apply
                  </button>
                </form>
              )}
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                Tip: Enter <strong>NOVA10</strong> for 10% off or <strong>WELCOME15</strong> for 15% off.
              </div>
            </div>

            {/* Price Calculations breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                <span style={{ fontWeight: 500 }}>${subtotal.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-olive)' }}>
                  <span>Promo Discount ({appliedPromo?.code})</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Estimated Shipping</span>
                <span>{isFreeShipping ? <span style={{ color: 'var(--accent-olive)', fontWeight: 600 }}>Free</span> : `$${standardShippingCost.toFixed(2)}`}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Sales Tax (Est. 8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--border-subtle)',
                  fontSize: '1.25rem',
                  fontWeight: 600
                }}
              >
                <span>Estimated Total</span>
                <span style={{ color: 'var(--text-primary)' }}>${estimatedTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => navigate('/checkout')}
              className="btn btn-primary btn-full"
              style={{ padding: '1rem', fontSize: '0.95rem', marginBottom: '1rem' }}
            >
              Proceed to Demo Checkout <ArrowRight size={17} />
            </button>

            {/* Demo safe harbor reminder */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              <ShieldCheck size={16} color="var(--accent-olive)" style={{ flexShrink: 0 }} />
              <span>Simulated demo checkout. No financial charges will be processed.</span>
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .cart-grid {
            grid-template-columns: 1fr !important;
          }
          .cart-item-row {
            grid-template-columns: 80px 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
