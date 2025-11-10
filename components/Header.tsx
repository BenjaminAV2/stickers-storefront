'use client'

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export default function Header() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <Image
            src="/logo.svg"
            alt="Exclusives Stickers"
            width={140}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-foreground transition-colors hover:text-[var(--color-brand-violet)]"
          >
            Accueil
          </Link>
          <Link
            href="/products"
            className="text-sm font-medium text-foreground transition-colors hover:text-[var(--color-brand-violet)]"
          >
            Produits
          </Link>
        </nav>

        {/* Cart */}
        <Link
          href="/cart"
          className="relative rounded-full p-2 transition-all hover:bg-accent/10"
          aria-label="Panier"
        >
          <ShoppingCart className="h-5 w-5 text-[var(--color-brand-violet)]" />
          {totalItems > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-brand-orange)] text-xs font-bold text-white">
              {totalItems > 99 ? '99+' : totalItems}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
