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
      <div
        className="bg-black rounded-2xl transition-all duration-300 overflow-hidden border-[3px] border-white hover:shadow-[6px_6px_16px_rgba(0,0,0,0.4)]"
        style={{
          boxShadow: '4px 4px 12px rgba(0, 0, 0, 0.3)'
        }}
      >
        {/* Image Container - Ratio 1:1 */}
        <div className="relative aspect-square overflow-hidden bg-black flex items-center justify-center p-6">
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            className="object-contain transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            quality={100}
            unoptimized
          />
        </div>

        {/* Product Info */}
        <div className="p-4 bg-black">
          {/* Product Name */}
          <h3 className="font-bold text-base text-white mb-2 group-hover:text-[#2B9FE0] transition-colors line-clamp-2">
            {product.title}
          </h3>

          {/* Description (optional) */}
          {product.description && (
            <p className="text-sm text-gray-300 line-clamp-2 mb-3 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Price & Variants */}
          <div className="pt-2 border-t border-gray-800">
            <div className="flex items-baseline gap-2">
              <p className="text-xs text-gray-400">À partir de</p>
              <p className="text-lg sm:text-xl font-bold text-white">
                {price > 0 ? `${price.toFixed(2)}€` : '0.00€'}
              </p>
            </div>
            {variantCount > 1 && (
              <p className="text-xs text-gray-400 mt-2">
                {variantCount} tailles disponibles
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
