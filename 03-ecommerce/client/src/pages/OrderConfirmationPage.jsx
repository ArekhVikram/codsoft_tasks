import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Package, Printer, ArrowRight, ShieldCheck } from 'lucide-react';
import { api } from '../services/api.js';

export default function OrderConfirmationPage() {
  const { orderNumber } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!order && orderNumber) {
      async function fetchOrder() {
        try {
          const res = await api.getOrderById(orderNumber);
          if (res.success && res.order) {
            setOrder(res.order);
          } else {
            setError('Could not retrieve order details.');
          }
        } catch (err) {
          setError(err.message || 'Error locating order record.');
        } finally {
          setLoading(false);
        }
      }
      fetchOrder();
    }
  }, [order, orderNumber]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Retrieving confirmation record...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Order Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          {error || 'Unable to display this order reference.'}
        </p>
        <Link to="/shop" className="btn btn-primary">Return to Catalog</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '3.5rem 0 6rem' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        {/* Success Header Banner */}
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '3rem 2.5rem',
            textAlign: 'center',
            marginBottom: '2.5rem',
            boxShadow: 'var(--shadow-subtle)'
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-olive-light)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
              color: 'var(--accent-olive)'
            }}
          >
            <CheckCircle2 size={36} />
          </div>

          <div style={{ fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent-olive)', fontWeight: 600, marginBottom: '0.25rem' }}>
            Confirmation Dispatched
          </div>

          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
            Thank you for your order.
          </h1>

          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto 1.5rem' }}>
            We have registered your order reference <strong style={{ color: 'var(--text-primary)' }}>{order.orderNumber}</strong>. A dispatch notification has been scheduled.
          </p>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#FFF8E6', border: '1px solid #E6CA85', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: '#684500' }}>
            <ShieldCheck size={16} />
            <span>Simulated Demo Transaction: No real currency was charged.</span>
          </div>
        </div>

        {/* Order Tracking Timeline */}
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '2rem',
            marginBottom: '2.5rem'
          }}
        >
          <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.05rem', fontWeight: 600, marginBottom: '1.5rem' }}>
            Dispatch Status
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1rem',
              textAlign: 'center',
              position: 'relative'
            }}
            className="tracking-grid"
          >
            {[
              { step: '1', title: 'Confirmed', desc: 'Authoritative server verified', active: true },
              { step: '2', title: 'Processing', desc: 'Crafted & QA inspected', active: true },
              { step: '3', title: 'Dispatched', desc: 'Carbon neutral transit', active: false },
              { step: '4', title: 'Delivered', desc: 'Signed receipt', active: false }
            ].map((s, idx) => (
              <div key={idx} style={{ position: 'relative' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: s.active ? 'var(--accent-olive)' : 'var(--bg-secondary)',
                    color: s.active ? '#FAF8F5' : 'var(--text-muted)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    marginBottom: '0.5rem'
                  }}
                >
                  {s.step}
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: s.active ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  {s.title}
                </div>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  {s.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Details & Summary Card */}
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '2.25rem',
            marginBottom: '2.5rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Order Reference</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{order.orderNumber}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Date Placed</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
            {order.items?.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-secondary)' }}
                    />
                  )}
                  <div>
                    <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', fontWeight: 600 }}>
                      {item.name}
                    </h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Quantity: {item.quantity} · ${item.price} each
                    </span>
                  </div>
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 600 }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Breakdown & Totals */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Items Subtotal</span>
              <span>${Number(order.subtotal).toFixed(2)}</span>
            </div>

            {order.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-olive)' }}>
                <span>Discount ({order.promoCode || 'Promo applied'})</span>
                <span>-${Number(order.discount).toFixed(2)}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Shipping ({order.shippingMethod?.name || 'Standard'})</span>
              <span>{order.shippingCost === 0 ? 'Free' : `$${Number(order.shippingCost).toFixed(2)}`}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Sales Tax</span>
              <span>${Number(order.tax).toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem', fontSize: '1.25rem', fontWeight: 600 }}>
              <span>Total Paid</span>
              <span>${Number(order.total).toFixed(2)}</span>
            </div>
          </div>

          {/* Shipping Address Snapshot */}
          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Delivery Address
              </div>
              <div style={{ fontSize: '0.875rem', lineHeight: 1.5 }}>
                <div><strong>{order.shippingAddress.fullName}</strong></div>
                <div>{order.shippingAddress.street}</div>
                <div>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</div>
                <div>{order.shippingAddress.country}</div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Payment Method
              </div>
              <div style={{ fontSize: '0.875rem', lineHeight: 1.5 }}>
                <div>Simulated Card ending in <strong>{order.paymentDetails?.cardLast4 || '4242'}</strong></div>
                <div style={{ color: 'var(--accent-olive)', fontWeight: 500, fontSize: '0.8rem' }}>Demo Mode Approved</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={handlePrint} className="btn btn-secondary">
              <Printer size={16} /> Print Receipt
            </button>
            <Link to="/account" className="btn btn-secondary">
              View In Account
            </Link>
          </div>

          <Link to="/shop" className="btn btn-primary">
            Continue Browsing Objects <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .tracking-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
