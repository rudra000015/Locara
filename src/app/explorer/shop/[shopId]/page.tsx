import ShopPageClient from './ShopPageClient';

export default function ExplorerShopPage({ params }: { params: { shopId: string } }) {
  return <ShopPageClient shopId={params.shopId} />;
}

