'use client';

import { useEffect, useState } from 'react';
import ExplorerApp from '@/components/explorer/ExplorerApp';
import { useStore } from '@/store/useStore';

export default function ShopPageClient({ shopId }: { shopId: string }) {
  const openShop = useStore((s) => s.openShop);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    openShop(shopId);
    setReady(true);
  }, [shopId, openShop]);

  if (!ready) return null;
  return <ExplorerApp routePage="shop" />;
}

