'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getSupabase } from '@/lib/supabase'

// Landing page for the password-reset link. The /auth/callback exchanged the
// recovery code for a session, so here the user just sets a new password.
export default function ResetPasswordPage() {
  const router = useRouter()
  const supabase = getSupabase()
  const [phase, setPhase] = useState<'checking' | 'ready' | 'invalid'>('checking')
  const [password, setPassword] = useState('')
  const [focused, setFocused] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!supabase) {
      setPhase('invalid')
      return
    }
    supabase.auth.getSession().then(({ data }) => {
      setPhase(data.session ? 'ready' : 'invalid')
    })
  }, [supabase])

  const handle = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) return
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    setError(null)
    const { error: updErr } = await supabase.auth.updateUser({ password })
    if (updErr) {
      setError(updErr.message)
      setLoading(false)
      return
    }
    setDone(true)
    setLoading(false)
    setTimeout(() => router.push('/account'), 1200)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    border: 'none',
    borderBottom: `1px solid ${focused ? 'var(--brand-purple-dark)' : '#E5E5E5'}`,
    borderRadius: 0,
    padding: '12px 0',
    fontSize: '16px',
    fontFamily: 'inherit',
    background: 'transparent',
    color: 'var(--text-primary)',
    outline: 'none',
    transition: 'border-color 150ms ease',
    boxSizing: 'border-box',
  }

  return (
    <main style={{ minHeight: '100svh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '120px 24px 80px', background: 'var(--surface-white)' }}>
      <div style={{ width: '100%', maxWidth: '360px' }}>
        <h1 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '28px', letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '32px' }}>
          Set a new password.
        </h1>

        {phase === 'checking' && (
          <p style={{ fontFamily: 'var(--font-dm-sans)', color: 'var(--text-secondary)' }}>Checking your link…</p>
        )}

        {phase === 'invalid' && (
          <div>
            <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
              This reset link is invalid or has expired. Request a new one from the login page.
            </p>
            <Link href="/login" style={{ color: 'var(--brand-purple-light)', textDecoration: 'none', fontWeight: 500, fontFamily: 'var(--font-dm-sans)' }}>
              ← Back to sign in
            </Link>
          </div>
        )}

        {phase === 'ready' && (
          done ? (
            <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '15px', color: 'var(--text-primary)', lineHeight: 1.6 }}>
              Password updated — taking you to your account…
            </p>
          ) : (
            <form onSubmit={handle}>
              <div style={{ marginBottom: '28px' }}>
                <input
                  type="password"
                  placeholder="New password (6+ characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  style={inputStyle}
                  autoComplete="new-password"
                />
              </div>
              {error && <p style={{ fontSize: '13px', color: '#c0392b', marginBottom: '16px', lineHeight: 1.5 }}>{error}</p>}
              <button
                type="submit"
                disabled={loading || !password}
                style={{
                  width: '100%',
                  height: '52px',
                  backgroundColor: loading || !password ? 'var(--text-disabled)' : 'var(--brand-purple-light)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontFamily: 'var(--font-syne)',
                  fontSize: '16px',
                  fontWeight: 700,
                  cursor: loading || !password ? 'default' : 'pointer',
                }}
              >
                {loading ? 'Updating…' : 'Update password →'}
              </button>
            </form>
          )
        )}
      </div>
    </main>
  )
}
