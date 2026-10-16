import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, RefreshCw, Feather, Award, Star } from 'lucide-react';
import { api } from '../services/api.js';
import ProductCard from '../components/ProductCard.jsx';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHomeData() {
      try {
        const res = await api.getFeaturedProducts();
        if (res.success) {
          setFeaturedProducts(res.featured || []);
          setBestSellers(res.bestSellers || []);
          setNewArrivals(res.newArrivals || []);
        }
      } catch (err) {
        console.error('Failed to load home products', err);
      } finally {
        setLoading(false);
      }
    }
    fetchHomeData();
  }, []);

  const categories = [
    {
      name: 'Audio Systems',
      slug: 'Audio',
      description: 'Acoustic monitors and precision headphones tuned for master fidelity.',
      image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
      count: 'Acoustic'
    },
    {
      name: 'Workspace',
      slug: 'Workspace',
      description: 'Solid aluminium risers, wool felt mats, and weighted brass pens.',
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
      count: 'Tactile'
    },
    {
      name: 'Living & Vessels',
      slug: 'Living',
      description: 'Cast iron Nanbu kettles, porcelain ultrasonic diffusers, and Belgian flax.',
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&auto=format&fit=crop&q=80',
      count: 'Ceremony'
    },
    {
      name: 'Carry & Leather',
      slug: 'Carry',
      description: 'Weatherproof Scottish waxed canvas bags and Tuscan bridle cardholders.',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
      count: 'Endurance'
    }
  ];

  const testimonials = [
    {
      quote: "The Studio Monitor Headphones Mk. II have that rare balance of surgical honesty and warm musicality. The aluminium build feels like it was milled for the next fifty years.",
      author: "Julian Chen",
      role: "Audio Engineer & Producer",
      location: "San Francisco",
      rating: 5
    },
    {
      quote: "NOVA SUPPLY objects share a rare design language — quiet, substantial, and devoid of meaningless branding. The cast iron kettle is centerpiece in my morning routine.",
      author: "Elena Rostova",
      role: "Architect & Interior Stylist",
      location: "Stockholm",
      rating: 5
    },
    {
      quote: "The desk shelf system reclaimed nearly half my usable studio space. Cable management is invisible and the walnut oil finish smells incredible out of the box.",
      author: "Marcus Vance",
      role: "Industrial Designer",
      location: "Kyoto",
      rating: 5
    }
  ];

  return (
    <div>
      {/* 1. Hero Section */}
      <section
        style={{
          position: 'relative',
          padding: '4rem 0 5rem',
          backgroundColor: 'var(--bg-primary)',
          overflow: 'hidden'
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3.5rem',
              alignItems: 'center'
            }}
          >
            {/* Hero Text */}
            <div style={{ maxWidth: '580px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--accent-olive)',
                  marginBottom: '1.25rem'
                }}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-olive)' }} />
                <span>Autumn Edition · Studio Release 04</span>
              </div>

              <h1
                style={{
                  fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                  fontWeight: 400,
                  lineHeight: 1.1,
                  marginBottom: '1.5rem',
                  color: 'var(--text-primary)'
                }}
              >
                Objects for everyday living.
              </h1>

              <p
                style={{
                  fontSize: '1.1rem',
                  lineHeight: 1.65,
                  color: 'var(--text-secondary)',
                  marginBottom: '2.5rem'
                }}
              >
                A deliberate collection of acoustic tools, machined workspace instruments, and honest living goods designed to bring quiet utility to your everyday life.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                <Link to="/shop" className="btn btn-primary" style={{ padding: '0.95rem 2rem', fontSize: '0.95rem' }}>
                  Explore Collection <ArrowRight size={17} />
                </Link>
                <Link to="/about" className="btn btn-secondary" style={{ padding: '0.95rem 1.75rem', fontSize: '0.95rem' }}>
                  Our Philosophy
                </Link>
              </div>

              {/* Trust Badges Bar */}
              <div
                style={{
                  display: 'flex',
                  gap: '1.5rem',
                  marginTop: '3rem',
                  paddingTop: '2rem',
                  borderTop: '1px solid var(--border-subtle)',
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)'
                }}
              >
                <div>
                  <strong style={{ display: 'block', color: 'var(--text-primary)' }}>100% Honest Materials</strong>
                  Solid brass, walnut & flax
                </div>
                <div style={{ width: '1px', backgroundColor: 'var(--border-subtle)' }} />
                <div>
                  <strong style={{ display: 'block', color: 'var(--text-primary)' }}>Carbon Neutral</strong>
                  Every shipment offset
                </div>
              </div>
            </div>

            {/* Hero Image Showcase */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'relative',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  boxShadow: '0 20px 48px rgba(26,25,24,0.1)',
                  backgroundColor: '#ECE8E0'
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=80"
                  alt="Studio Monitor Headphones Mk. II"
                  style={{
                    width: '100%',
                    height: '520px',
                    objectFit: 'cover'
                  }}
                />

                {/* Floating Product Tag Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '24px',
                    left: '24px',
                    backgroundColor: 'rgba(250, 248, 245, 0.95)',
                    backdropFilter: 'blur(8px)',
                    padding: '1rem 1.25rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    maxWidth: '300px'
                  }}
                >
                  <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-olive)', fontWeight: 600 }}>
                    Featured Release
                  </div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Studio Monitor Headphones Mk. II
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.35rem' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>$295.00</span>
                    <Link to="/product/studio-monitor-headphones-mk2" style={{ fontSize: '0.75rem', color: 'var(--accent-olive)', fontWeight: 600, textDecoration: 'underline' }}>
                      Inspect Object →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Brand Ethos Pillars */}
      <section style={{ padding: '3.5rem 0', backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '2.5rem'
            }}
          >
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ padding: '0.65rem', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', color: 'var(--accent-olive)' }}>
                <Feather size={22} />
              </div>
              <div>
                <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.3rem' }}>Reductive Aesthetics</h4>
                <p style={{ fontSize: '0.825rem' }}>Stripped of cosmetic excess so each object lives in quiet harmony with your space.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ padding: '0.65rem', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', color: 'var(--accent-olive)' }}>
                <Award size={22} />
              </div>
              <div>
                <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.3rem' }}>Tactile Materials</h4>
                <p style={{ fontSize: '0.825rem' }}>Bavarian merino wool, raw sand-cast iron, Tuscan leather, and aircraft-grade aluminium.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ padding: '0.65rem', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', color: 'var(--accent-olive)' }}>
                <ShieldCheck size={22} />
              </div>
              <div>
                <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.3rem' }}>2-Year Studio Warranty</h4>
                <p style={{ fontSize: '0.825rem' }}>Constructed for decades of service, backed by our direct repair and replacement pledge.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ padding: '0.65rem', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', color: 'var(--accent-olive)' }}>
                <RefreshCw size={22} />
              </div>
              <div>
                <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.3rem' }}>30-Day In-Home Trial</h4>
                <p style={{ fontSize: '0.825rem' }}>Experience the acoustic and tactile presence in your own home with free returns.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Categories */}
      <section style={{ padding: '5.5rem 0' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Curated Collections</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
              <h2 className="section-title">Designed for every room & journey</h2>
              <Link to="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-olive)', fontWeight: 600, fontSize: '0.9rem' }}>
                View All Categories <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.75rem'
            }}
          >
            {categories.map(cat => (
              <Link
                key={cat.slug}
                to={`/shop?category=${cat.slug}`}
                style={{
                  position: 'relative',
                  height: '380px',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '2rem',
                  color: '#FAF8F5'
                }}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1.0)'; }}
                />
                {/* Gradient scrim */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(20, 19, 18, 0.88) 0%, rgba(20, 19, 18, 0.2) 60%, rgba(20, 19, 18, 0) 100%)'
                  }}
                />

                <div style={{ position: 'relative', zIndex: 2 }}>
                  <span style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#D4CFC4', fontWeight: 600 }}>
                    {cat.count}
                  </span>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.65rem', color: '#FAF8F5', margin: '0.25rem 0 0.5rem' }}>
                    {cat.name}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#BDB9AF', lineHeight: 1.4, marginBottom: '0.75rem' }}>
                    {cat.description}
                  </p>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 600, color: '#FAF8F5' }}>
                    Browse Category <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Best Selling Objects Grid */}
      <section style={{ padding: '4rem 0', backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Enduring Favorites</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
              <h2 className="section-title">Best-Selling Objects</h2>
              <Link to="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-olive)', fontWeight: 600, fontSize: '0.9rem' }}>
                Explore All {bestSellers.length + 8}+ Objects <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1.75rem'
            }}
          >
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} style={{ height: '400px', backgroundColor: '#EAE6DD', borderRadius: 'var(--radius-sm)' }} />
              ))
            ) : (
              (bestSellers.length > 0 ? bestSellers : featuredProducts).slice(0, 4).map(product => (
                <ProductCard key={product.id || product._id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* 5. Editorial Story Banner */}
      <section style={{ padding: '6rem 0', backgroundColor: '#191817', color: '#FAF8F5' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '4rem',
              alignItems: 'center'
            }}
          >
            <div>
              <span style={{ fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C49B66', fontWeight: 600 }}>
                The Material Manifesto
              </span>
              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(2rem, 4vw, 3.25rem)',
                  color: '#FAF8F5',
                  lineHeight: 1.15,
                  margin: '1.25rem 0 1.5rem'
                }}
              >
                “We do not design objects to fill spaces. We design objects to empty minds.”
              </h2>
              <p style={{ color: '#A8A49C', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                Every dial on the Type-01 keyboard, every curve of the Nanbu cast iron kettle, and every stitch of our Tuscan bridle leather case exists because it performs an authentic physical function. No plastic veneers. No planned obsolescence.
              </p>
              <Link to="/about" className="btn" style={{ backgroundColor: '#FAF8F5', color: '#191817' }}>
                Read The Studio Monograph <ArrowRight size={16} />
              </Link>
            </div>

            <div>
              <img
                src="https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=1000&auto=format&fit=crop&q=80"
                alt="Machined Brass Craftsmanship"
                style={{
                  width: '100%',
                  height: '460px',
                  objectFit: 'cover',
                  borderRadius: 'var(--radius-sm)',
                  boxShadow: '0 16px 40px rgba(0,0,0,0.4)'
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. New Arrivals */}
      <section style={{ padding: '5.5rem 0' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Freshly Machined</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
              <h2 className="section-title">New Arrivals</h2>
              <Link to="/shop?sort=newest" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-olive)', fontWeight: 600, fontSize: '0.9rem' }}>
                View All New Items <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1.75rem'
            }}
          >
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} style={{ height: '400px', backgroundColor: '#EAE6DD', borderRadius: 'var(--radius-sm)' }} />
              ))
            ) : (
              (newArrivals.length > 0 ? newArrivals : featuredProducts).slice(0, 4).map(product => (
                <ProductCard key={product.id || product._id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* 7. Customer Testimonials */}
      <section style={{ padding: '5.5rem 0', backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem' }}>
            <span className="section-eyebrow">Customer Dispatches</span>
            <h2 className="section-title" style={{ marginTop: '0.5rem', marginBottom: '0.75rem' }}>
              In the hands of practitioners
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Sample testimonials from architects, industrial designers, and sound engineers.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem'
            }}
          >
            {testimonials.map((item, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  padding: '2.25rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-subtle)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', gap: '3px', marginBottom: '1.25rem' }}>
                    {Array(item.rating).fill(0).map((_, i) => (
                      <Star key={i} size={15} fill="#C49B66" color="#C49B66" />
                    ))}
                  </div>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontStyle: 'italic', lineHeight: 1.65, marginBottom: '1.5rem' }}>
                    “{item.quote}”
                  </p>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                  <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-primary)' }}>{item.author}</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.role} · {item.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
