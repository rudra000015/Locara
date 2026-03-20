'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore, type OwnerPage } from '@/store/useStore';
import { SHOPS } from '@/data/shops';
import OwnerHeader from '@/components/owner/OwnerHeader';
import OwnerBottomNav from '@/components/owner/OwnerBottomNav';
import ShowcasePage from '@/components/owner/ShowcasePage';
import CollectionsPage from '@/components/owner/CollectionsPage';
import AddProductPage from '@/components/owner/AddProductPage';
import ShopProfilePage from '@/components/owner/ShopProfilePage';
import AnalyticsPage from '@/components/owner/AnalyticsPage';
import Toast from '@/components/ui/Toast';

export default function OwnerApp({ routePage }: { routePage: OwnerPage }) {
  const router = useRouter();
  const { user, ownerPage, ownerShopId, ownerNavTo } = useStore();

  useEffect(() => {
    if (!user) router.push('/');
  }, [user, router]);

  useEffect(() => {
    if (ownerPage !== routePage) ownerNavTo(routePage);
  }, [ownerPage, ownerNavTo, routePage]);

  if (!user) return null;

  const shop = SHOPS.find((s) => s.id === ownerShopId)!;

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-4 bg-gradient-to-br from-[#fdfbf7] to-[#f5e6d3]">
      <div className="w-full max-w-4xl bg-white p-6 sm:p-10 rounded-3xl sm:rounded-[2.5rem] shadow-2xl border border-gray-100 relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#b87333]/10 rounded-full blur-3xl" />

        <div className="text-center mb-6 sm:mb-8 relative z-10">
          <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-[#8d5524] to-[#b87333] text-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl sm:text-4xl shadow-lg">
            <i className="fas fa-tools" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-800 mb-1">Welcome back to</h1>
          <h2 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-[#8d5524] to-[#b87333] bg-clip-text text-transparent mb-2">
            {shop.name}
          </h2>
          <p className="text-gray-500 font-medium text-xs sm:text-sm uppercase tracking-widest">
            Manage your shop and grow your business
          </p>
        </div>

        <div className="relative z-10">
          <div className="h-screen flex flex-col">
            <OwnerHeader shopName={shop.name} />
            <main className="flex-grow overflow-y-auto p-6 max-w-7xl mx-auto w-full">
              {ownerPage === 'showcase' && <ShowcasePage />}
              {ownerPage === 'collections' && <CollectionsPage />}
              {ownerPage === 'addproduct' && <AddProductPage />}
              {ownerPage === 'profile' && <ShopProfilePage />}
              {ownerPage === 'analytics' && <AnalyticsPage />}
            </main>
            <OwnerBottomNav />
          </div>
        </div>

        <Toast />
      </div>
    </div>
  );
}

