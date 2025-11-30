'use client'

import dynamic from 'next/dynamic'

const CustomNav = dynamic(() => import('./CustomNav'), {
  ssr: false,
  loading: () => <div style={{ height: '60px' }} />,
})

export default CustomNav
