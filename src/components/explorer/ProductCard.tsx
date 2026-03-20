'use client';
 
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
 
/* ── Per-category palettes (mirrors ShopCard) ─────────────── */
const CAT_PALETTE: Record<string, { bg: string; accent: string; blob: string; tagBg: string; tagColor: string }> = {
  sweets:    { bg: 'linear-gradient(145deg,#fff0f5,#ffe4ef)', accent: '#f48fb1', blob: '#f06292', tagBg: '#fce4ec', tagColor: '#c2185b' },
  grocery:   { bg: 'linear-gradient(145deg,#fffde7,#fff3cd)', accent: '#ffd54f', blob: '#ffc107', tagBg: '#fff8e1', tagColor: '#f57f17' },
  pharmacy:  { bg: 'linear-gradient(145deg,#e3f2fd,#bbdefb)', accent: '#64b5f6', blob: '#42a5f5', tagBg: '#e3f2fd', tagColor: '#1565c0' },
  namkeen:   { bg: 'linear-gradient(145deg,#fff8e1,#ffecb3)', accent: '#ffca28', blob: '#ffa000', tagBg: '#fff8e1', tagColor: '#e65100' },
  dairy:     { bg: 'linear-gradient(145deg,#f3e5f5,#e1bee7)', accent: '#ce93d8', blob: '#ab47bc', tagBg: '#f3e5f5', tagColor: '#7b1fa2' },
  puja:      { bg: 'linear-gradient(145deg,#fbe9e7,#ffccbc)', accent: '#ff8a65', blob: '#e64a19', tagBg: '#fbe9e7', tagColor: '#bf360c' },
  bakery:    { bg: 'linear-gradient(145deg,#f1f8e9,#dcedc8)', accent: '#aed581', blob: '#7cb342', tagBg: '#f1f8e9', tagColor: '#33691e' },
  spices:    { bg: 'linear-gradient(145deg,#fce4ec,#f8bbd9)', accent: '#f48fb1', blob: '#e91e63', tagBg: '#fce4ec', tagColor: '#880e4f' },
  clothing:  { bg: 'linear-gradient(145deg,#e8f5e9,#c8e6c9)', accent: '#81c784', blob: '#388e3c', tagBg: '#e8f5e9', tagColor: '#1b5e20' },
  jewellery: { bg: 'linear-gradient(145deg,#fffde7,#fff9c4)', accent: '#fff176', blob: '#f9a825', tagBg: '#fff9c4', tagColor: '#e65100' },
  general:   { bg: 'linear-gradient(145deg,#e8eaf6,#c5cae9)', accent: '#9fa8da', blob: '#3f51b5', tagBg: '#e8eaf6', tagColor: '#283593' },
  tailoring: { bg: 'linear-gradient(145deg,#fce4ec,#f8bbd9)', accent: '#f48fb1', blob: '#c2185b', tagBg: '#fce4ec', tagColor: '#880e4f' },
  default:   { bg: 'linear-gradient(145deg,#f5f5f5,#eeeeee)', accent: '#bdbdbd', blob: '#757575', tagBg: '#f5f5f5', tagColor: '#424242' },
};
 
function getPalette(cat?: string) {
  return CAT_PALETTE[cat ?? 'default'] ?? CAT_PALETTE.default;
}
 
/* ── Shimmer-sweep overlay (CSS animation via inline style) ─ */
const shimmerStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0, left: '-60%',
  width: '50%', height: '100%',
  background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.45),transparent)',
  transform: 'skewX(-12deg)',
  animation: 'shimmerSweep 3s ease infinite',
  pointerEvents: 'none',
};
 
const SPRING = { type: 'spring', stiffness: 320, damping: 22 };
 
/* ══════════════════════════════════════════════════════════
   PRODUCT CARD
   Props match existing usage in HomePage / ProductStrip
══════════════════════════════════════════════════════════ */
interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    mrp?: number;
    images?: string[];
    image?: string;
    isNew?: boolean;
    isFeatured?: boolean;
    isPopular?: boolean;
    cat?: string;
    shopId?: string;
  };
  shopId?: string;
  shopName?: string;
  imgIndex?: number;
  showNew?: boolean;
  variant?: 'default' | 'wide';
}
 
