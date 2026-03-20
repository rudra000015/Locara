'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IntroBannerProps {
  onDismiss?: () => void;
  city?: string;
}

export default function IntroBanner({ onDismiss, city = 'Meerut' }: IntroBannerProps) {
  const [visible, setVisible] = useState(false);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number; size: number; delay: number }[]>([]);

  // Only show once per session
  useEffect(() => {
    const seen = sessionStorage.getItem('intro_banner_seen');
    if (!seen) {
      setTimeout(() => setVisible(true), 400); // slight delay after page load
    }
  }, []);

  // Generate floating sparkle positions
  useEffect(() => {
    setSparkles(
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: 10 + Math.random() * 80,
        y: 10 + Math.random() * 60,
        size: 4 + Math.random() * 6,
        delay: Math.random() * 2,
      }))
    );
  }, []);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem('intro_banner_seen', '1');
    setTimeout(() => onDismiss?.(), 500);
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={dismiss}
            style={{
              position: 'fixed', inset: 0, zIndex: 9000,
              background: 'rgba(0,0,0,0.55)',
              backdropFilter: 'blur(3px)',
              WebkitBackdropFilter: 'blur(3px)',
            }}
          />

          {/* ── Bottom sheet banner ── */}
          <motion.div
            key="banner"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '110%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28, mass: 0.9 }}
            style={{
              position: 'fixed',
              bottom: 0, left: 0, right: 0,
              zIndex: 9001,
              maxWidth: 480,
              margin: '0 auto',
              borderRadius: '28px 28px 0 0',
              overflow: 'hidden',
              background: 'linear-gradient(160deg, #e8196b 0%, #c8006a 40%, #a8005a 100%)',
              boxShadow: '0 -8px 40px rgba(200,0,106,0.40)',
            }}
          >
            {/* Floating sparkle stars */}
            {sparkles.map(s => (
              <motion.div
                key={s.id}
                animate={{ y: [0, -12, 0], opacity: [0.6, 1, 0.6], rotate: [0, 15, 0] }}
                transition={{ duration: 2.5 + s.delay, repeat: Infinity, ease: 'easeInOut', delay: s.delay }}
                style={{
                  position: 'absolute',
                  left: `${s.x}%`, top: `${s.y}%`,
                  width: s.size, height: s.size,
                  background: '#ffd700',
                  borderRadius: '50%',
                  pointerEvents: 'none',
                  boxShadow: `0 0 ${s.size * 2}px #ffd70088`,
                }}
              />
            ))}

            {/* Wavy top decoration */}
            <svg viewBox="0 0 400 40" style={{ display: 'block', width: '100%', height: 32, marginBottom: -2 }} preserveAspectRatio="none">
              <path d="M0,20 Q50,0 100,20 Q150,40 200,20 Q250,0 300,20 Q350,40 400,20 L400,0 L0,0 Z"
                fill="rgba(255,255,255,0.08)" />
            </svg>

            {/* Close button */}
            <button
              onClick={dismiss}
              style={{
                position: 'absolute', top: 16, right: 16,
                width: 32, height: 32, borderRadius: '50%',
                background: 'rgba(255,255,255,0.20)',
                border: '1.5px solid rgba(255,255,255,0.35)',
                color: '#fff', fontSize: 16, fontWeight: 700,
                cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                zIndex: 2, lineHeight: 1,
                backdropFilter: 'blur(4px)',
              }}
            >
              ×
            </button>

            {/* Content */}
            <div style={{ padding: '8px 28px 0', textAlign: 'center', position: 'relative', zIndex: 1 }}>

              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{ fontSize: 15, fontWeight: 500, color: 'rgba(255,255,255,0.88)', marginBottom: 4, letterSpacing: '0.01em' }}
              >
                बड़े ऑफर आ गए हैं
              </motion.p>

              {/* City name */}
              <motion.h2
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 260, damping: 18 }}
                style={{
                  fontSize: 42, fontWeight: 900,
                  color: '#fff',
                  fontFamily: "'Playfair Display','Georgia',serif",
                  letterSpacing: '-0.01em',
                  margin: '0 0 10px',
                  textShadow: '0 2px 12px rgba(0,0,0,0.18)',
                }}
              >
                {city}
              </motion.h2>

              {/* Sub copy */}
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38 }}
                style={{ fontSize: 14, color: 'rgba(255,255,255,0.80)', marginBottom: 4 }}
              >
                अपनी ज़रूरत की चीज़ें पाएं
              </motion.p>

              {/* BIG text */}
              <motion.p
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.45, type: 'spring', stiffness: 240, damping: 16 }}
                style={{
                  fontSize: 34, fontWeight: 900,
                  color: '#FFD700',
                  fontFamily: "'Baloo 2',cursive",
                  letterSpacing: '0.04em',
                  marginBottom: 0,
                  textShadow: '0 2px 16px rgba(255,215,0,0.30)',
                  lineHeight: 1.1,
                }}
              >
                सबसे कम दामों पर
              </motion.p>
            </div>

            {/* Illustration area */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              style={{
                position: 'relative', height: 200,
                display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              {/* Circular glow behind illustration */}
              <div style={{
                position: 'absolute',
                bottom: -30, left: '50%', transform: 'translateX(-50%)',
                width: 260, height: 200,
                borderRadius: '50%',
                background: 'radial-gradient(ellipse, rgba(255,105,180,0.35) 0%, transparent 70%)',
                pointerEvents: 'none',
              }} />

              {/* SVG Shop Bag Illustration */}
              <svg width="190" height="190" viewBox="0 0 190 190" style={{ position: 'relative', zIndex: 1 }}>
                {/* Bag body */}
                <path d="M40 75 Q38 170 95 172 Q152 170 150 75 Z"
                  fill="#d4956a" stroke="#c0845a" strokeWidth="1.5"/>
                {/* Bag sheen */}
                <path d="M52 85 Q50 155 70 162 Q58 140 55 95 Z"
                  fill="rgba(255,255,255,0.12)"/>
                {/* Bag top */}
                <rect x="38" y="68" width="114" height="12" rx="6"
                  fill="#c0845a"/>
                {/* Handles */}
                <path d="M65 68 Q65 40 85 38 Q105 36 105 68"
                  fill="none" stroke="#a06040" strokeWidth="8" strokeLinecap="round"/>
                {/* Groceries popping out */}
                {/* Green onion tops */}
                <ellipse cx="72" cy="62" rx="6" ry="18" fill="#4caf50" opacity="0.9"/>
                <ellipse cx="80" cy="58" rx="5" ry="16" fill="#388e3c" opacity="0.85"/>
                {/* Tomatoes */}
                <circle cx="118" cy="66" r="10" fill="#f44336"/>
                <circle cx="108" cy="70" r="8" fill="#e53935"/>
                {/* Cheese */}
                <path d="M128 55 L148 55 L148 70 L128 70 Z" fill="#ffc107" rx="3"/>
                {/* Milk bottle */}
                <rect x="88" y="50" width="14" height="28" rx="3" fill="#fff" opacity="0.9"/>
                <rect x="90" y="48" width="10" height="6" rx="2" fill="#e0e0e0"/>
                <rect x="88" y="50" width="14" height="8" rx="2" fill="#ef5350" opacity="0.6"/>
                {/* Sauce bottle */}
                <rect x="100" y="52" width="11" height="24" rx="4" fill="#8d6e63"/>
                <rect x="101" y="50" width="9" height="5" rx="2" fill="#6d4c41"/>
                {/* Broccoli */}
                <circle cx="132" cy="68" r="9" fill="#388e3c"/>
                <circle cx="125" cy="72" r="7" fill="#43a047"/>
                <line x1="129" y1="76" x2="129" y2="88" stroke="#2e7d32" strokeWidth="2.5"/>

                {/* Piggy bank bottom left */}
                <ellipse cx="42" cy="148" rx="28" ry="22" fill="#f48fb1"/>
                {/* piggy legs */}
                <rect x="26" y="162" width="8" height="10" rx="3" fill="#f06292"/>
                <rect x="37" y="165" width="8" height="7" rx="3" fill="#f06292"/>
                <rect x="49" y="165" width="8" height="7" rx="3" fill="#f06292"/>
                {/* piggy snout */}
                <ellipse cx="64" cy="149" rx="10" ry="8" fill="#f06292"/>
                <circle cx="61" cy="149" r="2" fill="#c2185b" opacity="0.5"/>
                <circle cx="66" cy="149" r="2" fill="#c2185b" opacity="0.5"/>
                {/* piggy eye */}
                <circle cx="55" cy="138" r="3" fill="#fff"/>
                <circle cx="55" cy="138" r="1.5" fill="#333"/>
                {/* piggy ear */}
                <ellipse cx="33" cy="133" rx="6" ry="8" fill="#f06292"/>
                <ellipse cx="33" cy="133" rx="4" ry="5" fill="#f48fb1" opacity="0.5"/>
                {/* Rupee coin floating */}
                <circle cx="75" cy="128" r="13" fill="#ffd700"/>
                <circle cx="75" cy="128" r="10" fill="#ffca28"/>
                <text x="75" y="133" textAnchor="middle" fontSize="12" fontWeight="900" fill="#e65100">₹</text>
              </svg>
            </motion.div>

            {/* CTA button */}
            <div style={{ padding: '0 20px 32px' }}>
              <motion.button
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, type: 'spring', stiffness: 260, damping: 20 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={dismiss}
                style={{
                  width: '100%', padding: '16px 0',
                  borderRadius: 99,
                  background: '#111',
                  color: '#fff',
                  fontSize: 17, fontWeight: 900,
                  fontFamily: "'Baloo 2',cursive",
                  border: 'none', cursor: 'pointer',
                  letterSpacing: '0.02em',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.30)',
                }}
              >
                बाज़ार खोलें 🛒
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}