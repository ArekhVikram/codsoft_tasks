import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, CheckCircle, CreditCard, Truck, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { api } from '../services/api.js';

export default function CheckoutPage() {
  const { cartItems, subtotal, discount, appliedPromo, clearCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  // Form State
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '+1 (555) 019-2834',
    street: user?.shippingAddress?.street || '724 Broadway, 5th Floor',
    city: user?.shippingAddress?.city || 'New York',
    state: user?.shippingAddress?.state || 'NY',
    zip: user?.shippingAddress?.zip || '10003',
    country: user?.shippingAddress?.country || 'United States'
  });

  const [shippingMethod, setShippingMethod] = useState('standard'); // 'standard' | 'express'
  const [paymentMethod, setPaymentMethod] = useState('test_card'); // 'test_card' | 'test_cod'
  const [testCardNumber, setTestCardNumber] = useState('4242 •••• •••• 4242');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Sync with user data if user logs in or updates
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        email: prev.email || user.email || '',
        street: prev.street || user.shippingAddress?.street || '',
        city: prev.city || user.shippingAddress?.city || '',
        state: prev.state || user.shippingAddress?.state || '',
        zip: prev.zip || user.shippingAddress?.zip || ''
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Calculations
  const shippingCost = shippingMethod === 'express' ? 15 : (subtotal >= 100 ? 0 : 10);
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = Number((taxableAmount * 0.08).toFixed(2));
  const finalTotal = Number((taxableAmount + tax + shippingCost).toFixed(2));

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.street.trim() || !formData.city.trim() || !formData.zip.trim()) {
      setErrorMsg('Please fill in all required shipping and contact fields.');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        items: cartItems.map(item => ({
          productId: item.productId || item.id,
          quantity: item.quantity
        })),
        shippingAddress: formData,
        shippingMethod: {
          id: shippingMethod,
          name: shippingMethod === 'express' ? 'Express Priority Courier' : 'Standard Carbon-Neutral Ground',
          price: shippingCost
        },
        promoCode: appliedPromo ? appliedPromo.code : null,
        paymentSimulation: {
          method: paymentMethod,
          cardLast4: '4242'
        }
      };

      const res = await api.createOrder(orderPayload);

      if (res.success && res.order) {
        clearCart();
        addToast('Demo order completed successfully!', 'success');
        navigate(`/order-confirmation/${res.order.orderNumber}`, { state: { order: res.order } });
      } else {
        throw new Error(res.message || 'Order processing failed.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error processing order. Please check item stock.');
      addToast(err.message || 'Failed to place order', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '3rem 0 6rem', minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '1080px' }}>
        {/* Prominent Demo Notice Banner */}
        <div
          role="alert"
          style={{
            backgroundColor: '#FFF8E6',
            border: '1px solid #E6CA85',
            borderRadius: 'var(--radius-sm)',
            padding: '1.25rem 1.5rem',
            marginBottom: '2.5rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem',
            boxShadow: 'var(--shadow-subtle)'
          }}
        >
          <ShieldAlert size={22} color="#9C6500" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '0.85rem', color: '#684500', lineHeight: 1.5 }}>
            <strong style={{ display: 'block', fontSize: '0.95rem', color: '#4D3300', marginBottom: '0.25rem' }}>
              DEMO SIMULATION CHECKOUT — CODSOFT Level 3, Task 1
            </strong>
            This is a mock transaction environment. <strong>No real financial charges will ever occur.</strong> Never enter actual credit card numbers. Order totals and stock inventory are validated and recalculated securely on the server.
          </div>
        </div>

        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.25rem' }}>Checkout & Dispatch</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Complete your shipping details below to generate an authoritative order dispatch.
          </p>
        </div>

        {/* 2-Column Checkout Form */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 380px',
            gap: '3rem',
            alignItems: 'start'
          }}
          className="checkout-grid"
        >
          {/* Left Form */}
          <form onSubmit={handlePlaceOrder}>
            {errorMsg && (
              <div
                style={{
                  backgroundColor: 'var(--status-danger-bg)',
                  border: '1px solid var(--status-danger)',
                  color: 'var(--status-danger)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  marginBottom: '1.5rem'
                }}
              >
                {errorMsg}
              </div>
            )}

            {/* Step 1: Customer Contact */}
            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '1.75rem',
                marginBottom: '1.5rem'
              }}
            >
              <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.25rem' }}>
                1. Customer Information
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-two-col">
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '0.825rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                    Email Address <span style={{ color: 'var(--accent-rust)' }}>*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="alex@novasupply.com"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.825rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                    Full Name <span style={{ color: 'var(--accent-rust)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder="Alex Vane"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.825rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Destination */}
            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '1.75rem',
                marginBottom: '1.5rem'
              }}
            >
              <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.25rem' }}>
                2. Shipping Address
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-two-col">
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '0.825rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                    Street Address <span style={{ color: 'var(--accent-rust)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    required
                    placeholder="724 Broadway, 5th Floor"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.825rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                    City <span style={{ color: 'var(--accent-rust)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    placeholder="New York"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div>
                    <label style={{ fontSize: '0.825rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                      State <span style={{ color: 'var(--accent-rust)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      placeholder="NY"
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.825rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                      ZIP Code <span style={{ color: 'var(--accent-rust)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="zip"
                      value={formData.zip}
                      onChange={handleChange}
                      required
                      placeholder="10003"
                    />
                  </div>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '0.825rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                    Country
                  </label>
                  <select name="country" value={formData.country} onChange={handleChange}>
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Germany">Germany</option>
                    <option value="Japan">Japan</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 3: Shipping Method */}
            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '1.75rem',
                marginBottom: '1.5rem'
              }}
            >
              <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.25rem' }}>
                3. Shipping Speed
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    border: `1px solid ${shippingMethod === 'standard' ? 'var(--accent-olive)' : 'var(--border-subtle)'}`,
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: shippingMethod === 'standard' ? 'var(--accent-olive-light)' : 'transparent',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <input
                      type="radio"
                      name="shippingSpeed"
                      checked={shippingMethod === 'standard'}
                      onChange={() => setShippingMethod('standard')}
                      style={{ width: '18px', height: '18px', accentColor: 'var(--accent-olive)' }}
                    />
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.9rem' }}>Standard Carbon-Neutral Ground</strong>
                      <span style={{ fontSize: '0.785rem', color: 'var(--text-secondary)' }}>Delivered in 3–5 business days</span>
                    </div>
                  </div>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                    {subtotal >= 100 ? 'Free' : '$10.00'}
                  </span>
                </label>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    border: `1px solid ${shippingMethod === 'express' ? 'var(--accent-olive)' : 'var(--border-subtle)'}`,
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: shippingMethod === 'express' ? 'var(--accent-olive-light)' : 'transparent',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <input
                      type="radio"
                      name="shippingSpeed"
                      checked={shippingMethod === 'express'}
                      onChange={() => setShippingMethod('express')}
                      style={{ width: '18px', height: '18px', accentColor: 'var(--accent-olive)' }}
                    />
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.9rem' }}>Express Priority Courier</strong>
                      <span style={{ fontSize: '0.785rem', color: 'var(--text-secondary)' }}>Dispatched in 24h · Air courier delivery</span>
                    </div>
                  </div>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>$15.00</span>
                </label>
              </div>
            </div>

            {/* Step 4: Simulated Payment Method */}
            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '1.75rem',
                marginBottom: '2rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.1rem', fontWeight: 600 }}>
                  4. Payment Simulation
                </h2>
                <span className="badge badge-olive">Test Mode</span>
              </div>

              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  <Lock size={14} /> Simulated Payment Gateway
                </div>
                Standard test card details have been pre-populated. Clicking "Place Test Order" will simulate a successful transaction without processing actual currency.
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-two-col">
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '0.825rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                    Simulated Card Number
                  </label>
                  <input
                    type="text"
                    disabled
                    value={testCardNumber}
                    style={{ backgroundColor: '#ECE9E1', cursor: 'not-allowed', color: '#555' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.825rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    disabled
                    value="12 / 28"
                    style={{ backgroundColor: '#ECE9E1', cursor: 'not-allowed', color: '#555' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.825rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                    CVC Code
                  </label>
                  <input
                    type="text"
                    disabled
                    value="•••"
                    style={{ backgroundColor: '#ECE9E1', cursor: 'not-allowed', color: '#555' }}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary btn-full"
              style={{ padding: '1.1rem', fontSize: '1rem' }}
            >
              {isSubmitting ? 'Validating Order on Server...' : `Authorize Demo Order · $${finalTotal.toFixed(2)}`}
            </button>
          </form>

          {/* Right Summary */}
          <aside
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '1.75rem',
              position: 'sticky',
              top: '90px'
            }}
          >
            <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.25rem' }}>
              Bag Summary ({cartItems.length} items)
            </h3>

            {/* Compact Item List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '300px', overflowY: 'auto', marginBottom: '1.5rem', paddingRight: '0.5rem' }}>
              {cartItems.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-secondary)', flexShrink: 0 }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Qty: {item.quantity} · ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-olive)' }}>
                  <span>Promo ({appliedPromo?.code})</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Shipping ({shippingMethod})</span>
                <span>{shippingCost === 0 ? <strong style={{ color: 'var(--accent-olive)' }}>Free</strong> : `$${shippingCost.toFixed(2)}`}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Estimated Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '1rem',
                  fontSize: '1.2rem',
                  fontWeight: 600
                }}
              >
                <span>Total Authorized</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              * Calculated securely on the server from authoritative product records.
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .checkout-grid {
            grid-template-columns: 1fr !important;
          }
          .form-two-col {
            grid-template-columns: 1fr !important;
          }
          .form-two-col > div {
            grid-column: span 1 !important;
          }
        }
      `}</style>
    </div>
  );
}
