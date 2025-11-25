'use client'

import { useRef, useState, useEffect } from 'react'
import ProductCard from '@/components/ProductCard'
import { Product } from '@/lib/types'

interface ProductSliderProps {
  products: Product[]
}

export default function ProductSlider({ products }: ProductSliderProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    const container = scrollContainerRef.current
    if (!container) return

    const { scrollLeft, scrollWidth, clientWidth } = container
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    checkScroll()
    container.addEventListener('scroll', checkScroll)
    window.addEventListener('resize', checkScroll)

    return () => {
      container.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current
    if (!container) return

    const scrollAmount = 350 // Width of card + gap
    const newScrollLeft =
      direction === 'left'
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount

    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth',
    })
  }

  return (
    <div className="relative">
      {/* Left Arrow */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center bg-white rounded-full shadow-lg border-2 border-gray-200 text-gray-700 hover:bg-[#4F39D7] hover:text-white hover:border-[#4F39D7] transition-all duration-300 -ml-6"
          aria-label="Précédent"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Right Arrow */}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center bg-white rounded-full shadow-lg border-2 border-gray-200 text-gray-700 hover:bg-[#4F39D7] hover:text-white hover:border-[#4F39D7] transition-all duration-300 -mr-6"
          aria-label="Suivant"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Scroll Container */}
      <div className="relative -mx-4 sm:mx-0">
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide pb-4"
        >
          <div className="flex gap-4 sm:gap-6 px-4 sm:px-0">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex-none w-[280px] sm:w-[320px]"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        {/* Gradient fade on right */}
        <div className="hidden sm:block absolute right-0 top-0 bottom-4 w-24 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none" />
      </div>
    </div>
  )
}
