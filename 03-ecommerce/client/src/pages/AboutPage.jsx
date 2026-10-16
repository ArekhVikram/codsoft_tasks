import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, ShieldCheck, Feather, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div style={{ padding: '3.5rem 0 6rem' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
          <div style={{ fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent-olive)', fontWeight: 600, marginBottom: '0.75rem' }}>
            The Studio Monograph
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.75rem)', lineHeight: 1.15, marginBottom: '1.25rem' }}>
            Objects for everyday living.
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto', lineHeight: 1.65 }}>
            NOVA SUPPLY was established on a single foundational premise: that the physical instruments we touch each day should possess tactile honesty, acoustic calm, and structural permanence.
          </p>
        </div>

        {/* Hero Image */}
        <div
          style={{
            borderRadius: 'var(--radius-sm)',
            overflow: 'hidden',
            marginBottom: '4.5rem',
            boxShadow: 'var(--shadow-card)',
            backgroundColor: '#ECE8DF'
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=1200&auto=format&fit=crop&q=80"
            alt="NOVA SUPPLY Design Workshop"
            style={{ width: '100%', height: '460px', objectFit: 'cover' }}
          />
        </div>

        {/* Philosophy Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '5rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent-olive)', fontWeight: 600 }}>
              01 / Reductive Form
            </span>
            <h2 style={{ fontSize: '2rem', margin: '0.5rem 0 1rem' }}>
              Silence in a world of visual noise
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Modern consumer products often shout for attention through glossy plastic, RGB LEDs, and excessive surface complexity. We take the opposing path. Every fillet, bevel, and tolerance in a NOVA object is resolved until nothing non-essential remains.
            </p>
            <p style={{ color: 'var(--text-secondary)' }}>
              The outcome is gear that slips naturally into your personal environment — quiet when idle, deeply rewarding when engaged.
            </p>
          </div>

          <div>
            <span style={{ fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent-olive)', fontWeight: 600 }}>
              02 / Material Authenticity
            </span>
            <h2 style={{ fontSize: '2rem', margin: '0.5rem 0 1rem' }}>
              Honest metals, organic fibers, living timber
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              We machine our desk risers from continuous aerospace-grade aluminium; we weave our throws from unbleached Flemish flax; and we cast our kettles using Nanbu tekki metallurgy practiced for four centuries in Iwate.
            </p>
            <p style={{ color: 'var(--text-secondary)' }}>
              These materials do not degrade with usage; they accrue character. The brass pen gains an amber patina shaped uniquely by the owner’s fingertips.
            </p>
          </div>

          <div>
            <span style={{ fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent-olive)', fontWeight: 600 }}>
              03 / Radical Longevity
            </span>
            <h2 style={{ fontSize: '2rem', margin: '0.5rem 0 1rem' }}>
              Engineered to outlive consumer cycles
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              We refuse planned obsolescence. Our acoustic monitors use standard replaceable cables; our mechanical keyboards feature hot-swappable switch sockets; and our duffle bags use YKK brass hardware backed by a two-year studio warranty.
            </p>
          </div>
        </div>

        {/* CODSOFT Internship Section */}
        <div
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '2.5rem',
            marginBottom: '4rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <Award size={20} color="var(--accent-olive)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-olive)' }}>
              Internship Project Overview
            </span>
          </div>
          <h3 style={{ fontSize: '1.45rem', marginBottom: '0.75rem' }}>
            CODSOFT Web Development Internship · Level 3, Task 1
          </h3>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '1.25rem' }}>
            This project was developed as the capstone assignment for the CODSOFT Web Development Internship. The objective was to design and engineer a production-ready, editorial e-commerce platform with authoritative server-side pricing, inventory management, password hashing, and token authentication.
          </p>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <div><strong>Frontend:</strong> React 18, Vite, React Router, CSS Modules/Variables</div>
            <div><strong>Backend:</strong> Node.js, Express, JWT, BcryptJS, Node Test Suite</div>
            <div><strong>Database:</strong> MongoDB & Mongoose with In-Memory Demo Fallback</div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', paddingTop: '2rem' }}>
          <Link to="/shop" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1rem' }}>
            Explore The Current Collection <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </div>
  );
}
