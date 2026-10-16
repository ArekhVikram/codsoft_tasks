import { useEffect, useState } from 'react';

export default function CountUp({ value, suffix = '' }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setN(value); return; }
    let raf; const start = performance.now();
    const tick = (now) => { const t = Math.min((now - start) / 900, 1); setN(Math.round(value * (1 - (1 - t) ** 3))); if (t < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{n}{suffix}</>;
}
