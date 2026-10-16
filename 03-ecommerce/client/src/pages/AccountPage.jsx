import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Package, User, LogOut, CheckCircle, Clock, ShieldCheck, MapPin, Database, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';

export default function AccountPage() {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'profile' | 'system'
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [healthInfo, setHealthInfo] = useState(null);

  // Profile form
  const [name, setName] = useState(user?.name || '');
  const [street, setStreet] = useState(user?.shippingAddress?.street || '');
  const [city, setCity] = useState(user?.shippingAddress?.city || '');
  const [state, setState] = useState(user?.shippingAddress?.state || '');
  const [zip, setZip] = useState(user?.shippingAddress?.zip || '');
  const [country, setCountry] = useState(user?.shippingAddress?.country || 'United States');
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const orderRes = await api.getMyOrders();
        if (orderRes.success) {
          setOrders(orderRes.orders || []);
        }

        const healthRes = await api.getHealth();
        setHealthInfo(healthRes);
      } catch (err) {
        console.warn('Could not load account data', err);
      } finally {
        setLoadingOrders(false);
      }
    }

    loadData();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    await updateProfile({
      name,
      shippingAddress: { street, city, state, zip, country }
    });
    setSavingProfile(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div style={{ padding: '3.5rem 0 6rem', minHeight: '80vh' }}>
      <div className="container">
        {/* Account Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem',
            marginBottom: '3rem',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '1.5rem'
          }}
        >
          <div>
            <div style={{ fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent-olive)', fontWeight: 600, marginBottom: '0.35rem' }}>
              Client Dashboard
            </div>
            <h1 style={{ fontSize: '2.5rem' }}>{user?.name || 'My Account'}</h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '2026'} · {user?.email}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '2.5rem' }}>
          <button
            onClick={() => setActiveTab('orders')}
            style={{
              padding: '0.85rem 1.5rem',
              fontSize: '0.95rem',
              fontWeight: 600,
              color: activeTab === 'orders' ? 'var(--text-primary)' : 'var(--text-muted)',
              borderBottom: `2px solid ${activeTab === 'orders' ? 'var(--accent-olive)' : 'transparent'}`,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Package size={17} /> Order History ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            style={{
              padding: '0.85rem 1.5rem',
              fontSize: '0.95rem',
              fontWeight: 600,
              color: activeTab === 'profile' ? 'var(--text-primary)' : 'var(--text-muted)',
              borderBottom: `2px solid ${activeTab === 'profile' ? 'var(--accent-olive)' : 'transparent'}`,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <User size={17} /> Shipping & Preferences
          </button>

          <button
            onClick={() => setActiveTab('system')}
            style={{
              padding: '0.85rem 1.5rem',
              fontSize: '0.95rem',
              fontWeight: 600,
              color: activeTab === 'system' ? 'var(--text-primary)' : 'var(--text-muted)',
              borderBottom: `2px solid ${activeTab === 'system' ? 'var(--accent-olive)' : 'transparent'}`,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Database size={17} /> Demo Architecture
          </button>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div>
            {loadingOrders ? (
              <p style={{ color: 'var(--text-muted)' }}>Retrieving your order dispatches...</p>
            ) : orders.length === 0 ? (
              <div
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '4rem 2rem',
                  textAlign: 'center'
                }}
              >
                <Package size={36} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No orders yet</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  When you order living objects, their dispatch tracking will appear here.
                </p>
                <Link to="/shop" className="btn btn-primary">Browse Objects</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                {orders.map(order => (
                  <div
                    key={order._id || order.id || order.orderNumber}
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '2rem',
                      boxShadow: 'var(--shadow-subtle)'
                    }}
                  >
                    {/* Header */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '1rem',
                        borderBottom: '1px solid var(--border-subtle)',
                        paddingBottom: '1.25rem',
                        marginBottom: '1.25rem'
                      }}
                    >
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                          Order Reference
                        </span>
                        <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>{order.orderNumber}</div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Placed On</span>
                          <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                            {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                        </div>

                        <div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total</span>
                          <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>${Number(order.total).toFixed(2)}</div>
                        </div>

                        <span
                          className={`badge ${
                            order.orderStatus === 'Delivered'
                              ? 'badge-olive'
                              : 'badge-charcoal'
                          }`}
                        >
                          {order.orderStatus || 'Confirmed'}
                        </span>
                      </div>
                    </div>

                    {/* Items */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                      {order.items?.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-secondary)' }}
                              />
                            )}
                            <div>
                              <strong style={{ fontSize: '0.95rem' }}>{item.name}</strong>
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                Qty: {item.quantity} · ${item.price} each
                              </div>
                            </div>
                          </div>
                          <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Footer link */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>
                        Shipped to: {order.shippingAddress?.fullName}, {order.shippingAddress?.city}
                      </span>
                      <Link
                        to={`/order-confirmation/${order.orderNumber}`}
                        state={{ order }}
                        style={{ color: 'var(--accent-olive)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                      >
                        View Full Receipt <ChevronRight size={15} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Profile & Shipping Address */}
        {activeTab === 'profile' && (
          <div style={{ maxWidth: '640px' }}>
            <form
              onSubmit={handleSaveProfile}
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '2.5rem',
                boxShadow: 'var(--shadow-subtle)'
              }}
            >
              <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                Default Contact & Delivery Address
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ fontSize: '0.825rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                    Full Name
                  </label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>

                <div>
                  <label style={{ fontSize: '0.825rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                    Email Address (Account Identifier)
                  </label>
                  <input type="email" value={user?.email || ''} disabled style={{ backgroundColor: '#ECE9E1', cursor: 'not-allowed' }} />
                </div>

                <div>
                  <label style={{ fontSize: '0.825rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                    Street Address
                  </label>
                  <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} placeholder="420 Greenpoint Ave, Loft 3B" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.825rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                      City
                    </label>
                    <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Brooklyn" />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.825rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                      State / Province
                    </label>
                    <input type="text" value={state} onChange={(e) => setState(e.target.value)} placeholder="NY" />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.825rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                      ZIP / Postal Code
                    </label>
                    <input type="text" value={zip} onChange={(e) => setZip(e.target.value)} placeholder="11222" />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.825rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                      Country
                    </label>
                    <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="United States" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="btn btn-primary"
                  style={{ alignSelf: 'flex-start', marginTop: '1rem' }}
                >
                  {savingProfile ? 'Saving Changes...' : 'Save Preferences'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 3: System & Demo Architecture */}
        {activeTab === 'system' && (
          <div style={{ maxWidth: '720px' }}>
            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '2.5rem',
                boxShadow: 'var(--shadow-subtle)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
                <ShieldCheck size={22} color="var(--accent-olive)" />
                <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.25rem', fontWeight: 600 }}>
                  System Architecture & Demo Mode
                </h2>
              </div>

              <p style={{ fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                This production-style e-commerce application was built for <strong>CODSOFT Web Development Internship Level 3, Task 1</strong>. It features dual database capability:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--accent-olive)', marginBottom: '0.25rem' }}>
                    Active Database Provider
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 600 }}>
                    {healthInfo?.database || 'Demo Mode (Local In-Memory / File Storage)'}
                  </div>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                    Authoritative server-side price recalculation, inventory management, password hashing with bcrypt, and JWT auth tokens are active regardless of database backend.
                  </p>
                </div>

                <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--accent-olive)', marginBottom: '0.25rem' }}>
                    Authoritative Inventory Status
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 600 }}>
                    {healthInfo?.productsCount || 14} Curated Products Available
                  </div>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                    Each product item has true stock limits. Orders with quantities exceeding stock are rejected on the server.
                  </p>
                </div>
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Server timestamp: {healthInfo?.timestamp ? new Date(healthInfo.timestamp).toLocaleString() : 'Live'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
