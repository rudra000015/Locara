import ProductPageClient from './ProductPageClient';

export default function ExplorerProductPage({
  params,
}: {
  params: { shopId: string; prodId: string };
}) {
  return <ProductPageClient shopId={params.shopId} prodId={params.prodId} />;
}

