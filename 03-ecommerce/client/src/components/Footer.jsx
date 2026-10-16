import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');
  const { addToast } = useToast();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    try {
      const res = await api.subscribeNewsletter(email);
      setStatus('success');
      setMessage(res.message || 'Subscribed successfully. Welcome to the journal.');
      setEmail('');
      addToast('Thank you for subscribing.', 'success');
    } catch (err) {
      setStatus('error');
      setMessage(err.message || 'Subscription failed. Please try again.');
    }
  };

  return (
    <footer
      style={{
        backgroundColor: '#191817',
        color: '#FAF8F5',
        padding: '5rem 0 2.5rem',
        marginTop: '6rem',
        borderTop: '1px solid #282624'
      }}
    >
      <div className="container">
        {/* Top Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '3rem',
            marginBottom: '4.5rem'
          }}
        >
          {/* Brand Column */}
          <div style={{ gridColumn: 'span 1' }}>
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.5rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                display: 'block',
                marginBottom: '0.75rem',
                color: '#FAF8F5'
              }}
            >
              NOVA SUPPLY
            </span>
            <p style={{ color: '#A8A49C', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              Objects for everyday living. Designed with restraint, crafted from honest tactile materials, and engineered to outlast transient fashion.
            </p>
            <div style={{ display: 'inline-block', padding: '0.35rem 0.65rem', border: '1px solid #383531', borderRadius: '3px', fontSize: '0.7rem', color: '#88847C' }}>
              CODSOFT Internship · Web Development Level 3
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.8rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#FAF8F5',
                marginBottom: '1.25rem'
              }}
            >
              Collections
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <li><Link to="/shop" style={{ color: '#A8A49C' }}>All Objects</Link></li>
              <li><Link to="/shop?category=Audio" style={{ color: '#A8A49C' }}>Acoustic & Audio</Link></li>
              <li><Link to="/shop?category=Workspace" style={{ color: '#A8A49C' }}>Workspace Systems</Link></li>
              <li><Link to="/shop?category=Living" style={{ color: '#A8A49C' }}>Living & Vessels</Link></li>
              <li><Link to="/shop?category=Carry" style={{ color: '#A8A49C' }}>Luggage & Carry</Link></li>
            </ul>
          </div>

          {/* Philosophy / About */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.8rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#FAF8F5',
                marginBottom: '1.25rem'
              }}
            >
              The Studio
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <li><Link to="/about" style={{ color: '#A8A49C' }}>Design Philosophy</Link></li>
              <li><Link to="/about" style={{ color: '#A8A49C' }}>Material Sourcing</Link></li>
              <li><Link to="/contact" style={{ color: '#A8A49C' }}>Studio Inquiries</Link></li>
              <li><Link to="/contact" style={{ color: '#A8A49C' }}>Customer Care & Warranty</Link></li>
              <li><Link to="/account" style={{ color: '#A8A49C' }}>Order Tracking</Link></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div style={{ maxWidth: '340px' }}>
            <h4
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.8rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#FAF8F5',
                marginBottom: '1.25rem'
              }}
            >
              The Dispatch
            </h4>
            <p style={{ color: '#A8A49C', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1rem' }}>
              Receive thoughtful essays on material culture, studio previews, and private archive editions.
            </p>

            <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="email"
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status !== 'idle') setStatus('idle');
                  }}
                  disabled={status === 'loading'}
                  style={{
                    backgroundColor: '#262422',
                    border: '1px solid #3D3934',
                    color: '#FAF8F5',
                    fontSize: '0.85rem',
                    padding: '0.65rem 0.85rem'
                  }}
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  aria-label="Subscribe"
                  style={{
                    backgroundColor: '#FAF8F5',
                    color: '#191817',
                    padding: '0 1.1rem',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <ArrowRight size={16} />
                </button>
              </div>

              {status === 'success' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#A3E5B9', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                  <CheckCircle2 size={14} />
                  <span>{message}</span>
                </div>
              )}

              {status === 'error' && (
                <div style={{ color: '#F5A39B', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                  {message}
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid #282624',
            paddingTop: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            fontSize: '0.75rem',
            color: '#848077'
          }}
        >
          <div>
            © {new Date().getFullYear()} NOVA SUPPLY CO. All rights reserved. Built for CODSOFT Internship Level 3 Task 1.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Carbon Accounting</span>
            <span>Simulated Payment Safe Harbor</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
