'use client'

import { useEffect, useState, useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { formatEur } from '@/lib/pricing'

interface StickyCheckoutButtonProps {
  totalCents: number
  buttonText: string
  onClick: () => void
  showPrice?: boolean
}

export default function StickyCheckoutButton({ totalCents, buttonText, onClick, showPrice = true }: StickyCheckoutButtonProps) {
  const [isVisible, setIsVisible] = useState(false)
  const buttonRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cleanupScroll: (() => void) | undefined

    // Wait for DOM to be ready
    const timer = setTimeout(() => {
      const originalButton = document.querySelector('[data-checkout-button]')
      if (!originalButton) {
        console.log('Button with data-checkout-button not found')
        return
      }

      const handleScroll = () => {
        const rect = originalButton.getBoundingClientRect()
        const windowHeight = window.innerHeight

        // Show sticky button only when:
        // 1. The original button has passed the top of the viewport (scrolled below it)
        // 2. The button is not visible in the viewport
        const hasScrolledPastButton = rect.top < 0
        const buttonNotVisible = rect.bottom < 0 || rect.top > windowHeight

        setIsVisible(hasScrolledPastButton && buttonNotVisible)
      }

      window.addEventListener('scroll', handleScroll)
      handleScroll()

      cleanupScroll = () => window.removeEventListener('scroll', handleScroll)
    }, 100)

    return () => {
      clearTimeout(timer)
      if (cleanupScroll) cleanupScroll()
    }
  }, [totalCents])

  return (
    <>
      {/* Invisible marker for the original button position */}
      <div ref={buttonRef} className="absolute" />

      {/* Sticky button */}
      {isVisible && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg">
          <div className="max-w-6xl mx-auto px-4 py-3 flex justify-center">
            <button
              onClick={onClick}
              className="w-full md:w-3/5 py-4 px-6 rounded-lg font-semibold text-lg transition-all bg-[#FEA501] text-white hover:bg-[#e89401] hover:shadow-lg flex items-center justify-center gap-2"
            >
              {showPrice ? `${buttonText} • ${formatEur(totalCents)}` : buttonText}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
