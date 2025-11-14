'use client'

import Link from 'next/link'

interface HeroStickerSectionProps {
  overlayColor?: string
  overlayOpacity?: number
  backgroundImage?: string
}

export default function HeroStickerSection({
  overlayColor = '#2563EB',
  overlayOpacity = 0.4,
  backgroundImage = '/hero-stickers-bg.jpg'
}: HeroStickerSectionProps) {
  return (
    <section className="relative min-h-[60vh] md:min-h-[70vh]">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />

      {/* Blue Overlay Filter */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: overlayColor,
          opacity: overlayOpacity
        }}
      />

      {/* Content Container */}
      <div className="relative z-[3] h-full flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Title - UPPERCASE */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight leading-tight drop-shadow-2xl">
            CRÉER VOTRE AUTOCOLLANTS
          </h1>

          {/* Subtitle - Yellow */}
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-[#FDE047] mb-6 drop-shadow-lg">
            MEILLEUR ENDROIT POUR PERSONNALISER VOTRE AUTOCOLLANT
          </p>

          {/* Description */}
          <p className="text-base sm:text-lg text-white mb-8 max-w-2xl mx-auto font-medium">
            Complet, fiable et rapide - Vinyle blanc, transparent, holographique ou miroir
          </p>

          {/* CTA Button - Yellow */}
          <Link
            href="/products"
            className="inline-block px-10 py-4 font-bold text-base sm:text-lg transform hover:scale-105 transition-all duration-300"
            style={{
              backgroundColor: '#F9D94C',
              color: '#1F2937',
              borderRadius: '50px',
              border: '2px solid white',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}
          >
            CRÉER VOTRE AUTOCOLLANTS
          </Link>
        </div>
      </div>

      {/* Bottom Peel Effect - Premier plan */}
      {/* Mobile - visible en dessous de 768px */}
      <div className="absolute bottom-0 left-0 w-full block md:hidden pointer-events-none">
        {/* Fond blanc qui épouse la forme - couche intermédiaire (z-5) */}
        <img
          src="/Background_White_Bottom_Mobil.svg"
          alt=""
          className="absolute bottom-0 left-0 w-full h-auto block"
          style={{ zIndex: 5, transform: 'translateY(9px)' }}
        />

        {/* SVG vecteur avec drop shadow - premier plan (z-20) */}
        <img
          src="/Vector_Hero_Bottom_Mobile_VF1.svg"
          alt=""
          className="absolute bottom-0 left-0 w-full h-auto block"
          style={{
            filter: 'drop-shadow(4px 6px 8px rgba(0, 0, 0, 0.3))',
            zIndex: 20
          }}
        />
      </div>

      {/* Desktop - visible à partir de 768px */}
      <div className="absolute bottom-0 left-0 w-full hidden md:block pointer-events-none">
        {/* Fond blanc qui épouse la forme - couche intermédiaire (z-5) */}
        <img
          src="/Background_White_Bottom_desktop.svg"
          alt=""
          className="absolute bottom-0 left-0 w-full h-auto block"
          style={{ zIndex: 5, transform: 'translateY(15px)' }}
        />

        {/* SVG vecteur avec drop shadow - premier plan (z-20) */}
        <img
          src="/Vector_Hero_Bottom_Dektop_VF2.svg"
          alt=""
          className="absolute bottom-0 left-0 w-full h-auto block md:translate-y-0 lg:translate-y-[-4px]"
          style={{
            filter: 'drop-shadow(4px 6px 8px rgba(0, 0, 0, 0.3))',
            zIndex: 20
          }}
        />
      </div>
    </section>
  )
}
