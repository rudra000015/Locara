'use client';
 
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { Shop } from '@/types/shop';
 
/* ── Per-category colour palettes ───────────────────────────── */
const CAT_PALETTE: Record<string, { bg: string; accent: string; blob: string; icon: string }> = {
  sweets:    { bg: 'linear-gradient(145deg,#fff0f5,#ffe4ef)', accent: '#f48fb1', blob: '#f06292', icon: '🍬' },
  grocery:   { bg: 'linear-gradient(145deg,#fffde7,#fff3cd)', accent: '#ffd54f', blob: '#ffc107', icon: '🛒' },
  pharmacy:  { bg: 'linear-gradient(145deg,#e3f2fd,#bbdefb)', accent: '#64b5f6', blob: '#42a5f5', icon: '💊' },
  namkeen:   { bg: 'linear-gradient(145deg,#fff8e1,#ffecb3)', accent: '#ffca28', blob: '#ffa000', icon: '🌶️' },
  dairy:     { bg: 'linear-gradient(145deg,#f3e5f5,#e1bee7)', accent: '#ce93d8', blob: '#ab47bc', icon: '🥛' },
  puja:      { bg: 'linear-gradient(145deg,#fbe9e7,#ffccbc)', accent: '#ff8a65', blob: '#e64a19', icon: '🪔' },
  bakery:    { bg: 'linear-gradient(145deg,#f1f8e9,#dcedc8)', accent: '#aed581', blob: '#7cb342', icon: '🧁' },
  spices:    { bg: 'linear-gradient(145deg,#fce4ec,#f8bbd9)', accent: '#f48fb1', blob: '#e91e63', icon: '🫚' },
  clothing:  { bg: 'linear-gradient(145deg,#e8f5e9,#c8e6c9)', accent: '#81c784', blob: '#388e3c', icon: '👗' },
  jewellery: { bg: 'linear-gradient(145deg,#fffde7,#fff9c4)', accent: '#fff176', blob: '#f9a825', icon: '💎' },
  general:   { bg: 'linear-gradient(145deg,#e8eaf6,#c5cae9)', accent: '#9fa8da', blob: '#3f51b5', icon: '🏪' },
  tailoring: { bg: 'linear-gradient(145deg,#fce4ec,#f8bbd9)', accent: '#f48fb1', blob: '#c2185b', icon: '✂️' },
  default:   { bg: 'linear-gradient(145deg,#f5f5f5,#eeeeee)', accent: '#bdbdbd', blob: '#757575', icon: '🏪' },
};
 
function getPalette(cat: string) {
  return CAT_PALETTE[cat] ?? CAT_PALETTE.default;
}
 
/* ── Shared spring transition ── */
const SPRING = { type: 'spring', stiffness: 320, damping: 22 };
 
/* ══════════════════════════════════════════════════════════
   SHOP TILE CARD  — used in grid view
══════════════════════════════════════════════════════════ */
interface ShopCardProps {
  shop: Shop;
  index?: number;
  variant?: 'tile' | 'list' | 'popular';
}
 
export default function ShopCard({ shop: s, index = 0, variant = 'tile' }: ShopCardProps) {
  const router = useRouter();
  const { openShop } = useStore();
  const pal = getPalette(s.cat);
 
  const go = () => { openShop(s.id); router.push(`/explorer/shop/${s.id}`); };
 
  if (variant === 'popular') return <PopularCard shop={s} index={index} pal={pal} onGo={go} />;
  if (variant === 'list')    return <ListCard    shop={s} index={index} pal={pal} onGo={go} />;
  return                            <TileCard    shop={s} index={index} pal={pal} onGo={go} />;
}
 
