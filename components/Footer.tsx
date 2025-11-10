import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.svg"
                alt="Exclusives Stickers"
                width={140}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-sm text-muted-foreground">
              Créez vos stickers personnalisés de qualité professionnelle.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-4 font-bold text-foreground">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground transition-colors hover:text-[var(--color-brand-violet)]">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-muted-foreground transition-colors hover:text-[var(--color-brand-violet)]">
                  Produits
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-muted-foreground transition-colors hover:text-[var(--color-brand-violet)]">
                  Panier
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 font-bold text-foreground">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="text-muted-foreground transition-colors hover:text-[var(--color-brand-violet)]">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground transition-colors hover:text-[var(--color-brand-violet)]">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-muted-foreground transition-colors hover:text-[var(--color-brand-violet)]">
                  Livraison
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 font-bold text-foreground">Légal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-muted-foreground transition-colors hover:text-[var(--color-brand-violet)]">
                  CGV
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground transition-colors hover:text-[var(--color-brand-violet)]">
                  Confidentialité
                </Link>
              </li>
              <li>
                <Link href="/legal" className="text-muted-foreground transition-colors hover:text-[var(--color-brand-violet)]">
                  Mentions légales
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} Exclusives Stickers. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
