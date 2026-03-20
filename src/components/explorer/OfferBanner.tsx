'use client';
 
import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
 
/* ══════════════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════════════ */
interface DealCard {
  id: string;
  badge: string;        // e.g. "⚡ FLASH SALE"
  badgeBg: string;      // pill background
  shopName: string;
  description: string;
  icon: string;         // emoji
  iconBg: string;       // circle bg
  mrp?: number;
  price: number;
  discountLabel?: string; // "25% off"
  freeShip?: boolean;
  countdown?: number;   // seconds remaining, if any
  tags?: string[];
  cardBg: string;       // card gradient
  accentColor: string;  // for blobs / rings
  corner?: string;      // corner ribbon text e.g. "NEW"
  cornerBg?: string;
}
 
/* ══════════════════════════════════════════════════════════
   MOCK DATA — 6 cards matching the screenshot palette
══════════════════════════════════════════════════════════ */
const DEALS: DealCard[] = [
  {
    id: 'd1',
    badge: '⚡ FLASH SALE',
    badgeBg: 'linear-gradient(90deg,#e91e8c,#ff5252)',
    shopName: 'Agarwal Sweets',
    description: 'Kaju Barfi & Gulab Jamun',
    icon: '🍬',
    iconBg: '#fce4ec',
    mrp: 489, price: 360,
    discountLabel: '25% off',
    countdown: 3 * 3600 + 38 * 60 + 37,
    tags: ['Sweets', 'Diwali'],
    cardBg: 'linear-gradient(145deg,#fff0f5 0%,#ffe4ef 100%)',
    accentColor: '#f48fb1',
  },
  {
    id: 'd2',
    badge: '🔥 DEAL OF THE DAY',
    badgeBg: 'linear-gradient(90deg,#ff6f00,#ffc107)',
    shopName: 'Ram Lal Halwai',
    description: 'Gajak & Rewri combo',
    icon: '🥜',
    iconBg: '#fff8e1',
    mrp: 220, price: 149,
    discountLabel: '32% off',
    countdown: 3 * 3600 + 33 * 60 + 20,
    tags: ['Seasonal', 'Namkeen'],
    cardBg: 'linear-gradient(145deg,#fffde7 0%,#fff3cd 100%)',
    accentColor: '#ffd54f',
  },
  {
    id: 'd3',
    badge: '✨ NEW ARRIVAL',
    badgeBg: 'linear-gradient(90deg,#00897b,#26a69a)',
    shopName: 'Shri Durga Spices',
    description: 'Homemade Masala range',
    icon: '🌶️',
    iconBg: '#e8f5e9',
    price: 199,
    tags: ['Spices', 'Organic'],
    cardBg: 'linear-gradient(145deg,#e8f5e9 0%,#c8e6c9 100%)',
    accentColor: '#81c784',
    corner: 'NEW',
    cornerBg: 'linear-gradient(135deg,#00897b,#26a69a)',
  },
  {
    id: 'd4',
    badge: '🎁 COMBO DEAL',
    badgeBg: 'linear-gradient(90deg,#7b1fa2,#ab47bc)',
    shopName: 'Sharma Kirana',
    description: 'Ghee + Dal + Basmati',
    icon: '🧺',
    iconBg: '#f3e5f5',
    mrp: 920, price: 699,
    discountLabel: '₹221 off',
    tags: ['Grocery'],
    cardBg: 'linear-gradient(145deg,#f3e5f5 0%,#e1bee7 100%)',
    accentColor: '#ce93d8',
  },
  {
    id: 'd5',
    badge: '🚀 FREE DELIVERY',
    badgeBg: 'linear-gradient(90deg,#e64a19,#ff7043)',
    shopName: 'Goyal Dry Fruits',
    description: 'Kaju Kismis premium',
    icon: '🥜',
    iconBg: '#fbe9e7',
    price: 349,
    freeShip: true,
    tags: ['Dry Fruits'],
    cardBg: 'linear-gradient(145deg,#fff8f5 0%,#ffe8e0 100%)',
    accentColor: '#ff8a65',
    corner: 'NEW',
    cornerBg: 'linear-gradient(135deg,#e64a19,#ff7043)',
  },
  {
    id: 'd6',
    badge: '⏳ LIMITED STOCK',
    badgeBg: 'linear-gradient(90deg,#1565c0,#42a5f5)',
    shopName: 'Puja Corner',
    description: 'Diwali puja thali set',
    icon: '🪔',
    iconBg: '#e3f2fd',
    mrp: 380, price: 299,
    discountLabel: '21% off',
    tags: ['Puja'],
    cardBg: 'linear-gradient(145deg,#e3f2fd 0%,#bbdefb 100%)',
    accentColor: '#64b5f6',
  },
];
 
