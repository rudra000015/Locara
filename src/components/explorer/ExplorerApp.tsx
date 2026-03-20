'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { useT } from '@/i18n/useT';
import ExplorerHeader from '@/components/explorer/ExplorerHeader';
import ExplorerNav from '@/components/explorer/ExplorerNav';
import HomePage from '@/components/explorer/HomePage';
import ShopProfile from '@/components/explorer/ShopProfile';
import ProductDetail from '@/components/explorer/ProductDetail';
import WishlistPage from '@/components/explorer/WishlistPage';
import MapPage from '@/components/explorer/MapPage';
import Toast from '@/components/ui/Toast';
import { type FilterState, DEFAULT_FILTERS } from '@/data/categories';
import { useShops } from '@/hooks/useShops';
import IntroBanner from '@/components/ui/IntroBanner';
export type ExplorerRoutePage = 'home' | 'map' | 'wishlist' | 'shop' | 'product' | 'profile';

export default function ExplorerApp({ routePage }: { routePage: ExplorerRoutePage }) {
  const router = useRouter();
  const { user, currentPage, navTo } = useStore();
  const t = useT();

  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const { shops, loading, error, refetch } = useShops({ radius: 3000 });

  useEffect(() => {
    if (!user) router.push('/');
  }, [user, router]);

  useEffect(() => {
    if (currentPage !== routePage) navTo(routePage);
  }, [currentPage, routePage, navTo]);

  if (!user) return null;

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            query={query}
            filters={filters}
            shops={shops}
            loading={loading}
            error={error}
            refetch={refetch}
          />
        );
      case 'shop':
        return <ShopProfile />;
      case 'product':
        return <ProductDetail />;
      case 'wishlist':
        return <WishlistPage />;
      case 'map':
        return <MapPage />;
      case 'profile':
        return (
          <div className="bg-white p-6 rounded-2xl border shadow-sm max-w-xl mx-auto">
            <h2 className="text-2xl font-black text-[#ffffff] mb-2">{t('explorer_you_title')}</h2>
            <p className="text-gray-500 mb-6">{t('explorer_you_sub')}</p>
            <div className="flex items-center gap-4">
              <img
                src={user.img}
                alt={user.name}
                className="w-14 h-14 rounded-2xl border border-gray-200 object-cover bg-white"
              />
              <div className="min-w-0">
                <p className="font-black text-gray-800 truncate">{user.name}</p>
                <p className="text-xs text-gray-400">Explorer</p>
              </div>
            </div>
            <div className="h-px bg-gray-100 my-6" />
            <button
              type="button"
              onClick={() => router.push('/festival')}
              className="w-full py-3 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-all"
            >
              <i className="fas fa-calendar-alt mr-2" />
              {t('explorer_browse_festivals')}
            </button>
          </div>
        );
      default:
        return (
          <HomePage
            query={query}
            filters={filters}
            shops={shops}
            loading={loading}
            error={error}
            refetch={refetch}
          />
        );
    }
  };

  return (
    
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <IntroBanner city="Meerut" />
      <ExplorerHeader
        query={query}
        onQueryChange={setQuery}
        filters={filters}
        onFiltersChange={setFilters}
        totalResults={shops.length}
        onRefetch={refetch}
      />
      
      <main className="max-w-7xl mx-auto px-4 pt-4 pb-24">
        <div key={currentPage} className="page-enter">
          {renderPage()}
        </div>
      </main>
      <ExplorerNav />
      <Toast />
    </div>
  );
}
