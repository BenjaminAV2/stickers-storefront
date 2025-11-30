'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function BypassLoginPage() {
  const [email, setEmail] = useState('contact@avdigital.fr')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const handleBypassLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/bypass-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      // Store the token
      document.cookie = `payload-token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}`

      setSuccess('Login successful! Redirecting to admin...')

      // Redirect to admin
      setTimeout(() => {
        router.push('/admin')
      }, 1000)
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f3f4f6',
      padding: '1rem',
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px',
        width: '100%',
      }}>
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '0.5rem',
          color: '#1f2937',
        }}>
          🔓 Bypass Login (TEMPORARY)
        </h1>

        <p style={{
          fontSize: '0.875rem',
          color: '#6b7280',
          marginBottom: '1.5rem',
        }}>
          This is a temporary login page that bypasses password authentication for debugging.
        </p>

        <form onSubmit={handleBypassLogin}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              marginBottom: '0.5rem',
              color: '#374151',
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '1rem',
              }}
              placeholder="contact@avdigital.fr"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: loading ? '#9ca3af' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Logging in...' : 'Bypass Login'}
          </button>
        </form>

        {error && (
          <div style={{
            marginTop: '1rem',
            padding: '0.75rem',
            backgroundColor: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '4px',
            color: '#991b1b',
            fontSize: '0.875rem',
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            marginTop: '1rem',
            padding: '0.75rem',
            backgroundColor: '#d1fae5',
            border: '1px solid #a7f3d0',
            borderRadius: '4px',
            color: '#065f46',
            fontSize: '0.875rem',
          }}>
            {success}
          </div>
        )}

        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          backgroundColor: '#fef3c7',
          border: '1px solid #fde047',
          borderRadius: '4px',
        }}>
          <p style={{
            fontSize: '0.75rem',
            color: '#854d0e',
            margin: 0,
          }}>
            <strong>⚠️ Available accounts:</strong><br />
            • contact@avdigital.fr<br />
            • benjamin@avdigital.fr
          </p>
        </div>
      </div>
    </div>
  )
}
