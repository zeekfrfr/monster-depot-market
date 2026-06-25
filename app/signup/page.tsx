'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getSupabase } from '@/lib/supabase'

export default function SignUpPage() {
  const router = useRouter()
  const supabase = getSupabase()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [focused, setFocused] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [checkEmail, setCheckEmail] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)

  // Coming from an order confirmation: prefill the order's email (claim-order
  // requires the account email to match the order) and carry the order id.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setOrderId(params.get('order_id'))
    const e = params.get('email')
    if (e) setEmail(e)
  }, [])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) return
    setError(null)
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    const { data, error: signUpErr } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/account${orderId ? `&order_id=${orderId}` : ''}`,
      },
    })
    if (signUpErr) {
      setError(
        /already|registered|exists/i.test(signUpErr.message)
          ? 'An account with this email already exists — try signing in.'
          : signUpErr.message,
      )
      setLoading(false)
      return
    }
    // Email confirmation off → session is live. Claim the order (if any), then go.
    if (data.session) {
      if (orderId) {
        try {
          await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/claim-order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${data.session.access_token}` },
            body: JSON.stringify({ orderId, marketingOptIn: false }),
          })
        } catch {
          // Non-fatal — the account still works; order can be linked later.
        }
      }
      router.push('/account')
      return
    }
    // Confirmation required → tell them to check their inbox.
    setCheckEmail(true)
    setLoading(false)
  }

  const inputStyle = (field: string): React.CSSProperties => ({
    width: '100%',
    border: 'none',
    borderBottom: `1px solid ${focused === field ? 'var(--brand-purple-dark)' : '#E5E5E5'}`,
    borderRadius: 0,
    padding: '12px 0',
    fontSize: '16px',
    fontFamily: 'inherit',
    background: 'transparent',
    color: 'var(--text-primary)',
    outline: 'none',
    transition: 'border-color 150ms ease',
    boxSizing: 'border-box',
  })

  return (
    <main
      style={{
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '120px 24px 80px',
        background: 'var(--surface-white)',
      }}
    >
      <div style={{ width: '100%', maxWidth: '360px' }}>
        <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-tertiary)', marginBottom: '12px' }}>
          Monster Depot Market
        </p>
        <h1 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '28px', letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '40px' }}>
          Create your account.
        </h1>

        {checkEmail ? (
          <div>
            <p style={{ fontSize: '15px', color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '8px' }}>
              Almost there — check your inbox.
            </p>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
              We sent a confirmation link to <strong>{email}</strong>. Click it to finish setting up your account, then you&apos;ll land on your orders.
            </p>
            <Link href="/login" style={{ fontSize: '14px', color: 'var(--brand-purple-light)', textDecoration: 'none', fontWeight: 500 }}>
              Back to sign in →
            </Link>
          </div>
        ) : (
          <>
            <form onSubmit={handleSignUp}>
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
                  placeholder="Password (6+ characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  style={inputStyle('password')}
                  autoComplete="new-password"
                />
              </div>

              {error && (
                <p style={{ fontSize: '13px', color: '#c0392b', marginBottom: '16px', lineHeight: 1.5 }}>{error}</p>
              )}

              <button
                type="submit"
                disabled={loading || !email || !password}
                style={{
                  width: '100%',
                  height: '52px',
                  backgroundColor: loading || !email || !password ? 'var(--text-disabled)' : 'var(--brand-purple-light)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontFamily: 'var(--font-syne)',
                  fontSize: '16px',
                  fontWeight: 700,
                  cursor: loading || !email || !password ? 'default' : 'pointer',
                  transition: 'background-color 150ms ease',
                  marginBottom: '24px',
                }}
              >
                {loading ? 'Creating account…' : 'Create account →'}
              </button>
            </form>

            <Link href="/login" style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'underline', textUnderlineOffset: '3px', display: 'inline-flex', minHeight: '44px', alignItems: 'center' }}>
              Already have an account? Sign in
            </Link>
          </>
        )}
      </div>
    </main>
  )
}
