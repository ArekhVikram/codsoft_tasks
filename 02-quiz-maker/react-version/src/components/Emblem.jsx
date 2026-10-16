import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Small floating quiz emblem. Static single frame on reduced motion or small screens; hidden if WebGL fails.
export default function Emblem() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current; let renderer;
    try { renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' }); } catch { canvas.hidden = true; return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5)); renderer.setSize(260, 260, false);
    const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(40, 1, 0.1, 50); cam.position.z = 6;
    const cube = new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.7, 1.7), new THREE.MeshStandardMaterial({ color: 0x7c6cff, metalness: 0.5, roughness: 0.25 }));
    const ring = new THREE.Mesh(new THREE.TorusGeometry(2.1, 0.05, 12, 64), new THREE.MeshStandardMaterial({ color: 0x3ee6c4 }));
    ring.rotation.x = 1.2; scene.add(cube, ring);
    scene.add(new THREE.AmbientLight(0xffffff, 0.8)); const l = new THREE.DirectionalLight(0xffffff, 2); l.position.set(3, 4, 5); scene.add(l);
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches || innerWidth < 600;
    let raf, t = 0;
    const draw = () => { t += 0.01; cube.rotation.set(0.5 + t * 0.6, t, 0); ring.rotation.z = t * 0.7; renderer.render(scene, cam); if (!still) raf = requestAnimationFrame(draw); };
    draw();
    return () => { cancelAnimationFrame(raf); renderer.dispose(); };
  }, []);
  return <div className="emblem"><canvas ref={ref} aria-hidden="true" /></div>;
}
