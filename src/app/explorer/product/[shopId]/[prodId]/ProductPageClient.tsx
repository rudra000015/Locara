'use client';

import { useEffect, useState } from 'react';
import ExplorerApp from '@/components/explorer/ExplorerApp';
import { useStore } from '@/store/useStore';

export default function ProductPageClient({ shopId, prodId }: { shopId: string; prodId: string }) {
  const viewProduct = useStore((s) => s.viewProduct);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    viewProduct(shopId, prodId);
    setReady(true);
  }, [shopId, prodId, viewProduct]);

  if (!ready) return null;
  return <ExplorerApp routePage="product" />;
}

