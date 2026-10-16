import React, { useState } from 'react';
import { Mail, MapPin, Clock, CheckCircle2, Send, HelpCircle } from 'lucide-react';
import { api } from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const { addToast } = useToast();

  const faqs = [
    {
      q: "How does the 30-Day In-Home Evaluation trial operate?",
      a: "From the day your package is delivered, you have 30 days to live with the object. If it does not integrate seamlessly into your space or satisfy your acoustic requirements, request a complimentary prepaid return label."
    },
    {
      q: "Is shipping really carbon-neutral?",
      a: "Yes. For every dispatched order, we compute the transport emissions using standard logistics models and fund verified reforestation and biochar carbon removal projects via Pachama."
    },
    {
      q: "Are the headphones and speakers serviceable?",
      a: "Yes. Our Studio Monitor Mk. II features modular detachable cables, user-replaceable earcups, and easily swappable driver assemblies."
    },
    {
      q: "How is checkout handled in this project?",
      a: "In this CODSOFT Level 3 project demonstration, checkout is executed in simulated test mode. No financial credentials are collected or charged, and order references are stored in the server database."
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.submitContact(formData);
      if (res.success) {
        setSubmittedId(res.inquiryId || `CNT-${Date.now()}`);
        setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
        addToast('Your dispatch was sent to our studio.', 'success');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Could not send message.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '3.5rem 0 6rem' }}>
      <div className="container" style={{ maxWidth: '1040px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent-olive)', fontWeight: 600, marginBottom: '0.5rem' }}>
            Direct Communications
          </div>
          <h1 style={{ fontSize: '2.75rem', marginBottom: '0.75rem' }}>Studio Dispatches</h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '580px', margin: '0 auto' }}>
            Have a question regarding custom specifications, wholesale partnerships, or object care? Our team responds within 24 hours.
          </p>
        </div>

        {/* 2-Column: Form + Studio Details */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: '3.5rem',
            alignItems: 'start',
            marginBottom: '5rem'
          }}
          className="contact-grid"
        >
          {/* Contact Form Left */}
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '2.5rem',
              boxShadow: 'var(--shadow-subtle)'
            }}
          >
            <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>
              Transmit a Message
            </h2>

            {submittedId && (
              <div
                style={{
                  backgroundColor: 'var(--status-success-bg)',
                  border: '1px solid var(--status-success)',
                  color: 'var(--status-success)',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem'
                }}
              >
                <CheckCircle2 size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.95rem', marginBottom: '0.25rem' }}>Message Transmitted</strong>
                  <p style={{ fontSize: '0.85rem' }}>
                    Reference ticket <strong>{submittedId}</strong>. Our studio concierge will contact you within 24 hours.
                  </p>
                </div>
              </div>
            )}

            {errorMsg && (
              <div
                style={{
                  backgroundColor: 'var(--status-danger-bg)',
                  border: '1px solid var(--status-danger)',
                  color: 'var(--status-danger)',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  marginBottom: '1.25rem'
                }}
              >
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.825rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                  Full Name <span style={{ color: 'var(--accent-rust)' }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Julian Chen"
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.825rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                  Email Address <span style={{ color: 'var(--accent-rust)' }}>*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="julian@domain.com"
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.825rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                  Inquiry Topic
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                >
                  <option value="General Inquiry">General Object Inquiry</option>
                  <option value="Warranty & Repairs">Warranty, Servicing & Spare Parts</option>
                  <option value="Trade & Wholesale">Architectural & Trade Partnerships</option>
                  <option value="Internship Review">CODSOFT Project Review Feedback</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.825rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                  Your Message <span style={{ color: 'var(--accent-rust)' }}>*</span>
                </label>
                <textarea
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your inquiry or requested specification in detail..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary"
                style={{ alignSelf: 'flex-start', padding: '0.9rem 2rem' }}
              >
                {submitting ? 'Transmitting...' : (
                  <>
                    <Send size={16} /> Send Dispatch
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Showroom & Hours Right */}
          <div>
            <div
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '2rem',
                marginBottom: '2rem'
              }}
            >
              <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-olive)', marginBottom: '1.5rem' }}>
                Studio Locations
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontSize: '0.9rem' }}>
                <div>
                  <strong style={{ display: 'block', color: 'var(--text-primary)' }}>New York Workshop</strong>
                  <p style={{ color: 'var(--text-secondary)' }}>420 Greenpoint Avenue, Loft 3B<br />Brooklyn, NY 11222</p>
                </div>

                <div>
                  <strong style={{ display: 'block', color: 'var(--text-primary)' }}>Copenhagen Atelier</strong>
                  <p style={{ color: 'var(--text-secondary)' }}>Bredgade 24, 2nd Floor<br />1260 København K, Denmark</p>
                </div>

                <div>
                  <strong style={{ display: 'block', color: 'var(--text-primary)' }}>Tokyo Showroom</strong>
                  <p style={{ color: 'var(--text-secondary)' }}>5-7-22 Minamiaoyama<br />Minato-ku, Tokyo 107-0062</p>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '1.5rem', paddingTop: '1.25rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  <Mail size={15} /> studio@novasupply.com
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                  <Clock size={15} /> Monday – Friday, 09:00 – 18:00 EST
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent-olive)', fontWeight: 600 }}>
              Frequent Inquiries
            </span>
            <h2 style={{ fontSize: '2rem', marginTop: '0.35rem' }}>Frequently Asked Questions</h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1.75rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <HelpCircle size={18} color="var(--accent-olive)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', fontWeight: 600 }}>
                    {faq.q}
                  </h4>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, paddingLeft: '1.85rem' }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 840px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
