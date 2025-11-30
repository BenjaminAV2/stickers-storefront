import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Header from "@/components/Header";
import { CartProvider } from "@/contexts/CartContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Exclusives Stickers | Stickers Personnalisés de Qualité Premium",
  description: "Créez vos stickers personnalisés en vinyle blanc, transparent, holographique ou miroir. Qualité professionnelle, livraison rapide. Exclusives Stickers, votre partenaire pour des autocollants qui brillent.",
  keywords: "stickers personnalisés, autocollants, vinyle, holographique, impression stickers, stickers professionnels",
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: "Exclusives Stickers | Stickers Personnalisés Premium",
    description: "Stickers personnalisés de qualité professionnelle",
    type: "website",
  },
};

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-gray-50`} suppressHydrationWarning>
        <CartProvider>
          <Header />
          {children}
          <Toaster position="bottom-right" />
        </CartProvider>
      </body>
    </html>
  );
}