/* ══════════════════════════════════════════════════════════
   COUNTDOWN HOOK
══════════════════════════════════════════════════════════ */
function useCountdown(initial?: number) {
  const [secs, setSecs] = useState(initial ?? 0);
  useEffect(() => {
    if (!initial) return;
    const t = setInterval(() => setSecs(s => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [initial]);
 
  const hh = String(Math.floor(secs / 3600)).padStart(2, '0');
  const mm = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
  const ss = String(secs % 60).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}
 
/* ══════════════════════════════════════════════════════════
   SINGLE DEAL CARD
══════════════════════════════════════════════════════════ */
function DealCardComponent({ card, index }: { card: DealCard; index: number }) {
  const timer = useCountdown(card.countdown);
 
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.07, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
      whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.97 }}
      style={{
        background: card.cardBg,
        borderRadius: 20,
        padding: '14px 14px 16px',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        border: '1px solid rgba(255,255,255,0.8)',
        boxShadow: `0 4px 20px ${card.accentColor}33, 0 1px 4px rgba(0,0,0,0.06)`,
      }}
    >
      {/* Decorative blob — bottom right */}
      <div style={{
        position: 'absolute', bottom: -22, right: -22,
        width: 88, height: 88, borderRadius: '50%',
        background: card.accentColor, opacity: 0.18,
        pointerEvents: 'none',
      }} />
      {/* Decorative blob — top left faint */}
      <div style={{
        position: 'absolute', top: -16, left: -16,
        width: 60, height: 60, borderRadius: '50%',
        background: card.accentColor, opacity: 0.10,
        pointerEvents: 'none',
      }} />
 
      {/* Corner ribbon */}
      {card.corner && (
        <div style={{
          position: 'absolute', top: 0, right: 0,
          background: card.cornerBg,
          color: '#fff', fontSize: 8, fontWeight: 900,
          padding: '4px 10px 4px 14px',
          borderBottomLeftRadius: 12,
          letterSpacing: '0.08em',
        }}>
          {card.corner}
        </div>
      )}
 
      {/* Badge pill */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        background: card.badgeBg,
        borderRadius: 99, padding: '4px 10px',
        fontSize: 9, fontWeight: 900, color: '#fff',
        letterSpacing: '0.06em', marginBottom: 10,
        boxShadow: `0 2px 8px ${card.accentColor}55`,
      }}>
        {card.badge}
      </div>
 
      {/* Icon circle + shop info row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
        {/* Animated icon */}
        <motion.div
          animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: index * 0.3 }}
          style={{
            width: 48, height: 48, borderRadius: '50%',
            background: card.iconBg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, flexShrink: 0,
            boxShadow: `0 2px 10px ${card.accentColor}44`,
            border: `2px solid rgba(255,255,255,0.7)`,
          }}
        >
          {card.icon}
        </motion.div>
 
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontWeight: 800, fontSize: 13, color: '#1a1a1a', marginBottom: 1, lineHeight: 1.2 }}>
            {card.shopName}
          </p>
          <p style={{ fontSize: 11, color: '#555', lineHeight: 1.3 }}>
            {card.description}
          </p>
        </div>
      </div>
 
      {/* Price row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: card.countdown ? 6 : 10, flexWrap: 'wrap' }}>
        {card.mrp && (
          <span style={{ fontSize: 11, textDecoration: 'line-through', color: '#999' }}>₹{card.mrp}</span>
        )}
        <span style={{ fontSize: 18, fontWeight: 900, color: '#1a1a1a', fontFamily: "'Baloo 2',cursive" }}>
          ₹{card.price}
        </span>
        {card.discountLabel && (
          <motion.span
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: index * 0.2 }}
            style={{
              background: 'linear-gradient(135deg,#e53935,#ff7043)',
              color: '#fff', fontSize: 9, fontWeight: 900,
              padding: '3px 8px', borderRadius: 99,
              boxShadow: '0 2px 6px rgba(229,57,53,0.35)',
            }}
          >
            {card.discountLabel}
          </motion.span>
        )}
        {card.freeShip && (
          <span style={{
            background: 'linear-gradient(135deg,#2e7d32,#43a047)',
            color: '#fff', fontSize: 9, fontWeight: 900,
            padding: '3px 8px', borderRadius: 99,
          }}>
            Free ship
          </span>
        )}
      </div>
 
      {/* Countdown timer */}
      {card.countdown !== undefined && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8 }}>
          <span style={{ fontSize: 10, color: '#888', fontWeight: 600 }}>Ends</span>
          <motion.span
            animate={{ opacity: [1, 0.6, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{
              fontSize: 13, fontWeight: 900, color: '#1a1a1a',
              fontFamily: 'monospace', letterSpacing: '0.05em',
              background: 'rgba(0,0,0,0.06)',
              padding: '2px 8px', borderRadius: 6,
            }}
          >
            {timer}
          </motion.span>
        </div>
      )}
 
      {/* Tags */}
      {card.tags && card.tags.length > 0 && (
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {card.tags.map(tag => (
            <span key={tag} style={{
              fontSize: 9, fontWeight: 700,
              padding: '3px 9px', borderRadius: 99,
              background: 'rgba(0,0,0,0.07)',
              color: '#444',
            }}>
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
 
/* ══════════════════════════════════════════════════════════
   TICKER (scrolling marquee at top)
══════════════════════════════════════════════════════════ */
function Ticker() {
  const items = [
    '🎉 Diwali Special — Assorted Sweets ✦',
    '🌟 Namkeen Box — New Flavours In ✦',
    '🔥 Flash Sale — Up to 40% off ✦',
    '🎁 Free Delivery on orders above ₹299 ✦',
    '⭐ New Arrivals every Friday ✦',
  ];
  const text = items.join('   ');
 
  return (
    <div style={{
      background: 'linear-gradient(90deg,#1B4332,#2D6A4F)',
      overflow: 'hidden',
      borderRadius: '14px 14px 0 0',
      padding: '7px 0',
      position: 'relative',
    }}>
      <motion.div
        animate={{ x: [0, -1200] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        style={{
          display: 'flex', gap: 40,
          whiteSpace: 'nowrap',
          fontSize: 11, fontWeight: 700, color: '#fff',
          paddingLeft: 16,
        }}
      >
        {[text, text, text].map((t, i) => (
          <span key={i}>{t}</span>
        ))}
      </motion.div>
    </div>
  );
}
 
/* ══════════════════════════════════════════════════════════
   MAIN EXPORT — OfferBanner
   Drop this wherever OfferBanner is imported in HomePage
══════════════════════════════════════════════════════════ */
export default function OfferBanner() {
  const [visible, setVisible] = useState(true);
 
  if (!visible) return null;
 
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      style={{ marginBottom: 24, borderRadius: 16, overflow: 'hidden' }}
    >
      {/* Scrolling ticker */}
      <Ticker />
 
      {/* Cards grid */}
      <div style={{
        background: 'rgba(255,255,255,0.6)',
        backdropFilter: 'blur(8px)',
        padding: '14px 12px',
        borderRadius: '0 0 16px 16px',
        border: '1px solid rgba(201,151,58,0.15)',
        borderTop: 'none',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: 12,
        }}>
          {DEALS.map((card, i) => (
            <DealCardComponent key={card.id} card={card} index={i} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
 
/* ══════════════════════════════════════════════════════════
   Also export individual card for use elsewhere
══════════════════════════════════════════════════════════ */
export { DealCardComponent, DEALS };
export type { DealCard };