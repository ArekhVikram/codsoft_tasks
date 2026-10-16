import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';

export default function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    subtotal,
    freeShippingThreshold,
    isFreeShipping,
    itemsCount
  } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const progressToFreeShipping = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountRemainingForFreeShipping = Math.max(0, (freeShippingThreshold - subtotal).toFixed(2));

  const handleCheckoutClick = () => {
    closeCart();
    navigate('/checkout');
  };

  const handleViewCart = () => {
    closeCart();
    navigate('/cart');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        backgroundColor: 'rgba(26, 25, 24, 0.45)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        justifyContent: 'flex-end',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={closeCart}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          backgroundColor: 'var(--bg-primary)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-drawer)',
          animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-card)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <ShoppingBag size={20} color="var(--accent-olive)" />
            <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.05rem', fontWeight: 600 }}>
              Shopping Bag ({itemsCount})
            </h2>
          </div>
          <button
            onClick={closeCart}
            aria-label="Close cart drawer"
            style={{
              padding: '0.4rem',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div
          style={{
            padding: '0.85rem 1.5rem',
            backgroundColor: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-subtle)',
            fontSize: '0.8rem'
          }}
        >
          {isFreeShipping ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-olive)', fontWeight: 500 }}>
              <ShieldCheck size={16} />
              <span>You have unlocked complimentary carbon-neutral shipping!</span>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                <span>Free shipping progress</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>${amountRemainingForFreeShipping} away</span>
              </div>
              <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--border-subtle)', borderRadius: '2px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${progressToFreeShipping}%`,
                    height: '100%',
                    backgroundColor: 'var(--accent-olive)',
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Drawer Body: Item List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem' }}>
          {cartItems.length === 0 ? (
            <div
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '2rem 1rem'
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                  color: 'var(--text-muted)'
                }}
              >
                <ShoppingBag size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Your bag is empty</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '240px' }}>
                Explore our collection of understated objects engineered for daily use.
              </p>
              <button
                onClick={() => {
                  closeCart();
                  navigate('/shop');
                }}
                className="btn btn-primary"
              >
                Explore Collection
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {cartItems.map(item => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    paddingBottom: '1.25rem',
                    borderBottom: '1px solid var(--border-subtle)'
                  }}
                >
                  {/* Thumbnail */}
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: '80px',
                      height: '80px',
                      objectFit: 'cover',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-secondary)',
                      flexShrink: 0
                    }}
                  />

                  {/* Info */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          aria-label={`Remove ${item.name}`}
                          style={{ color: 'var(--text-muted)', padding: '2px' }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.category}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                      {/* Quantity Stepper */}
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          border: '1px solid var(--border-medium)',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'var(--bg-card)'
                        }}
                      >
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                          style={{ padding: '0.25rem 0.5rem', color: 'var(--text-secondary)' }}
                        >
                          <Minus size={13} />
                        </button>
                        <span style={{ padding: '0 0.5rem', fontSize: '0.85rem', fontWeight: 600, minWidth: '24px', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          aria-label="Increase quantity"
                          style={{
                            padding: '0.25rem 0.5rem',
                            color: item.quantity >= item.stock ? 'var(--text-muted)' : 'var(--text-secondary)',
                            cursor: item.quantity >= item.stock ? 'not-allowed' : 'pointer'
                          }}
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.925rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        {item.quantity > 1 && (
                          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                            ${item.price} each
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {cartItems.length > 0 && (
          <div
            style={{
              padding: '1.5rem',
              borderTop: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-card)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Estimated Subtotal</span>
              <span style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                ${subtotal.toFixed(2)}
              </span>
            </div>

            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              Taxes, promo discounts, and delivery speeds calculated securely at checkout.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button
                onClick={handleCheckoutClick}
                className="btn btn-primary btn-full"
                style={{ padding: '0.95rem' }}
              >
                Proceed to Checkout <ArrowRight size={16} />
              </button>
              <button
                onClick={handleViewCart}
                className="btn btn-secondary btn-full"
                style={{ padding: '0.75rem', fontSize: '0.85rem' }}
              >
                View Full Bag & Promo Codes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
