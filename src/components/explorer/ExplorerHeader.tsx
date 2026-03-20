'use client';
 
import { useState, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { usePathname, useRouter } from 'next/navigation';
import { useT } from '@/i18n/useT';
import { CATEGORIES, FilterState } from '@/data/categories';
import FilterPanel from './FilterPanel';
import VisualSearch from './VisualSearch';
// import LanguageToggle from '@/components/ui/LanguageToggle';
 
interface Props {
  query: string;
  onQueryChange: (q: string) => void;
  filters: FilterState;
  onFiltersChange: (f: FilterState) => void;
  totalResults: number;
  onRefetch: (q?: string) => void;
}
 
export default function ExplorerHeader({
  query, onQueryChange, filters, onFiltersChange, totalResults, onRefetch,
}: Props) {
  const { user, wishlist, logout, theme, setTheme, searchHistory, addSearchHistory } = useStore();
  const router   = useRouter();
  const pathname = usePathname();
  const t        = useT();
  const inputRef = useRef<HTMLInputElement>(null);
 
  const [locationOpen, setLocationOpen] = useState(false);
  const [showFilters,  setShowFilters]  = useState(false);
  const [showVisual,   setShowVisual]   = useState(false);
  const [focused,      setFocused]      = useState(false);
 
  const POPULAR = ['Jalebi', 'Hira Sweets', 'Gajak', 'Paneer', 'Namkeen', 'Dawai'];
 
  const activeFilterCount = [
    filters.category !== 'all',
    filters.sort !== 'relevance',
    filters.openNow,
    filters.minRating > 0,
    filters.priceRange !== 'all',
  ].filter(Boolean).length;
 
  const handleSearch = (val: string) => {
    onQueryChange(val);
    if (val.length >= 3) { onRefetch(val + ' Meerut'); addSearchHistory(val); }
    if (val.length === 0) onRefetch();
  };
 
  /* ── small reusable icon button ── */
  const IconBtn = ({ onClick, children, badge, title, active }: any) => (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: 34, height: 34, borderRadius: 9, flexShrink: 0,
        background: active ? '#8d5524' : 'var(--bg-card)',
        border: `1.5px solid ${active ? '#8d5524' : 'var(--border-md)'}`,
        color: active ? '#fff' : 'var(--fg-muted)',
        cursor: 'pointer', position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.15s',
      }}
    >
      {children}
      {!!badge && (
        <span style={{
          position: 'absolute', top: -5, right: -5,
          minWidth: 15, height: 15, borderRadius: 99,
          background: '#ef4444', color: '#fff',
          fontSize: 8, fontWeight: 900, padding: '0 3px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          lineHeight: 1,
        }}>{badge}</span>
      )}
    </button>
  );
 
  return (
    <>
      <header
        className="sticky top-0 z-40 rounded-b-4xl"
        style={{
          background: 'var(--bg-header)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: '1px solid var(--header-border)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 14px' }}>
 
          {/* ══ ROW 1 — height 52px ══════════════════════════════ */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 52 }}>
 
            {/* Logo */}
            <button
              onClick={() => router.push('/explorer')}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0,
              }}
            >
              <div style={{
                width: 30, height: 30, borderRadius: 9,
                background: 'linear-gradient(135deg,#8d5524,#b87333)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(141,85,36,0.30)', flexShrink: 0,
              }}>
                <i className="fas fa-store" style={{ color: '#fff', fontSize: 12 }} />
              </div>
              <div className="hidden sm:block" style={{ lineHeight: 1 }}>
                <p style={{
                  fontFamily: "'Playfair Display','Georgia',serif",
                  fontSize: 16, fontWeight: 700, color: 'var(--fg-heading)',
                  margin: 0, lineHeight: 1.15,
                }}>Locara</p>
                <p style={{
                  fontSize: 7.5, fontWeight: 700, letterSpacing: '0.16em',
                  textTransform: 'uppercase', color: 'var(--fg-link)', margin: 0,
                }}>Pride in Heritage</p>
              </div>
            </button>
 
            {/* Location pill — sm+ */}
            <button
              onClick={() => setLocationOpen(true)}
              className="hidden sm:flex"
              style={{
                alignItems: 'center', gap: 4,
                background: 'var(--bg-pill)', border: '1px solid var(--border)',
                borderRadius: 9, padding: '4px 9px',
                cursor: 'pointer', flexShrink: 0,
              }}
            >
              <i className="fas fa-map-marker-alt" style={{ color: '#f59e0b', fontSize: 9 }} />
              <div>
                <p style={{ fontSize: 7.5, fontWeight: 700, color: 'var(--fg-faint)', textTransform: 'uppercase', margin: 0 }}>Deliver to</p>
                <p style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--fg)', margin: 0 }}>Meerut, UP</p>
              </div>
              <i className="fas fa-chevron-down" style={{ fontSize: 7, color: 'var(--fg-faint)' }} />
            </button>
 
            {/* Search — flex-grow */}
            <div style={{ flex: 1, position: 'relative', minWidth: 0 }}>
              <div
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  background: 'var(--bg-input)',
                  border: `1.5px solid ${focused ? 'var(--green)' : 'var(--search-border)'}`,
                  borderRadius: 10, padding: '0 10px', height: 36,
                  boxShadow: focused ? 'var(--shadow-glow)' : 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  cursor: 'text',
                }}
                onClick={() => inputRef.current?.focus()}
              >
                <i className="fas fa-search" style={{
                  color: focused ? 'var(--green)' : '#9ca3af',
                  fontSize: 11, flexShrink: 0, transition: 'color 0.2s',
                }} />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={e => handleSearch(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setTimeout(() => setFocused(false), 150)}
                  placeholder="Jalebi, namkeen, dawai..."
                  style={{
                    flex: 1, background: 'transparent', outline: 'none',
                    border: 'none', fontSize: 12.5, fontWeight: 500,
                    color: 'var(--fg)', minWidth: 0,
                  }}
                />
                {query && (
                  <button onClick={() => { onQueryChange(''); onRefetch(); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-faint)', fontSize: 15, lineHeight: 1, flexShrink: 0 }}>
                    ×
                  </button>
                )}
              </div>
 
              {/* Dropdown */}
              {focused && !query && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 5px)', left: 0, right: 0,
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 13, boxShadow: 'var(--shadow-md)', zIndex: 60,
                  overflow: 'hidden', maxHeight: 260, overflowY: 'auto',
                }}>
                  {searchHistory.slice(0, 3).map(h => (
                    <button key={h} onClick={() => { onQueryChange(h); setFocused(false); }}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                        padding: '9px 13px', background: 'none', border: 'none',
                        borderBottom: '1px solid var(--border)',
                        cursor: 'pointer', fontSize: 12.5, color: 'var(--fg)', textAlign: 'left',
                      }}>
                      <i className="fas fa-clock" style={{ color: 'var(--fg-faint)', fontSize: 10 }} />
                      {h}
                    </button>
                  ))}
                  <div style={{ padding: '7px 13px 3px' }}>
                    <p style={{ fontSize: 8.5, fontWeight: 700, color: 'var(--fg-faint)', textTransform: 'uppercase', letterSpacing: '0.14em', margin: 0 }}>Popular</p>
                  </div>
                  {POPULAR.map(p => (
                    <button key={p} onClick={() => { onQueryChange(p); setFocused(false); }}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                        padding: '8px 13px', background: 'none', border: 'none',
                        cursor: 'pointer', fontSize: 12.5, color: 'var(--fg)', textAlign: 'left',
                      }}>
                      <i className="fas fa-fire" style={{ color: '#f97316', fontSize: 10 }} />
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>
 
            {/* Visual search */}
            <button
              onClick={() => setShowVisual(true)}
              title="Photo se search"
              style={{
                width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                background: 'linear-gradient(135deg,#8d5524,#b87333)',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(141,85,36,0.28)',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><circle cx="11" cy="11" r="3"/>
              </svg>
            </button>
 
            {/* Filter */}
            <IconBtn onClick={() => setShowFilters(true)} badge={activeFilterCount || undefined} active={activeFilterCount > 0}>
              <i className="fas fa-sliders-h" style={{ fontSize: 11 }} />
            </IconBtn>
 
            {/* Wishlist */}
            <IconBtn onClick={() => router.push('/explorer/wishlist')} badge={wishlist.length || undefined}>
              <i className="fas fa-heart" style={{ fontSize: 12, color: wishlist.length > 0 ? '#ef4444' : undefined }} />
            </IconBtn>
 
            {/* Theme */}
            <IconBtn onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} title={theme === 'light' ? 'Dark mode' : 'Light mode'}>
              <i className={`fas ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`} style={{ fontSize: 11 }} />
            </IconBtn>
 
            {/* Language */}
            {/* <LanguageToggle /> */}
 
            {/* Avatar */}
            <button
              onClick={() => { logout(); router.push('/'); }}
              style={{
                width: 32, height: 32, borderRadius: 9, flexShrink: 0,
                border: '2px solid rgba(141,85,36,0.22)',
                overflow: 'hidden', cursor: 'pointer', padding: 0,
              }}
            >
              <img src={user?.img ?? ''} alt="U" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </button>
          </div>
 
          {/* ══ ROW 2 — height 38px ══════════════════════════════ */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 5, paddingBottom: 8, overflowX: 'auto' }}
            className="no-scrollbar"
          >
            {/* Desktop page nav */}
            <div className="hidden md:flex" style={{ alignItems: 'center', gap: 3, flexShrink: 0 }}>
              {[
                { label: t('nav_home'),      icon: 'home',          href: '/explorer',         match: pathname === '/explorer' },
                { label: t('nav_map'),       icon: 'map-marked-alt',href: '/explorer/map',      match: pathname.startsWith('/explorer/map') },
                { label: t('nav_festivals'), icon: 'calendar-alt',  href: '/festival',          match: pathname.startsWith('/festival') },
                { label: t('nav_saved'),     icon: 'heart',         href: '/explorer/wishlist', match: pathname.startsWith('/explorer/wishlist') },
                { label: t('nav_you'),       icon: 'user',          href: '/explorer/you',      match: pathname.startsWith('/explorer/you') },
              ].map(item => (
                <button key={item.href} onClick={() => router.push(item.href)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    padding: '4px 10px', borderRadius: 7,
                    fontSize: 10.5, fontWeight: 800, whiteSpace: 'nowrap',
                    background: item.match ? '#8d5524' : 'transparent',
                    color: item.match ? '#fff' : 'var(--fg-muted)',
                    border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  <i className={`fas fa-${item.icon}`} style={{ fontSize: 8.5 }} />
                  {item.label}
                </button>
              ))}
              {/* separator */}
              <div style={{ width: 1, height: 16, background: 'var(--border-md)', margin: '0 3px', flexShrink: 0 }} />
            </div>
 
            {/* Category pills */}
            {CATEGORIES.map(cat => {
              const active = filters.category === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onFiltersChange({ ...filters, category: cat.id })}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    padding: '4px 11px', borderRadius: 99, flexShrink: 0,
                    fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap',
                    background: active ? '#8d5524' : 'var(--bg-pill)',
                    color: active ? '#fff' : 'var(--fg-muted)',
                    border: `1.5px solid ${active ? '#8d5524' : 'rgba(0,0,0,0.07)'}`,
                    boxShadow: active ? '0 2px 8px rgba(141,85,36,0.26)' : 'none',
                    transform: active ? 'scale(1.04)' : 'scale(1)',
                    transition: 'all 0.15s', cursor: 'pointer',
                  }}
                >
                  <i className={`fas fa-${cat.icon}`} style={{ fontSize: 8.5 }} />
                  {cat.label}
                </button>
              );
            })}
          </div>
 
        </div>
      </header>
 
      {/* Location modal */}
      {locationOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.28)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 70 }}
          onClick={() => setLocationOpen(false)}
        >
          <div
            style={{ background: 'var(--bg-card)', borderRadius: 18, padding: 18, width: '100%', maxWidth: 320, margin: '0 16px', boxShadow: 'var(--shadow-lg)', animation: 'scaleIn 0.22s cubic-bezier(0.34,1.56,0.64,1) forwards' }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontWeight: 700, color: 'var(--fg)', marginBottom: 12 }}>Select Location</h3>
            {[
              { name: 'Sadar Bazaar',  sub: 'Meerut Cantt'  },
              { name: 'Abu Lane',      sub: 'Central Meerut' },
              { name: 'Begum Bridge',  sub: 'Old Meerut'     },
              { name: 'Shastri Nagar', sub: 'Meerut City'    },
            ].map(loc => (
              <button key={loc.name} onClick={() => setLocationOpen(false)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 10px', borderRadius: 10,
                  background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-card2)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              >
                <i className="fas fa-map-marker-alt" style={{ color: '#8d5524', fontSize: 12 }} />
                <div>
                  <p style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--fg)', margin: 0 }}>{loc.name}</p>
                  <p style={{ fontSize: 10.5, color: 'var(--fg-muted)', margin: 0 }}>{loc.sub}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
 
      {showFilters && <FilterPanel filters={filters} onChange={onFiltersChange} onClose={() => setShowFilters(false)} totalResults={totalResults} />}
      {showVisual  && <VisualSearch onClose={() => setShowVisual(false)} />}
    </>
  );
}
 