/* ── TILE CARD ─────────────────────────────────────────── */
function TileCard({ shop: s, index, pal, onGo }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ ...SPRING, delay: index * 0.06 }}
      whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.18 } }}
      whileTap={{ scale: 0.97 }}
      onClick={onGo}
      style={{
        background: pal.bg,
        borderRadius: 20,
        overflow: 'hidden',
        cursor: 'pointer',
        border: '1px solid rgba(255,255,255,0.85)',
        boxShadow: `0 4px 20px ${pal.accent}44, 0 1px 4px rgba(0,0,0,0.06)`,
        position: 'relative',
      }}
    >
      {/* Decorative blob */}
      <div style={{
        position: 'absolute', bottom: -20, right: -20,
        width: 90, height: 90, borderRadius: '50%',
        background: pal.blob, opacity: 0.13, pointerEvents: 'none',
      }} />
 
      {/* Photo area */}
      <div style={{ height: 140, position: 'relative', overflow: 'hidden' }}>
        {s.photos?.[0] ? (
          <motion.img
            src={s.photos[0]} alt={s.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            whileHover={{ scale: 1.06, transition: { duration: 0.35 } }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            background: `linear-gradient(135deg, ${pal.blob}88, ${pal.accent})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 42,
          }}>
            {pal.icon}
          </div>
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 55%)' }} />
 
        {/* Age badge */}
        <div style={{ position: 'absolute', top: 8, left: 8 }}>
          <span style={{
            background: `linear-gradient(135deg,#8d5524,#C9973A)`,
            color: '#fff', fontSize: 9, fontWeight: 900,
            padding: '3px 8px', borderRadius: 99, letterSpacing: '0.04em',
          }}>
            {s.age} Yrs
          </span>
        </div>
 
        {/* Open/closed */}
        {s.openNow != null && (
          <div style={{ position: 'absolute', top: 8, right: 8 }}>
            <span style={{
              background: s.openNow ? '#e8f5e9' : '#fef2f2',
              color: s.openNow ? '#2e7d32' : '#c62828',
              fontSize: 9, fontWeight: 800,
              padding: '3px 8px', borderRadius: 99,
              display: 'inline-flex', alignItems: 'center', gap: 3,
              border: `1px solid ${s.openNow ? '#a5d6a7' : '#fca5a5'}`,
            }}>
              <span style={{
                width: 5, height: 5, borderRadius: '50%',
                background: s.openNow ? '#43a047' : '#e53935',
                ...(s.openNow ? { animation: 'pulse 1.5s infinite' } : {}),
                display: 'inline-block',
              }} />
              {s.openNow ? 'Open' : 'Closed'}
            </span>
          </div>
        )}
 
        {/* Owner + rating row */}
        <div style={{ position: 'absolute', bottom: 8, left: 8, right: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <img src={s.ownerImg} alt=""
            style={{ width: 30, height: 30, borderRadius: 10, border: '2px solid rgba(255,255,255,0.9)', objectFit: 'cover', background: '#fff' }} />
          {s.rating > 0 && (
            <div style={{
              background: 'rgba(0,0,0,0.55)', borderRadius: 99,
              padding: '2px 7px', display: 'flex', alignItems: 'center', gap: 3,
            }}>
              <span style={{ color: '#ffd740', fontSize: 9 }}>★</span>
              <span style={{ color: '#fff', fontSize: 10, fontWeight: 800 }}>{s.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
 
      {/* Info */}
      <div style={{ padding: '12px 13px 14px' }}>
        <h3 style={{ fontWeight: 800, fontSize: 13, color: '#1a1a1a', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {s.name}
        </h3>
        <p style={{ fontSize: 10, color: '#666', marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          📍 {s.addr.split(',')[0]}
        </p>
 
        {/* Delivery row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 10, color: '#888', paddingTop: 8, borderTop: `1px solid ${pal.accent}33` }}>
          <span style={{ fontWeight: 700 }}>⏱ 15 min</span>
          <span style={{ color: '#ccc' }}>|</span>
          <span style={{ color: '#2e7d32', fontWeight: 800 }}>🛵 Free</span>
        </div>
      </div>
    </motion.div>
  );
}
 
/* ── LIST CARD ─────────────────────────────────────────── */
function ListCard({ shop: s, index, pal, onGo }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ ...SPRING, delay: index * 0.05 }}
      whileHover={{ x: 4, transition: { duration: 0.15 } }}
      whileTap={{ scale: 0.98 }}
      onClick={onGo}
      style={{
        background: pal.bg,
        borderRadius: 18, display: 'flex', gap: 12, padding: 14,
        cursor: 'pointer',
        border: '1px solid rgba(255,255,255,0.85)',
        boxShadow: `0 3px 14px ${pal.accent}33, 0 1px 3px rgba(0,0,0,0.05)`,
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Blob */}
      <div style={{
        position: 'absolute', bottom: -16, right: -16,
        width: 70, height: 70, borderRadius: '50%',
        background: pal.blob, opacity: 0.12, pointerEvents: 'none',
      }} />
 
      {/* Thumb */}
      <div style={{ width: 78, height: 78, borderRadius: 14, overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
        {s.photos?.[0] ? (
          <img src={s.photos[0]} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            background: `linear-gradient(135deg,${pal.blob}88,${pal.accent})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30,
          }}>{pal.icon}</div>
        )}
        {s.openNow != null && (
          <span style={{
            position: 'absolute', bottom: 3, left: 3,
            background: s.openNow ? '#43a047' : '#e53935',
            color: '#fff', fontSize: 7, fontWeight: 900, padding: '1px 5px', borderRadius: 99,
          }}>
            {s.openNow ? 'OPEN' : 'CLOSED'}
          </span>
        )}
      </div>
 
      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 6, marginBottom: 2 }}>
          <h3 style={{ fontWeight: 800, fontSize: 14, color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
            {s.name}
          </h3>
          {s.rating > 0 && (
            <span style={{
              background: `linear-gradient(135deg,#8d5524,#C9973A)`,
              color: '#fff', fontSize: 10, fontWeight: 800,
              padding: '2px 7px', borderRadius: 99, flexShrink: 0,
              display: 'flex', alignItems: 'center', gap: 3,
            }}>★ {s.rating.toFixed(1)}</span>
          )}
        </div>
        <p style={{ fontSize: 11, color: '#666', marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {s.addr.split(',')[0]}
        </p>
        <div style={{ display: 'flex', gap: 5, marginBottom: 6, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 99, background: `linear-gradient(135deg,#8d5524,#C9973A)`, color: '#fff' }}>
            {s.age} Yrs
          </span>
          <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: `${pal.accent}33`, color: '#333' }}>
            {s.cat}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 12, fontSize: 11, color: '#888' }}>
          <span style={{ fontWeight: 700 }}>⏱ ~15 min</span>
          <span style={{ color: '#2e7d32', fontWeight: 800 }}>🛵 Free delivery</span>
        </div>
      </div>
    </motion.div>
  );
}
 
/* ── POPULAR CARD ──────────────────────────────────────── */
function PopularCard({ shop: s, index, pal, onGo }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ ...SPRING, delay: index * 0.07 }}
      whileHover={{ y: -5, scale: 1.03, transition: { duration: 0.18 } }}
      whileTap={{ scale: 0.97 }}
      onClick={onGo}
      style={{
        width: 160, height: 148,
        borderRadius: 20, overflow: 'hidden',
        cursor: 'pointer', flexShrink: 0, position: 'relative',
        boxShadow: `0 6px 22px ${pal.accent}55, 0 2px 6px rgba(0,0,0,0.10)`,
      }}
    >
      {s.photos?.[0] ? (
        <img src={s.photos[0]} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      ) : (
        <div style={{
          width: '100%', height: '100%',
          background: pal.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 46,
        }}>{pal.icon}</div>
      )}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.68) 0%, transparent 52%)' }} />
 
      {/* Age */}
      <div style={{ position: 'absolute', top: 8, left: 8 }}>
        <span style={{ background: `linear-gradient(135deg,#8d5524,#C9973A)`, color: '#fff', fontSize: 9, fontWeight: 900, padding: '2px 7px', borderRadius: 99 }}>
          {s.age} Yrs
        </span>
      </div>
      {/* Rating */}
      {s.rating > 0 && (
        <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.55)', borderRadius: 99, padding: '2px 7px', display: 'flex', alignItems: 'center', gap: 3 }}>
          <span style={{ color: '#ffd740', fontSize: 9 }}>★</span>
          <span style={{ color: '#fff', fontSize: 10, fontWeight: 800 }}>{s.rating.toFixed(1)}</span>
        </div>
      )}
      {/* Name */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px 10px 10px' }}>
        <p style={{ color: '#fff', fontWeight: 900, fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.2 }}>{s.name}</p>
        <p style={{ color: 'rgba(255,255,255,0.62)', fontSize: 9, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.addr.split(',')[0]}</p>
      </div>
 
      {/* Coloured bottom accent strip */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${pal.blob},${pal.accent})` }} />
    </motion.div>
  );
}