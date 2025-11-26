'use client'

import React from 'react'
import Link from 'next/link'

const CustomNav: React.FC = () => {
  return (
    <div className="custom-nav-links" style={{ padding: '1rem', borderBottom: '1px solid #e5e5e5' }}>
      <nav style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Link
          href="/dashboard"
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#5b40d7',
            color: 'white',
            borderRadius: '4px',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          📊 Dashboard
        </Link>
        <Link
          href="/statistics"
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#5b40d7',
            color: 'white',
            borderRadius: '4px',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          📈 Statistiques
        </Link>
        <Link
          href="/orders-list"
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#5b40d7',
            color: 'white',
            borderRadius: '4px',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          📋 Liste Commandes
        </Link>
      </nav>
    </div>
  )
}

export default CustomNav
