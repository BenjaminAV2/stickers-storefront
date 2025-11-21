import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Always use the local product placeholder image
  const imageUrl = '/product-placeholder.png';

  // Get the price from the first variant
  const price = product.variants && product.variants.length > 0 && product.variants[0].prices && product.variants[0].prices.length > 0
    ? product.variants[0].prices[0].amount / 100
    : 0;

  // Get the variant count
  const variantCount = product.variants?.length || 0;

  return (
    <Link href={`/products/${product.handle}`} className="group block">
      <div className="overflow-hidden rounded-lg border bg-white transition-all duration-300 hover:shadow-[var(--shadow-card-hover)]" style={{ boxShadow: 'var(--shadow-card)' }}>
        <div className="p-0">
          {/* Image Container - Ratio 1:1 */}
          <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
            {/* Glossy Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/0 to-white/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>

          {/* Product Info */}
          <div className="space-y-2 p-4">
            {/* Product Name */}
            <h3 className="font-bold text-base text-foreground line-clamp-2 transition-colors group-hover:text-[var(--color-brand-violet)]">
              {product.title}
            </h3>

            {/* Description (optional) */}
            {product.description && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {product.description}
              </p>
            )}

            {/* Price & Variants */}
            <div className="flex items-center justify-between">
              {price > 0 ? (
                <div>
                  <p className="text-sm text-gray-500 mb-1">À partir de</p>
                  <p className="text-lg font-bold text-[var(--color-brand-violet)]">
                    {price.toFixed(2)} €
                    <span className="text-xs font-normal text-muted-foreground"> TTC</span>
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Prix sur demande</p>
              )}
              {variantCount > 1 && (
                <span className="rounded-full bg-[var(--color-brand-highlight)]/10 px-2.5 py-1 text-xs font-medium text-[var(--color-brand-highlight)]">
                  {variantCount} tailles
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
