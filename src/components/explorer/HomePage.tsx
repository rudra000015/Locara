'use client';
 
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Shop } from '@/types/shop';
import { useStore } from '@/store/useStore';
import { FilterState, CATEGORIES } from '@/data/categories';
import ShopCard from './ShopCard';
import ProductCard from './ProductCard';
import OfferBanner from './OfferBanner';
import FestivalBanner from '@/components/festival/FestivalBanner';
 
interface Props {
  query: string;
  filters: FilterState;
  shops: Shop[];
  loading: boolean;
  error: string | null;
  refetch: (q?: string) => void;
}
 
// ── colour tokens ─────────────────────────────────────────────
const C = {
  bg:       '#F7E8D4',
  card:     '#FFFFFF',
  green:    '#2D6A4F',
  greenDk:  '#1B4332',
  gold:     '#C9973A',
  goldLt:   '#EED28A',
  copper:   '#8d5524',
  copperLt: '#b87333',
  text:     '#1c1c1c',
  muted:    '#6b7280',
};
 
// ── Map View ──────────────────────────────────────────────────
function MapView({ shops }: { shops: Shop[] }) {
  const mapRef      = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef  = useRef<any[]>([]);
  const router      = useRouter();
  const { openShop } = useStore();
 
  const openShopAndNavigate = (shopId: string) => {
    openShop(shopId);
    router.push(`/explorer/shop/${shopId}`);
  };
 
  useEffect(() => {
    if (mapInstance.current || !mapRef.current) return;
    let cancelled = false;
    (async () => {
      const L = (await import('leaflet')).default;
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({ iconRetinaUrl: '', iconUrl: '', shadowUrl: '' });
      if (cancelled) return;
      const map = L.map(mapRef.current!).setView([28.9845, 77.7064], 13);
      mapInstance.current = map;
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map);
      L.circle([28.9845, 77.7064], { color: C.copper, fillColor: C.copper, fillOpacity: 0.04, radius: 3000, weight: 1 }).addTo(map);
    })();
    return () => {
      cancelled = true;
      try { markersRef.current.forEach(m => m.remove()); markersRef.current = []; mapInstance.current?.remove?.(); } catch {}
      mapInstance.current = null;
    };
  }, []);
 
  useEffect(() => {
    if (!shops.length || !mapInstance.current) return;
    (async () => {
      const L   = (await import('leaflet')).default;
      const map = mapInstance.current;
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];
      const iconMap: Record<string, string> = { pharmacy: 'prescription-bottle-alt', grocery: 'shopping-cart', sweets: 'cookie', general: 'store' };
      shops.forEach(s => {
        const icon = L.divIcon({ className: '', html: `<div class="cm"><i class="fas fa-${iconMap[s.cat] ?? 'store'}"></i></div>`, iconSize: [40, 40], iconAnchor: [20, 20] });
        const openBadge = s.openNow != null ? `<span style="color:${s.openNow ? '#059669' : '#ef4444'};font-weight:700;font-size:10px">${s.openNow ? '● Open Now' : '● Closed'}</span>` : '';
        const photoHtml = s.photos?.[0] ? `<img src="${s.photos[0]}" style="width:100%;height:70px;object-fit:cover;border-radius:8px;margin-bottom:8px">` : '';
        const marker = L.marker(s.loc, { icon }).addTo(map).bindPopup(`
          <div style="min-width:210px;padding:4px">
            ${photoHtml}
            <h4 style="font-weight:800;font-size:14px;margin:0 0 4px">${s.name}</h4>
            <p style="font-size:11px;color:${C.copper};font-weight:600;margin:0 0 2px">⭐ ${s.rating.toFixed(1)} (${s.totalRatings} reviews)</p>
            ${openBadge ? `<p style="margin:0 0 4px">${openBadge}</p>` : ''}
            <p style="font-size:11px;color:#666;margin:0 0 8px">${s.addr}</p>
            <button onclick="window.__openShop('${s.id}')" style="background:${C.copper};color:#fff;border:none;padding:8px 12px;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;width:100%">View Shop</button>
          </div>
        `);
        markersRef.current.push(marker);
      });
    })();
  }, [shops]);
 
  useEffect(() => {
    if (typeof window !== 'undefined') (window as any).__openShop = openShopAndNavigate;
  }, [openShopAndNavigate]);
 
  return (
    <div className="mb-4">
      <div ref={mapRef} className="w-full h-96 rounded-2xl overflow-hidden border border-gray-200" />
      <style jsx>{`.cm{width:40px;height:40px;background:${C.copper};border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:16px;box-shadow:0 2px 8px rgba(0,0,0,0.2)}`}</style>
    </div>
  );
}
 
