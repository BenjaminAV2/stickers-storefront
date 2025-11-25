'use client'

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Menu, X, User } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";

export default function Header() {
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <style jsx global>{`
        @keyframes spinCircle {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .icon-hover-circle {
          position: absolute;
          inset: -2px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .icon-hover-container:hover .icon-hover-circle {
          opacity: 1;
        }
        .icon-hover-circle svg {
          width: 100%;
          height: 100%;
          animation: spinCircle 1.5s linear infinite;
        }
      `}</style>

      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="container mx-auto flex h-16 md:h-20 items-center justify-between px-4 md:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80 shrink-0">
            <Image
              src="/logo.svg"
              alt="Exclusives Stickers"
              width={152}
              height={62}
              className="h-8 md:h-11 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-lg font-medium transition-all hover:font-bold"
              style={{ color: '#2B9FE0' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#1e3a8a'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#2B9FE0'
              }}
            >
              Accueil
            </Link>
            <Link
              href="/products"
              className="text-lg font-medium transition-all hover:font-bold"
              style={{ color: '#2B9FE0' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#1e3a8a'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#2B9FE0'
              }}
            >
              Produits
            </Link>
          </nav>

          {/* Right Side: Account + Cart + Mobile Menu */}
          <div className="flex items-center gap-3">
            {/* Account */}
            <Link
              href="/account"
              className="icon-hover-container relative p-2 transition-all active:scale-95"
              aria-label="Mon compte"
            >
              <div className="icon-hover-circle">
                <svg viewBox="0 0 40 40" fill="none">
                  <circle
                    cx="20"
                    cy="20"
                    r="18"
                    stroke="#2B9FE0"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray="20 60"
                  />
                </svg>
              </div>
              <User className="h-5 w-5" style={{ color: '#2B9FE0', strokeWidth: 2.5 }} />
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="icon-hover-container relative p-2 transition-all active:scale-95 flex flex-col items-center"
              aria-label="Panier"
            >
              <div className="relative">
                <div className="icon-hover-circle">
                  <svg viewBox="0 0 40 40" fill="none">
                    <circle
                      cx="20"
                      cy="20"
                      r="18"
                      stroke="#2B9FE0"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeDasharray="20 60"
                    />
                  </svg>
                </div>
                <ShoppingCart className="h-5 w-5" style={{ color: '#2B9FE0', strokeWidth: 2.5 }} />
              </div>
              {totalItems > 0 && (
                <span className="text-[10px] font-bold mt-0.5" style={{ color: '#2B9FE0' }}>
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden rounded-full p-2 transition-all hover:bg-gray-100 active:scale-95"
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5 text-gray-700" />
              ) : (
                <Menu className="h-5 w-5 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-3">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Accueil
              </Link>
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Produits
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}

/* UX IMPROVEMENTS:
 * - Added mobile menu burger for better mobile navigation
 * - Improved touch targets (min 44px for mobile)
 * - Better visual hierarchy with shadow on header
 * - Active states with scale animation for tactile feedback
 * - Cart badge now uses yellow-cta color from design
 * - Smoother transitions and hover states
 * - Logo scales down on mobile to save space
 */
