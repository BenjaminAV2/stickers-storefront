'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface ProductImageSliderProps {
  images: string[]
  productTitle: string
}

export default function ProductImageSlider({ images, productTitle }: ProductImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const changeSlide = (newIndex: number) => {
    if (isAnimating || newIndex === currentIndex) return
    setIsAnimating(true)
    setCurrentIndex(newIndex)
  }

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => setIsAnimating(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isAnimating])

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1
    changeSlide(newIndex)
  }

  const goToNext = () => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1
    changeSlide(newIndex)
  }

  const goToSlide = (index: number) => {
    changeSlide(index)
  }

  return (
    <div className="bg-white rounded-lg shadow-[var(--shadow-card)] p-4 sm:p-6">
      {/* Main image */}
      <div className="aspect-square relative bg-black rounded-lg overflow-hidden">
        <div
          className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${
            isAnimating ? 'opacity-0' : 'opacity-100'
          }`}
        >
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
        </div>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-1 top-1/2 -translate-y-1/2 p-1 transition-all hover:scale-110 z-10"
              aria-label="Image précédente"
            >
              <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-1 top-1/2 -translate-y-1/2 p-1 transition-all hover:scale-110 z-10"
              aria-label="Image suivante"
            >
              <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Dots indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? 'w-8 h-2 bg-white'
                    : 'w-2 h-2 bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Voir image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