// ── Hero Banner ───────────────────────────────────────────────
function HeroBanner({ totalShops, onListShop }: { totalShops: number; onListShop: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-3xl mb-5"
      style={{
        background: 'linear-gradient(135deg, #fdf3e3 0%, #f5ddb0 100%)',
        border: '1px solid rgba(201,151,58,0.20)',
        minHeight: 200,
      }}
    >
      {/* Decorative dots pattern */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(201,151,58,0.12) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }} />
 
      <div className="relative flex items-stretch p-5 gap-4">
        {/* Left copy */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <motion.p
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
              style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.copper, fontFamily: 'monospace', marginBottom: 6 }}
            >
              Locara Market
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.22 }}
              style={{ fontFamily: "'Georgia', serif", fontSize: 'clamp(20px, 3.5vw, 28px)', fontWeight: 700, color: C.text, lineHeight: 1.25, marginBottom: 8 }}
            >
              Discover <span style={{ color: C.copper }}>Hidden Gems</span><br />of Local Markets
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              style={{ fontSize: 12, color: C.muted, marginBottom: 16 }}
            >
              Save more, shop better, support local
            </motion.p>
          </div>
 
          {/* Search hint pills */}
          <div className="flex flex-wrap gap-2">
            {['Kurtas', 'Sarees', 'Jewellery', 'Tailoring'].map((t, i) => (
              <motion.span
                key={t}
                initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.35 + i * 0.06 }}
                style={{
                  fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 99,
                  background: 'rgba(141,85,36,0.10)', color: C.copper,
                  border: '1px solid rgba(141,85,36,0.18)',
                  cursor: 'pointer',
                }}
              >
                {t}
              </motion.span>
            ))}
          </div>
        </div>
 
        {/* Right illustration + CTA */}
        <div className="flex flex-col items-center justify-between flex-shrink-0" style={{ width: 140 }}>
          {/* Shop illustration placeholder with awning */}
          <div style={{ position: 'relative', width: 120, height: 100 }}>
            <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
              {/* Shop body */}
              <rect x="15" y="48" width="90" height="48" rx="4" fill="#fff" stroke={C.gold} strokeWidth="1.5"/>
              {/* Door */}
              <rect x="48" y="68" width="24" height="28" rx="3" fill={C.gold} opacity="0.3" stroke={C.copper} strokeWidth="1.2"/>
              <circle cx="69" cy="82" r="2" fill={C.copper}/>
              {/* Windows */}
              <rect x="20" y="58" width="18" height="14" rx="2" fill={C.goldLt} opacity="0.5" stroke={C.gold} strokeWidth="1"/>
              <rect x="82" y="58" width="18" height="14" rx="2" fill={C.goldLt} opacity="0.5" stroke={C.gold} strokeWidth="1"/>
              {/* Awning */}
              <rect x="10" y="38" width="100" height="12" rx="2" fill={C.copper}/>
              {[16,26,36,46,56,66,76,86,96,106].map((x,i) => (
                <line key={i} x1={x} y1="38" x2={x-2} y2="50" stroke={C.goldLt} strokeWidth="3" strokeLinecap="round" opacity="0.7"/>
              ))}
              <path d="M10 50 Q20 56 30 50 Q40 56 50 50 Q60 56 70 50 Q80 56 90 50 Q100 56 110 50" fill="none" stroke={C.goldLt} strokeWidth="1.5"/>
              {/* Roof */}
              <path d="M5 38 L60 12 L115 38 Z" fill={C.greenDk} stroke={C.green} strokeWidth="1"/>
              <path d="M15 38 L60 17 L105 38 Z" fill={C.green} opacity="0.6"/>
              {/* Flag */}
              <line x1="60" y1="12" x2="60" y2="4" stroke={C.copper} strokeWidth="1.5"/>
              <polygon points="60,4 68,8 60,12" fill={C.gold}/>
              {/* Stars */}
              {[28,60,92].map((x,i) => <text key={i} x={x} y="35" fontSize="7" textAnchor="middle" fill={C.goldLt}>★</text>)}
            </svg>
          </div>
 
          <motion.button
            whileHover={{ y: -2, boxShadow: `0 8px 24px ${C.green}44` }}
            whileTap={{ scale: 0.96 }}
            onClick={onListShop}
            style={{
              background: `linear-gradient(135deg, ${C.greenDk}, ${C.green})`,
              color: '#fff', border: 'none', borderRadius: 14,
              padding: '10px 16px', fontSize: 12, fontWeight: 800,
              cursor: 'pointer', width: '100%', textAlign: 'center',
              boxShadow: `0 4px 16px ${C.green}44`,
              letterSpacing: '0.02em',
            }}
          >
            List Your Shop 🏪
          </motion.button>
        </div>
      </div>
 
      {/* Savings ticker */}
      <div style={{
        background: `linear-gradient(90deg, ${C.greenDk}, ${C.green}, ${C.greenDk})`,
        padding: '8px 20px',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'monospace' }}>
          Community Savings
        </span>
        <span style={{ fontSize: 13, fontWeight: 900, color: '#fff', fontFamily: "'Georgia', serif" }}>
          ₹24,000+ saved shopping locally →
        </span>
      </div>
    </motion.div>
  );
}
 
