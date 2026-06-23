import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailPage } from "@/components/builder/products/product-detail-page";
import { products } from "@/components/builder/products/data";

type ProductDetailRouteProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: ProductDetailRouteProps): Promise<Metadata> {
  const { id } = await params;
  const productId = Number(id);
  const product = products.find((item) => item.id === productId);

  return {
    title: product ? `${product.name} | Product details` : "Product details",
    robots: { index: false, follow: false },
  };
}

export default async function BuilderProductDetailRoute({ params }: ProductDetailRouteProps) {
  const { id } = await params;
  const productId = Number(id);
  const product = products.find((item) => item.id === productId);

  if (!product) {
    notFound();
  }

  return <ProductDetailPage product={product} />;
}
