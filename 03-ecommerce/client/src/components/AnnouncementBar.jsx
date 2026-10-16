import React from 'react';
import { Sparkles, Truck, ShieldCheck } from 'lucide-react';

export default function AnnouncementBar() {
  return (
    <aside
      aria-label="Announcement"
      style={{
        background: '#191817',
        color: '#FAF8F5',
        fontSize: '0.75rem',
        letterSpacing: '0.04em',
        padding: '0.5rem 1rem',
        borderBottom: '1px solid #2A2825',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.5rem',
        flexWrap: 'wrap'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <Truck size={13} color="#C49B66" />
        <span>Complimentary carbon-neutral delivery on orders over $100</span>
      </div>
      <div style={{ display: 'none', alignItems: 'center', gap: '0.4rem' }} className="announcement-desktop-only">
        <Sparkles size={13} color="#C49B66" />
        <span>Use code <strong>NOVA10</strong> for 10% off your first order</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: 0.85 }}>
        <ShieldCheck size={13} color="#A3E5B9" />
        <span style={{ fontSize: '0.7rem' }}>Demo Simulation Mode · CODSOFT Level 3</span>
      </div>
      <style>{`
        @media (min-width: 840px) {
          .announcement-desktop-only {
            display: flex !important;
          }
        }
      `}</style>
    </aside>
  );
}
