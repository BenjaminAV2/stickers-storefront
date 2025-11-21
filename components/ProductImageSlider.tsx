'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ProductImageSliderProps {
  images: string[]
  productTitle: string
}

export default function ProductImageSlider({ images, productTitle }: ProductImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <div className="bg-white rounded-lg shadow-[var(--shadow-card)] p-4 sm:p-6">
      {/* Main image */}
      <div className="aspect-square relative bg-black rounded-lg overflow-hidden">
        <Image
          src={images[currentIndex]}
          alt={`${productTitle} - Image ${currentIndex + 1}`}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
          quality={100}
          unoptimized
        />

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-1 top-1/2 -translate-y-1/2 p-1 transition-all hover:scale-110"
              aria-label="Image précédente"
            >
              <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-1 top-1/2 -translate-y-1/2 p-1 transition-all hover:scale-110"
              aria-label="Image suivante"
            >
              <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnails / Dots */}
      {images.length > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? 'border-[#4F39D7] shadow-md'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
              aria-label={`Voir image ${index + 1}`}
            >
              <Image
                src={image}
                alt={`${productTitle} - Miniature ${index + 1}`}
                width={64}
                height={64}
                className="w-full h-full object-contain bg-black"
                quality={80}
                unoptimized
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
