'use client'

import Lottie from 'lottie-react'
import animationData from '@/public/animation.json'

export default function LottieAnimation() {
  return (
    <div className="w-full h-full">
      <Lottie
        animationData={animationData}
        loop={true}
        autoplay={true}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}
