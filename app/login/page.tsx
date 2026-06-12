'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [focused, setFocused] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resetSent, setResetSent] = useState(false)

  const supabase = getSupabase()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) return
    setError(null)
    setLoading(true)
    const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password })
    if (signInErr) {
      setError('Email or password is incorrect.')
      setLoading(false)
      return
    }
    router.push('/account')
  }

  const handleForgot = async () => {
    if (!supabase) return
    if (!email || !email.includes('@')) {
      setError('Enter your email above first.')
      return
    }
    setError(null)
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/account`,
    })
    setResetSent(true)
  }

  const inputStyle = (field: string): React.CSSProperties => ({
    width: '100%',
    border: 'none',
    borderBottom: `1px solid ${focused === field ? '#1A1A1A' : 'var(--mid-gray)'}`,
    borderRadius: 0,
    padding: '12px 0',
    fontSize: '15px',
    fontFamily: 'inherit',
    background: 'transparent',
    color: 'var(--text-primary)',
    outline: 'none',
    transition: 'border-color 150ms ease',
    boxSizing: 'border-box',
  })

  return (
    <main
      className="page-enter"
      style={{
        minHeight: 'calc(100vh - 56px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '96px 24px 64px',
      }}
    >
      <div style={{ width: '100%', maxWidth: '360px' }}>
        <p
          style={{
            fontSize: 'var(--text-xs)',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: 'var(--text-tertiary)',
            marginBottom: '12px',
          }}
        >
          Monster Depot
        </p>

        <h1
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 'var(--text-2xl)',
            fontWeight: 300,
            letterSpacing: '0.02em',
            color: 'var(--text-primary)',
            marginBottom: '40px',
          }}
        >
          Welcome back.
        </h1>

        <form onSubmit={handleSignIn}>
          <div style={{ marginBottom: '8px' }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocused('email')}
              onBlur={() => setFocused(null)}
              style={inputStyle('email')}
              autoComplete="email"
            />
          </div>
          <div style={{ marginBottom: '32px' }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocused('password')}
              onBlur={() => setFocused(null)}
              style={inputStyle('password')}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p style={{ fontSize: 'var(--text-sm)', color: '#c0392b', marginBottom: '16px', lineHeight: 1.5 }}>
              {error}
            </p>
          )}
          {resetSent && (
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
              Password reset email sent. Check your inbox.
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !email || !password}
            style={{
              width: '100%',
              height: '52px',
              backgroundColor: loading || !email || !password ? 'var(--mid-gray)' : '#1A1A1A',
              color: loading || !email || !password ? 'var(--text-secondary)' : '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: 'var(--text-base)',
              fontWeight: 500,
              cursor: loading || !email || !password ? 'default' : 'pointer',
              fontFamily: 'inherit',
              transition: 'background-color 150ms ease',
              marginBottom: '24px',
            }}
          >
            {loading ? 'Signing in…' : 'Sign in →'}
          </button>
        </form>

        <button
          onClick={handleForgot}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)',
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
            fontFamily: 'inherit',
            padding: 0,
          }}
        >
          Forgot your password?
        </button>
      </div>
    </main>
  )
}