export default function ProductCard({ product: p, shopId, shopName, imgIndex = 0, showNew, variant = 'default' }: ProductCardProps) {
  const router   = useRouter();
  const { openShop } = useStore();
  const pal      = getPalette(p.cat);
  const discount = p.mrp && p.mrp > p.price ? Math.round((1 - p.price / p.mrp) * 100) : null;
  const img      = p.images?.[0] ?? p.image;
  const sid      = shopId ?? p.shopId;
 
  const go = () => {
    if (sid) { openShop(sid); router.push(`/explorer/shop/${sid}`); }
  };
 
  /* Cycle through 6 accent colours for visual variety even within same cat */
  const accentCycle = [
    { bg: 'linear-gradient(145deg,#fff0f5,#ffe4ef)', accent: '#f48fb1', blob: '#f06292' },
    { bg: 'linear-gradient(145deg,#fffde7,#fff3cd)', accent: '#ffd54f', blob: '#ffc107' },
    { bg: 'linear-gradient(145deg,#e8f5e9,#c8e6c9)', accent: '#81c784', blob: '#388e3c' },
    { bg: 'linear-gradient(145deg,#e3f2fd,#bbdefb)', accent: '#64b5f6', blob: '#42a5f5' },
    { bg: 'linear-gradient(145deg,#f3e5f5,#e1bee7)', accent: '#ce93d8', blob: '#ab47bc' },
    { bg: 'linear-gradient(145deg,#fbe9e7,#ffccbc)', accent: '#ff8a65', blob: '#e64a19' },
  ];
  const cycle = p.cat ? pal : accentCycle[imgIndex % accentCycle.length];
 
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.93 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ ...SPRING, delay: (imgIndex % 8) * 0.05 }}
      whileHover={{ y: -6, scale: 1.03, transition: { duration: 0.18 } }}
      whileTap={{ scale: 0.96 }}
      onClick={go}
      style={{
        background: cycle.bg,
        borderRadius: 18, overflow: 'hidden',
        cursor: 'pointer',
        border: '1px solid rgba(255,255,255,0.85)',
        boxShadow: `0 4px 18px ${cycle.accent}44, 0 1px 4px rgba(0,0,0,0.06)`,
        position: 'relative',
      }}
    >
      {/* Bottom blob */}
      <div style={{
        position: 'absolute', bottom: -16, right: -16,
        width: 72, height: 72, borderRadius: '50%',
        background: cycle.blob, opacity: 0.13, pointerEvents: 'none',
      }} />
 
      {/* Image area */}
      <div style={{ aspectRatio: '1/1', position: 'relative', overflow: 'hidden' }}>
        {img ? (
          <motion.img
            src={img} alt={p.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            whileHover={{ scale: 1.08, transition: { duration: 0.35 } }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            background: `linear-gradient(135deg,${cycle.blob}66,${cycle.accent})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 38,
          }}>
            🛍️
          </div>
        )}
 
        {/* Shimmer sweep on new/featured items */}
        {(showNew && p.isNew) && (
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 0 }}>
            <div style={shimmerStyle} />
          </div>
        )}
 
        {/* NEW ribbon */}
        {showNew && p.isNew && (
          <div style={{
            position: 'absolute', top: 0, right: 0,
            background: 'linear-gradient(135deg,#e53935,#ff7043)',
            color: '#fff', fontSize: 8, fontWeight: 900,
            padding: '4px 10px 4px 13px',
            borderBottomLeftRadius: 12,
            letterSpacing: '0.08em',
          }}>NEW</div>
        )}
 
        {/* Discount badge top-left */}
        {discount && (
          <motion.div
            animate={{ scale: [1, 1.07, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: (imgIndex % 6) * 0.3 }}
            style={{
              position: 'absolute', top: 7, left: 7,
              background: 'linear-gradient(135deg,#e53935,#ff7043)',
              color: '#fff', fontSize: 9, fontWeight: 900,
              padding: '3px 8px', borderRadius: 99,
              boxShadow: '0 2px 8px rgba(229,57,53,0.35)',
            }}
          >
            {discount}% off
          </motion.div>
        )}
 
        {/* Featured glow dot */}
        {p.isFeatured && (
          <div style={{
            position: 'absolute', top: 7, left: discount ? 54 : 7,
            width: 8, height: 8, borderRadius: '50%',
            background: '#ffd740',
            boxShadow: '0 0 6px #ffd740',
            animation: 'pulse 1.5s infinite',
          }} />
        )}
      </div>
 
      {/* Info */}
      <div style={{ padding: '10px 11px 12px', position: 'relative', zIndex: 1 }}>
        <h3 style={{
          fontWeight: 800, fontSize: 12, color: '#1a1a1a',
          marginBottom: 2, lineHeight: 1.3,
          overflow: 'hidden', textOverflow: 'ellipsis',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        }}>
          {p.name}
        </h3>
 
        {shopName && (
          <p style={{ fontSize: 10, color: '#666', marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            🏪 {shopName}
          </p>
        )}
 
        {/* Price row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: 15, fontWeight: 900, color: '#1B4332',
            fontFamily: "'Baloo 2',cursive",
          }}>
            ₹{p.price}
          </span>
          {p.mrp && p.mrp > p.price && (
            <span style={{ fontSize: 10, textDecoration: 'line-through', color: '#999' }}>₹{p.mrp}</span>
          )}
        </div>
 
        {/* Tags row */}
        {p.cat && (
          <div style={{ marginTop: 7, display: 'flex', gap: 4 }}>
            <span style={{
              fontSize: 9, fontWeight: 700,
              padding: '2px 8px', borderRadius: 99,
              background: `${cycle.accent}33`,
              color: '#333',
            }}>
              {p.cat}
            </span>
            {p.isPopular && (
              <span style={{
                fontSize: 9, fontWeight: 700,
                padding: '2px 8px', borderRadius: 99,
                background: 'linear-gradient(135deg,#1B4332,#2D6A4F)',
                color: '#fff',
              }}>
                Popular
              </span>
            )}
          </div>
        )}
      </div>
 
      {/* Bottom accent line */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 3,
        background: `linear-gradient(90deg,${cycle.blob},${cycle.accent})`,
      }} />
    </motion.div>
  );
}
 