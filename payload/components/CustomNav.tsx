'use client'

import React from 'react'
import Link from 'next/link'

const CustomNav: React.FC = () => {
  return (
    <div className="custom-nav-links" style={{ padding: '1rem', borderBottom: '1px solid #e5e5e5' }}>
      <nav style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Link
          href="/dashboard-v2"
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#5750F1',
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
          href="/statistics-v2"
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#5750F1',
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
          href="/orders-list-v2"
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#5750F1',
            color: 'white',
            borderRadius: '4px',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          📋 Liste Commandes
        </Link>
        <Link
          href="/admin-custom/orders"
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#2563eb',
            color: 'white',
            borderRadius: '4px',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          🚀 Commandes (Vue Détails)
        </Link>
      </nav>
    </div>
  )
}

export default CustomNav