// ── Category Pills ────────────────────────────────────────────
const QUICK_CATS = [
  { icon: '👗', label: 'Kurtas',    cat: 'clothing' },
  { icon: '🥻', label: 'Sarees',    cat: 'sarees' },
  { icon: '💎', label: 'Jewellery', cat: 'jewellery' },
  { icon: '✂️', label: 'Tailoring', cat: 'tailoring' },
  { icon: '🍬', label: 'Sweets',    cat: 'sweets' },
  { icon: '🫘', label: 'Grocery',   cat: 'grocery' },
  { icon: '💊', label: 'Medical',   cat: 'pharmacy' },
  { icon: '🌸', label: 'Puja',      cat: 'puja' },
  { icon: '🧁', label: 'Bakery',    cat: 'bakery' },
  { icon: '🫚', label: 'Spices',    cat: 'spices' },
];
 
function CategoryPills({ onCat }: { onCat: (cat: string) => void }) {
  return (
    <div className="mb-6">
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {QUICK_CATS.map((a, i) => (
          <motion.button
            key={a.cat}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            onClick={() => onCat(a.cat)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 14px', borderRadius: 99, flexShrink: 0,
              background: '#fff', border: '1px solid rgba(201,151,58,0.22)',
              cursor: 'pointer', fontSize: 12, fontWeight: 700,
              color: C.copper, whiteSpace: 'nowrap',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              transition: 'all 0.2s',
            }}
          >
            <span style={{ fontSize: 15 }}>{a.icon}</span>
            {a.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
 
// ── Shop Stories ──────────────────────────────────────────────
function ShopStories({ shops, onOpen }: { shops: Shop[]; onOpen: (id: string) => void }) {
  if (!shops.length) return null;
  return (
    <div className="mb-6">
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
        {shops.slice(0, 10).map((s, i) => (
          <motion.button
            key={s.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => onOpen(s.id)}
            className="flex flex-col items-center gap-2 flex-shrink-0"
          >
            <div className="relative">
              <div className="w-16 h-16 rounded-full p-0.5"
                style={{ background: `linear-gradient(135deg, ${C.copper}, ${C.gold}, #f59e0b)` }}>
                <div className="w-full h-full rounded-full bg-white p-0.5">
                  <img src={s.ownerImg} alt={s.name}
                    className="w-full h-full rounded-full object-cover bg-gray-100" />
                </div>
              </div>
              {s.openNow && (
                <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>
            <span className="text-[11px] font-bold text-gray-700 text-center leading-tight max-w-[60px] truncate">
              {s.name.split(' ')[0]}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
 
// ── Popular Shop Card (screenshot style) ─────────────────────
function PopularShopCard({ shop: s, index }: { shop: Shop; index: number }) {
  const router = useRouter();
  const { openShop } = useStore();
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="relative flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer"
      style={{ width: 160, height: 140, boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}
      onClick={() => { openShop(s.id); router.push(`/explorer/shop/${s.id}`); }}
    >
      {/* Photo */}
      {s.photos?.[0] ? (
        <img src={s.photos[0]} alt={s.name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, #3e2723, ${C.copper})` }}>
          <i className="fas fa-store text-white/30 text-4xl" />
        </div>
      )}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)' }} />
 
      {/* Age badge top-left */}
      <div className="absolute top-2 left-2">
        <span style={{
          background: `linear-gradient(135deg, ${C.copper}, ${C.gold})`,
          color: '#fff', fontSize: 9, fontWeight: 800,
          padding: '2px 7px', borderRadius: 99, letterSpacing: '0.05em',
        }}>
          {s.age} Yrs
        </span>
      </div>
 
      {/* Rating top-right */}
      {s.rating > 0 && (
        <div className="absolute top-2 right-2 flex items-center gap-1"
          style={{ background: 'rgba(0,0,0,0.55)', borderRadius: 99, padding: '2px 7px' }}>
          <i className="fas fa-star" style={{ color: C.gold, fontSize: 9 }} />
          <span style={{ color: '#fff', fontSize: 10, fontWeight: 800 }}>{s.rating.toFixed(1)}</span>
        </div>
      )}
 
      {/* Name + addr bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-2.5">
        <p className="text-white font-black text-xs truncate leading-tight">{s.name}</p>
        <p className="text-white/60 text-[9px] truncate">{s.addr.split(',')[0]}</p>
      </div>
    </motion.div>
  );
}
 
// ── Product Strip ─────────────────────────────────────────────
function ProductStrip({ title, products }: { title: string; products: any[] }) {
  if (!products.length) return null;
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 style={{ fontFamily: "'Georgia', serif", fontSize: 18, fontWeight: 700, color: C.text }}>{title}</h2>
        <span style={{ fontSize: 12, fontWeight: 700, color: C.copper, cursor: 'pointer' }}>See all →</span>
      </div>
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {products.map((p, i) => (
          <div key={p.id} className="flex-shrink-0 w-36">
            <ProductCard product={p} shopId={p.shopId} shopName={p.shopName} imgIndex={i} showNew />
          </div>
        ))}
      </div>
    </div>
  );
}
 
// ── Section Header ────────────────────────────────────────────
function SectionHeader({ title, onSeeAll }: { title: string; onSeeAll?: () => void }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 style={{ fontFamily: "'Georgia', serif", fontSize: 18, fontWeight: 700, color: C.text }}>{title}</h2>
      {onSeeAll && (
        <button onClick={onSeeAll} style={{ fontSize: 12, fontWeight: 700, color: C.copper, background: 'none', border: 'none', cursor: 'pointer' }}>
          See all →
        </button>
      )}
    </div>
  );
}
 
// ── Shop Tile Card (grid) ─────────────────────────────────────
function ShopTileCard({ shop: s, index }: { shop: Shop; index: number }) {
  const router = useRouter();
  const { openShop } = useStore();
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="shop-card pressable overflow-hidden"
      onClick={() => { openShop(s.id); router.push(`/explorer/shop/${s.id}`); }}
    >
      <div className="h-36 relative overflow-hidden">
        {s.photos?.[0] ? (
          <img src={s.photos[0]} alt={s.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, #3e2723, ${C.copper})` }}>
            <i className="fas fa-store text-white/30 text-4xl" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute top-2.5 left-2.5">
          <span className="badge-legacy">{s.age} Yrs</span>
        </div>
        {s.openNow != null && (
          <div className="absolute top-2.5 right-2.5">
            <span className={s.openNow ? 'badge-open' : 'badge-closed'}>
              <span className={`w-1.5 h-1.5 rounded-full ${s.openNow ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              {s.openNow ? 'Open' : 'Closed'}
            </span>
          </div>
        )}
        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-end justify-between">
          <img src={s.ownerImg} alt="" className="w-8 h-8 rounded-xl border-2 border-white/80 bg-white object-cover shadow-sm" />
          {s.rating > 0 && (
            <div className="rating-badge">
              <i className="fas fa-star text-[10px]" />{s.rating.toFixed(1)}
            </div>
          )}
        </div>
      </div>
      <div className="p-3.5">
        <h3 className="font-black text-sm text-gray-800 mb-0.5 truncate">{s.name}</h3>
        <p className="text-[11px] text-gray-400 mb-2 truncate">
          <i className="fas fa-map-marker-alt mr-1" style={{ color: C.copper }} />{s.addr.split(',')[0]}
        </p>
        <div className="flex items-center gap-2 text-[10px] text-gray-400 pt-2 border-t border-gray-50">
          <span className="flex items-center gap-1 font-bold"><i className="fas fa-clock text-[9px]" /> 15 min</span>
          <span className="text-gray-200">|</span>
          <span style={{ color: '#059669' }} className="flex items-center gap-1 font-bold">
            <i className="fas fa-motorcycle text-[9px]" /> Free
          </span>
        </div>
      </div>
    </motion.div>
  );
}
 
// ── Shop List Card ────────────────────────────────────────────
function ShopListCard({ shop: s, index }: { shop: Shop; index: number }) {
  const router = useRouter();
  const { openShop } = useStore();
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="shop-card pressable flex gap-4 p-4"
      onClick={() => { openShop(s.id); router.push(`/explorer/shop/${s.id}`); }}
    >
      <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 relative">
        {s.photos?.[0] ? (
          <img src={s.photos[0]} alt={s.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, #3e2723, #5d4037)` }}>
            <i className="fas fa-store text-white/60 text-2xl" />
          </div>
        )}
        {s.openNow != null && (
          <span className={`absolute bottom-1 left-1 text-[8px] font-black px-1.5 py-0.5 rounded-full ${s.openNow ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
            {s.openNow ? 'OPEN' : 'CLOSED'}
          </span>
        )}
      </div>
      <div className="flex-grow min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-black text-base text-gray-800 leading-tight truncate">{s.name}</h3>
          <div className="rating-badge flex-shrink-0">
            <i className="fas fa-star text-[10px]" />{s.rating.toFixed(1)}
          </div>
        </div>
        <p className="text-xs text-gray-500 mb-1 truncate">{s.addr.split(',')[0]}</p>
        <div className="flex flex-wrap gap-1 mb-2">
          <span className="badge-legacy text-[9px] px-2 py-0.5">{s.age} Yrs</span>
          <span className="text-[9px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-bold capitalize">{s.cat}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span><i className="fas fa-clock mr-1 text-[10px]" />~15 min</span>
          <span style={{ color: '#059669' }} className="font-bold"><i className="fas fa-motorcycle mr-1 text-[10px]" />Free delivery</span>
        </div>
      </div>
    </motion.div>
  );
}
 
// ── Main HomePage ─────────────────────────────────────────────
export default function HomePage({ query, filters, shops, loading, error, refetch }: Props) {
  const router = useRouter();
  const { openShop } = useStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
 
  const openShopAndNavigate = (shopId: string) => {
    openShop(shopId);
    router.push(`/explorer/shop/${shopId}`);
  };
 
  const filtered = useMemo(() => {
    let list = [...shops];
    if (filters.category !== 'all') {
      const cat = CATEGORIES.find(c => c.id === filters.category);
      if (cat) {
        list = list.filter(s =>
          cat.shopCats.includes(s.cat) ||
          cat.keywords.some(kw => s.name.toLowerCase().includes(kw) || (s.story ?? '').toLowerCase().includes(kw))
        );
      }
    }
    if (query.length >= 2) {
      const q = query.toLowerCase();
      list = list.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.addr.toLowerCase().includes(q) ||
        s.products?.some(p => p.name.toLowerCase().includes(q))
      );
    }
    if (filters.openNow)        list = list.filter(s => s.openNow === true);
    if (filters.minRating > 0)  list = list.filter(s => s.rating >= filters.minRating);
    switch (filters.sort) {
      case 'rating': list.sort((a, b) => b.rating - a.rating); break;
      case 'legacy': list.sort((a, b) => a.est - b.est); break;
      case 'name':   list.sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return list;
  }, [shops, filters, query]);
 
  const newProducts = useMemo(() =>
    shops.flatMap((s, si) =>
      (s.products ?? []).map((p, pi) => ({ ...p, shopId: s.id, shopName: s.name, imgIndex: si * 10 + pi }))
    ).filter(p => p.isNew).slice(0, 10),
  [shops]);
 
  const popularProducts = useMemo(() =>
    shops.flatMap((s, si) =>
      (s.products ?? []).map((p, pi) => ({ ...p, shopId: s.id, shopName: s.name, imgIndex: si * 10 + pi }))
    ).filter(p => p.isPopular || p.isFeatured).slice(0, 10),
  [shops]);
 
  const topRated  = useMemo(() => [...shops].sort((a, b) => b.rating - a.rating).slice(0, 8), [shops]);
  const isSearching = query.length > 0 || filters.category !== 'all' ||
    filters.sort !== 'relevance' || filters.openNow || filters.minRating > 0;
 
  if (error) return (
    <div className="text-center py-20">
      <div className="text-5xl mb-4">😕</div>
      <p className="font-black text-lg text-gray-700 mb-2">Shops nahi mile</p>
      <p className="text-gray-400 text-sm mb-6">{error}</p>
      <button onClick={() => refetch()}
        className="bg-gradient-to-br from-[#8d5524] to-[#b87333] text-white px-6 py-3 rounded-2xl font-black">
        Try Again
      </button>
    </div>
  );
 
  return (
    <div className="pt-2" style={{ background: C.bg, minHeight: '100vh' }}>
 
      {/* ── HOME VIEW ───────────────────────────────── */}
      {!isSearching && (
        <>
          {/* Hero */}
          <HeroBanner
            totalShops={shops.length}
            onListShop={() => router.push('/shopowner')}
          />
 
          {/* Festival / offer banners */}
          <OfferBanner />
          <FestivalBanner />
 
          {/* Category pills */}
          <CategoryPills onCat={cat => {}} />
 
          {/* Shop stories */}
          {!loading && <ShopStories shops={shops} onOpen={openShopAndNavigate} />}
 
          {/* Popular Shops section */}
          {!loading && topRated.length > 0 && (
            <div className="mb-8">
              <SectionHeader title="🏆 Popular Shops" onSeeAll={() => {}} />
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                {topRated.map((s, i) => <PopularShopCard key={s.id} shop={s} index={i} />)}
              </div>
            </div>
          )}
 
          {/* New Arrivals product strip */}
          {newProducts.length > 0 && (
            <ProductStrip title="🔥 New Arrivals" products={newProducts} />
          )}
 
          {/* Popular products strip */}
          {popularProducts.length > 0 && (
            <ProductStrip title="✨ Trending Now" products={popularProducts} />
          )}
 
          {/* "All Shops" divider */}
          <div className="flex items-center gap-3 mb-4 mt-2">
            <div className="flex-grow h-px" style={{ background: `rgba(201,151,58,0.25)` }} />
            <span style={{ fontSize: 10, fontWeight: 800, color: C.copper, textTransform: 'uppercase', letterSpacing: '0.22em', fontFamily: 'monospace' }}>
              All Shops
            </span>
            <div className="flex-grow h-px" style={{ background: `rgba(201,151,58,0.25)` }} />
          </div>
        </>
      )}
 
      {/* ── RESULTS HEADER ──────────────────────────── */}
      <div className="flex items-center justify-between mb-4">
        <p style={{ fontWeight: 800, color: C.text, fontSize: 14 }}>
          {loading
            ? 'Looking around...'
            : `${filtered.length} ${isSearching ? 'results' : 'Shops nearby'}`}
        </p>
        <div className="flex gap-1 rounded-xl p-1" style={{ background: '#fff', border: '1px solid rgba(201,151,58,0.18)' }}>
          {(['grid', 'list', 'map'] as const).map(mode => (
            <button key={mode} onClick={() => setViewMode(mode)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={{
                background: viewMode === mode ? C.copper : 'transparent',
                color: viewMode === mode ? '#fff' : C.muted,
              }}>
              <i className={`fas fa-${mode === 'grid' ? 'th' : mode === 'list' ? 'list' : 'map-marked-alt'}`} />
            </button>
          ))}
        </div>
      </div>
 
      {/* ── LOADING SKELETON ────────────────────────── */}
      {loading ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-3'}>
          {Array.from({ length: 6 }).map((_, i) =>
            viewMode === 'grid' ? (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="h-36 skeleton" />
                <div className="p-3 space-y-2">
                  <div className="h-4 skeleton rounded w-3/4" />
                  <div className="h-3 skeleton rounded w-1/2" />
                </div>
              </div>
            ) : (
              <div key={i} className="bg-white rounded-2xl p-4 flex gap-4 animate-pulse">
                <div className="w-20 h-20 skeleton rounded-xl flex-shrink-0" />
                <div className="flex-grow space-y-2">
                  <div className="h-4 skeleton rounded w-3/4" />
                  <div className="h-3 skeleton rounded w-1/2" />
                  <div className="h-3 skeleton rounded w-2/3" />
                </div>
              </div>
            )
          )}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-3">🔍</div>
          <p className="font-black text-lg text-gray-600">Kuch nahi mila</p>
          <p className="text-sm text-gray-400 mt-1">Search ya filter badlein</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((s, i) => <ShopTileCard key={s.id} shop={s} index={i} />)}
        </div>
      ) : viewMode === 'list' ? (
        <div className="space-y-3">
          {filtered.map((s, i) => <ShopListCard key={s.id} shop={s} index={i} />)}
        </div>
      ) : (
        <MapView shops={filtered} />
      )}
    </div>
  );
}
 