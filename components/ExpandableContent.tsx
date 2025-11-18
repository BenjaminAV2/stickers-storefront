'use client'

import { useState } from 'react'

export default function ExpandableContent() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-white">
          {/* Titre principal */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-center">
            Titre de la section
          </h2>

          {/* Premier bloc - toujours visible */}
          <div className="mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-[#F9D94C] mb-4">
              Premier sous-titre
            </h3>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
              Contenu du premier paragraphe. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
              quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>

          {/* Contenu extensible */}
          <div className={`overflow-hidden transition-all duration-500 ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
            {/* Deuxième bloc */}
            <div className="mb-8">
              <h3 className="text-xl sm:text-2xl font-bold text-[#F9D94C] mb-4">
                Deuxième sous-titre
              </h3>
              <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                Contenu du deuxième paragraphe. Duis aute irure dolor in reprehenderit in voluptate
                velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>

            {/* Troisième bloc */}
            <div className="mb-8">
              <h3 className="text-xl sm:text-2xl font-bold text-[#F9D94C] mb-4">
                Troisième sous-titre
              </h3>
              <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                Contenu du troisième paragraphe. Sed ut perspiciatis unde omnis iste natus error sit
                voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo
                inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
              </p>
            </div>
          </div>

          {/* Bouton Lire plus / Lire moins */}
          <div className="text-center mt-8">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-block px-8 py-3 font-bold text-sm sm:text-base transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: '#F9D94C',
                color: '#1F2937',
                borderRadius: '50px',
                border: '2px solid white',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}
            >
              {isExpanded ? 'Lire moins' : 'Lire plus'}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
